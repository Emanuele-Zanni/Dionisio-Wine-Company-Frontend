/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, User, Category } from "../interfaces/interfaces";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useRouter } from 'next/navigation';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

const AdminDashboard: React.FC = () => {
  const { user } = useUser();
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin' && role !== 'superadmin') {
      router.push('/api/auth/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api-vinos/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api-vinos/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validate = (name: string, value: string | number): string => {
    switch (name) {
      case 'description':
        return typeof value === 'string' && value.length > 250 ? 'Descripción no puede exceder 250 caracteres' : '';
      case 'category':
        return typeof value === 'string' && value.length < 20 ? 'Categoría no puede exceder 20 caracteres' : '';
      case 'price':
      case 'stock':
        return typeof value === 'number' && value <= 0 ? 'Debe ser un número positivo' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const validatedValue = name === 'price' || name === 'stock' ? parseFloat(value) : value;
    setNewProduct({ ...newProduct, [name]: validatedValue });
    setErrors({ ...errors, [name]: validate(name, validatedValue) });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewProduct({ ...newProduct, category: e.target.value });
    setErrors({ ...errors, category: validate('category', e.target.value) });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = Object.entries(newProduct).reduce((acc, [name, value]) => {
      const error = validate(name, value);
      return error ? { ...acc, [name]: error } : acc;
    }, {});

    setErrors(validationErrors as typeof errors);
    if (Object.values(validationErrors).some((error) => error)) return;

    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!);

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire('Error', 'Hubo un problema al subir la imagen', 'error');
        return;
      }
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api-vinos/products', {
        ...newProduct,
        imgUrl: imageUrl || newProduct.imgUrl,
      }, {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
      Swal.fire('¡Producto creado!', 'El producto ha sido creado exitosamente', 'success');
      setNewProduct({ name: '', description: '', price: 0, stock: 0, imgUrl: '', category: '', store: '' });
      setImagePreview(null);
      fetchProducts();
      console.log(response)
    } catch (error) {
      console.error('Error al crear producto:', error);
      Swal.fire('Error', 'Hubo un problema al crear el producto', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
      Swal.fire('Error', 'El nombre de la categoría no puede estar vacío', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/api-vinos/categories', { name: newCategory }, {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
      Swal.fire('¡Categoría creada!', 'La categoría ha sido creada exitosamente', 'success');
      setNewCategory('');
      fetchCategories();
      console.log(response)
    } catch (error) {
      console.error('Error al crear categoría:', error);
      Swal.fire('Error', 'Hubo un problema al crear la categoría', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete.trim() === '') {
      Swal.fire('Error', 'El nombre de la categoría no puede estar vacío', 'error');
      return;
    }
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get('/api-vinos/categories', {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
  
      const categories: Category[] = response.data.data;
      
      const category = categories.find((cat: Category) => cat.name.toLowerCase() === categoryToDelete.toLowerCase());
  
      if (!category) {
        Swal.fire('Error', 'Categoría no encontrada', 'error');
        return;
      }
  
      const categoryId = category.categoryId;
  
      await axios.delete(`/api-vinos/categories/${categoryId}`, {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
  
      Swal.fire('¡Categoría eliminada!', 'La categoría ha sido eliminada exitosamente', 'success');
      setCategoryToDelete('');
      fetchCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar la categoría', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api-vinos/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center mb-6">
      {user && user.picture ? (
  <>
    <Image
      src={user.picture}
      alt={user.name ?? 'Usuario'}
      className="w-16 h-16 rounded-full"
      width={30}
      height={30}
    />
    <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
    <p className="text-lg text-gray-600">{user.email}</p>
  </>
) : (
  <h1 className="text-3xl font-bold mt-2">Administrador</h1>
)}
        

      </div>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields for product */}
        </form>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Categoría</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Nombre de la categoría"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white rounded px-4 py-2"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Eliminar Categoría</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={categoryToDelete}
            onChange={(e) => setCategoryToDelete(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Nombre de la categoría"
          />
          <button
            onClick={handleDeleteCategory}
            className="bg-red-500 text-white rounded px-4 py-2"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="border border-gray-300 p-4 rounded">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Categoría: {product.category}</p>
              <img src={product.imgUrl} alt={product.name} className="w-32 h-32 object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default withPageAuthRequired(AdminDashboard);
