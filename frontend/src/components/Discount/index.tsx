import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiscountCodeGenerator = () => {
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateCode = async () => {
    try {
      // Como discountAmount ya es de tipo number, no necesitas parsearlo
      const percentage = discountAmount;
      
      // Asegúrate de tener el token de autenticación
      const token = localStorage.getItem('token'); // O el método que estés usando para obtener el token
      
      const response = await axios.post('/api-vinos/offers/generate', 
        { percentage },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Asegúrate de usar el encabezado correcto
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
        setError('');
        Swal.fire('¡Código generado!', `El código de descuento es: ${response.data.code}`, 'success');
      } else {
        setError('Error inesperado al generar el código de descuento');
      }
    } catch (error) {
      console.error('Error durante la generación del código:', error);
      setError('Error generando el código de descuento');
      Swal.fire('Error', 'Hubo un problema al generar el código de descuento', 'error');
    }
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Generar Código de Descuento</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="discountAmount" className="block font-semibold">Monto del Descuento (%)</label>
          <input
            type="number"
            id="discountAmount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value))} // Convertir a número
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
            max="100"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerateCode}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Generar Código
        </button>
        {generatedCode && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
            Código Generado: <strong>{generatedCode}</strong>
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountCodeGenerator;
