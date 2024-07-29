// src/components/ProductsCard.tsx

import { IProductProps } from "@/interface";
import Image from "next/image";
import Link from "next/link";

function ProductsCard({ product }: IProductProps) {
  return (
    <div className="border-2 border-[#800020] p-4 rounded-lg w-[250px] h-[400px] flex flex-col mx-auto bg-gradient-to-r from-[#4b0026] via-[#800020] to-[#a52a2a]">
      <div className="p-4 flex items-center justify-center flex-grow">
        <div className="relative w-32 h-32">
          <Image
            className="rounded-xl object-cover"
            src={product.imgUrl}
            alt={product.name}
            layout="fill"
          />
        </div>
      </div>
      <div className="flex flex-col items-start flex-grow p-2 text-left">
        <h5 className="text-xl font-bold mb-2 text-white">{product.name}</h5>
        <div className="mb-2 space-y-1">
          <span className="block text-lg text-gray-300 font-semibold">
            Tipo: <span className="font-normal">{product.category.name}</span>
          </span>
          <span className="block text-lg text-gray-300 font-semibold">
            Bodega: <span className="font-normal">{product.store}</span>
          </span>
          <span className="block text-lg text-gray-300 font-semibold">
            <span className="font-normal">{`$${product.price}`}</span>
          </span>
        </div>
        <div className="flex w-full justify-end mt-auto">
          <Link href={`/detail/${product.id}`} passHref>
            <button className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg">Detalles</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductsCard;