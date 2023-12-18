import { IsNotEmpty, IsString } from "class-validator";

export class userIdDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}