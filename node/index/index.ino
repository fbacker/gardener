
#include <SPI.h>
#include <Thread.h>
#include <ThreadController.h>
#include <EventManager.h>
#include <dht11.h>
#include <RF24.h>
#include <nRF24L01.h>

#include <SensorEvents.h>
#include <SensorTemperatureHumidity.h>
#include <SensorLight.h>
#include <SensorLightPhoto.h>
#include <SensorMoisture.h>
#include <SensorMoistureGroup4501.h>
#include <ModuleRF.h>

//-----------------------------
// 
//         VARIABLES
//             & 
//        CONTROLLERS
// 
//-----------------------------

// threads
ThreadController controller = ThreadController(); // run active threads

// events
EventManager eventManager;

// looper
int currentGroup = 0;
int currentIndex = 0;

//-----------------------------
// 
//      CUSTOM MODULES
// 
//-----------------------------
int temperatureHumiditysLength = 0;
SensorTemperatureHumidity temperatureHumiditys[] = {
  SensorTemperatureHumidity(&eventManager,0,8)
};
int lightsLength = 0;
SensorLight lights[] = {
  SensorLight(&eventManager,0,A0)
};
int lightphotosLength = 0;
SensorLightPhoto lightphotos[] = {
  SensorLightPhoto(&eventManager,0,A1)
};
int moisturesLength = 0;
SensorMoisture moistures[] = {
  SensorMoisture(&eventManager,0,49,A2)
};
int sensorMoistureGroup4501Length = 0;
SensorMoistureGroup4501 moisturesGroup4501[] = {
  SensorMoistureGroup4501(&eventManager,0,3,48,A3,41,42,43)
};
// Set up nRF24L01 radio on SPI bus plus pins 9 & 10
ModuleRF RFModule = ModuleRF(&eventManager,9,10);



void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Started");

  // Setup listeners
  eventManager.addListener(EventType::Error, &onEvent);
  eventManager.addListener(EventType::Temperature, &onEvent);
  eventManager.addListener(EventType::Humidity, &onEvent);
  eventManager.addListener(EventType::Light, &onEvent);
  eventManager.addListener(EventType::Moisture, &onEvent);
  eventManager.addListener(EventType::Complete, &onEvent);

  RFModule.setInterval(10000);
  RFModule.enabled = true;
  controller.add(&RFModule); 

  delay(1000);
  onNextItem();

  delay(1000);
  Serial.println("do here");
}

void loop() {
  // put your main code here, to run repeatedly:
  controller.run();              // Threads
  eventManager.processEvent();   // Events
}
Thread* runArr;
int runLen;

void onRunItem(){
  /*
  Serial.print("run item ");
  Serial.print(currentIndex);
  Serial.print(", of ");
  Serial.println(runLen);
  */
  if(runLen>0 && currentIndex<runLen){
      // done
      runArr[currentIndex].run();
      currentIndex++;
    }
    else {
      // nothing to do
      currentGroup++;
      currentIndex = 0;
      onNextItem();
    }
}
void onNextItem(){
  /*
  Serial.println("");
  Serial.print("onNextItem, group: ");
  Serial.print(currentGroup);
  Serial.print(", index: ");
  Serial.println(currentIndex);
  */
  switch(currentGroup){
    
    case 0:
      runArr = temperatureHumiditys;
      runLen = temperatureHumiditysLength;
      onRunItem();
      break;
      
    case 1:
      runArr = lights;
      runLen = lightsLength;
      onRunItem();
      break;

    case 2:
      runArr = lightphotos;
      runLen = lightphotosLength;
      onRunItem();
      break;

    case 3:
      runArr = moistures;
      runLen = moisturesLength;
      onRunItem();
      break;
      
    case 4:
      runArr = moisturesGroup4501;
      runLen = sensorMoistureGroup4501Length;
      onRunItem();
      break;

    
    
    default:
      // reset and reloop
      currentGroup = 0;
      currentIndex = 0;
      delay(5000);
      onNextItem();
      break;
  }
}

void onEvent(int event, int device, int param) {
  
  
  String data = "";
  switch(event){
    case EventType::Humidity :
      data = "humidity";
      break;
    case EventType::Temperature :
      data = "temperature";
      break;
    case EventType::Light :
      data = "light";
      break;
    case EventType::Moisture :
      data = "moisture";
      break;  
    case EventType::Error :
      data = "error";
      break;
    case EventType::Complete :
      onRunItem();
      return; // break
  }
  Serial.print("onEvent ");
  Serial.print(event);
  Serial.print(", type: ");
  Serial.print(data);
  Serial.print(", device ");
  Serial.print(device);
  Serial.print(", param ");
  Serial.println(param);

  if(data!=""){
      //data = data + "," + device;
      //data = data + "," + param;
      //RFModule.addData(data);
  }
}
