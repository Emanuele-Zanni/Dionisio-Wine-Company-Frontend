"use client"

import { useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import {Filters, Order} from "../interfaces/interfaces"
import axios from 'axios';




const UserDashboard: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState<Filters>({ category: '', store: '', name: '' });



  useEffect(() => {console.log(user?.data);},[])

  useEffect(() => {
    
    const fetchOrders = async () => {
      // Fetch orders from API endpoint using user's ID
      try {
        const response = await fetch(`/api-vinos/orders/:${user?.id}`);
        const data = await response.json();
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const postUser = async () => {
      try {
        const response = await axios.post('/api-vinos/auth/user', {
          id: user?.sub,
          name: user?.name,
          email: user?.email,
          //picture: user?.picture,
        });
        console.log(response)
      } catch (error) {
        console.error('Error posting user:', error);
      }
    };

    if (user) {
      postUser();
    }
  }, [user]);

  useEffect(() => {
    
    const applySorting = () => {
      const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.total - b.total;
        } else {
          return b.total - a.total;
        }
      });
    
      setFilteredOrders(sortedOrders);
    };

    applySorting();
  }, [sortOrder]);

  const applyFilters = () => {
    const filtered = orders.filter((order) => {
      return (
        (filters.category ? order.items.some(item => item.name.includes(filters.category)) : true) &&
        (filters.store ? order.items.some(item => item.name.includes(filters.store)) : true) &&
        (filters.name ? order.items.some(item => item.name.includes(filters.name)) : true)
      );
    });

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center p-4 space-y-6">
       {user && (
        <div className="flex flex-col items-center mb-6">
          <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full" />
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
          onClick={applyFilters}
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
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Orden: {order.id}</span>
                  <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
                </div>
                <div className="mt-4 hidden">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-gray-700">
                      {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                    </div>
                  ))}
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
