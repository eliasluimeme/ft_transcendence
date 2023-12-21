import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class idDto {
    @IsNotEmpty()
    @IsString()
    id: string;
}