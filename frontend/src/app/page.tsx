"use client";

import { useEffect, useState } from 'react';
import Carrusel from "@/components/Carrusel";
import ProductList from "@/components/ProductList";
import { IProduct } from "@/interface";


async function getProducts(): Promise<IProduct[]> {
  const res = await fetch("/api-vinos/products");
  const data = await res.json();
  return data.data;
}

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const products = await getProducts();
        if (isMounted) {
          setProducts(products);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      setProducts([]); 
      setLoading(true); 
    };
  }, []);
  if (loading) {
    return <div >Loading...</div>;
  }

  return (
    <div>
      <div>
        <Carrusel />
      </div>
      <div className="text-center pt-28">
        <h5 className="text-2xl font-bold mb-4 text-center text-red-900">
          Nuestros Vinos Más Vendidos
        </h5>
        <div className="text-center pt-7">
          <ProductList products={products} />
        </div>
      </div>
      <div className="text-center pt-28">
        
      </div>
    </div>
  );
}

export default Home;

