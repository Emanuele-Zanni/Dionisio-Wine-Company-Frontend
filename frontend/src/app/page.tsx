"use client";

import { useEffect, useState } from 'react';
import Carrusel from "@/components/Carrusel";
import ProductList from "@/components/ProductList";
import { IProduct } from "@/interface";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';



async function getProducts(): Promise<IProduct[]> {
  const res = await fetch("/api-vinos/products");
  const data = await res.json();
  return data.data;
}


const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log(user?.data);
  }, [])
  
  useEffect(() => {
    const postUser = async () => {
      try {
        const response = await axios.post('/api-vinos/auth/user', {
          id: user?.sub,
          name: user?.name,
          email: user?.email,
        });
        console.log(response)
      } catch (error) {
        console.error('Error posting user:', error);
      }
    };

    if (user) {
      postUser();
    }
  }, [user]);

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

