

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
export interface IProductProps {
    product: IProduct;
}

export interface IProductListProps {
=======
  }
  
  export interface IProductListProps {
>>>>>>> 13009337860318557d52508e1101d9e2b29e7e73
    products: IProduct[];
  }
  
  export interface IProductProps {
    product: IProduct;
  }
  