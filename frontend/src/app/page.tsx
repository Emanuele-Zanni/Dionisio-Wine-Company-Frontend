
import Carrusel from "@/components/Carrusel";
import ProductsList from "@/components/ProductList";
import { IProduct } from "@/interface";

async function getProducts(startIndex: number, endIndex: number): Promise<IProduct[]> {
  const res = await fetch('https://jsebastianvanegasl.github.io/json-api/products.json');
  const products = await res.json();
    const selectedProducts = products.slice(startIndex, endIndex);
    return selectedProducts;
}

async function Home() {
    const products = await getProducts(2, 10);

    return (
        <div >
            <div>
                <Carrusel />
            </div>
            <div className="text-center pt-28">
                <h5 className="text-xl font-semibold">VINOS MAS VENDIDOS</h5>
                <div className="text-center pt-7 ">
                <ProductsList products={products} />
                </div>
            </div>
        </div>
    );
}

export default Home;
