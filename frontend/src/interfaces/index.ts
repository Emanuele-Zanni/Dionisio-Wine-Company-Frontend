export interface IProduct {
  productId?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  quantity: number;
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

export interface ICart {
  productId: string;
  price: number;
  quantity: number;
  stock: number;
  imgUrl: string;
  name: string;
}
