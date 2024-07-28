import Image from "next/image";
import Link from "next/link";

function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-[#4b0026] via-[#800020] to-[#a52a2a] border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image
                        src="https://static.vecteezy.com/system/resources/previews/013/223/358/non_2x/wine-logo-template-design-with-wine-glasses-and-bottles-logo-for-nightclub-bar-and-wine-shop-free-vector.jpg"
                        className="h-8"
                        alt="Flowbite Logo"
                        width={30}
                        height={30}
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                        Dionisio Wine 
                    </span>
                </a>

                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                        <li>
                            <Link href="/" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white "> Inicio </Link>
                        </li>
                        <li>
                            <Link href="/products"className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500"> Productos </Link>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">
                                Servicios
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">
                                Mi perfil
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-white rounded hover:bg-[#800020] md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500">
                                Contactanos
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
