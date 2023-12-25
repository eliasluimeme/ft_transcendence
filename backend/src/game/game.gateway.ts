import { Logger, UseGuards } from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
namespace: 'game',})
@UseGuards(GameGuard)
export class GameGateway implements OnGatewayInit{
  @WebSocketServer() server: Server;
  private players: Map<string,Player> = new Map();
  private readonly logger: Logger = new Logger(GameGateway.name);
  private queue: Socket[] = [];
  private readonly board: BoardData = {
    board: {width: 1000, height: 500},
    padel: {width: 15, height: 100},
    ballc: {x: 500, y: 250},
    ballr: 10
  };
  constructor(private rooms: Map<string, GameService>, private config: ConfigService, private userservice: UserService, private prisma: PrismaService) {}

  async findUserByIntraId(userId: string) {
    try {
        const user = await this.prisma.user.findUnique({
            where: {
                intraId: userId,
            },
            include: {
                level: true,
            }
        });
        if (user) {
            delete user.hash;
            return user;
        } else return user;
    } catch (error) {
        // check prisma error status code
        console.error('Error finding user: ', error);
    }
}

  afterInit(client: Socket)
  { 
    this.logger.log("Gateway is initialized.");
    this.server.on('connection', (client: Socket) => {
      if (!GameGuard.validateToken(client, this.config.get('JWT_SECRET')))
      {this.server.to(client.id).emit('goback', "[Access Denied]: Log in to access the game");}
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.warn("Client is disconnected");
    const looser: Player = this.players.get(client.data);
    if (!looser)
      return;
    this.rooms.get(looser.roomid).clearTimers();
    this.removeRoom(looser.roomid, true);
  }

  removeRoom(roomid: string, disconnect: boolean) {
    
    const rslts = this.rooms.get(roomid).roomRslts();
    this.logger.error("room is removed.");
    if (rslts.winner.id)
    {
      this.players.delete(rslts.winner.id);
      if (disconnect)
        this.server.to(rslts.winner.sock).emit('goback', "Your opponent has disconnected");
      else
        this.server.to(rslts.winner.sock).emit('goback', "You won the game");
      // this.userservice.updateUser(parseInt(rslts.looser.id), {
      //   achievements: rslts.looser.achievs,
      //   losses: {increment: 1}
      // });
    }
    if (rslts.looser.id)
    {
      this.players.delete(rslts.looser.id);
      if (disconnect)
        this.server.to(rslts.looser.sock).emit('goback', "You were disconnected");
      else
        this.server.to(rslts.looser.sock).emit('goback', "You were lost the game");
      // this.userservice.updateUser(parseInt(rslts.winner.id), {
      //   achievements: rslts.winner.achievs,
      //   wins: {increment: 1}
      // });
    }
    if (rslts.looser.id && rslts.winner.id) {
      this.userservice.addToGameHistory({
        winnerId: rslts.winner.id,
        winnerScore: rslts.winner.score,
        looserId: rslts.looser.id,
        looserScore: rslts.looser.score,
        disconnect: disconnect
      });
    }
    this.rooms.delete(roomid);
  }

  @SubscribeMessage('newGameBot')
  async newGameBot(@ConnectedSocket() client: Socket, @MessageBody() mode: string)
  {
    this.logger.warn("hello");
    const player = {id: client.data, sock: client.id, roomid: client.data};
    if (this.players.has(player.id))
    {
      if (player.sock != client.id)  
        client.disconnect();
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
    this.server.to(player.sock).emit('roomCreated', 'left');
    this.rooms.get(player.id).resetBoard();
    //sending ready event to each player with opponent data
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(@MessageBody() y: number, @ConnectedSocket() client: Socket) {
    const player: Player = this.players.get(client.data);
    if (!player || player.sock != client.id) {
      client.disconnect();
      return;
    }
    if(this.rooms.get(player.roomid).getRoomStatus() == "closed") {
      this.removeRoom(player.roomid, false);
      return;
    }
    const board = this.rooms.get(player.roomid).updateBoard(player.id, y);
    this.server.to(client.id).emit('updatePlayer', board);
  }

  @SubscribeMessage('newGamePlayer')
  async newGamePlayer(@ConnectedSocket() client: Socket)
  { 
    const player1 = {id: client.data, sock: client.id, roomid: client.data};
    if (this.players.has(player1.id))
    {
      if (player1.sock != client.id)  
        client.disconnect();
      return;
    }
    if (!this.queue.length) {
      this.queue.push(client);
      return;
    }
    const opponent = this.queue.pop();
    const player2 = {id: opponent.data, sock: opponent.id, roomid: player1.id};
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
    this.server.to(player1.sock).emit('roomCreated', 'left');
    this.server.to(player2.sock).emit('roomCreated', 'right');
    this.rooms.get(player1.id).resetBoard();
    //sending ready event to each player with opponent data
  }

  @SubscribeMessage('cancelMatching')
  cancel(@ConnectedSocket() client: Socket) {
    this.queue = this.queue.filter((waiters) => {client.id != waiters.id});
    this.server.to(client.id).emit('goback', "[Game Canceled] U canceled the matching process");
  }
}
