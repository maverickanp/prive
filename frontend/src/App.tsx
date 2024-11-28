// src/App.tsx
import { useState, useEffect } from 'react'

interface Driver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  rating: number;
}

function App() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drivers');
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError('Erro ao carregar motoristas');
        console.error(err);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste Inicial - App de Transporte</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      <div>
        <h2 className="text-xl mb-2">Motoristas Disponíveis:</h2>
        {drivers.map(driver => (
          <div key={driver.id} className="border p-4 mb-2 rounded">
            <h3 className="font-bold">{driver.name}</h3>
            <p>{driver.description}</p>
            <p>Veículo: {driver.vehicle}</p>
            <p>Avaliação: {driver.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App