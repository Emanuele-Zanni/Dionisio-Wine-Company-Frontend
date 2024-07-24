"use client"
import React, { useState } from 'react';
import { Product, User } from "../interfaces/interfaces";

const AdminDashboard: React.FC = () => {
  
  const user: User = {
    id: "4b4d327c-9f14-4423-9513-ec2142dc4e46",
    name: "Brittni",
    email: "bmcculloch0@macromedia.com",
    password: "rL9_)Lxy`@",
    phone: "766-355-8233",
    country: "China",
    address: "45 Everett Junction",
    city: "Hebu",
    date: "1/24/2024",
    isAdmin: true,
    orders: "\""
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imgUrl: '',
    type: '',
    store: '',
    offer: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    setProducts([...products, { ...newProduct, id }]);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imgUrl: '',
      type: '',
      store: '',
      offer: 0,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      <section className="text-center my-4">
        <h2 className="text-xl">Bienvenido, {user.name}</h2>
      </section>
      <section className="my-4">
        <h2 className="text-xl text-center">Crear Producto</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-2">
            <label htmlFor="name" className="block text-left">Nombre del producto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block text-left">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="price" className="block text-left">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              placeholder="Precio"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="stock" className="block text-left">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="imgUrl" className="block text-left">URL de la imagen</label>
            <input
              type="text"
              id="imgUrl"
              name="imgUrl"
              value={newProduct.imgUrl}
              onChange={handleChange}
              placeholder="URL de la imagen"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="type" className="block text-left">Varietal</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newProduct.type}
              onChange={handleChange}
              placeholder="Tipo"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="store" className="block text-left">Bodega</label>
            <input
              type="text"
              id="store"
              name="store"
              value={newProduct.store}
              onChange={handleChange}
              placeholder="Tienda"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="offer" className="block text-left">Descuento/Oferta</label>
            <input
              type="number"
              id="offer"
              name="offer"
              value={newProduct.offer}
              onChange={handleChange}
              placeholder="Oferta"
              className="w-full p-2 border border-gray-300 rounded"
              required 
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Crear Producto
          </button>
        </form>
      </section>
      <section className="my-4">
        <h2 className="text-xl text-center">Searchbar Productos</h2>
        {/* Placeholder for future implementation */}
      </section>
      <section className="my-4">
        <h2 className="text-xl text-center">Searchbar Usuarios</h2>
        {/* Placeholder for future implementation */}
      </section>
      <section className="my-4">
        <h2 className="text-xl text-center">Productos Creados</h2>
        <div className="max-w-md mx-auto">
          {products.length === 0 ? (
            <p className="text-center">No hay productos creados aún.</p>
          ) : (
            <ul>
              {products.map(product => (
                <li key={product.id} className="border p-2 my-2 rounded">
                  <h3 className="font-bold">{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Precio: ${product.price}</p>
                  <p>Stock: {product.stock}</p>
                  <p>Varietal: {product.type}</p>
                  <p>Bodega: {product.store}</p>
                  <p>Descuento/Oferta: {product.offer}%</p>
                  <img src={product.imgUrl} alt={product.name} className="w-full"/>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
