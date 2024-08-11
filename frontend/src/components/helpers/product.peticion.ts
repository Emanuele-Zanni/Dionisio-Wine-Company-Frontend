
 import { IProduct } from "./interfaces"
 


 const apiUrl = 'https://dionisio-wine-company-backend.onrender.com';

 export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch(`${apiUrl}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });

        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        // Lee el cuerpo de la respuesta como texto primero
        const text = await res.text();
        console.log('Response Text:', text);

        // Intenta analizar el texto como JSON
        try {
            const data = JSON.parse(text);
            console.log('Parsed API Response Data:', data);

            // Verifica si `data` tiene la propiedad `data` y es un array
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Unexpected response structure or empty response');
            }

            return data.data; // Devuelve el array de productos
        } catch (jsonError) {
            // Verifica si el error tiene una propiedad `message`
            if (jsonError instanceof Error) {
                console.error('Error parsing JSON:', jsonError.message);
            } else {
                console.error('Error parsing JSON:', jsonError);
            }
            console.error('Response Text:', text);
            throw new Error('Failed to parse JSON from response');
        }
    } catch (error: any) {
        // Manejamos el tipo unknown adecuadamente
        if (error instanceof Error) {
            console.error('Error fetching products:', error.message);
            throw new Error(error.message);
        } else {
            console.error('Unknown error fetching products:', error);
            throw new Error('Unknown error occurred');
        }
    }
}
export async function getProductById(productId: string): Promise<IProduct> {
    try {
        const res = await fetch(`https://dionisio-wine-company-backend.onrender.com/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache', // Opcional para evitar caché
            },
        });

        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const product: IProduct = await res.json();

        if (!product || !product.productId || !product.name) {
            throw new Error('Product data is invalid or incomplete');
        }

        return product;
    } catch (error: any) {
        console.error('Error fetching product:', error.message);
        throw new Error(error.message); 
    }
}