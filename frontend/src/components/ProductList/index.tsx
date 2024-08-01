// src/components/ProductList.tsx

import { IProduct, IProductListProps } from "@/interface";
import ProductsCard from "../ProductsCard";

function ProductList({ products }: IProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-16 p-8 mr-5">
      {products.map((product: IProduct) => (
        <ProductsCard product={product} key={product.id} />
      ))}
    </div>
  );
}

export default ProductList;
