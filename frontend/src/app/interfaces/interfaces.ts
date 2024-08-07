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

export interface IOrder {
 id: number,
 status: string,
 date: Date,
 products: Product[]
}

export  interface Filters {
  category: string;
  store: string;
  name: string;
}

export  interface Order {
  id: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}