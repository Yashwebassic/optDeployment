#include <napi.h>
#include <string>
#include "greeting.h"

Napi::String greetHello(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string name = info[0].As<Napi::String>().Utf8Value();
    std::string result = helloUser(name);
    return Napi::String::New(env, result);

}

Napi::Object Init(Napi::Env env, Napi::Object exports){
    exports.Set(
        Napi::String::New(env, "greetHello"),
        Napi::Function::New(env, greetHello)
    );
    return exports;
}

NODE_API_MODULE(greet, Init)