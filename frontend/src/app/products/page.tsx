"use client";

import { useState, useEffect } from 'react';
import ProductsList from '@/components/ProductList';
import Sidebar from '@/components/Sidebar';
import { IProduct } from '@/interface';

async function getProducts() {
    const res = await fetch('/api-vinos/products');
    const products = await res.json();
    return products.data;
}

const Products = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filters, setFilters] = useState({
        category: { name: '' },
        store: '',
        name: '',
        priceMin: 0,
        priceMax: 100000
    });
    const [sortOrder, setSortOrder] = useState('asc');
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [showFilteredProducts, setShowFilteredProducts] = useState(false);

    const initialFilters = {
        category: { name: '' },
        store: '',
        name: '',
        priceMin: 0,
        priceMax: 100000
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getProducts();
                setProducts(products);
                setFilteredProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {

        resetFilters();
    }, []); 

    const resetFilters = () => {
        setFilters(initialFilters);
        setSortOrder('asc'); 
        setFilteredProducts(products);
        setShowFilteredProducts(false); 
    };

    const applyFilters = () => {
        const filtered = products
            .filter(product => 
                (filters.category.name ? product.category.name.toLowerCase().includes(filters.category.name.toLowerCase()) : true) &&
                (filters.store ? product.store.toLowerCase().includes(filters.store.toLowerCase()) : true) &&
                (filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                (product.price >= filters.priceMin) &&
                (product.price <= filters.priceMax)
            )
            .sort((a, b) => 
                sortOrder === 'asc' ? a.price - b.price : b.price - a.price
            );

        setFilteredProducts(filtered);
        setShowFilteredProducts(true);
    };

    return (
        <div className="flex">
            <Sidebar
                filters={filters}
                setFilters={setFilters}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
                products={products}
            />
            <div className="flex-1 p-4">
                {showFilteredProducts && filteredProducts.length === 0 ? (
                    <p className="text-center text-red-600">Ningún producto encontrado</p>
                ) : (
                    <ProductsList products={filteredProducts} />
                )}
            </div>
        </div>
    );
};

export default Products;