export interface Adverse {
    fullname: string;
    username: string;
    photo: string;
}

export interface BoardData {
    board: Size;
    padel: Size;
    ballc: Point;
    ballr: number;
}

export interface RoomData {
    board: BoardData,
    adverse: Adverse,
}

export interface Player {
    id: string;
    sock: string;
    roomid: string;
}

export interface Bot{
    speed: number;
    timer: any;
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface Ball {
    cords: Point;
    vec: Point;
    rad: number;
    speed: number;
    repete: number;
    timer: any;
    dir: string;
}

export interface PlayerRslt {
    id: string;
    score: number;
}

export interface RoomRslt {
    player1: {id: string, sock: string};
    player2: {id: string, sock: string};
}

export interface NewRoom {
    vsbot: boolean;
    mode: number;
    id1: string;
    sock1: string;
    id2: string;
    sock2: string;
}

export interface Board {
    ball: Point;
    rpadel: number;
    lpadel: number;
    lscore: number;
    rscore: number;
}

export interface User {
    userId: string;
    email: string;
    isTwoFactorAuthEnabled: boolean;
    isTwoFactorAuthenticated: boolean;
}

export interface DecodedToken {
    payload: User;
    iat: string;
    exp: string;
}