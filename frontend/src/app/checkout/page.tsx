"use client";
import { error } from 'console';
import React, { useEffect, useState } from 'react';

interface CartItem {
  productId: string;
  price: number; // Asegúrate de que price es de tipo número
  quantity: number;
}

export default function CheckoutPage() {
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);

      if (query.get('success')) {
        setOrderStatus('success');
        console.log('Order placed! You will receive an email confirmation.');
      } else if (query.get('canceled')) {
        setOrderStatus('canceled');
        console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
      }
    }
  }, []);

  useEffect(() => {
    if (orderStatus === 'success') {
      const cartItems: CartItem[] = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

      if (cartItems.length > 0) {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No se encontró el token en localStorage.");
          return;
        }

        const userId = getUserIdFromToken(token);

        // Calcular el precio total
        const totalPrice = cartItems.reduce((total, item) => 
          total + item.price * (item.quantity || 1), 
        0);
        
        const createOrder = async () => {
          try {
            const orderData = {
              cartItems: cartItems.map(item => ({
                productId: item.productId,
                price: item.price, // El precio ya es un número, no se necesita parseFloat
                quantity: item.quantity || 1,
              })),
              userId,
              price: totalPrice,
            };

            // Log de los datos enviados
            console.log('Datos enviados en el POST:', orderData);

            const response = await fetch(`/api-vinos/orders/create/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic: ${token}`,
              },

              body: JSON.stringify(orderData),
            });

            console.log('Respuesta del servidor:', await response.json());

            if (!response.ok) {
              throw new Error('Error al crear la orden');
            }

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
  }, [orderStatus]);

  const getUserIdFromToken = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT para obtener el payload
      return payload.id; // Esto asume que el userId está en el campo "id" del token
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6">
      <h1 className="text-2xl font-semibold text-gray-700">¡Gracias por tu compra!</h1>
      <p className="text-lg text-gray-500">
        {orderStatus === 'success'
          ? 'Tu pedido ha sido realizado con éxito. Recibirás una confirmación por correo electrónico.'
          : orderStatus === 'canceled'
          ? 'El pedido ha sido cancelado. Puedes seguir comprando y volver a intentar el checkout cuando estés listo.'
          : 'Cargando...'}
      </p>
    </div>
  );
}