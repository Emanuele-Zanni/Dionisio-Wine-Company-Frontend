
export interface Product {
  id?: string; 
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  category: string;
  store: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  date: string;
  isAdmin: boolean;
  orders: string;
}
