"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductsList from '@/components/ProductList';
import Sidebar from '@/components/Sidebar';
import { IProduct } from '@/interface';
import { getProductsDB } from '@/components/helpers/product.peticion';

async function getProducts() {
    try {
      const products = await getProductsDB();
      console.log(products);
      return products; // Asegúrate de devolver los productos aquí
    } catch (error) {
      console.error('Error fetching products:', error);
      return []; // Devuelve un array vacío en caso de error para evitar problemas en la UI
    }
  }


const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(...args), delay);
  };
};

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState({
    category: { name: "" },
    store: "",
    name: "",
    priceMin: 0,
    priceMax: 100000,
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [showFilteredProducts, setShowFilteredProducts] = useState(false);

  const initialFilters = useMemo(
    () => ({
      category: { name: "" },
      store: "",
      name: "",
      priceMin: 0,
      priceMax: 100000,
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

    const applyFilters = useCallback(() => {
        const filtered = products
            .filter(product => {
                // Convert product.price to a number for comparison
                const price = parseFloat(product.price);
                return (
                    (filters.category.name ? product.category.name.toLowerCase().includes(filters.category.name.toLowerCase()) : true) &&
                    (filters.store ? product.store.toLowerCase().includes(filters.store.toLowerCase()) : true) &&
                    (filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                    (price >= filters.priceMin) &&
                    (price <= filters.priceMax)
                );
            })
            .sort((a, b) =>
                sortOrder === 'asc' ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price)
            );

    setFilteredProducts(filtered);
    setShowFilteredProducts(true);
  }, [filters, sortOrder, products]);

  useEffect(() => {
    const debouncedApplyFilters = debounce(applyFilters, 300);

    debouncedApplyFilters();
  }, [applyFilters, filters, sortOrder]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortOrder("asc");
    setFilteredProducts(products);
    setShowFilteredProducts(false);
  }, [initialFilters, products]);

  return (
    <div className="flex">
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
      <div className="flex-1 p-4">
        {showFilteredProducts && filteredProducts.length === 0 ? (
          <p className="text-center text-red-600">Ningún producto encontrado</p>
        ) : (
          <ProductsList
            products={showFilteredProducts ? filteredProducts : products}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
