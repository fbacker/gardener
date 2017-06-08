#include "SensorMoistureGroup4501.h"

#if MOISTURE_4501_DEBUG
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
const char* const SensorMoistureGroup4501::VERSION = "0.1";


void SensorMoistureGroup4501::run(){

    DEBUG_PRINTLN("MOSITURE4501:Run:");
    
    // enable power
    digitalWrite(pinPower, HIGH);
    delay(50);
    
    // loop and check each device
    int count = 0;
    int r0 = 0;
    int r1 = 0;
    int r2 = 0;
    
    while(count<numberOfDevices){
        
        DEBUG_PRINT("MOSITURE4501:Run:Index: ");
        DEBUG_PRINTLN(count);
        
        // set read port
        r0 = bitRead(count,0);
        r1 = bitRead(count,1);
        r2 = bitRead(count,2);
        
        DEBUG_PRINT("MOSITURE4501:Run:Index:Bits ");
        DEBUG_PRINT(r0);
        DEBUG_PRINT(r1);
        DEBUG_PRINTLN(r2);
        
        digitalWrite(pinDigital0, r0);
        digitalWrite(pinDigital1, r1);
        digitalWrite(pinDigital2, r2);
        
        // read the value
        int val_new = analogRead(pinAnalog);
        int val_old = values[count];
        val_new = map(val_new,550,100,0,100);

        DEBUG_PRINT("MOSITURE4501:Run:Index:Compare ");
        DEBUG_PRINT(val_new);
        DEBUG_PRINT(", ");
        DEBUG_PRINTLN(val_old);
        
        // value has changed
        if(val_new!=val_old){
            values[count] = val_new;
            int deviceId = deviceIdStart + count;
            eventQueue->queueEvent(EventType::Moisture, deviceId, val_new);
        }
        count++;
    }
    
    // Turn off power
    digitalWrite(pinPower, LOW);
    
    runned();
    
    eventQueue->queueEvent(EventType::Complete, 0, 0);
};
