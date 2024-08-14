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
import DiscountCodeGenerator from '@/components/Discount';

const AdminDashboard: React.FC = () => {
  const {user} = useUser();
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
    // Obtener el rol del usuario desde localStorage
    const role = localStorage.getItem('role');
    if (role !== 'admin' && role !== 'superadmin') {
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
      fetchProducts(); // Recargar la lista de productos después de agregar uno nuevo
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
      console.log(response) // Recargar la lista de categorías después de agregar una nueva
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
      // Obtener la lista de categorías
      const response = await axios.get('/api-vinos/categories', {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
  
      const categories = response.data.data; // Asumiendo que la respuesta tiene un array de categorías en `data`
      
      // Encontrar el UUID de la categoría con el nombre proporcionado
      const category = categories.find(cat => cat.name.toLowerCase() === categoryToDelete.toLowerCase());
  
      if (!category) {
        Swal.fire('Error', 'Categoría no encontrada', 'error');
        return;
      }
  
      const categoryId = category.categoryId;
  
      // Realizar la solicitud de eliminación usando el UUID
      await axios.delete(`/api-vinos/categories/${categoryId}`, {
        headers: {
          Authorization: `Basic: ${token}`,
        },
      });
  
      Swal.fire('¡Categoría eliminada!', 'La categoría ha sido eliminada exitosamente', 'success');
      setCategoryToDelete('');
      fetchCategories(); // Recargar la lista de categorías después de eliminar una
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
        {user ? (
          <>
            <Image src={user.picture} alt={user.name} className="w-16 h-16 rounded-full"  width={30} height={30}/>
            <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
            <p className="text-lg text-gray-600">{user.email}</p>
          </>
        ) : (
          <h1 className="text-3xl font-bold mt-2">Administrador</h1>
        )}
      </div>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Crear Producto</h2>
          <div>
            <label htmlFor="name" className="block font-semibold">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label htmlFor="price" className="block font-semibold">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label htmlFor="stock" className="block font-semibold">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block font-semibold">Categoría</label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleCategoryChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label htmlFor="store" className="block font-semibold">Bodega</label>
            <input
              type="text"
              id="store"
              name="store"
              value={newProduct.store}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.store && <p className="text-red-500 text-sm mt-1">{errors.store}</p>}
          </div>
          <div>
            <label htmlFor="imgUrl" className="block font-semibold">Imagen</label>
            <input
              type="file"
              id="imgUrl"
              name="imgUrl"
              accept="image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.imgUrl && <p className="text-red-500 text-sm mt-1">{errors.imgUrl}</p>}
            {imagePreview && <img src={imagePreview} alt="Vista previa de la imagen" className="mt-2 w-32 h-32 object-cover" />}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Crear Producto
          </button>
        </form>
      </div>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Crear Categoría</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="newCategory" className="block font-semibold">Nombre de la Categoría</label>
            <input
              type="text"
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Crear Categoría
          </button>
        </div>
      </div>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Eliminar Categoría</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="categoryToDelete" className="block font-semibold">Nombre de la Categoría</label>
            <input
              type="text"
              id="categoryToDelete"
              value={categoryToDelete}
              onChange={(e) => setCategoryToDelete(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleDeleteCategory}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Eliminar Categoría
          </button>
        </div>
      </div>

      <div className="mb-6">
    <DiscountCodeGenerator />
        </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Productos</h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <li key={product.id} className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p>${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price as string).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <p>Categoría: {categories.find((category) => category.categoryId === product.category)?.name}</p>
              <Image src={product.imgUrl} alt={product.name} className="w-32 h-32 object-cover mt-2" width={30} height={30}/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
