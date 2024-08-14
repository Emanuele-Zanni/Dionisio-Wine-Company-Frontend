"use client";

import Map from '@/components/Map';

const Contacto = () => {
    return (
        <div className="min-h-screen  flex flex-col items-center py-8">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-red-900">Contacto</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-red-900">Nuestra Ubicación</h2>
                        <p className="text-gray-700 mb-2">Dionisio Wine Company</p>
                        <p className="text-gray-700 mb-2">Calle Defensa 1234, San Telmo</p>
                        <p className="text-gray-700 mb-2">Buenos Aires, Argentina</p>
                        <p className="text-gray-700 mb-2">Teléfono: +54 11 1234-5678</p>
                        <p className="text-gray-700 mb-2">Email: contacto@dionisiowine.com</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-red-900">Horario de Atención</h2>
                        <p className="text-gray-700 mb-2">Lunes a Viernes: 10:00 AM - 8:00 PM</p>
                        <p className="text-gray-700 mb-2">Sábado: 10:00 AM - 6:00 PM</p>
                        <p className="text-gray-700 mb-2">Domingo: Cerrado</p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-red-900">Envíanos un Mensaje</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Nombre</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            placeholder="Tu nombre" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            placeholder="Tu email" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Mensaje</label>
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded-lg" 
                            rows={4} 
                            placeholder="Tu mensaje" 
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full p-2 bg-red-900 text-white rounded-lg"
                    >
                        Enviar Mensaje
                    </button>
                </form>

                <div className="w-full mt-6">
                <p className="text-xl text-end font-bold text-red-950">
                   Te esperamos en nuestro local!
                  </p>
        <Map />
      </div>
            </div>
        </div>
    );
};

export default Contacto;