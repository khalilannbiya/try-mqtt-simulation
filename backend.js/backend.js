const mqtt = require('mqtt');
const WebSocket = require('ws');

// Membuat WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Menghubungkan ke broker MQTT
const mqttClient = mqtt.connect('mqtt://broker.emqx.io:1883');

// MQTT connection handler
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');

    mqttClient.subscribe('iot/sensors/temperature', (err) => {
        if (!err) {
            console.log('Subscribed to iot/sensors/temperature');
        } else {
            console.error('Subscribe error:', err);
        }
    });
});

// MQTT message handler
mqttClient.on('message', (topic, message) => {
    const data = message.toString();
    console.log('Received from MQTT:', data);

    // Broadcast ke semua client WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });
});