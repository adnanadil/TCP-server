const mqtt = require('mqtt')
const net = require('net')
//const {app} = require('./api')

const PORT = 3000

// MQTT Configuration 
const MQTT_BROKER = 'mqtt://3.84.240.88';
const MQTT_PORT = 1883;
const MQTT_TOPIC = 'v1/devices/me/telemetry';
const DEVICE_TOKEN = '25021310080';  // Replace with your actual device token
//const DEVICE_TOKEN = 'jrsdrsvorztyqyw82rqo';  // Replace with your actual device token

// TCP Server Configuration
const TCP_HOST = '0.0.0.0';
const TCP_PORT = 5000;

// Create MQTT client
const mqttClient = mqtt.connect(MQTT_BROKER, {
    port: MQTT_PORT,
    // For each device we will have to connect it our MQTT Broker
    username: DEVICE_TOKEN,
});

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error);
});


// Create TCP server
const TCPserver = net.createServer((socket) => {
    console.log('Device connected');

    socket.on('data', (data) => {
        console.log(`Data received: ${data}`);

        // Convert data to JSON payload
        const payload = JSON.stringify({ temperature: data.toString() });
        
        // Publish to ThingsBoard via MQTT
        mqttClient.publish(MQTT_TOPIC, payload, () => {
            console.log('Data sent to ThingsBoard');
        });
    });

    socket.on('error', (error) => {
        console.log(`Error: ${error}`);
    });

    // server.on('error', (err) => {
    //     if (err.code === 'ECONNRESET') {
    //       console.log('Connection was reset by the client.');
    //     } else {
    //       console.error('Server error:', err);
    //     }
    // });

    socket.on('end', () => {
        console.log('Device disconnected');
    });
});

// Start TCP server
TCPserver.listen(TCP_PORT, TCP_HOST, () => {
    console.log(`TCP server listening on ${TCP_HOST}:${TCP_PORT}`);
});
