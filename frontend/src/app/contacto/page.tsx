"use client"

import Image from 'next/image';

const Contacto = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-">
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

                {/* <h2 className="text-2xl font-semibold mt-8 mb-4 text-red-900">Ubicación en el Mapa</h2>
                 <div className="w-full h-64">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.992209273733!2d-58.37540138477043!3d-34.61972478045695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac2e46c9f1f%3A0x12dd56b51b30a8b8!2sSan%20Telmo%2C%20CABA!5e0!3m2!1sen!2sar!4v1620304971090!5m2!1sen!2sar"
                        width="100%"
                        height="100%"
                        allowFullScreen={true}
                        loading="lazy"
                        className="rounded-lg"
                    ></iframe>
                </div> */}
            </div>
        </div>
    );
};

export default Contacto;