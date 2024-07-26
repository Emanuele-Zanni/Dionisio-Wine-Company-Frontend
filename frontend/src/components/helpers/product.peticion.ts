const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 import { IProduct } from "./interfaces"
 import { arrayProducts } from "./data"

// export async function getProductsDB() {
//     try {
//         const res = await fetch(`${apiUrl}`, {
//             method: 'GET',
//             next: { revalidate: 3600 }
//         });
//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await res.json();
//         console.log('API Response:', data); 
//         const products: IProduct[] = data.results;
//         console.log('Products:', products); 
//         return products;
//     } catch (error: any) {
//         throw new Error(error.message);
//     }
// }

// export async function getProductById(id:string)  {
//     try {
//         const products = await getProductsDB()
//         const product = products.find((product) => product.id.toString() === id)
//         if(!product) throw new Error("Product not found")
//             return product;
//     } catch (error: any) {
//         throw new Error(error)
//     }
// }

export function getProductsDB(): IProduct[] {
    return arrayProducts;
  }
  
  export function getProductById(id: string): IProduct | undefined {
    return arrayProducts.find(product => product.id === id);
  }
