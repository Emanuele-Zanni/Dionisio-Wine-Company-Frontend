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