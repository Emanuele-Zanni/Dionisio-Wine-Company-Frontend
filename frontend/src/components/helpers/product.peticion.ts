const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { IProduct } from "./interfaces";

export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const res = await fetch('/api/products', {
            method: 'GET',
            next: { revalidate: 3600 }
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        console.log('API Response:', data);
        const products: IProduct[] = data.data || []; 
        console.log('Products:', products);
        return products;
    } catch (error: any) {
        console.error('Failed to fetch products:', error.message);
        return []; 
    }
}

export async function getProductById(id: string): Promise<IProduct | undefined> {
    try {
        const products = await getProductsDB();
        const product = products.find((product) => product.id === id);
        if (!product) throw new Error("Product not found");
        return product;
    } catch (error: any) {
        throw new Error(error.message);
    }
}