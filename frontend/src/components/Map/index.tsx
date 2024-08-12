"use client";

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from './Map.module.css';

const mapContainerStyle = {
  height: "100%", // La altura ahora se manejará en el archivo CSS
  width: "100%", // La anchura ahora se manejará en el archivo CSS
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