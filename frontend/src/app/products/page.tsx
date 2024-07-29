"use client"

import { useState, useEffect } from 'react';
import ProductsList from '@/components/ProductList';
import Sidebar from '@/components/Sidebar';
import { IProduct } from '@/interface';

async function getProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    return products.data;
}

const Products = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filters, setFilters] = useState({ type: '', store: '', name: '', priceMin: '', priceMax: '' });
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const products = await getProducts();
            setProducts(products);
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter(product => 
                (filters.type ? product.type.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
                (filters.store ? product.store.toLowerCase().includes(filters.store.toLowerCase()) : true) &&
                (filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                (filters.priceMin ? product.price >= parseFloat(filters.priceMin) : true) &&
                (filters.priceMax ? product.price <= parseFloat(filters.priceMax) : true)
            )
        );
    }, [filters, products]);

    return (
        <div className="flex">
            <Sidebar filters={filters} setFilters={setFilters} />
            <div className="flex-1 p-4">
                <ProductsList products={filteredProducts} />
            </div>
        </div>
    );
};

export default Products;
