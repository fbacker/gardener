
#ifndef SensorHeat_h
#define SensorHeat_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif

#include "../ArduinoThread/Thread.h";
#include "../dht11/dht11.h";
#include "../EventManager/EventManager.h";
#include "./SensorEvents.h";

#define HEAT_DEBUG 0

/*
 * Sensor Heat and Humidity
 *
 * A class that handles outdoor light sensor
 */
class SensorTemperatureHumidity : public Thread  {
private:
    
    dht11 module;
    
    // controller digital pin
    int pinDigital;
    
    // device id
    int deviceId;

    // current value
    int currentTemperature;
    int currentHumidity;
    
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
    SensorTemperatureHumidity(EventManager* eventQueueIn,uint8_t deviceIdIn,uint8_t pinDigitalIn) :
        pinDigital(-1),
        currentTemperature(0),
        currentHumidity(0)
    {
        eventQueue = eventQueueIn;
        deviceId = deviceIdIn;
        pinDigital = pinDigitalIn;
        
        pinMode(pinDigital,INPUT);
    }
    
    
    int celcius();
    
    int fahrenheit();
    
    int kelvin();
    
    int humidity();
    
    void run();
    
};

#endif
