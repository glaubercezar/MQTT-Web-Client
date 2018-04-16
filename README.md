# MQTT-Web-Client

This web tool runs on any modern browser, which supports websockets. You can use it to publish and subscribe to JSON messages. Very useful for testing and developing applications which use MQTT over websockets.

## Features

+ Send and receive JSON messages
+ Send and receive serialized messages in [Avro](http://avro.apache.org/docs/current/)
+ Store and manage messages from publish and subscribe
+ Store and manage connection environments
+ Subscriptions control and received messages

## Installation

Open the terminal in root of the project

Install bower dependencies
```sh
bower install
```
Install npm dependencies
```sh
npm install
```
Type gulp to run local Browsersync server
```sh
gulp
```
## How to use

You must connect to MQTT broker which supports websockets. Some public brokers:
+ Mosquitto, &nbsp; Host: iot.eclipse.org &nbsp; Port: 443 &nbsp; SSL: true
+ Mosquitto, &nbsp; Host: test.mosquitto.org &nbsp; Port: 8080 &nbsp; SSL: false
+ HiveMQ, &nbsp; Host: broker.mqttdashboard.com &nbsp; Port: 8000 &nbsp; SSL: false

## Examples

To publish a message avro:

Topic: your/topic/here

Json:
```javascript
{"name":"Glauber", "age":27}
```

Schema:
```javascript
{
    "name": "UserData",
    "type": "record",
    "fields": [
        {"name":"name", "type":"string"},
        {"name":"age", "type":"int"}
    ]
}
```

To receive the message, you must subscribe with same schema

## Dependencies

This project utilizes:
+ [AngularJS Material](https://material.angularjs.org/latest/) - UI Component framework
+ [MQTT.js](https://github.com/mqttjs/MQTT.js) - A client library for the [MQTT](http://mqtt.org/) protocol
+ [Avsc](https://github.com/mtth/avsc) - Pure JavaScript implementation of the [Avro](http://avro.apache.org/docs/current/) specification

## Screenshots

![publish.png](/screenshots/publish.png?raw=true "Publish message")
