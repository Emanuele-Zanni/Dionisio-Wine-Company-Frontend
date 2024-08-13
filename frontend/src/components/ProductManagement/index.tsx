import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl: string;
  store: string;
  isActive: boolean;
  category: {
    categoryId: string;
    name: string;
  };
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    store: '',
    productId: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api-vinos/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) { // Asegúrate de acceder al array correcto
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          console.error('Data fetched is not an array:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  const applyFilters = () => {
    const { name, category, store, productId } = filters;
    const filtered = products.filter(
      (product) =>
        (!name || product.name.toLowerCase().includes(name.toLowerCase())) &&
        (!category || product.category.name.toLowerCase().includes(category.toLowerCase())) &&
        (!store || product.store.toLowerCase().includes(store.toLowerCase())) &&
        (!productId || product.productId.toLowerCase().includes(productId.toLowerCase()))
    );

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      category: '',
      store: '',
      productId: ''
    });
    setFilteredProducts(products); // Restablecer los productos filtrados a todos los productos
  };

  const handleAdjustClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePatchProduct = () => {
    if (!selectedProduct) return;

    const token = localStorage.getItem('token');
    fetch(`/api-vinos/products/${selectedProduct.productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic: ${token}`,
      },
      body: JSON.stringify(selectedProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update product');
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producto modificado correctamente',
        });
        setSelectedProduct(null); // Cerrar el popup
        // Opcional: actualizar la lista de productos en el estado
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al modificar el producto',
        });
        console.error('Error updating product:', error);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Product Management</h2>

      {/* Barra de Filtrado */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="p-2 border rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoría"
          className="p-2 border rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bodega"
          className="p-2 border rounded"
          value={filters.store}
          onChange={(e) => setFilters({ ...filters, store: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product ID"
          className="p-2 border rounded"
          value={filters.productId}
          onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </button>
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={clearFilters}
        >
          Borrar Filtros
        </button>
      </div>

      {/* Tarjetas de Productos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(filteredProducts) &&
          filteredProducts.map((product) => (
            <div key={product.productId} className="flex p-4 border rounded shadow-lg">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <p className="font-semibold">ID: {product.productId}</p>
                <p className="text-xl font-bold">{product.name}</p>
                <p className="text-gray-600">Precio: ${product.price}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
              </div>
              <button
                className="bg-red-500 text-white p-2 rounded self-end"
                onClick={() => handleAdjustClick(product)}
              >
                Adjust
              </button>
            </div>
          ))}
      </div>

      {/* Pop-up de Ajuste */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg relative p-4">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Adjust Product</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Descripción</label>
                <textarea
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Precio</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Categoría</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.category.name}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    category: {
                      ...selectedProduct.category,
                      name: e.target.value
                    }
                  })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Bodega</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded"
                  value={selectedProduct.store}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, store: e.target.value })}
                />
              </div>
              <button
                type="button"
                className="bg-green-500 text-white p-2 rounded"
                onClick={handlePatchProduct}
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
