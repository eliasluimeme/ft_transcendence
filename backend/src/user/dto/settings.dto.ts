import { IsNotEmpty, IsString } from "class-validator";

export class settingsDTO {
    @IsNotEmpty( {message: "You must provide a full name"} )
    @IsString()
    fullName: string;

    @IsNotEmpty( {message: "You must provide a user name"} )
    @IsString( {message: "User name must be a string"} )
    userName: string;

    country: string;

    number: string;

    photo: string;
}