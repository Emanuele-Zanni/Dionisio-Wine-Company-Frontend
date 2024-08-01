export interface IProduct {
    id?: string;
    name: string;
    description: string;
    price: string; 
    stock: number;
    imgUrl: string;
    category: {
      categoryId: string;
      name: string;
    };
    store: string;
<<<<<<< HEAD
    isActive: boolean;
    category: {
        categoryId: string;
        name: string;
    };
    offer?: number; 
}
=======
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
  
>>>>>>> 13009337860318557d52508e1101d9e2b29e7e73

