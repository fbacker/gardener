
#ifndef ModuleRF_h
#define ModuleRF_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif

#include "../ArduinoThread/Thread.h";
#include "../EventManager/EventManager.h";
#include "../RF24/RF24.h";
#include "./SensorEvents.h";



#define RF_DEBUG 1

/*
 * Sensor Light
 *
 * A class that handles outdoor light sensor
 */
class ModuleRF : public Thread  {
private:

    // data to send
    String sendMessageData;

    RF24* module;
    
    // Radio pipe addresses for the 2 nodes to communicate.
    uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

    // event que for messages
    EventManager* eventQueue;
    
public:
    // The version of this library
    static const char* const VERSION;

    /*
     * Constructor
     *
     * Constructs a light thread
     */
    ModuleRF(EventManager* eventQueueIn,uint8_t pin0In, uint8_t pin1In)
    {
        eventQueue = eventQueueIn;
        RF24 module(pin0In,pin1In);
        
        module.begin();
        module.setAutoAck(1);                    // Ensure autoACK is enabled
        module.setRetries(15,15);
        
        module.openWritingPipe(pipes[1]);
        module.openReadingPipe(1,pipes[0]);
        module.startListening();
        module.printDetails();
    }
    
    void addData(String data);
    
    void sendMessages();
    
    void run();
    
};

#endif
