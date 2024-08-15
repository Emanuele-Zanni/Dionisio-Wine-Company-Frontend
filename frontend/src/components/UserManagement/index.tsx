import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import OrderStatusUpdater from './OrderStatusUpdater'; // Importa el nuevo componente

const roles = ['user', 'admin', 'superadmin', 'banned'];

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    email: '',
    name: '',
    id: '',
    role: ''
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [roleToUpdate, setRoleToUpdate] = useState<{ id: string; newRole: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api-vinos/users', {
      headers: {
        'Authorization': `Basic: ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then(data => {
        const flattenedData = data.flat().map((user: any) => user);
        setUsers(flattenedData);
        setFilteredUsers(flattenedData);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const applyFilters = () => {
    const { email, name, id, role } = filters;
    const filtered = users.filter(user =>
      (!email || user.email.includes(email)) &&
      (!name || user.name.includes(name)) &&
      (!id || user.id.includes(id)) &&
      (!role || user.role === role)
    );
    setFilteredUsers(filtered);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Obtiene el rol del usuario actual desde localStorage

    // Verificar si el usuario actual es un superadmin
    if (userRole !== 'superadmin') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Solo un superadmin puede modificar los roles'
      });
      return;
    }

    fetch(`/api-vinos/users/role/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic: ${token}`,
      },
      body: JSON.stringify({ role: newRole }), // Solo enviamos el nuevo rol
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update role');
        }
        return res.json();
      })
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Rol modificado correctamente'
        });

        // Actualizar la lista de usuarios en el estado
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setRoleToUpdate(null); // Limpiar el rol a actualizar después de guardar
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al modificar el rol'
        });
        console.error('Error updating role:', error);
      });
  };

  const handleSaveClick = () => {
    if (roleToUpdate) {
      handleRoleChange(roleToUpdate.id, roleToUpdate.newRole);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No hay cambios de rol para guardar'
      });
    }
  };

  const fetchOrders = (userId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`/api-vinos/orders/${userId}`, {
      headers: {
        'Authorization': `Basic: ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching orders:', error));
  };

  const formatPrice = (price: any) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? '00.00' : numericPrice.toFixed(2);
  };

  const handleStatusUpdated = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="p-4">
      {/* Filtros */}
      <h2 className="text-3xl font-bold text-center mb-8">User Management</h2>
      <div className="flex justify-center mb-4">
  <div className="flex space-x-2">
    <input
      type="text"
      placeholder="Buscar por email"
      value={filters.email}
      onChange={(e) => setFilters({ ...filters, email: e.target.value })}
      className="p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Buscar por nombre"
      value={filters.name}
      onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      className="p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Buscar por ID"
      value={filters.id}
      onChange={(e) => setFilters({ ...filters, id: e.target.value })}
      className="p-2 border rounded"
    />
    <input
      type="text"
      placeholder="Buscar por rol"
      value={filters.role}
      onChange={(e) => setFilters({ ...filters, role: e.target.value })}
      className="p-2 border rounded"
    />
    <button
      className="bg-[#4b0026] text-white p-2 rounded"
      onClick={applyFilters}
    >
      Aplicar Filtros
    </button>
  </div>
</div>


      {/* Lista de usuarios */}
      <div className="space-y-4">
  {filteredUsers.map(user => (
    <div key={user.id} className="p-4 border rounded shadow-sm flex items-start space-x-4">
      <div className="flex-1">
        <h2 className="font-semibold text-xl">{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
        <p>Rol: {user.role}</p>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <button
          className="text-white bg-[#4b0026] rounded p-2 w-full max-w-[200px] h-10 flex items-center justify-center"
          onClick={() => {
            setSelectedUserId(user.id);
            fetchOrders(user.id);
          }}
        >
          Ver Órdenes
        </button>
        <select
          value={roleToUpdate?.id === user.id ? roleToUpdate?.newRole : user.role}
          className="p-2 border rounded w-full max-w-[200px] h-10"
          onChange={(e) => {
            const newRole = e.target.value;
            setRoleToUpdate({ id: user.id, newRole });
          }}
        >
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
    </div>
  ))}
</div>


      {/* Botón Guardar */}
      <div className="mt-4">
        <button
          className=" text-white p-2 rounded mx-auto block bg-[#4b0026] align-middle"
          onClick={handleSaveClick}
        >
          Guardar Cambios
        </button>
      </div>

      {/* Pop-up de Órdenes */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-start justify-center p-4">
          <div
            className="bg-white rounded-lg w-full max-w-3xl relative overflow-auto"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedUserId(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 place-self-center">
              Órdenes del Usuario
            </h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 border rounded shadow-sm">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">
                      Orden ID: {order.id}
                    </h3>
                    {order.details.map((product: any) => (
                      <div key={product.id} className="mb-2">
                        <p>Producto: {product.name}</p>
                        <p>Precio: ${formatPrice(product.price)}</p>
                        <p>Cantidad: {product.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total: ${formatPrice(order.total)}</span>
                    <OrderStatusUpdater
                      orderId={order.id}
                      currentStatus={order.status}
                      onStatusUpdated={handleStatusUpdated}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
