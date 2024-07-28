"use client"
import { IProduct } from "@/components/helpers/interfaces";
import { useEffect, useState } from "react";
import { getProductById } from "@/components/helpers/product.peticion";
import Image from "next/image";

function Detail({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const product = await getProductById(params.id); 
                if (product) {
                    setProduct(product);
                } else {
                    throw new Error("Product not found");
                }
            } catch (error: any) {
                setError("Error fetching product: " + error.message);
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) return <p>La pagina se esta cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="w-full h-screen flex items-center justify-center p-4 bg-white">
            <div className="w-full max-w-2xl p-8 rounded-lg shadow-lg flex flex-row items-start space-x-32">
                <div className="flex flex-col items-start">
                    {product?.offer && (
                        <div className="mb-4">
                            <p className="font-bold text-champagne animate-bounce">Oferta: {product?.offer}%</p>
                        </div>
                    )}
                    {product && (
                        <Image 
                            src={product.imgUrl} 
                            alt={product.name} 
                            width={300} 
                            height={300}
                            className="rounded-lg" 
                            unoptimized 
                        />
                    )}
                    <ul className="list-none list-inside mt-20">
                        <li className="text-black mb-4 text-left flex items-center">
                            <Image src="/uva.png" alt="icon" width={30} height={30} className="w-4 h-4 mr-2"/>
                            {product?.type}
                        </li>
                        <li className="text-black mb-4 text-left flex items-center">
                            <Image src="/bodega.png" alt="icon" width={30} height={30} className="w-4 h-4 mr-2"/>
                            {product?.store}
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold mb-4 text-center text-red-900">{product?.name}</h2>
                    <p className="text-gray-700 mb-4 text-left mt-8">{product?.description}</p>
                    <p className="text-gray-700 font-bold underline underline-offset-8  mb-4 mt-8">$ {product?.price}</p>
                    <p className="text-red-900 mb-4 text-center mt-4">{product?.stock} disponibles</p>
                    <button className="rounded-lg bg-red-950 hover:bg-red-900 text-white px-4 py-2 mt-8">Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
}

export default Detail;