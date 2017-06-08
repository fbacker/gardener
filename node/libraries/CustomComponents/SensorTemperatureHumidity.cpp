#include "SensorTemperatureHumidity.h"


#if HEAT_DEBUG
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
const char* const SensorTemperatureHumidity::VERSION = "0.1";

int SensorTemperatureHumidity::celcius(){
    return currentTemperature;
}

int SensorTemperatureHumidity::fahrenheit(){
    return (currentTemperature * 18 + 5)/10 + 32;;
}

int SensorTemperatureHumidity::kelvin(){
    return (currentTemperature + 273.15);;
}

int SensorTemperatureHumidity::humidity(){
    return currentHumidity;
}


void SensorTemperatureHumidity::run(){
    
    int chk = module.read(pinDigital);
    DEBUG_PRINTLN("TEMPERATURE:Run:"+String(chk));

    switch (chk) {
        case DHTLIB_OK:
            
            if(currentHumidity != module.humidity){
                currentHumidity = module.humidity;
                eventQueue->queueEvent(EventType::Humidity, deviceId, currentHumidity);
            }
            if(currentTemperature != module.temperature){
                currentTemperature = module.temperature;
                eventQueue->queueEvent(EventType::Temperature, deviceId, currentTemperature);
            }
            
            DEBUG_PRINT("TEMPERATURE:Humidity: ");
            DEBUG_PRINT(currentHumidity);
            DEBUG_PRINT("%,  Temperature: ");
            DEBUG_PRINT(currentTemperature);
            DEBUG_PRINTLN("c");
            break;
            
        case DHTLIB_ERROR_CHECKSUM:
            
            DEBUG_PRINTLN("TEMPERATURE:Error:Checksum error");
            eventQueue->queueEvent(EventType::Error, deviceId, 11);
            break;
            
        case DHTLIB_ERROR_TIMEOUT:
            DEBUG_PRINTLN("TEMPERATURE:Error:Timeout error");
            eventQueue->queueEvent(EventType::Error, deviceId, 12);
            break;
            
        default:
            DEBUG_PRINTLN("TEMPERATURE:Error:Unknown error");
            eventQueue->queueEvent(EventType::Error, deviceId, 10);
            break;
    }
    
    eventQueue->queueEvent(EventType::Complete,deviceId,0);
    runned();
};
