
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
        const fetchData = () => {
            setLoading(true);
            setError(null);
            try {
                const product = getProductById(params.id);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{product?.name}</h1>
            {product && (
                <Image 
                    src={product.imgUrl} 
                    alt={product.name} 
                    width={300} 
                    height={300} 
                    unoptimized // Permite cargar imágenes desde URLs externas
                />
            )}
            <p>{product?.description}</p>
            <p>${product?.price}</p>
            <p>Stock:{product?.stock}</p>
            <p>Tipo: {product?.type}</p>
            <p>Bodega: {product?.store}</p>
            <p>Oferta: {product?.offer}%</p>
            <button>Agregar al carrito</button>  
        </div>
    );
}

export default Detail;



// "use client"

// import { IProduct } from "@/components/helpers/interfaces";
// import { useEffect, useState } from "react";
// import { getProductById } from "@/components/helpers/product.peticion";
// import Image from "next/image"

// function Detail({ params }: { params: { id: string } }) {
//     const [product, setProduct] = useState<IProduct | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const product = await getProductById(params.id);
//                 setProduct(product);
//             } catch (error) {
//                 console.error("Error fetching product:", error);
//             }
//         };
//         fetchData();
//     }, []);

//     return (
//         <div>
//              <h1>{product?.id}</h1>
//             <h1>{product?.name}</h1>
//             {product && (
//                 <Image src={product.imgUrl} alt={product.name} width={300} height={300} />
//             )}
//             <p>{product?.description}</p>
//             <p>$ {product?.price}</p>
//             <p>{product?.stock}</p>
//             <button>Agregar al carrito</button>  
//         </div>
//     );
// }

// export default Detail;