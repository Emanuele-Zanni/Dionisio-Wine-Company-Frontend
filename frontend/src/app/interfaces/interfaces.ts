// interfaces/interfaces.ts

export interface Product {
  id?: string; // El ID puede ser opcional en la creación de productos nuevos
  name: string;
  description: string;
  price: number; // Cambiado a number
  stock: number;
  imgUrl: string;
  category: string; // Se asume que el ID de la categoría es un string
  store: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  date: string; // Considera usar Date si prefieres trabajar con objetos Date en vez de strings
  isAdmin: boolean;
}


export interface Category {
  categoryId: string; // El ID de la categoría
  name: string;
}

export interface UserSession {
  token: string;
  userData: {
      address: string;
      email: string;
      id: number;
      name: string;
      phone: string;
      role: string;
      orders: []
  }
}

export interface Order {
  id: string;
  price: number; // Precio total de la orden
  status: OrderStatus; // Estado de la orden
  createdAt: string; // Fecha de creación en formato ISO
  details: OrderDetail[]; // Detalles de la orden
}

export interface OrderDetail {
  orderDetailId: string; // ID único del detalle de la orden
  product: Product; // Información del producto
  quantity: number; // Cantidad del producto
  price: number; // Precio del producto
  total: number; // Precio total para este producto
}

export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface Filters {
  category: string;
  store: string;
  name: string;
}
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string; // Categoría del item
  store: string; // Tienda o bodega del item
  imgUrl: string; // Cambiado de `imageUrl` a `imgUrl` para que coincida con el código
}


