"use client";

import { IProduct } from "@/components/helpers/interfaces";
import { useEffect, useState } from "react";
import { getProductById } from "@/components/helpers/product.peticion";
import Image from "next/image";
import Plantilla from "@/components/Plantilla";
import Link from "next/link";

// function Detail({ params }: { params: { productId: string } }) {
//     const [product, setProduct] = useState<IProduct | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         let isMounted = true;

//         console.log('params:', params);

//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 console.log('Fetching product with ID:', params.productId);
//                 const fetchedProduct = await getProductById(params.productId);
//                 console.log('Fetched product:', fetchedProduct);
//                 if (isMounted) {
//                     setProduct(fetchedProduct);
//                 }
//             } catch (error: any) {
//                 if (isMounted) {
//                     setError("Error fetching product: " + (error.message || "Unknown error"));
//                     console.error("Error fetching product:", error);
//                 }
//             } finally {
//                 if (isMounted) {
//                     setLoading(false);
//                 }
//             }
//         };

//         fetchData();

//         return () => {
//             isMounted = false;
//         };
//     }, [params.productId]);

//     if (loading) return <p>La página se está cargando...</p>;
//     if (error) return <p>{error}</p>;

//     if (!product) return <p>No se encontró el producto.</p>;

//     return (
//         <div className="w-full h-auto flex flex-col items-center justify-center p-4 bg-white">
//             <div className="w-full max-w-5xl p-8 rounded-lg shadow-lg">
//                 <div className="flex flex-row items-start space-x-8">
//                     <div className="flex flex-col items-start w-1/2">
//                         {product.imgUrl && (
//                             <Image 
//                                 src={product.imgUrl} 
//                                 alt={product.name} 
//                                 width={300} 
//                                 height={300}
//                                 className="rounded-lg" 
//                                 unoptimized 
//                             />
//                         )}
//                         <ul className="list-none list-inside mt-20">
//                             <li className="text-black mb-4 text-left flex items-center">
//                                 <Image src="/uva.png" alt="icon" width={30} height={30} className="w-4 h-4 mr-2"/>
//                                 {product.category.name}
//                             </li>
//                             <li className="text-black mb-4 text-left flex items-center">
//                                 <Image src="/bodega.png" alt="icon" width={30} height={30} className="w-4 h-4 mr-2"/>
//                                 {product.store}
//                             </li>
//                         </ul>
//                     </div>
//                     <div className="flex flex-col items-start w-1/2">
//                         <h2 className="text-2xl font-bold mb-4 text-center text-red-900">{product.name}</h2>
//                         <p className="text-gray-700 mb-4 text-left mt-8">{product.description}</p>
//                         <p className="text-gray-700 font-bold underline underline-offset-8 mb-4 mt-8">$ {product.price}</p>
//                         <p className="text-red-900 mb-4 text-center mt-4">{product.stock} disponibles</p>
//                         <Link href="/cart">
//                             <button className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg">
//                                 Agregar al Carrito
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//                 <Plantilla />
//             </div>
//         </div>
//     );
// }

// export default Detail;

function Detail({ params }: { params: { productId: string } }) {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProduct = await getProductById(params.productId);
                setProduct(fetchedProduct);
            } catch (error: any) {
                setError("Error fetching product: " + (error.message || "Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.productId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            {/* Render more product details here */}
        </div>
    );
}

export default Detail;