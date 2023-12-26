import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class idDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class idMessageDto {
    @IsNotEmpty()
    @IsNumber()
    roomId : number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    senderId : number ;

    @IsNotEmpty()
    @IsDate()
    timestamp: Date;
}