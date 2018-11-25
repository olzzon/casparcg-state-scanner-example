## CasparCG-State-Scanner Client Example

A simple Client that subscribe realtime from CasparCG-State-Scanner via Apollo GraphQL subscriptions.

Run CasparCG-State-Scanner in your CCG-server folder. (https://github.com/olzzon/casparcg-state-scanner/releases)

Set the Ip address defined in top of App.js:
 
```
const CCG_SERVER_IP = "192.7.9.13"
```
Connects to CasparCG-State-Scanner via port: 5254 

Usind Apollo and GraphQL subscriptions gives you realtime updates from your server.
Try to run it on a server antoher client is using. And see the instant response :)


## It´s Build on Create-React-App

To keep the example as simple and easy to redo if you wan´t to try out yourself it´s a basic "create-react-app" and all changes has been put into App.js

Just do a Yarn and a Yarn start to run the app.
(Install Yarn and Nodejs if you don´t have it on your machine)