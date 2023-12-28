import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class idDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}

export class idMessageDto {
    @IsNotEmpty()
    @IsString()
    roomId : string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    userId : number ;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;
}