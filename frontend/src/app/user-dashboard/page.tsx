"use client";

import { useState, useEffect } from 'react';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Filters, Order } from "../interfaces/interfaces";

const UserDashboard: React.FC = () => {
  const { user, error, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState<Filters>({ category: '', store: '', name: '' });
  const [userId, setUserId] = useState<string>();

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
          const token = localStorage.getItem('token');
          const response = await fetch(`/api-vinos/orders/${userId}`, {
            headers: {
              'Authorization': `Basic ${token}`, // Agregar el encabezado Authorization
            },
          });
          const data = await response.json();
          
          console.log('Full Response:', data); // Log completo de la respuesta
          
          if (data && Array.isArray(data)) {
            console.log('Fetched Orders:', data);
            setOrders(data.map((order: Order) => ({
              ...order,
              price: parseFloat(order.price || '0.00'),
              details: order.details.map(detail => ({
                ...detail,
                price: parseFloat(detail.price || '0.00'),
                total: parseFloat(detail.total || '0.00')
              }))
            })));
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
    const normalizedFilters = {
      category: filters.category.toLowerCase(),
      store: filters.store.toLowerCase(),
      name: filters.name.toLowerCase()
    };

    const filtered = ordersToFilter.filter((order) => {
      const filteredDetails = order.details.filter((item) => {
        const productCategory = item.product.category?.name.toLowerCase() || ''; // Normaliza a minúsculas
        const productStore = item.product.store.toLowerCase() || '';
        const productName = item.product.name.toLowerCase() || '';

        return (
          (normalizedFilters.category ? productCategory.includes(normalizedFilters.category) : true) &&
          (normalizedFilters.store ? productStore.includes(normalizedFilters.store) : true) &&
          (normalizedFilters.name ? productName.includes(normalizedFilters.name) : true)
        );
      });

      return filteredDetails.length > 0;
    });

    const sortedOrders = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.price || 0) - (b.price || 0);
      } else {
        return (b.price || 0) - (a.price || 0);
      }
    });

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
          <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
          <p className="text-lg text-gray-600">{user.email}</p>
        </div>
      )}

      <div className="flex flex-col items-center mb-4 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
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
        </div>
        <button
          onClick={() => applyFilters(orders)}
          className="px-4 py-2 bg-[#4b0026] text-white rounded-lg"
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="flex flex-col items-center p-4 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500">Aún no hay órdenes</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:bg-gray-100 transition"
              >
                <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-4">
                  <div className="flex-1">
                    {order.details && Array.isArray(order.details) ? (
                      order.details.map((detail, index) => (
                        <div key={index} className="flex items-start border-b border-gray-200 pb-4 mb-4">
                          <div className="flex-1">
                            <div className="font-semibold text-lg">Detalles del producto {index + 1}</div>
                            <div>Nombre: {detail.product.name}</div>
                            <div>Categoría: {detail.product.category?.name}</div>
                            <div>Bodega: {detail.product.store}</div>
                            <div>Cantidad: {detail.quantity}</div>
                            <div>Precio: ${parseFloat(detail.price || '0.00').toFixed(2)}</div>
                            <div>Total: ${parseFloat(detail.total || '0.00').toFixed(2)}</div>
                          </div>
                          <img
                            src={detail.product.imgUrl}
                            alt={detail.product.name}
                            className="w-32 h-32 ml-4 object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-red-500">No se encontraron detalles para esta orden.</div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-4 border-t border-gray-200 pt-4">
                  <span className="font-semibold">Orden: {order.id}</span>
                  <span className="font-semibold">Fecha: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="font-semibold">Total: ${parseFloat(order.price || '0.00').toFixed(2)}</span>
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
