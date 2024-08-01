"use client";
import Map from '@/components/Map';

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
          Nos enorgullece trabajar directamente con los productores, estableciendo relaciones de confianza y colaboración que nos permiten garantizar la autenticidad y excelencia de cada vino. Nuestro compromiso no es solo con la calidad, sino también con la sostenibilidad y la preservación de las tradiciones vinícolas.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          A lo largo de los años, hemos creado un espacio donde los amantes del vino pueden explorar, aprender y disfrutar. Nuestro equipo, apasionado y conocedor, está siempre dispuesto a guiar a nuestros clientes en su viaje por el fascinante mundo del vino, ya sea para descubrir nuevos sabores o para encontrar esa botella especial para una ocasión memorable.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Hoy, seguimos comprometidos con nuestra misión de celebrar la cultura del vino, difundiendo la esencia y el carácter único de cada etiqueta que seleccionamos. Con una combinación de tradición y modernidad, buscamos ser la puerta de entrada a experiencias vinícolas excepcionales, tanto para conocedores como para aquellos que recién comienzan a descubrir la magia del vino.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Desde Buenos Aires, brindamos por el pasado, celebramos el presente y miramos con entusiasmo hacia el futuro, siempre con una copa en mano y el deseo de seguir compartiendo nuestra pasión por el vino con el mundo.
        </p>
        <p className="text-xl text-end font-bold text-red-950">
          Puedes visitarnos aquí!
        </p>
      </div>
      <div className="w-full mt-6">
        <Map />
      </div>
    </div>
  );
};

export default About;