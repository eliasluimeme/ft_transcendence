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
    modeChoosed: boolean;
    type: string;
    mode: string;
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

export interface Board {
    ball: Point;
    rpadel: number;
    lpadel: number;
    lscore: number;
    rscore: number;
}