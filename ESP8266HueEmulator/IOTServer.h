#include <AWSWebSocketClient.h>
#include <CircularByteBuffer.h>

#include <NtpClientLib.h>

#include <Arduino.h>
#include <Stream.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

//AWS
#include "sha256.h"
#include "Utils.h"

//WEBSockets
#include <Hash.h>
//#include <WebSocketsClient.h>

//MQTT PAHO
#include <SPI.h>
#include <IPStack.h>
#include <Countdown.h>
#include <MQTTClient.h>
#ifndef IOT_H

#define IOT_H


//AWS MQTT Websocket
#include "Client.h"
#include "AWSWebSocketClient.h"
#include "CircularByteBuffer.h"
//AWS IOT config, change these:


//MQTT config
const int maxMQTTpackageSize = 512;
const int maxMQTTMessageHandlers = 1;

class IOTServer
{
private: 
String aws_endpoint;
String aws_topic;
int port = 443;
long connection = 0;
MQTT::Client<IPStack, Countdown, maxMQTTpackageSize, maxMQTTMessageHandlers> *client = NULL;  
char* generateClientID ();
void sendmessage ();
void subscribe ();
bool connect();

public:
IOTServer(char*aws_region,char*aws_endpoint,char*aws_key,char*aws_secret,const char*aws_topic);
void begin();
void loop();  
};
void messageArrived(MQTT::MessageData& md);
#endif

