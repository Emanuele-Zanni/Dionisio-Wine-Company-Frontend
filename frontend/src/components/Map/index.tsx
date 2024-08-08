"use client";

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from './Map.module.css';

// Configuración del mapa
const mapContainerStyle = {
  height: "400px",
  width: "100%", // Corregí el ancho para que sea más adecuado para la visualización
};

const center = {
  lat: -34.6195, // Latitud de la ubicación
  lng: -58.3736 // Longitud de la ubicación
};

const apiKey = 'AIzaSyDzh7T8ZPq52K6fZnYl_kfymEaBZ3AwFPs';

const Map = () => {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;