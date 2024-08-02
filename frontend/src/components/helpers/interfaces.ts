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
  }

  export interface AppSession {
    data: {
      message: string;
      token: string;
    };
  }
  
  export interface IOrder {
   id: number,
   status: string,
   date: Date,
   products: IProduct[]
  }
  

