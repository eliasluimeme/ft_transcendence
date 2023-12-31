import { Logger, UseGuards } from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { BoardData, NewRoom, Player } from './interfaces';
import { GameGuard } from './game.guard'; 
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({cors: {
  origin: 'http://localhost:3000',
  credentials: true,
},
namespace: '/game',})
@UseGuards(GameGuard)
export class GameGateway {
  @WebSocketServer() server: Server;
  private online: Map<string, string> = new Map();
  private players: Map<string,Player> = new Map();
  private queue: Player[] = [];
  private readonly board: BoardData = {
    board: {width: 1000, height: 500},
    padel: {width: 15, height: 100},
    ballc: {x: 500, y: 250},
    ballr: 10
  };
  constructor(private rooms: Map<string, GameService>, private config: ConfigService, private userservice: UserService) {}

// connection/diconnection functions
  handleDisconnect(client: Socket) {
    this.queue = this.queue.filter((waiter) => {client.id != waiter.sock});
    const online = this.online.get(client.data);
    if (online != client.id)
      return;
    this.online.delete(client.data);
    this.userservice.updateIntraUser(client.data, {
      status: 'OFFLINE',
    });
    const looser: Player = this.players.get(client.data);
    if (!looser)
      return;
    else
    {
      this.rooms.get(looser.roomid).clearTimers();
      this.removeRoom(looser.roomid, true, looser.id);
    }
  }
  async handleConnection(client: Socket) {

    if (!GameGuard.validateToken(client, this.config.get('JWT_SECRET'))) {
      this.server.to(client.id).emit('goback', "[Access Denied]: Log in to access the game");
      return;
    }
    const online = this.online.get(client.data);
    if(online)
      return;
    this.online.set(client.data, client.id);
    this.userservice.updateIntraUser(client.data, {
      status: 'ONLINE',
    })
  }

// add new room functions
  @SubscribeMessage('newBotGame')
  newGameBot(@ConnectedSocket() client: Socket, @MessageBody() mode: string)
  {
    const online = this.online.get(client.data);
    if (online != client.id) {
      this.server.to(client.id).emit('goback', "You are connected in other page");
      return;
    }
    const player = {id: client.data, sock: client.id, roomid: client.data};
    if (this.players.has(player.id))
    {
      if (player.sock != client.id)  
              this.server.to(client.id).emit('goback', "You are already ingame");
      return;
    }
    this.players.set(player.id, player);
    const room: NewRoom = {
      vsbot: true,
      mode: parseInt(mode),
      id1: player.id,
      sock1: player.sock,
      id2: '',
      sock2: ''
    };
    this.rooms.set(player.id,new GameService(room));
    this.server.to(player.sock).emit('roomCreated', {side: 'left', oppName: "Bot", oppPhoto: "http://localhost:3001/bg.png"});
    this.userservice.updateIntraUser(player.id, {
      status: 'INGAME',
    });
    this.rooms.get(player.id).resetBoard();
  }
  @SubscribeMessage('newRandomGame')
  async newGamePlayer(@ConnectedSocket() client: Socket)
  { 
    const online = this.online.get(client.data);
    if (!online || online != client.id) {
      this.server.to(client.id).emit('goback', "You are connected in other page");
      return;
    }
    const player1 = {id: client.data, sock: client.id, roomid: client.data};
    if (this.players.has(player1.id))
    {
      if (player1.sock != client.id)  
        this.server.to(client.id).emit('goback', "You were disconnected");
      return;
    }
    if (!this.queue.length) {
      this.queue.push(player1);
      return;
    }
    const user1 = this.userservice.findUserByIntraId(player1.id);
    const matching = this.queue.pop();
    const user2 = this.userservice.findUserByIntraId(matching.id);
    const player2 = {id: matching.id, sock: matching.sock, roomid: player1.id};
    const room: NewRoom = {
      vsbot: false,
      mode: 0,
      id1: player1.id,
      sock1: player1.sock,
      id2: player2.id,
      sock2: player2.sock
    };
    this.players.set(player1.id, player1);
    this.players.set(player2.id, player2);
    this.rooms.set(player1.id,new GameService(room));
    this.server.to(player1.sock).emit('roomCreated', {side: 'left', oppName: (await user2).userName, oppPhoto: (await user2).photo});
    this.server.to(player2.sock).emit('roomCreated', {side: 'right', oppName: (await user1).userName, oppPhoto: (await user1).photo});
    this.userservice.updateIntraUser(player1.id, {
      status: 'INGAME',
    });
    this.userservice.updateIntraUser(player2.id, {
      status: 'INGAME',
    });
    this.rooms.get(player1.id).resetBoard();
  }
  @SubscribeMessage('joinGame')
  async startGame(@ConnectedSocket() client: Socket) {
    const online1 = this.online.get(client.data);
    if (!online1 || online1 != client.id)
      return;
    const pready = this.players.get(client.data);
    const startgame = this.rooms.get(pready.roomid).isReady(client.data);
    if (startgame === false)
      return;
    const player1 = this.players.get(startgame.player1);
    const player2 = this.players.get(startgame.player2);
    const user1 = this.userservice.findUserByIntraId(player1.id);
    const user2 = this.userservice.findUserByIntraId(player2.id);
    this.server.to(player1.sock).emit('roomCreated', {side: 'left', oppName: (await user2).userName, oppPhoto: (await user2).photo});
    this.server.to(player2.sock).emit('roomCreated', {side: 'right', oppName: (await user1).userName, oppPhoto: (await user1).photo});
    this.userservice.updateIntraUser(player1.id, {
      status: 'INGAME',
    });
    this.userservice.updateIntraUser(player2.id, {
      status: 'INGAME',
    });
    this.rooms.get(player1.id).resetBoard();
  }

// update room data function
  @SubscribeMessage('updateRoom')
  updateRoom(@MessageBody() y: number, @ConnectedSocket() client: Socket) {
    const player: Player = this.players.get(client.data);
    if (!player || player.sock != client.id) {
            this.server.to(client.id).emit('goback', "You are ingame");
      return;
    }
    if(this.rooms.get(player.roomid).getRoomStatus() == "closed") {
      this.removeRoom(player.roomid, false, '');
      return;
    }
    const board = this.rooms.get(player.roomid).updateBoard(player.id, y);
    this.server.to(client.id).emit('updatePlayer', board);
  }

// Surrender functions
  @SubscribeMessage('cancelMatching')
  cancel(@ConnectedSocket() client: Socket) {
    this.queue = this.queue.filter((waiter) => {client.id != waiter.sock});
  }
  @SubscribeMessage('quitGame')
  quitGame(client: Socket) {
    const looser: Player = this.players.get(client.data);
    if (!looser)
      return;
    this.rooms.get(looser.roomid).clearTimers();
    this.removeRoom(looser.roomid, true, looser.id);
  }

  @SubscribeMessage('inviteEvent')
  handelInvite(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const online = this.online.get(data[0].recieverId);
    if (online && !this.players.get(client.data))
      this.server.to(online).emit('inviteEvent', data);
}

@SubscribeMessage('acceptedInvite')
handelAccept(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
  const player1: Player= {id: client.data, sock: client.id, roomid: client.data};
  const player2: Player= {id: data.senderId, sock: this.online.get(data.senderId), roomid: client.data};
  this.server.to(player2.sock).emit('acceptedInvite', data.accepterName);
  const room: NewRoom = {
    vsbot: false,
    mode: 0,
    id1: player1.id,
    sock1: player1.sock,
    id2: player2.id,
    sock2: player2.sock
  };
  this.players.set(player1.id, player1);
  this.players.set(player2.id, player2);
  this.rooms.set(player1.id,new GameService(room));
}

// remove room and update db function
  async removeRoom(roomid: string, disconnect: boolean, looserid: string) {
      
    const rslts = this.rooms.get(roomid).roomRslts(disconnect, looserid);
    if (rslts.winner.id)
    {
      this.players.delete(rslts.winner.id);
      this.server.to(rslts.winner.sock).emit('goback', "win");
      this.userservice.updateIntraUser(rslts.winner.id, {
        status: 'ONLINE',
      });
    }
    if (rslts.looser.id)
    {
      this.players.delete(rslts.looser.id);
      this.server.to(rslts.looser.sock).emit('goback', "lost");
      this.userservice.updateIntraUser(rslts.looser.id, {
        status: 'ONLINE',
      });
    }
    if (rslts.looser.id && rslts.winner.id) {
      this.userservice.addToGameHistory({
        winnerId: rslts.winner.id,
        winnerScore: rslts.winner.score,
        looserId: rslts.looser.id,
        looserScore: rslts.looser.score,
      });
    }
    this.userservice.setAchievements(rslts.winner, rslts.looser)
    this.rooms.delete(roomid);
  }
}