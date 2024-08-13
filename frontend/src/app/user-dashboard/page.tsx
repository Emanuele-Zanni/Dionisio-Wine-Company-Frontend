"use client";

import { useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Filters, Order } from "../interfaces/interfaces"; // Asegúrate de que Filters esté definido en interfaces
import Image from 'next/image';

const UserDashboard: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState<Filters>({ category: '', store: '', name: '' });
  const [userId, setUserId] = useState<string | null>(null);

  // Efecto para obtener el ID del usuario del token
  useEffect(() => {
    const fetchUserIdFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserId(decodedToken.id); // Extrae el ID del usuario del token
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    fetchUserIdFromToken();
  }, []);

  // Efecto para obtener las órdenes del usuario una vez que el userId esté disponible
  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`/api-vinos/orders/${userId}`, {
            headers: {
              'Authorization': `Basic ${token}`, // Agregar el encabezado Authorization
            },
          });
          const data = await response.json();
          
          console.log('Full Response:', data); // Log completo de la respuesta
          
          if (data && Array.isArray(data)) {
            console.log('Fetched Orders:', data);
            setOrders(data);
          } else {
            console.warn('No orders found or invalid response format:', data);
            setOrders([]);
            setFilteredOrders([]);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      fetchOrders();
    }
  }, [userId]);

  // Función para aplicar filtros y sorting
  const applyFilters = (ordersToFilter: Order[]) => {
    const filtered = ordersToFilter.filter((order) => {
      // Filtrar los detalles dentro de la orden
      const filteredItems = order.items.filter((item) => {
        return (
          (filters.category ? item.name.includes(filters.category) : true) &&
          (filters.store ? item.imageUrl.includes(filters.store) : true) &&
          (filters.name ? item.name.includes(filters.name) : true)
        );
      });

      // Solo incluir la orden si tiene al menos un detalle que pase el filtro
      return filteredItems.length > 0;
    });
  
    const sortedOrders = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.total - b.total;
      } else {
        return b.total - a.total;
      }
    });
  
    console.log('Filtered and Sorted Orders:', sortedOrders); 
    setFilteredOrders(sortedOrders);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Aplicar filtros cuando los filtros cambien
  useEffect(() => {
    applyFilters(orders);
  }, [filters, sortOrder, orders]); // Vuelve a aplicar los filtros y orden cuando alguno de estos cambie

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
      {user && (
        <div className="flex flex-col items-center mb-6">
          {/* Asegurarse de que user.picture es una string válida antes de usarla en el componente Image */}
          {user.picture && (
            <Image 
              src={user.picture} 
              alt={user.name || "User avatar"} 
              className="w-16 h-16 rounded-full" 
              width={30} 
              height={30}
            />
          )}
          <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
          <p className="text-lg text-gray-600">{user.email}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <label htmlFor="sortOrder" className="font-semibold">Ordenar por:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="category" className="font-semibold">Categoría:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="store" className="font-semibold">Bodega:</label>
          <input
            type="text"
            id="store"
            name="store"
            value={filters.store}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="name" className="font-semibold">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={() => applyFilters(orders)}
          className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg mt-4 lg:mt-0"
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="flex-1 w-full">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500">Aún no hay órdenes</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition"
              >
                <div className="flex flex-col space-y-4">
                  {/* Verificar si order.items está definido y es un array */}
                  {order.items && Array.isArray(order.items) ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex items-center border-b border-gray-200 pb-4 mb-4">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mr-4"/>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">Detalles del producto {index + 1}</div>
                          <div>Nombre: {item.name}</div>
                          <div>Categoría: {item.category}</div>
                          <div>Bodega: {item.store}</div>
                          <div>Cantidad: {item.quantity}</div>
                          <div>Precio: ${item.price ? Number(item.price).toFixed(2) : "0.00"}</div>
                          <div>Total: ${item.total ? Number(item.total).toFixed(2) : "0.00"}</div>
                        </div>
                      </div>
                    ))
                ) : (
                    <div className="text-center text-red-500">No se encontraron detalles para esta orden.</div>
                )}
                </div>
                <div className="flex justify-between mt-4">
                  <span className="font-semibold">Orden: {order.id}</span>
                  <span className="font-semibold">Fecha: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold">Total: ${order.total ? Number(order.total).toFixed(2) : "0.00"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withPageAuthRequired(UserDashboard);




/*
useEffect(() => {
  if (userId) {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api-vinos/orders/${userId}`, {
          headers: {
            'Authorization': `Basic ${token}`, // Agregar el encabezado Authorization
          },
        });
        const data = await response.json();
        
        console.log('Full Response:', data); // Log completo de la respuesta
        
        if (data && Array.isArray(data)) {
          console.log('Fetched Orders:', data);
          setOrders(data);
        } else {
          console.warn('No orders found or invalid response format:', data);
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }
}, [userId]);
*/