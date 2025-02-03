const mqtt = require('mqtt');

// Connect to MQTT Broker
const client = mqtt.connect('mqtt://broker.emqx.io:1883');

const numberOfPanels = 3;

// Function to generate realistic voltage values
function generateVoltage(isPhaseOn) {
    if (!isPhaseOn) return 0; // Simulate phase failure
    return (Math.random() * (240 - 220) + 220).toFixed(2); // Random voltage between 220V - 240V
}

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    setInterval(() => {
        for (let i = 1; i <= numberOfPanels; i++) {
            // Simulate random phase failures (10% chance per phase)
            const isPhaseROn = Math.random() > 0.1;
            const isPhaseSOn = Math.random() > 0.1;
            const isPhaseTOn = Math.random() > 0.1;

            const panelData = {
                "Line 1 Phase R": generateVoltage(isPhaseROn),
                "Line 1 Phase S": generateVoltage(isPhaseSOn),
                "Line 1 Phase T": generateVoltage(isPhaseTOn),
                "Line 2 Phase R": generateVoltage(Math.random() > 0.1),
                "Line 2 Phase S": generateVoltage(Math.random() > 0.1),
                "Line 2 Phase T": generateVoltage(Math.random() > 0.1),
                "Line 3 Phase R": generateVoltage(Math.random() > 0.1),
                "Line 3 Phase S": generateVoltage(Math.random() > 0.1),
                "Line 3 Phase T": generateVoltage(Math.random() > 0.1),
                timestamp: new Date().toISOString()
            };

            const jsonData = JSON.stringify(panelData);
            const topic = `iot/location/panel${i}/electricity`;

            client.publish(topic, jsonData, (error) => {
                if (error) {
                    console.error(`Publish error to ${topic}:`, error);
                } else {
                    console.log(`Data sent to ${topic}:`, jsonData);
                }
            });
        }
    }, 5000); // Send data every 5 seconds
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});
