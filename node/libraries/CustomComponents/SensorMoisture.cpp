#include "SensorMoisture.h"

#if MOISTURE_DEBUG
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
const char* const SensorMoisture::VERSION = "0.1";

int SensorMoisture::value(){
    return currentValue;
}

void SensorMoisture::run(){

    DEBUG_PRINTLN("MOSITURE:Run:");
    
    digitalWrite(pinPower, HIGH);
    delay(50);
    
    int val_new = analogRead(pinAnalog);
    val_new = map(val_new,550,10,0,100);
    DEBUG_PRINT("MOISTURE: Value: ");
    DEBUG_PRINTLN(val_new);
    
    if(currentValue != val_new){
        currentValue = val_new;
        eventQueue->queueEvent(EventType::Moisture, deviceId, val_new);
    }
    eventQueue->queueEvent(EventType::Complete, deviceId, 0);
    digitalWrite(pinPower, LOW);
    runned();
};
