"use client";

import { useEffect, useState } from 'react';
import Carrusel from "@/components/Carrusel";
import ProductList from "@/components/ProductList";
import { IProduct } from "@/interface";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import cookie from 'js-cookie';
import { getProductsDB } from '@/components/helpers/product.peticion';

// async function getProducts(): Promise<IProduct[]> {
  async function getProducts() {
    try {
      const products = await getProductsDB();
      console.log(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
//   const res = await fetch("/api-vinos/products", {
//     headers: {
//       'Accept': 'application/json',
//       'Cache-Control': 'no-cache'
//     }
//   });
  
//   console.log(res);
  
//   const data = await res.json();
//   return data.data;
// }

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const postUser = async () => {
      try {
        const response = await axios.post('/api-vinos/auth/user', {
          authId: user?.sub,
          name: user?.name,
          email: user?.email,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const role = tokenPayload.role;

        console.log(response);
        console.log(tokenPayload);
        console.log(role);

        localStorage.setItem('role', role);
      } catch (error) {
        console.error('Error posting user:', error);
      }
    };

    if (user) {
      postUser();
    }
  }, [user]);

  useEffect(() => {
    const checkSession = () => {
      const appSession = cookie.get('appSession');
      if (!appSession) {
        // En lugar de limpiar todo el localStorage, puedes limpiar solo la sesión específica.
        localStorage.removeItem('sessionData');
      }
    };
  
    window.addEventListener('focus', checkSession);
  
    return () => {
      window.removeEventListener('focus', checkSession);
    };
  }, []);
  
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
    return <div>Loading...</div>;
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
