"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/interface";
import { useRouter } from "next/navigation";
import { createrOrder } from "@/components/helpers/orders";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import Swal from "sweetalert2";

import 'sweetalert2/src/sweetalert2.scss';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(`pk_test_51PkM2hRqIY0nHTTTS9PELbyk4rpLu8s5fI8WDcQPRnAmWmrxa4TF7jbhmf562MkJqX92JQFEi24ZMDVg9oZEtakc00Cll8YVsl`);

// ${process.env.STRIPE_PUBLIC_KEY} // Reemplaza con tu clave pública de Stripe 

const total = 100

const CheckoutForm = ({ cart, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: user?.name || 'Unknown',
      },
    });

    if (error) {
      console.log('[error]', error);
      return;
    }

    // Obtener el client secret del backend
    const response = await fetch('/api-vinos/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer pk_test_51PkM2hRqIY0nHTTTS9PELbyk4rpLu8s5fI8WDcQPRnAmWmrxa4TF7jbhmf562MkJqX92JQFEi24ZMDVg9oZEtakc00Cll8YVsl'
      },
      body: JSON.stringify({ amount: total }), 
    });

    console.log(response)
    const { clientSecret } = await response.json();
    //const  clientSecret1  = await clientSecret.clientSecret
    console.log(clientSecret)

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      console.log('[confirmError]', confirmError);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      try {
        const userId = user.sub;

        const orderItems = cart.map((product) => ({
          productId: product.productId,
          quantity: product.quantity || 1,
        }));

        await createrOrder(orderItems, userId);
        setCart([]);
        setTotal(0);
        updateLocalStorage([]);
        await Swal.fire({
          icon: 'success',
          title: 'Compra realizada con éxito',
          text: 'Tu pedido ha sido procesado correctamente.',
          confirmButtonText: 'Aceptar',
        });
        router.push("/home");
      } catch (error) {
        console.error("Error creando la orden:", error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al procesar tu pedido. Intenta nuevamente más tarde.',
          confirmButtonText: 'Ok',
        });
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div id="card-element">
        <CardElement />
      </div>
      <button id="submit" className="bg-red-800 hover:bg-red-500 text-white p-3 rounded-md mt-7">
        Pagar ${total.toFixed(2)}
      </button>
      <div id="error-message"></div>
    </form>
  );
};

const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (storedCart) {
        setCart(storedCart);
        const totalCart = storedCart.reduce((acc: number, item: IProduct) => acc + item.price * (item.quantity || 1), 0);
        setTotal(totalCart);
      }
    }
  }, []);

  const updateLocalStorage = (updatedCart: IProduct[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter((product) => product.productId !== productId);
    setCart(updatedCart);
    const updatedTotal = updatedCart.reduce((acc, curr) => acc + curr.price * (curr.quantity || 1), 0);
    setTotal(updatedTotal);
    updateLocalStorage(updatedCart);
  };

  const handleQuantityChange = async (productId: string, delta: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.productId === productId) {
          const newQuantity = (item.quantity || 1) + delta;

          if (newQuantity > item.stock) {
            Swal.fire({
              icon: 'warning',
              title: 'Stock insuficiente',
              text: 'No hay más unidades disponibles.',
              confirmButtonText: 'Aceptar',
            });
            return item; 
          }

          return {
            ...item,
            quantity: Math.max(newQuantity, 1)
          };
        }
        return item;
      });

      const totalCart = updatedCart.reduce((acc, curr) => acc + curr.price * (curr.quantity || 1), 0);
      setTotal(totalCart);
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    return router.push("/api/auth/login");
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex flex-col items-center justify-center py-6">
        <h1 className="text-2xl mt-7 font-semibold text-gray-700">Tu Carrito</h1>
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col gap-6">
            {cart.length > 0 ? (
              cart.map((product) => (
                <div key={product.productId} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm space-x-4">
                  <Image src={product.imgUrl} alt={product.name} width={150} height={150} className="rounded-lg" />
                  <div className="flex-1">
                    <p className="text-lg font-medium dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600">Precio: ${product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(product.productId, -1)}
                      className="bg-gray-300 hover:bg-gray-400 text-black p-1 rounded-md text-sm"
                      disabled={(product.quantity || 1) <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm">{product.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(product.productId, 1)}
                      className="bg-gray-300 hover:bg-gray-400 text-black p-1 rounded-md text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(product.productId)}
                    className="flex items-center"
                  >
                    <Image
                      src="/eliminar.png"
                      alt="Eliminar"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay productos en tu carrito</p>
            )}
          </div>
          <div className="mt-6 w-full flex flex-col md:flex-row items-center justify-between">
            <p className="text-xl mt-7 font-semibold text-gray-700">Total: ${total.toFixed(2)}</p>
          </div>
          {cart.length > 0 && (
            <CheckoutForm cart={cart} total={total} />
          )}
        </div>
      </div>
    </Elements>
  );
};

export default Cart;
