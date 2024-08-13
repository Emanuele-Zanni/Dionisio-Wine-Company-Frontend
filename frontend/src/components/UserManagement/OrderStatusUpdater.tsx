import { useState } from "react";
import Swal from "sweetalert2";

const orderStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdated: (orderId: string, status: string) => void;
}

const OrderStatusUpdater: React.FC<OrderStatusUpdaterProps> = ({
  orderId,
  currentStatus,
  onStatusUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);

  const handleStatusChange = () => {
    Swal.fire({
      title: "Confirmación",
      text: "¿Estás seguro de que deseas cambiar el estado de esta orden?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Token de autenticación no encontrado",
          });
          return;
        }

        fetch(`https://dionisio-wine-company-backend.onrender.com/orders/orderSatus`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic: ${token}`, 
          },
          body: JSON.stringify({ orderId, status: selectedStatus }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((text) => {
                throw new Error(text || "Failed to update order status");
              });
            }
            return res.json();
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Éxito",
              text: "Estado de la orden actualizado correctamente",
            });
            onStatusUpdated(orderId, selectedStatus);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Error al actualizar el estado de la orden: ${error.message}`,
            });
            console.error("Error updating order status:", error);
          });
      }
    });
  };

  return (
    <div className="mt-4">
      <select
        value={selectedStatus}
        className="p-2 border rounded"
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {orderStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white p-2 rounded mt-2"
        onClick={handleStatusChange}
      >
        Actualizar Estado
      </button>
    </div>
  );
};

export default OrderStatusUpdater;
