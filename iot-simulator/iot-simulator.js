const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.emqx.io:1883');

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    setInterval(() => {
        const temperature = (Math.random() * 10 + 20).toFixed(2);
        const data = JSON.stringify({ temperature, timestamp: new Date() });

        client.publish('iot/sensors/temperature', data, (error) => {
            if (error) {
                console.error('Publish error:', error);
            } else {
                console.log('Data sent:', data);
            }
        });
    }, 5000);
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});