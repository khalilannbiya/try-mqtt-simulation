import { useState, useEffect } from 'react';

function App() {
    const [temperatureData, setTemperatureData] = useState(null);

    useEffect(() => {
        // Membuat koneksi WebSocket ke backend
        const ws = new WebSocket('ws://localhost:8080');

        // Ketika menerima pesan dari WebSocket
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTemperatureData(data);
        };

        // Bersihkan koneksi WebSocket ketika component di-unmount
        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="App">
            <h1>Real-time IoT Temperature Data</h1>
            {temperatureData ? (
                <div>
                    <p>Temperature: {temperatureData.temperature}°C</p>
                    <p>Timestamp: {new Date(temperatureData.timestamp).toLocaleString()}</p>
                </div>
            ) : (
                <p>Waiting for data...</p>
            )}
        </div>
    );
}

export default App;
