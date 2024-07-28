export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: string; 
    stock: number;
    imgUrl: string;
    type: string;
    store: string;
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
    products: IProduct[];
}