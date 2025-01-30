const mqtt = require('mqtt');

// Koneksi ke broker MQTT
const client = mqtt.connect('mqtt://broker.emqx.io:1883');

// Jumlah panel yang ingin disimulasikan di satu titik lokasi
const numberOfPanels = 3;

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Fungsi untuk menghasilkan data dinamis RST pada kelistrikan untuk setiap panel
    setInterval(() => {
        for (let i = 1; i <= numberOfPanels; i++) {
            // Simulasi data untuk setiap panel
            const panelData = {
                "Line 1 Phase R": Math.floor(Math.random() * 101),
                "Line 1 Phase S": Math.floor(Math.random() * 101),
                "Line 1 Phase T": Math.floor(Math.random() * 101),
                "Line 2 Phase R": Math.floor(Math.random() * 101),
                "Line 2 Phase S": Math.floor(Math.random() * 101),
                "Line 2 Phase T": Math.floor(Math.random() * 101),
                "Line 3 Phase R": Math.floor(Math.random() * 101),
                "Line 3 Phase S": Math.floor(Math.random() * 101),
                "Line 3 Phase T": Math.floor(Math.random() * 101),
                timestamp: new Date()
            };

            const jsonData = JSON.stringify(panelData);

            // Membuat topik unik untuk setiap panel
            const topic = `iot/location/panel${i}/electricity`;

            // Publish data ke topik unik untuk setiap panel
            client.publish(topic, jsonData, (error) => {
                if (error) {
                    console.error(`Publish error to ${topic}:`, error);
                } else {
                    console.log(`Data sent to ${topic}:`, jsonData);
                }
            });
        }
    }, 5000); // Mengirim data setiap 5 detik
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});
