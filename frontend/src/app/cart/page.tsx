"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/interface";
import { useRouter } from "next/navigation";
import { createrOrder } from "@/components/helpers/orders";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss';

const Cart = () => {
  const router = useRouter();
  const [cart, setCart] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);  // Nuevo estado para el descuento
  const [discountCode, setDiscountCode] = useState<string>("");  // Estado para el código de descuento
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (storedCart) {
        setCart(storedCart);

        // Asegúrate de que `price` es un número
        const totalCart = storedCart.reduce((acc: number, item: IProduct) =>
          acc + (parseFloat(item.price) || 0) * (item.quantity || 1)
        , 0);
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

  const handleClick = async () => {
    if (!user) {
      // await Swal.fire({
      //   icon: 'warning',
      //   title: 'Inicia sesión para continuar con tu compra',
      //   text: 'Serás redirigido a la página de inicio de sesión.',
      //   confirmButtonText: 'Iniciar sesión',
      // });
      router.push("/api/auth/login");
      return;
    }

    const userId = user.sub;

    if (!userId) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario. Intente nuevamente.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    const orderItems = cart.map((product) => ({
      productId: product.productId,
      quantity: product.quantity || 1,
    }));

    try {
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

  const handleApplyDiscount = async () => {
    try {
      const response = await fetch('/api-vinos/offers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: discountCode }),
      });
  
      // Obtener el porcentaje de descuento
      const discountPercentage = await response.json();
  
      if (response.ok) {
        const discountAmount = parseFloat(discountPercentage);
  
        if (isNaN(discountAmount) || discountAmount <= 0) {
          throw new Error("El porcentaje de descuento no es válido");
        }
  
        // Obtener el carrito desde el local storage
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  
        // Aplicar el descuento a cada producto en el carrito
        const updatedCart = cartItems.map((item) => {
          const discountedPrice = parseFloat(item.price) * (1 - discountAmount / 100);
          return {
            ...item,
            price: discountedPrice.toFixed(2),  // Actualiza el precio con el descuento aplicado
          };
        });
  
        // Actualizar el total con los precios con descuento
        const totalWithDiscount = updatedCart.reduce((acc, item) =>
          acc + parseFloat(item.price) * (item.quantity || 1), 0
        ).toFixed(2);
  
        // Guardar el carrito actualizado en el local storage y actualizar el estado
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        setTotal(parseFloat(totalWithDiscount));
        setDiscount(discountAmount);
  
        Swal.fire({
          icon: 'success',
          title: 'Código aplicado',
          text: `Descuento aplicado: ${discountAmount}%`,
          confirmButtonText: 'Aceptar',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: 'El código de descuento no es válido o ha expirado.',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      console.error("Error aplicando el descuento:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al aplicar el descuento. Intenta nuevamente más tarde.',
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!cartItems || cartItems.length === 0) {
        console.error("El carrito está vacío.");
        return;
      }

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems.map((item: IProduct) => ({
            productId: item.productId || '',  // Asegúrate de que el `productId` no sea undefined
            name: item.name,
            imgUrl: item.imgUrl,
            price: parseFloat(item.price),
            quantity: item.quantity || 1,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
        window.location.href = data.url;
      } else {
        console.error('Error creando la sesión de checkout:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    return (
      router.push("/api/auth/login")
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6">
      <h1 className="text-2xl mt-7 font-semibold text-gray-700 ">Tu Carrito</h1>
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
  className= "flex items-center"
>
  <Image
    src="/eliminar.png" // Reemplaza con la ruta a tu imagen
    alt="Eliminar"
    width={24} // Ajusta el tamaño según tus necesidades
    height={24} // Ajusta el tamaño según tus necesidades
    className="mr-2" // Espacio entre la imagen y el texto, si es necesario
  />

</button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay productos en tu carrito</p>
          )}
        </div>
        <div className="flex mt-4 space-x-4">
          <input 
            type="text" 
            value={discountCode} 
            onChange={(e) => setDiscountCode(e.target.value)} 
            placeholder="Código de descuento" 
            className="p-2 border border-gray-300 rounded-md"
          />
          <button 
            onClick={handleApplyDiscount} 
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Aplicar
          </button>
        </div>
        <div className="mt-6 w-full flex flex-col md:flex-row items-center justify-between">
          <p className="text-xl mt-7 font-semibold text-gray-700 ">Total: ${total.toFixed(2)}</p>
          <button
            onClick={handleClick}
            disabled={cart.length === 0}
            className={`w-full md:w-auto bg-red-800 hover:bg-red-500  text-white p-3 rounded-md mt-7  ${
              cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;