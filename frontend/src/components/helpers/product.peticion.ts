
 import { IProduct } from "./interfaces"
 


 const apiUrl = 'https://dionisio-wine-company-backend.onrender.com';


 export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch(`${apiUrl}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', 
                'Cache-Control': 'no-cache'

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

