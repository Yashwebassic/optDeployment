import { Injectable } from '@nestjs/common';
import axios from 'axios';



@Injectable()
export class SmsService {
    constructor(
        ) {}

    public sendSms(smsData: any) {
        console.log('SmsDetailsHits')
        console.log(smsData)             
    
        const apiKey = "MzUzODY4NGU0NjRiNzE0YzQ0Mzk0YTU5NGUzNjdhNzQ="
        const sender = "WITSMS"
        const number = 917058445134 
        console.log(typeof(number))
        console.log(number)
        let applicationName = "application name"
        let otp = "123123"  

        console.log(apiKey)
        // const message = encodeURIComponent(`Welcome to ${applicationName}, Your OTP is ${otp}. Thanks Doosy`);
        const message=`Hi, ${otp} is your OTP to activate your account for Onsite Fuel Delivery - Webassic IT Solutions`

        var url = "http://api.textlocal.in/send/?" + 'apiKey=' + apiKey + '&sender=' + 'WITSMS' + '&numbers=' + number + '&message=' + message;
        console.log('hits')
          console.log(url)
          axios
                .post(url)
                .then(function (response) {
                    return  ''
                    // console.log("response ", response.data);
                  
                    // const saveResponse= this.SmsService.save()
                })
                .catch(function (error) {
                    console.log("error ", error.message);
                });
        
       

    }

    public sendSMS(to:string, authCodeRes: string) {

        const apiKey = process.env.TEXTLOCAL_API_KEY
        const sender = process.env.TEXTLOCAL_SENDER_KEY
        let applicationName = "HECOTP"
        
        console.log(apiKey)
      
        const message=`Hi, No device with serial no: ${authCodeRes} found. Sorry Unable to proceed futher - Webassic IT Solutions`

        var url = "http://api.textlocal.in/send/?" 
        + 'apiKey=' + apiKey + '&sender=' + 'WITSMS' 
        + '&numbers=' + to + '&message=' + message;
          console.log(url)
          axios
                .post(url)
                .then(function (response) {
                    console.log("response ", response.data);
                  
                    // const saveResponse= this.SmsService.save()
                })
                .catch(function (error) {
                    console.log("error ", error.message);
                });
        
       

    }
        
    
    public sendOTP(to:string, otp: any) {
        console.log('SmsDetailsHits')       
    
        const apiKey = process.env.TEXTLOCAL_API_KEY
        const sender = process.env.TEXTLOCAL_SENDER_KEY
        let applicationName = "HECOTP"
        
        console.log(apiKey)
        // const message = encodeURIComponent(`Welcome to ${applicationName}, Your OTP is ${otp}. Thanks Doosy`);
        const message=`Hi, ${otp} is your OTP to activate your account for Onsite Fuel Delivery - Webassic IT Solutions`

        var url = "http://api.textlocal.in/send/?" 
        + 'apiKey=' + apiKey + '&sender=' + 'WITSMS' 
        + '&numbers=' + to + '&message=' + message;
          console.log(url)
          axios
                .post(url)
                .then(function (response) {
                    console.log("response ", response.data);
                  
                    // const saveResponse= this.SmsService.save()
                })
                .catch(function (error) {
                    console.log("error ", error.message);
                });
        
       

    }

}




