#include "SensorLight.h"

#if LIGHT_DEBUG
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
const char* const SensorLight::VERSION = "0.1";

int SensorLight::value(){
    return currentValue;
}

void SensorLight::run(){

    DEBUG_PRINTLN("LIGHT:Run:");
    
    int val_new = analogRead(pinAnalog);  //Get photoresistor value
    //int val_new_d = digitalRead(pinDigital);
    val_new /= 4;  //with a 10k resistor divide the value by 2, for 100k resistor divide by 4.
    
    DEBUG_PRINT("LIGHT: Value: ");
    DEBUG_PRINTLN(val_new);
    
    if(currentValue != val_new){
        currentValue = val_new;
        eventQueue->queueEvent(EventType::Light, deviceId, val_new);
    }
    
    eventQueue->queueEvent(EventType::Complete,deviceId,0);
    runned();
};
