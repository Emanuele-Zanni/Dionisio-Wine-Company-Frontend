"use client";

import {IProductProps } from "@/interface";
import { IProduct } from "../helpers/interfaces";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

function ProductsCard({ product }: IProductProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleAddToCart = (e: any) => {
    e.preventDefault();

    if (user) {
      const cart: IProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const productExists = cart.some((item: IProduct) => item.productId === product.productId);

      if (productExists) {
        Swal.fire({
          icon: 'warning',
          title: 'Producto ya en el carrito',
          text: 'Este producto ya está en el carrito.',
        });
      } else {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        Swal.fire({
          icon: 'success',
          title: 'Añadido al carrito',
          text: 'El producto se ha añadido al carrito.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Inicio de sesión requerido',
        text: 'Necesitas iniciar sesión para añadir productos al carrito.',
        confirmButtonText: 'Iniciar sesión',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/api/auth/login");
        }
      });
    }
  };

  const handleDetailsClick = () => {
    if (product.productId) {
      router.push(`/detail/${product.productId}`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Producto no disponible',
        text: 'No se pudo encontrar el ID del producto.',
      });
    }
  };

  return (
    <div className="border-2 border-[#800020] p-4 rounded-lg w-[250px] h-[400px] flex flex-col mx-auto bg-gradient-to-r from-[#4b0026] via-[#800020] to-[#a52a2a]">
      <div className="p-4 flex items-center justify-center flex-grow overflow-hidden">
        <div className="relative w-32 h-32">
          <Image
            className="rounded-xl object-cover"
            src={product.imgUrl}
            alt={product.name}
            fill
          />
        </div>
      </div>
      <div className="flex flex-col items-start flex-grow p-2 text-left overflow-hidden">
        <h5 className="text-xl font-bold mb-2 text-white">{product.name}</h5>
        <div className="mb-2 space-y-1">
          <span className="block text-lg text-gray-300 font-semibold">
            Tipo: <span className="font-normal">{product.category.name}</span>
          </span>
          <span className="block text-lg text-gray-300 font-semibold">
            Bodega: <span className="font-normal">{product.store}</span>
          </span>
          <span className="block text-lg text-gray-300 font-semibold">
            Precio: <span className="font-normal">{`$${product.price}`}</span>
          </span>
        </div>

        <div className="flex w-full justify-between mt-auto space-x-2">
          {user ? (
            <button
              className="px-4 py-2 bg-white text-[#800020] rounded-lg font-bold"
              onClick={handleAddToCart}
            >
              Comprar
            </button>
          ) : (
            <button className="px-4 py-2 bg-white text-[#800020] rounded-lg" onClick={() => router.push("/cart")}>
              Comprar
            </button>
          )}
          <button 
            className="flex-1 px-2 py-2 text-white underline"
            onClick={handleDetailsClick}
          >
            Detalles
          </button> 
        </div>
      </div>
    </div>
  );
}

export default ProductsCard;