
#ifndef SensorMoisture_h
#define SensorMoisture_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif

#include "../ArduinoThread/Thread.h";
#include "../EventManager/EventManager.h";
#include "./SensorEvents.h";


#define MOISTURE_DEBUG 1

/*
 * Sensor Light
 *
 * A class that handles outdoor light sensor
 */
class SensorMoisture : public Thread  {
private:

    // pin to give power
    int pinPower;
    
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
    SensorMoisture(EventManager* eventQueueIn,uint8_t deviceIdIn, uint8_t pinPowerIn, uint8_t pinAnalogIn) :
        currentValue(0)
    {
        eventQueue = eventQueueIn;
        deviceId = deviceIdIn;
        pinPower = pinPowerIn;
        pinAnalog = pinAnalogIn;
        
        pinMode(pinPower,OUTPUT);
        pinMode(pinAnalog,INPUT);
        
        digitalWrite(pinPower, LOW);
    }
    
    int value();
    
    void run();
    
};

#endif
