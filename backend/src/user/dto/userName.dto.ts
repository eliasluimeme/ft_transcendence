import { IsNotEmpty, IsString } from "class-validator";

export class userNameDTO {
    @IsNotEmpty()
    @IsString()
    user: string;
}