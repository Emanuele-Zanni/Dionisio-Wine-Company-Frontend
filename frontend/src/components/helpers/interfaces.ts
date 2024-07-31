export interface IProduct {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imgUrl: string;
    category: {
      categoryId: string;
      name: string;
    };
    store: string;
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
   products: IProduct[]
  }
  

