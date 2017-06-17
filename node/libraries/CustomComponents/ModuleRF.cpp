#include "ModuleRF.h"

#if RF_DEBUG
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
const char* const ModuleRF::VERSION = "0.1";
// http://hack.lenotta.com/arduino-raspberry-pi-switching-light-with-nrf24l01/

void ModuleRF::sendMessages(){
    // First, stop listening so we can talk
    module.stopListening();
        
    // Send the final one back.
    DEBUG_PRINTLN("Sent data.");
    module.write( &sendMessageData, sizeof(unsigned short) );
    DEBUG_PRINTLN("Sent response.");
        
    // Now, resume listening so we catch the next packets.
    module.startListening();
}

void ModuleRF::addData(String data){
    sendMessageData = sendMessageData + data;
}

void ModuleRF::run(){

    DEBUG_PRINTLN("RF:Run:");
    
    // if there is data ready
    if ( module.available() )
    {
        // Dump the payloads until we've gotten everything
        bool done = false;
        unsigned short message;
        unsigned short rawMessage;
        
        while ( module.available() )
        {
            // Fetch the payload, and see if this was the last one.
            module.read( &rawMessage, sizeof(unsigned long) );
            
            // Spew it
            DEBUG_PRINT("Got message ");
            DEBUG_PRINTLN(rawMessage);
            
            // send event
            
            delay(10);
        }
    }
    
    if(sendMessageData!=""){
        sendMessages();
    }
    
    runned();
};
