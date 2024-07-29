/*
export interface IProduct {
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
export interface IProductProps {
    product: IProduct;
}

export interface IProductListProps {
    products: IProduct[];
}

*/

// src/interfaces/index.ts

// src/interface/index.ts

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
  