#include <napi.h>
#include <string>
#include <iostream>
#include <node_api.h>

#include "aes.h"

const unsigned char key_req[16] = {0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f};

const unsigned char key_aut[16] = {0x0f,0x0e,0x0d,0x0c,0x0b,0x0a,0x09,0x08,0x07,0x06,0x05,0x04,0x03,0x02,0x01,0x00};

const unsigned char iv[16] =  {0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f};




Napi::Number encrypt(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    //std::string name = info[0].As<Napi::String>().Utf8Value();

    int16_t serial_number;
    napi_get_value_int32(env, info[0], (int32_t*)&serial_number);
    std::cout << "Serial="<< serial_number <<"\n";

    int16_t random;
    napi_get_value_int32(env, info[1], (int32_t*)&random);
    std::cout << "Random="<< random <<"\n";

    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx,key_req,iv);

    //int16_t serial_number = 3000;
	//short random = SpinEditRandom->Value;
	//int16_t random = 10982; //SpinEditRandom->Value;

	unsigned char code_buff[4];

	code_buff[3] = serial_number & 0xff;
	code_buff[1] = (serial_number & 0xff00) >> 8;
	code_buff[2] = random & 0xff;
	code_buff[0] = (random & 0xff00) >> 8;

	AES_CTR_xcrypt_buffer(&ctx,code_buff,4);
	unsigned int req_code;
	memcpy(&req_code,code_buff,4);
    std::cout << "Request Code=" << req_code <<"\n";
    
    //int32_t random1 = info[1].As<Napi::Number>().Int32Value();
    //std::cout << random1 <<"\n";
    return Napi::Number::New(env, req_code);
}

Napi::Object decrypt(const Napi::CallbackInfo& info) {
    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx,key_req,iv);

    Napi::Env env = info.Env();
    int32_t req_code_input;
    napi_get_value_int32(env, info[0], (int32_t*)&req_code_input);
    std::cout << "Request Code="<< (unsigned int)req_code_input <<"\n";

    unsigned int req_code = (unsigned int)req_code_input;
    unsigned char code_buff[4];

	memcpy(&code_buff[0],&req_code,4);

	AES_CTR_xcrypt_buffer(&ctx,code_buff,4);
	short serial_number;
	unsigned short random;

	serial_number = code_buff[3] + ((code_buff[1])<<8);
	random = code_buff[2] + ((code_buff[0])<<8);

    std::cout << "Serial=" << serial_number << "\n";
    std::cout << "Random=" << random << "\n";
    
    //int32_t random1 = info[1].As<Napi::Number>().Int32Value();
    //std::cout << random1 <<"\n";
    Napi::Object result = Napi::Object::New(env);
    result.Set("serial_number", serial_number);
    result.Set("random", random);
    return result;
}
Napi::Object generateAuthCode(const Napi::CallbackInfo& info) {
    Napi::Object result = decrypt(info);

    struct AES_ctx ctx;
    AES_init_ctx_iv(&ctx,key_aut,iv);

    Napi::Value val1 = result.Get("serial_number");
    int16_t serial_number = (int16_t)val1.As<Napi::Number>().Int32Value();
	//short random = SpinEditRandom->Value;
    Napi::Value val2 = result.Get("random");
    int16_t random = (int16_t)val2.As<Napi::Number>().Int32Value();; //SpinEditRandom->Value;


    std::cout << "Serial=" << serial_number << "\n";
    std::cout << "Random=" << random << "\n";
	unsigned char code_buff[4];

	code_buff[3] = serial_number & 0xff;
	code_buff[1] = (serial_number & 0xff00) >> 8;
	code_buff[2] = random & 0xff;
	code_buff[0] = (random & 0xff00) >> 8;

	AES_CTR_xcrypt_buffer(&ctx,code_buff,4);
	unsigned int auth_code;
	memcpy(&auth_code,code_buff,4);
    std::cout << "Auth Code=" << auth_code <<"\n";
    result.Set("auth_code", auth_code);
    
    return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set(
        Napi::String::New(env, "encrypt"),
        Napi::Function::New(env, encrypt)
    );
    exports.Set(
        Napi::String::New(env, "decrypt"),
        Napi::Function::New(env, decrypt)
    );

    exports.Set(
        Napi::String::New(env, "generateAuthCode"),
        Napi::Function::New(env, generateAuthCode)
    );
    return exports;
}

NODE_API_MODULE(aes, Init)