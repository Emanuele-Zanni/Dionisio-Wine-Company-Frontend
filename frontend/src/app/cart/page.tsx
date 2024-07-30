// "use client"
// import { useEffect, useState } from "react";
// import {IProduct, UserSession} from "@/components/helpers/interfaces"
// import { useRouter } from "next/navigation";
// import { createrOrder } from "@/components/helpers/orders";
// import Image from "next/image";

// const Cart = () => {
//     const router = useRouter();
//     const [cart, setCart] = useState<IProduct[]>([]);
//     const [total, setTotal] = useState<number>(0);
//     const [userData, setUserData] = useState<UserSession>();

//     useEffect(() => {
   
//         if (typeof window !== "undefined" && window.localStorage) {
//             const userData: UserSession = JSON.parse(localStorage.getItem("userSession")!);
//             setUserData(userData);
//             !userData?.token && router.push("/login");

//             const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
//             if (storedCart) {
//                 let totalCart = 0;
//                 storedCart.forEach((item: IProduct) => {
//                     totalCart += item.price;
//                 });
//                 setTotal(totalCart);
//                 setCart(storedCart);
//             }
//         }
//     }, []);

//     const handleRemoveFromCart = (productId: number) => {
//         const updatedCart = cart.filter((product) => product.id !== productId);
//         setCart(updatedCart);
//         const updatedTotal = updatedCart.reduce((acc, curr) => acc + curr.price, 0);
//         setTotal(updatedTotal);
//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//     };

//     const handleClick = async () => {
      
//         const idProducts = cart.map((product) => product.id);
//         await createrOrder(idProducts, userData?.token!);
//         setCart([]);
//         setTotal(0);
//         localStorage.setItem("cart", "[]");
//         alert("Buy successfully");
//         router.push("/home"); 
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center  py-6">
//                 <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Your Cart</h1>
//             <div className="w-full max-w-4xl bg-white  p-6 rounded-lg shadow-md">
//                 <div className="flex flex-col gap-6">
//                     {cart.length > 0 ? (
//                         cart.map((product) => (
//                             <div key={product.id} className="flex items-center bg-gray-50  p-4 rounded-lg shadow-sm">
//                                 <Image src={product.imgUrl} alt={product.name} width={150} height={150} className="rounded-lg"/>
//                                 <div className="ml-4 flex-1">
//                                     <p className="text-lg font-medium dark:text-white">{product.name}</p>
//                                     <p className="text-sm text-gray-600 ">Price: ${product.price}</p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleRemoveFromCart(product.id)}
//                                     className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md ml-28"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-center text-gray-500">No items in your cart</p>
//                     )}
//                 </div>
//                 <div className="mt-6 w-full flex flex-col md:flex-row items-center justify-between">
//                     <p className="text-xl font-bold dark:text-white">Total: ${total}</p>
//                     <button
//                         onClick={handleClick}
//                         disabled={cart.length === 0}
//                         className={`w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-md mt-4 md:mt-0 md:ml-12 ${
//                             cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
//                         }`}
//                     >
//                         Checkout
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Cart;

