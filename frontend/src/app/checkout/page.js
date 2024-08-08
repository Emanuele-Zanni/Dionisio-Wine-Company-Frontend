"use client";
import React, { useEffect } from 'react';

export default function CheckoutPage() {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6">
      <h1 className="text-2xl font-semibold text-gray-700">¡Gracias por tu compra!</h1>
      <p className="text-lg text-gray-500">
        {new URLSearchParams(window.location.search).get('success')
          ? 'Tu pedido ha sido realizado con éxito. Recibirás una confirmación por correo electrónico.'
          : 'El pedido ha sido cancelado. Puedes seguir comprando y volver a intentar el checkout cuando estés listo.'}
      </p>
    </div>
  );
}
