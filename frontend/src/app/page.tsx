"use client"

import { useEffect, useState } from 'react';
import Carrusel from "@/components/Carrusel";
import ProductList from "@/components/ProductList";
import { IProduct } from "@/interface";
import Map from '@/components/Map';

async function getProducts(): Promise<IProduct[]> {
  const res = await fetch("/api/products");
  const data = await res.json();
  return data.data;
}

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const products = await getProducts();
      setProducts(products);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Carrusel />
      </div>
      <div className="text-center pt-28">
      <h5 className="text-2xl font-bold mb-4 text-center text-red-900">Nuestros Vinos Más Vendidos</h5>
        <div className="text-center pt-7">
          <ProductList products={products} />
          
        </div>
      </div>
    </div>
  );
}

export default Home;

