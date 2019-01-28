import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey='AIzaSyDvwP-qqqRox-nKml20C6NB5reri9BfJK8'
    strokeWidth={3}
    strokeColor='#222'
  />
);

export default Directions;
