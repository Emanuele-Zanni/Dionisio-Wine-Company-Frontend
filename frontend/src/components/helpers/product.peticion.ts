
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

        const data = await res.json();

        // Verifica la estructura de la respuesta
        console.log('API Response Data:', data);

        // Asegúrate de que data tenga la estructura correcta
        if (!data || !Array.isArray(data.products)) {
            throw new Error('Unexpected response structure or empty response');
        }

        const products: IProduct[] = data.products; // Cambia 'results' por la clave correcta
        console.log('Products:', products);
        return products;
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        throw new Error(error.message);
    }
}

export async function getProductById(id: string): Promise<IProduct> {
    try {
        const res = await fetch(`/api-vinos/products/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

