
 import { IProduct } from "./interfaces"
 


 const apiUrl = 'https://dionisio-wine-company-backend.onrender.com';


 export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch(`${apiUrl}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
            },
        });

        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || !data.results) {
            throw new Error('Unexpected response structure or empty response');
        }

        console.log('API Response:', data); 
        const products: IProduct[] = data.results;
        console.log('Products:', products); 
        return products;
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        throw new Error(error.message);
    }
}
// export async function getProductById(id: string): Promise<IProduct> {
//     try {
//         const res = await fetch(`${apiUrl}/products/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json', // Asegúrate de enviar el tipo de contenido correcto
//             },
//         });

//         if (!res.ok) {
//             throw new Error(`Network response was not ok: ${res.statusText}`);
//         }

//         const product = await res.json();
//         if (!product) {
//             throw new Error('Unexpected response structure or empty response');
//         }

//         return product;
//     } catch (error: any) {
//         console.error('Error fetching product:', error.message);
//         throw new Error(error.message);
//     }
// }


// src/components/helpers/product.peticion.ts REVISAR CUANDO ANDE


export const getProductById = async (id: string): Promise<IProduct> => {
    const response = await fetch(`/api-vinos/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
};

