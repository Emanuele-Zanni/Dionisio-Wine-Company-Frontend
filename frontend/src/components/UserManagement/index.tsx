import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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
  const [roleToUpdate, setRoleToUpdate] = useState<{ id: string, newRole: string } | null>(null);

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

  const handleRoleChange = () => {
    if (!roleToUpdate) return;

    const { id, newRole } = roleToUpdate;
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

    fetch(`/api-vinos/users/${id}/role`, {
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
          user.id === id ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setRoleToUpdate(null); // Limpiar el estado de rol para actualizar
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

  return (
    <div className="p-4">
      {/* Título centrado */}
      <h2 className="text-3xl font-bold text-center mb-8">User Management</h2>

      {/* Barra de Filtrado */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Email"
          className="p-2 border rounded"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nombre"
          className="p-2 border rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID de Usuario"
          className="p-2 border rounded"
          value={filters.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
        />
        <select
          value={filters.role}
          className="p-2 border rounded"
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Tarjetas de Usuarios */}
      <div className="flex flex-col gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="flex p-4 border rounded shadow-lg items-center">
            <div className="flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${user.name}`}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="flex-1 ml-4">
              <p className="font-semibold">Email: {user.email}</p>
              <p>Nombre: {user.name}</p>
              <p>ID de Usuario: {user.id}</p>
            </div>
            <div className="flex flex-col items-end justify-center space-y-2 w-32">
              <select
                value={user.role}
                className="p-2 border rounded w-full"
                onChange={(e) => setRoleToUpdate({ id: user.id, newRole: e.target.value })}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <button
                className="bg-blue-500 text-white p-2 rounded w-full"
                onClick={handleRoleChange}
              >
                SAVE
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded w-full"
                onClick={() => { setSelectedUserId(user.id); fetchOrders(user.id); }}
              >
                Orders
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up de Órdenes */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg relative p-4">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedUserId(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Órdenes del Usuario {selectedUserId}</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 border rounded shadow-sm">
                  <p className="font-semibold">Nombre: {order.productName}</p>
                  <p>Cantidad: {order.quantity}</p>
                  <p>Precio: {order.price}</p>
                  <p>ID de la Orden: {order.id}</p>
                  <p>Fecha: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Total: {order.total}</p>
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
