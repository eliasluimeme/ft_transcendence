import { Injectable, Logger } from '@nestjs/common';
import { Point, Ball, Board } from './interfaces';
import { NewRoom, Bot} from './interfaces';
import { clearInterval } from 'timers';

@Injectable()
export class GameService {
  private logger: Logger = new Logger(GameService.name);
  private readonly board = {width: 500, height: 500};
  private roomstatus: string = "onhold";
  private readonly padel = {width: 5, height: 100, speed: 20};
  private vsBot: boolean = false;
  private bot: Bot = {speed: 0, timer: ''};
  private started: boolean = false;
  private colTimers: {wall: any, padel: any} = {wall: '', padel: ''};
  private scoreTimer: any;
  private lachiev: boolean[] = [false, false, false, false, false];
  private rachiev: boolean[] = [false, false, false, false, false];
  private leftReady: boolean = false;
  private rightReady: boolean = false;
  private ball: Ball = {
    cords:  {x: 500, y: 250},
    vec: {x: 0, y: 0},
    rad: 10,
    speed: 2,
    repete: 16,
    timer: '',
    dir: 'left',
  }
  private lplayer = {
    id: '',
    sock: '',
    padelx: 0,
    padely: 0,
    score: 0,
    quickRef: 0,
    cbTrigger: false
  };
  private rplayer = {
    id: '' ,
    sock: '',
    padelx: this.board.width - 5,
    padely: 0,
    score: 0,
    quickRef: 0,
    cbTrigger: false
  };

  constructor(newroom: NewRoom) {
    if (newroom.vsbot)
    {
      this.vsBot = true;
      this.bot.speed = newroom.mode * 50;
    }
    this.roomstatus = "open";
    this.rplayer.id = newroom.id2;
    this.rplayer.sock = newroom.sock2;
    this.lplayer.id = newroom.id1;
    this.lplayer.sock = newroom.sock1;
    this.started = true;
  } 
// Move functions
  moveBot() {
    if (this.ball.cords.x > this.board.width / 2)
    {
      if ((this.ball.cords.y < this.rplayer.padely) && (this.rplayer.padely - this.padel.speed > 0))
        this.rplayer.padely -= this.padel.speed;
      else if ((this.ball.cords.y > this.rplayer.padely + this.padel.height) && (this.rplayer.padely + this.padel.height < this.board.height))
        this.rplayer.padely += this.padel.speed;
    }
  }
  moveBall() {
    this.ball.cords.x += this.ball.vec.x;
    this.ball.cords.y += this.ball.vec.y;
  }
  
  scoreChecker(){
    if (this.ball.cords.x >= this.board.width)
    {
      this.lplayer.score++;
      if (this.lplayer.score == 4 && this.rplayer.score == 0)
        this.rplayer.cbTrigger = true;
      this.resetBoard();
    }
    else if (this.ball.cords.x <= 0)
    {
      this.rplayer.score++;
      if (this.rplayer.score == 4 && this.lplayer.score == 0)
        this.lplayer.cbTrigger = true;
      this.resetBoard();
    }
    if (this.lplayer.score == 5 || this.rplayer.score == 5) {
      this.clearTimers();
      this.roomstatus = "closed";
    }
  }
//reset functions
  resetBoard()
  {
    const angle = this.getRandomNumber(-45, 45);
    this.calculVecs(angle);
    this.ball.speed = 2;
    this.ball.cords = {x: 250, y: 250};
    this.lplayer.padely = 0;
    this.rplayer.padely = 5;
    this.ball.repete = 16;
    this.clearTimers();
    this.resetTimers();
  }

  resetTimers()
  {
    if (this.started)
    {
      this.ball.timer = setInterval(this.moveBall.bind(this), this.ball.repete);
      if (this.vsBot)
        this.bot.timer = setInterval(this.moveBot.bind(this), this.bot.speed);
      this.colTimers.wall = setInterval(this.wallCollusion.bind(this), 16);
      this.colTimers.padel = setInterval(this.padelCollusion.bind(this), 16);
      this.scoreTimer = setInterval(this.scoreChecker.bind(this), 16);
    }
  }

  clearTimers()
  {
    if (this.started)
    {
      clearInterval(this.colTimers.wall);
      clearInterval(this.colTimers.padel);
      clearInterval(this.ball.timer);
      clearInterval(this.bot.timer);
      clearInterval(this.scoreTimer);
    }
  }

// tools functions
  isReady(id: string): boolean | any
  {
    if(this.lplayer.id == id && !this.leftReady)
      this.leftReady = true;
    if(this.rplayer.id == id && !this.rightReady)
      this.rightReady = true;
    if(this.leftReady && this.rightReady)
      return {player1: this.lplayer.id, player2: this.rplayer.id};
    return false;
  }
  getRandomNumber(min:number, max:number):number {
    const side = Math.round(Math.random());
    if (side)
      return Math.floor(Math.random() * (max - min) + min);
    else
      return 180 - Math.floor(Math.random() * (max - min) + min);
  }

  getRoomStatus():string {return this.roomstatus;}

  calculVecs(angle: number)
  {
    var radian = angle * (Math.PI/180);
    this.ball.vec.x = this.ball.speed * Math.cos(radian);
    this.ball.vec.y = this.ball.speed * Math.sin(radian);
  }

  findIntersection(top: Point, bottom: Point): Point {
    const centerX = this.ball.cords.x;
    const centerY = this.ball.cords.y;
    const radius  = this.ball.rad;
    const topLeftX = top.x;
    const topLeftY = top.y;
    const bottomRightX = bottom.x;
    const bottomRightY = bottom.y;
  
    let closestX = Math.max(topLeftX, Math.min(centerX, bottomRightX));
    let closestY = Math.max(topLeftY, Math.min(centerY, bottomRightY));
    let distanceX = centerX - closestX;
    let distanceY = centerY - closestY;
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
    if (distance <= radius) {
      const intersectionX = closestX;
      const intersectionY = closestY;
      return ({ x: intersectionX, y: intersectionY });
    }
    return ({x: -1, y: -1});
  }

  wallCollusion() {
    if ((this.ball.cords.y <= (this.ball.rad / 2) || this.ball.cords.y >= (this.board.height - this.ball.rad)) && 
    (this.ball.cords.x && this.ball.cords.x < (this.board.width - this.ball.rad))) {
      this.ball.vec.y *= -1;
      clearInterval(this.colTimers.wall);
      setTimeout(() => {
        this.colTimers.wall = setInterval(this.wallCollusion.bind(this), this.ball.repete);
      }, 50);
    }
  }

  padelCollusion() {
    var padeltop:Point;
    var padelbottom: Point;
    if (this.ball.cords.x >= this.rplayer.padelx - (this.ball.rad / 2)) {
      padeltop = {x: this.rplayer.padelx, y: this.rplayer.padely};
      padelbottom = {x: this.rplayer.padelx, y: this.rplayer.padely + this.padel.height};
      this.ball.dir = 'right';
    }
    else if (this.ball.cords.x <= this.padel.width + (this.ball.rad / 2)) {
      padeltop = {x: this.lplayer.padelx + this.padel.width, y: this.lplayer.padely};
      padelbottom = {x: this.lplayer.padelx + this.padel.width, y: this.lplayer.padely + this.padel.height};
      this.ball.dir = 'left';
    }
    else
      return;
    var intersect = this.findIntersection(padeltop, padelbottom);
    if (intersect.x < 0)
      return;
    var angle = (((padeltop.y + (this.padel.height / 2)) - intersect.y) / (this.padel.height / 2)) * -60;
    if (this.ball.dir == 'left')
    {
      this.calculVecs(angle);
      if (this.ball.repete < 6)
        this.lplayer.quickRef++;
    }
    else
    {
      this.calculVecs(180 - angle);
      if (this.ball.repete < 6)
        this.rplayer.quickRef++;
    }
    if (this.ball.repete > 5)
      this.ball.repete-= 2;
    clearInterval(this.ball.timer);
    this.ball.timer = setInterval(this.moveBall.bind(this), this.ball.repete);
    clearInterval(this.colTimers.padel);
    setTimeout(() => {
      this.colTimers.padel = setInterval(this.padelCollusion.bind(this), this.ball.repete);
    }, 50);
  }
//update and send data to player function
  updateBoard(id: string, y: number): Board{
    if (id == this.lplayer.id)
      this.lplayer.padely = y;
    else
      this.rplayer.padely = y;
    const board: Board = {
      ball: this.ball.cords,
      rpadel: Math.round(this.rplayer.padely),
      lpadel: Math.round(this.lplayer.padely),
      lscore: this.lplayer.score,
      rscore: this.rplayer.score
    };
    return board;
  }

  roomRslts(disconnect:boolean, looserid:string) {

    if(disconnect)
    {
      if(this.lplayer.id == looserid)
        return ({
          winner: {id: this.rplayer.id, sock: this.rplayer.sock, score: this.rplayer.score, achievs: this.rachiev},
          looser: {id: this.lplayer.id, sock: this.lplayer.sock, score: this.lplayer.score, achievs: this.lachiev}
        });
      else
        return ({
          winner: {id: this.lplayer.id, sock: this.lplayer.sock, score: this.lplayer.score, achievs: this.lachiev},
          looser: {id: this.rplayer.id, sock: this.rplayer.sock, score: this.rplayer.score, achievs: this.rachiev}
        });
    }

    if (this.lplayer.score > this.rplayer.score) {
      if (this.lplayer.quickRef >= 5)
        this.lachiev[1] = true;
      if (this.lplayer.quickRef >= 10)
        this.rachiev[1] = true;
      if (this.lplayer.cbTrigger)
        this.lachiev[2] = true;
      if (this.rplayer.score == 0)
        this.lachiev[3] = true;
      return ({
        winner: {id: this.lplayer.id, sock: this.lplayer.sock, score: this.lplayer.score, achievs: this.lachiev},
        looser: {id: this.rplayer.id, sock: this.rplayer.sock, score: this.rplayer.score, achievs: this.rachiev}
      });
    }
    else {
      if (this.rplayer.quickRef >= 5)
      this.rachiev[1] = true;
      if (this.rplayer.quickRef >= 10)
        this.rachiev[1] = true;
      if (this.rplayer.cbTrigger)
        this.rachiev[2] = true;
      if (this.lplayer.score == 0)
        this.rachiev[3] = true;
      return ({
        winner: {id: this.rplayer.id, sock: this.rplayer.sock, score: this.rplayer.score, achievs: this.rachiev},
        looser: {id: this.lplayer.id, sock: this.lplayer.sock, score: this.lplayer.score, achievs: this.lachiev}
      });
    }
  }
}