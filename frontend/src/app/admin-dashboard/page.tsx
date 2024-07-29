"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, User, Category } from "../interfaces/interfaces"; // Asegúrate de definir y exportar Category

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imgUrl: '',
    category: '', // ID de la categoría
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

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        console.log('Categorías:', response.data.data); // Verifica la respuesta
        setCategories(response.data.data); // Ajusta según la respuesta real del endpoint
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch user information
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/users');
        const fetchedUser = response.data.data[0] || null; // Obtén el primer usuario si existe
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const validate = (name: string, value: string | number): string => {
    switch (name) {
      case 'description':
        return typeof value === 'string' && value.length > 250 ? 'Descripción no puede exceder 250 caracteres' : '';
      case 'category':
        return typeof value === 'string' && value.length > 250 ? 'Categoría no puede exceder 250 caracteres' : '';
      case 'store':
        return typeof value === 'string' && value.length > 25 ? 'Bodega no puede exceder 25 caracteres' : '';
      case 'price':
        return isNaN(Number(value)) || Number(value) <= 0 ? 'Precio debe ser un número positivo' : '';
      case 'stock':
        return isNaN(Number(value)) || Number(value) <= 0 ? 'Stock debe ser un número positivo' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: name === 'price' ? parseFloat(value) : name === 'stock' ? Number(value) : value
    }));
    setErrors({ ...errors, [name]: validate(name, name === 'price' ? parseFloat(value) : name === 'stock' ? Number(value) : value) });
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
      setNewProduct(prevState => ({
        ...prevState,
        imgUrl: response.data.secure_url
      }));
      setErrors({ ...errors, imgUrl: '' });
    } catch (error) {
      setErrors({ ...errors, imgUrl: 'Error subiendo la imagen' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (Object.values(errors).some(error => error)) return;

  try {
    const response = await axios.post('/api/products', {
      ...newProduct,
      price: newProduct.price,
      stock: newProduct.stock,
    });
    console.log('Producto creado:', response.data);
    setProducts(prevProducts => [...prevProducts, response.data]); // Agrega el nuevo producto
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imgUrl: '',
      category: '',
      store: '',
    });
    console.log('Productos:', products);
    console.log('Productos:', newProduct);
    console.log('Categorías:', categories);
    setProducts(prevProducts => [...prevProducts, newProduct])
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creando el producto:', error.response?.data || error.message);
    } else {
      console.error('Error creando el producto:', error);
    }
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      <section className="text-center my-4">
        <h2 className="text-xl">
          Bienvenido, {user ? user.name : 'Nombre de Usuario Predeterminado'}
        </h2>
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
            {errors.name && <p className="text-red-500">{errors.name}</p>}
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
              step="0.01"
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
            <label htmlFor="imgUrl" className="block text-left">Imagen</label>
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
            {newProduct.imgUrl && <img src={newProduct.imgUrl} alt="Vista previa" className="mt-2 w-full h-48 object-cover" />}
          </div>
          <div className="mb-2">
            <label htmlFor="category" className="block text-left">Categoría</label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              required
            />
            {errors.store && <p className="text-red-500">{errors.store}</p>}
          </div>
          <button
            type="submit"
            className="rounded-lg bg-red-950 hover:bg-red-900 text-white px-4 py-2 mt-8"
          >
            Crear Producto
          </button>
        </form>
      </section>
      <section className="my-4">
  <h2 className="text-xl text-center">Productos</h2>
  {products.length === 0 ? (
    <p>No hay productos disponibles.</p>
  ) : (
    products.map((product) => (
      <div key={product.id} className="p-4 border border-gray-300 rounded-lg shadow-md flex flex-col lg:flex-row lg:items-center">
        {/* Datos del producto */}
        <div className="lg:w-1/2 lg:pr-4">
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="font-bold text-champagne mb-2">
            ${product.price} {/* Mostrar precio como número */}
          </p>
          <p className="font-bold text-champagne mb-2">Stock: {product.stock}</p>
          <p className="font-bold text-champagne">
            Categoría: {categories.find(cat => cat.categoryId === product.category)?.name || 'Desconocida'}
          </p>
        </div>
        {/* Imagen del producto */}
        {product.imgUrl && (
          <img src={product.imgUrl} alt={product.name} className="w-full h-48 object-cover mt-2 lg:mt-0 lg:w-1/2 lg:ml-4" />
        )}
      </div>
    ))
  )}
</section>


    </div>
  );
};

export default AdminDashboard;

