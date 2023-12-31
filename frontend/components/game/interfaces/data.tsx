export interface Player{
    id: string;
    full_name: string;
    first_name: string;
};

export interface NewGame {
    type: string;
    mode: string;
    player: Player;
};

export interface CtxType {
    socket: any;
}

export interface Padel  {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Ball {
    x: number;
    y: number;
    radius: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface BoardInfo {
    ball: Point;
    rpadel: number;
    lpadel: number;
    lscore: number;
    rscore: number;
}

export interface User {
    id: number;
    fullName: string;
    userName: string;
    photo: string;
}