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
