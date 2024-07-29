interface IProduct {
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
  

export type {IProduct}