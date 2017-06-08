
#ifndef SensorLightPhoto_h
#define SensorLightPhoto_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif

#include "../ArduinoThread/Thread.h";
#include "../EventManager/EventManager.h";
#include "./SensorEvents.h";


#define LIGHT_PHOTO_DEBUG 0

/*
 * Sensor Light
 *
 * A class that handles outdoor light sensor
 */
class SensorLightPhoto : public Thread  {
private:

    // controller analog pin
    int pinAnalog;
    
    // device id
    int deviceId;

    // current value
    int currentValue;

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
    SensorLightPhoto(EventManager* eventQueueIn,uint8_t deviceIdIn, uint8_t pinAnalogIn) :
        currentValue(0)
    {
        eventQueue = eventQueueIn;
        deviceId = deviceIdIn;
        pinAnalog = pinAnalogIn;
        
        pinMode(pinAnalog,INPUT);
    }
    
    int value();
    
    void run();
    
};

#endif
