
#ifndef SensorMoistureGroup4501_h
#define SensorMoistureGroup4501_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif

#include "../ArduinoThread/Thread.h";
#include "../EventManager/EventManager.h";
#include "./SensorEvents.h";


#define MOISTURE_4501_DEBUG 1

/*
 * Sensor Light
 *
 * A class that handles outdoor light sensor
 */
class SensorMoistureGroup4501 : public Thread  {
private:

    // Power enable pin
    int pinPower;
    
    // controller analog pin
    int pinAnalog;
    
    // controller digital switch
    int pinDigital0;
    int pinDigital1;
    int pinDigital2;
    
    // device id
    int deviceIdStart;
    
    // how many to check
    int numberOfDevices;
    
    int *values;


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
    SensorMoistureGroup4501(
                   EventManager* eventQueueIn,
                   uint8_t deviceIdStartIn,
                   uint8_t numberOfDevicesIn,
                   uint8_t pinPowerIn,
                   uint8_t pinAnalogIn,
                   uint8_t pinDigitalIn0,
                   uint8_t pinDigitalIn1,
                   uint8_t pinDigitalIn2)
    {
        
        eventQueue = eventQueueIn;
        deviceIdStart = deviceIdStartIn;
        numberOfDevices = numberOfDevicesIn;
        values = new int[numberOfDevicesIn];
        for(int i = 0; i < numberOfDevicesIn; i++){
            values[i] = 0;
        }
        
        pinPower = pinPowerIn;
        pinAnalog = pinAnalogIn;
        pinDigital0 = pinDigitalIn0;
        pinDigital1 = pinDigitalIn1;
        pinDigital2 = pinDigitalIn2;
        
        pinMode(pinAnalog, INPUT);
        pinMode(pinPower, OUTPUT);
        pinMode(pinDigital0, OUTPUT);
        pinMode(pinDigital1, OUTPUT);
        pinMode(pinDigital2, OUTPUT);
        
        digitalWrite(pinPower, LOW);
        digitalWrite(pinDigital0, LOW);
        digitalWrite(pinDigital1, LOW);
        digitalWrite(pinDigital2, LOW);
    }
    
    
    void run();
    
};

#endif
