"use client"

const Cart = () => {

    return (
        
        <div className="min-h-screen flex flex-col items-center justify-center  py-6">
                <h1 className="text-2xl font-bold mb-4 text-center text-red-900">Tu carrito de compras</h1>
            <div className="w-full max-w-4xl bg-white  p-6 rounded-lg shadow-md">
                <div className="flex flex-col gap-6">
                    
                       
                            <div className="flex items-center bg-gray-50  p-4 rounded-lg shadow-sm">
                                {/* <Image src={product.imgUrl} alt={} width={150} height={150} className="rounded-lg"/> */}
                                <div className="ml-4 flex-1">
                                    <p className="text-lg font-medium dark:text-white"></p>
                                    <p className="text-sm text-gray-600 ">Precio: $</p>
                                </div>
                                <button
                                    
                                    className=" hover:bg-red-700 text-red-900 p-2 rounded-md ml-28"
                                >
                                    Eliminar
                                </button>
                            </div>
                       

                </div>
                <div className="mt-6 w-full flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xl font-bold text-[#800020]">Total:</p>
                    <button
                    className="px-4 py-2 bg-[#FFD700] text-[#800020] rounded-lg"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
      
    );
};

export default Cart;

