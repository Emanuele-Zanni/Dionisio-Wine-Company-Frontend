

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
  
  export interface IProductListProps {
    products: IProduct[];
  }
  
  export interface IProductProps {
    product: IProduct;
  }
  