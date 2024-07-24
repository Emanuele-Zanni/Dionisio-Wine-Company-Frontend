
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imgUrl: string;
    type: string;
    store: string;
    offer: number;
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
