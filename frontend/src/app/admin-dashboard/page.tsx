"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, User, Category } from "../interfaces/interfaces";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useRouter } from 'next/navigation';

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
    category: '',
    store: '',
  });
  const [newCategory, setNewCategory] = useState<string>('');
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imgUrl: '',
    category: '',
    store: '',
  });

  const router = useRouter();

  
  useEffect(() => {
    // Verificar si el usuario es admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      router.push('/api/auth/login'); // Redirige a la página de inicio de sesión
      return;
    }

    // Cargar datos de categorías y usuario
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api-vinos/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api-vinos/users');
        const fetchedUser = response.data.data[0] || null;
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchCategories();
    fetchUser();
  }, [router]);

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
      const response = await axios.post('/api-vinos/products', newProduct);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imgUrl: '',
        category: '',
        store: '',
      });
      Swal.fire({
        icon: 'success',
        title: 'Producto creado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      setProducts(prevProducts => [...prevProducts, newProduct]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error creando el producto:', error.response?.data || error.message);
      } else {
        console.error('Error creando el producto:', error);
      }
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api-vinos/categories', { name: newCategory });
      setCategories(prevCategories => [...prevCategories, response.data]);
      setNewCategory('');
      Swal.fire({
        icon: 'success',
        title: 'Categoría creada correctamente',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error creando la categoría:', error);
    }
  };

  const handleCategoryDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.delete(`/api-vinos/categories/${categoryToDelete}`);
      setCategories(prevCategories => prevCategories.filter(category => category.categoryId !== categoryToDelete));
      setCategoryToDelete('');
      Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada correctamente',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error eliminando la categoría:', error);
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
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <section className="my-4 w-full lg:w-1/2">
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
                required
              />
              {errors.stock && <p className="text-red-500">{errors.stock}</p>}
            </div>
            <div className="mb-2">
              <label htmlFor="category" className="block text-left">Categoría</label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
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
            <div className="mb-2">
              <label htmlFor="imgUrl" className="block text-left">Imagen</label>
              <input
                type="file"
                id="imgUrl"
                name="imgUrl"
                accept=".jpg, .jpeg"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              {errors.imgUrl && <p className="text-red-500">{errors.imgUrl}</p>}
            </div>
            {newProduct.imgUrl && (
              <div className="mb-2">
                <img src={newProduct.imgUrl} alt="Vista previa de la imagen" className="w-full h-auto" />
              </div>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={Object.values(errors).some(error => error !== '')}
            >
              Crear Producto
            </button>
          </form>
        </section>
        <section className="my-4 w-full lg:w-1/2">
          <h2 className="text-xl text-center">Crear Categoría</h2>
          <form onSubmit={handleCategorySubmit} className="max-w-md mx-auto">
            <div className="mb-2">
              <label htmlFor="newCategory" className="block text-left">Nombre de la categoría</label>
              <input
                type="text"
                id="newCategory"
                name="newCategory"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Crear Categoría
            </button>
          </form>
        </section>
        <section className="my-4 w-full lg:w-1/2">
          <h2 className="text-xl text-center">Eliminar Categoría</h2>
          <form onSubmit={handleCategoryDelete} className="max-w-md mx-auto">
            <div className="mb-2">
              <label htmlFor="categoryToDelete" className="block text-left">Categoría a eliminar</label>
              <select
                id="categoryToDelete"
                name="categoryToDelete"
                value={categoryToDelete}
                onChange={e => setCategoryToDelete(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600">
              Eliminar Categoría
            </button>
          </form>
        </section>
      </div>
      <section className="my-4">
        <h2 className="text-xl text-center">Productos Creados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded">
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <p>Categoría: {categories.find(category => category.categoryId === product.category)?.name || 'N/A'}</p>
              <p>Bodega: {product.store}</p>
              {product.imgUrl && <img src={product.imgUrl} alt={product.name} className="w-full h-auto mt-2" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
