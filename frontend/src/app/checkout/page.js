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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      const cartItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

      if (cartItems.length > 0) {
        const token = localStorage.getItem("token"); // Asegúrate de que el token JWT esté almacenado

        if (!token) {
          console.error("No se encontró el token en localStorage.");
          return;
        }

        const userId = getUserIdFromToken(token); // Función para obtener el userId del token

        // Crear la orden en el backend
        const createOrder = async () => {
          try {
            const response = await fetch(`/api-vinos/orders/create/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic: ${token}`,
              },
              body: JSON.stringify(cartItems.map(item => ({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity || 1,
              }))),
            });

            if (!response.ok) {
              throw new Error('Error al crear la orden');
            }

            // Limpiar el carrito y la información del checkout en localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("checkoutItems");

            console.log('¡Orden creada exitosamente!');
          } catch (error) {
            console.error('Error creando la orden:', error);
          }
        };

        createOrder();
      }
    }
  }, []);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT para obtener el payload
      return payload.id; // Esto asume que el userId está en el campo "sub" del token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  

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
