export interface IProduct {
  productId?: string;
  name: string;
  description: string;
  price: string; 
  stock: number;
  imgUrl: string;
  quantity?: number;
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
    id: string;
    createdAt: Date;
    updatedAt: Date;
    // Otros campos relevantes de la entidad Order...
    details: OrderDetail[]; // Relación uno a muchos con OrderDetail
  }
  export interface OrderDetail {
    orderDetailId: string;
    order: IOrder;
    product: IProduct;
    quantity: number;
    price: number;
    total: number;
  }

