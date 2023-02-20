import { IsEmail, IsNotEmpty } from "class-validator";

export class UserChangePasswordDto {  
    @IsNotEmpty()
    @IsEmail()
    email:string;   

    @IsNotEmpty()
    password:string;   
    
}