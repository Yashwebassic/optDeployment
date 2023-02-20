import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    
public sendMail(mailData: any){
        
        const nodemailer = require('nodemailer');
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'health.tech108@gmail.com',//set from env variable
                pass: 'vpodjoomjeftxphm'//set from env variable
            }
        });
        mailTransporter.sendMail(mailData, function(err) {
            if(err) {
                console.log('Error Occurs');
                return err;
            } else {
                console.log('Email sent successfully');
                return 1;
            }
        });
    }
}


