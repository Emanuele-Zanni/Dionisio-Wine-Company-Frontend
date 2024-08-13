import { useState, useEffect } from "react";
import OrderStatusUpdater from "./OrderStatusUpdater"; // Importa el nuevo componente

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    email: "",
    name: "",
    id: "",
    role: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api-vinos/users", {
      headers: {
        Authorization: `Basic: ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        return res.json();
      })
      .then((data) => {
        const flattenedData = data.flat().map((user: any) => user);
        setUsers(flattenedData);
        setFilteredUsers(flattenedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const applyFilters = () => {
    const { email, name, id, role } = filters;
    const filtered = users.filter(
      (user) =>
        (!email || user.email.includes(email)) &&
        (!name || user.name.includes(name)) &&
        (!id || user.id.includes(id)) &&
        (!role || user.role === role)
    );
    setFilteredUsers(filtered);
  };

  const fetchOrders = (userId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api-vinos/orders/${userId}`, {
      headers: {
        Authorization: `Basic: ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  };

  const formatPrice = (price: any) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? "00.00" : numericPrice.toFixed(2);
  };

  const handleStatusUpdated = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="p-4">
      {/* Filtros */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Buscar por ID"
          value={filters.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Buscar por rol"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold text-xl">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
            <p>Rol: {user.role}</p>
            <button
              className="bg-green-500 text-white p-2 rounded mt-2"
              onClick={() => {
                setSelectedUserId(user.id);
                fetchOrders(user.id);
              }}
            >
              Ver Órdenes
            </button>
          </div>
        ))}
      </div>

      {/* Pop-up de Órdenes */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-start justify-center p-4">
          <div
            className="bg-white rounded-lg w-full max-w-3xl relative overflow-auto"
            style={{ maxHeight: "calc(100vh - 100px)" }}
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
              {orders.map((order) => (
                <div key={order.id} className="p-4 border rounded shadow-sm">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">
                      Orden ID: {order.id}
                    </h3>
                    {order.details.map((product: any, index: number) => (
                      <div key={index} className="p-2 border rounded mb-2">
                        <p className="font-bold">Nombre del Vino</p>
                        <p>Cantidad: {product.quantity}</p>
                        <p>Precio por Unidad: ${formatPrice(product.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold">
                    Total: $
                    {formatPrice(
                      order.details.reduce(
                        (total: number, product: any) =>
                          total +
                          (product.price ? parseFloat(product.price) : 0) *
                            product.quantity,
                        0
                      )
                    )}
                  </div>
                  <OrderStatusUpdater
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdated={handleStatusUpdated}
                  />
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
