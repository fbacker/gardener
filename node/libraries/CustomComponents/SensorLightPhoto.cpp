#include "SensorLightPhoto.h"

#if LIGHT_PHOTO_DEBUG
#define DEBUG_PRINT( x )		Serial.print( x );
#define DEBUG_PRINTLN( x )      Serial.println( x );
#define DEBUG_PRINT_PTR( x )	Serial.print( reinterpret_cast<unsigned long>( x ), HEX );
#define DEBUG_PRINTLN_PTR( x )	Serial.println( reinterpret_cast<unsigned long>( x ), HEX );
#else
#define DEBUG_PRINT( x )
#define DEBUG_PRINTLN( x )
#define DEBUG_PRINT_PTR( x )
#define DEBUG_PRINTLN_PTR( x )
#endif

// The version of this code
const char* const SensorLightPhoto::VERSION = "0.1";

int SensorLightPhoto::value(){
    return currentValue;
}

void SensorLightPhoto::run(){

    DEBUG_PRINTLN("LIGHT:Run:");
    
    int val_new = analogRead(pinAnalog);  //Get photoresistor value

    DEBUG_PRINT("LIGHT: Value: ");
    DEBUG_PRINTLN(val_new);
    
    if(currentValue != val_new){
        currentValue = val_new;
        eventQueue->queueEvent(EventType::Light, deviceId, val_new);
    }
    
    eventQueue->queueEvent(EventType::Complete,deviceId,0);
    runned();
};
