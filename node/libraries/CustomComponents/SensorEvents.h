
#ifndef SensorEvents_h
#define SensorEvents_h

#if defined(ARDUINO) && (ARDUINO >= 100)
#    include <Arduino.h>
#else
#    include <WProgram.h>
#endif



class EventType {
public:
    enum eventType {
        Error,
        Complete,
        Temperature,
        Humidity,
        Light,
        Moisture
    };
};


#endif
