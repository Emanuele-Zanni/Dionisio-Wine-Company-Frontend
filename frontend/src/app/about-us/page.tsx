"use client";

import Image from 'next/image';

const About = () => {
  return (
    <div className="mx-auto p-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold mb-6 text-center text-red-950">Nuestra Historia</h1>
        <p className="text-lg text-gray-700 mb-6">
          Ubicados en el corazón de Buenos Aires, nuestra historia comienza con una pasión profunda por el vino y un deseo de compartir los mejores caldos con el mundo. Fundada hace más de una década, nuestra empresa nació de la visión de un grupo de enólogos y amantes del vino que soñaban con crear un puente entre los más exquisitos viñedos de Argentina y los paladares más exigentes.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Desde nuestros humildes comienzos, hemos crecido para convertirnos en un referente en la comercialización de vinos de alta calidad, ofreciendo una cuidadosa selección de etiquetas que reflejan la riqueza y diversidad de las regiones vitivinícolas argentinas. Cada botella que ofrecemos cuenta una historia, ya sea de un pequeño viñedo familiar en Mendoza, una bodega innovadora en Salta, o una añada excepcional de la Patagonia.
        </p>
       
        <p className="text-lg text-gray-700 mb-6">
          Desde Buenos Aires, brindamos por el pasado, celebramos el presente y miramos con entusiasmo hacia el futuro, siempre con una copa en mano y el deseo de seguir compartiendo nuestra pasión por el vino con el mundo.
        </p>
        <p className="text-xl text-center font-bold text-red-950"> Nuestro Equipo de Trabajo</p>
         </div>
    
       <div className="mt-8 flex justify-center space-x-8">
                    <a href="https://www.linkedin.com/in/mar%C3%ADa-laura-arcucci/" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://media.licdn.com/dms/image/D4D03AQFAx3ifKgkqsQ/profile-displayphoto-shrink_800_800/0/1723141667743?e=1729123200&v=beta&t=OoPonW2QOG_0iYFc-kL7Cwz9iB63iLFZ9q2MdoVz4mQ" 
                            alt="Foto 1" 
                            width={80} 
                            height={80} 
                            className="rounded-full object-cover"
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/pedro-gandola/" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://media.licdn.com/dms/image/v2/D4D35AQHabwkRFhoRXw/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1689255935737?e=1724266800&v=beta&t=PPQYH5-XXbdfDOiyXYt8-ImzjB7nK7SahmR66nHOp4U" 
                            alt="Foto 2" 
                            width={80} 
                            height={80} 
                            className="rounded-full object-cover"
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/eric-diaz-euka/" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://media.licdn.com/dms/image/v2/D4D35AQGexYCq4aUqog/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1710337977011?e=1724335200&v=beta&t=BmpDMwEMcw4CP9DOivNQtsCqQF4lRo6E-RkQs4xWIxg" 
                            alt="Foto 3" 
                            width={80} 
                            height={80} 
                            className="rounded-full object-cover"
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/emanuele-zanni/" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="/ema.png" 
                            alt="Foto 4" 
                            width={80} 
                            height={80} 
                            className="rounded-full object-cover"
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/francisco-imeroni-010b77280/" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="/fran.jpeg" 
                            alt="Foto 5" 
                            width={80} 
                            height={80} 
                            className="rounded-full object-cover"
                        />
                    </a>
                </div>
    </div>
  );
};


export default About;