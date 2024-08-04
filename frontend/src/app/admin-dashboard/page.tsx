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
        return typeof value === 'string' && value.length > 20 ? 'Categoría no puede exceder 20 caracteres' : '';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = Object.entries(newProduct).reduce((acc, [name, value]) => {
      const error = validate(name, value);
      return error ? { ...acc, [name]: error } : acc;
    }, {});

    setErrors(validationErrors as typeof errors);
    if (Object.values(validationErrors).some((error) => error)) return;

    try {
      await axios.post('https://dionisio-wine-company-backend.onrender.com/products', newProduct);
      Swal.fire('¡Producto creado!', 'El producto ha sido creado exitosamente', 'success');
      setNewProduct({ name: '', description: '', price: 0, stock: 0, imgUrl: '', category: '', store: '' });
      fetchProducts(); // Recargar la lista de productos después de agregar uno nuevo
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

    try {
      await axios.post('https://dionisio-wine-company-backend.onrender.com/categories', { name: newCategory });
      Swal.fire('¡Categoría creada!', 'La categoría ha sido creada exitosamente', 'success');
      setNewCategory('');
      fetchCategories(); // Recargar la lista de categorías después de agregar una nueva
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

    try {
      await axios.delete(`https://dionisio-wine-company-backend.onrender.com/categories/${categoryToDelete}`);
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
      const response = await axios.get('https://dionisio-wine-company-backend.onrender.com/products');
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
            <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
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
            <label htmlFor="imgUrl" className="block font-semibold">Imagen URL</label>
            <input
              type="text"
              id="imgUrl"
              name="imgUrl"
              value={newProduct.imgUrl}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.imgUrl && <p className="text-red-500 text-sm mt-1">{errors.imgUrl}</p>}
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
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
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
          <button type="submit" className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg mt-4">
            Crear Producto
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Agregar Categoría</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Nombre de la nueva categoría"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg"
          >
            Agregar Categoría
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Eliminar Categoría</h2>
          <input
            type="text"
            value={categoryToDelete}
            onChange={(e) => setCategoryToDelete(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Nombre de la categoría a eliminar"
          />
          <button
            onClick={handleDeleteCategory}
            className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg"
          >
            Eliminar Categoría
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
          {products.map((product) => (
            <div key={product.id} className="p-4 mb-4 border border-gray-300 rounded">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: {product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Imagen URL: {product.imgUrl}</p>
              <p>Categoría: {product.category}</p>
              <p>Bodega: {product.store}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
