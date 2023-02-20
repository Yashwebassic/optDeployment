import { IsEmail, IsNotEmpty } from "class-validator";
// import { OptEventLog } from "src/opt-event-log/entities/opteventlog.entity";

export class UserGetOptDto {  
    @IsNotEmpty()
    @IsEmail()
    email:string;   

    // optEventLog?:OptEventLog[];


   
    
}