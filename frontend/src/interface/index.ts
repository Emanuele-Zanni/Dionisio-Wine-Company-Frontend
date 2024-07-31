

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
  
  export interface IProductListProps {
    products: IProduct[];
  }
  
  export interface IProductProps {
    product: IProduct;
  }
  