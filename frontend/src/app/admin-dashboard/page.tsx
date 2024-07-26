"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, User } from "../interfaces/interfaces";

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imgUrl: '',
    category: '',
    store: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imgUrl: '',
    category: '',
    store: '',
  });


  /*
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://dionisio-wine-company-backend.onrender.com/users');
        setUser(response.data[0]); // Suponiendo que solo hay un usuario
        console.log(response)
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);
*/

  const validate = (name: string, value: string | number): string => {
    switch (name) {
      case 'description':
        return typeof value === 'string' && value.length > 250 ? 'Descripción no puede exceder 250 caracteres' : '';
      case 'type':
      case 'store':
        return typeof value === 'string' && value.length > 25 ? `${name} no puede exceder 25 caracteres` : '';
      case 'price':
      case 'stock':
        return typeof value === 'number' && value <= 0 ? 'Debe ser un número positivo mayor que 0' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
      setErrors({ ...errors, imgUrl: 'Solo se permiten archivos .jpg o .jpeg' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setNewProduct({ ...newProduct, imgUrl: response.data.secure_url });
      console.log(response.data.secure_url); // Verifica la URL de la imagen
      setErrors({ ...errors, imgUrl: '' });

    } catch (error) {
      setErrors({ ...errors, imgUrl: 'Error subiendo la imagen' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) return;
  
    try {
      const response = await axios.post('/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imgUrl: '',
        category: '',
        store: '',
      });
      console.log(response);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      {user && (
        <section className="text-center my-4">
          <h2 className="text-xl">Bienvenido, {user.name}</h2>
        </section>
      )}
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
              maxLength={250}
              required
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
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
              min={1}
              required
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
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
              min={1}
              required
            />
            {errors.stock && <p className="text-red-500">{errors.stock}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="imgUrl" className="block text-left">URL de la imagen</label>
            <input
              type="file"
              id="imgUrl"
              name="imgUrl"
              onChange={handleImageUpload}
              accept=".jpg,.jpeg"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.imgUrl && <p className="text-red-500">{errors.imgUrl}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="type" className="block text-left">Categoría</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newProduct.category}
              onChange={handleChange}
              placeholder="Varietal"
              className="w-full p-2 border border-gray-300 rounded"
              maxLength={25}
              required
            />
            {errors.category && <p className="text-red-500">{errors.category}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="store" className="block text-left">Bodega</label>
            <input
              type="text"
              id="store"
              name="store"
              value={newProduct.store}
              onChange={handleChange}
              placeholder="Bodega"
              className="w-full p-2 border border-gray-300 rounded"
              maxLength={25}
              required
            />
            {errors.store && <p className="text-red-500">{errors.store}</p>}
          </div>
          <button type="submit" className="rounded-lg bg-red-950 hover:bg-red-900 text-white px-4 py-2 mt-8">
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
              {products.map((product, index) => (
                <li key={product.id ?? index} className="border p-4 my-2 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold text-gray-700 underline underline-offset-8 mb-4 mt-8">{product.name}</h3>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-gray-700">Precio: ${product.price}</p>
                  <p className="text-gray-700">Stock: {product.stock}</p>
                  <img src={product.imgUrl} alt={product.name} className="w-full h-48 object-cover mt-4" />
                  <p className="text-gray-700">Varietal: {product.category}</p>
                  <p className="text-gray-700">Bodega: {product.store}</p>
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
