import { IProduct, IProductListProps } from "@/interface/index";
import ProductsCard from "../ProductsCard";

function ProductsList({ products }: IProductListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 p-8">
            {products.map((product: IProduct) => (
                <ProductsCard product={product} key={product.id} />
            ))}
        </div>
    );
}

export default ProductsList;
