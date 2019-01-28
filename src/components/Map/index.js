import React, {
    Component,
    Fragment
} from 'react';

import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getPixelSize } from '../../utils';
import Geocoder from 'react-native-geocoding';

import Search from './../Search';
import Directions from './../Directions';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import {
    Back,
    LocationBox,
    LocationText,
    LocationTimeBox,
    LocationTimeText,
    LocationTimeTextSmall
} from './styles';

import Details from '../Details';

Geocoder.init('AIzaSyDvwP-qqqRox-nKml20C6NB5reri9BfJK8');

export default class Map extends Component {

    state = {
        location: null,
        region: null,
        destination: null,
        duration: null
    };

    async componentDidMount() {

        this.watchID = navigator.geolocation.watchPosition(
            async (position) => {

                const response = await Geocoder.from({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });

                const address = response.results[0].formatted_address;
                const location = address.substring(0, address.indexOf(','));

                this.setState({
                    location,
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134
                    }
                });

            }, //sucesso
            (err) => { }, //erro
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000
            }
        );
    };

    /*async componentDidMount() {

        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {

                const response = await Geocoder.from({ latitude, longitude });
                const address = response.results[0].formatted_address;

                this.setState({
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0143,
                        longitudeDelta: 0.0134
                    }
                });

            }, //sucesso
            (err) => { console.warn(err) }, //erro
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000
            }
        );
    };*/

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    };

    handleLocationSelected = (data, { geometry }) => {
        const { location: {
            lat: latitude,
            lng: longitude
        } } = geometry;

        this.setState({
            destination: {
                latitude,
                longitude,
                title: data.structured_formatting.main_text,
            }
        });
    };

    handleBack = () => {
        this.setState({ destination: null });
    };

    render() {

        const { region, destination } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    region={region}
                    showsUserLocation
                    loadingEnabled
                    ref={el => this.mapView = el}
                >
                    {destination && (
                        <Fragment>
                            <Directions
                                origin={region}
                                destination={destination}
                                onReady={result => {
                                    this.setState({
                                        duration: Math.floor(result.duration)
                                    });
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: getPixelSize(50),
                                            left: getPixelSize(50),
                                            top: getPixelSize(50),
                                            bottom: getPixelSize(350),
                                        }
                                    })
                                }}
                            />
                            <Marker
                                coordinate={destination}
                                anchor={{
                                    x: 0,
                                    y: 0
                                }}
                                image={markerImage}
                            >

                                <LocationBox>
                                    <LocationText>{destination.title}</LocationText>
                                </LocationBox>

                            </Marker>

                            <Marker
                                coordinate={region}
                                anchor={{
                                    x: 0,
                                    y: 0
                                }}
                            >

                                <LocationBox>
                                    <LocationTimeBox>
                                        <LocationTimeText>{this.state.duration}</LocationTimeText>
                                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                                    </LocationTimeBox>
                                    <LocationText>{this.state.location}</LocationText>
                                </LocationBox>

                            </Marker>

                        </Fragment>
                    )}
                </MapView>

                {destination ? (
                    <Fragment>
                        <Back onPress={this.handleBack}>
                            <Image source={backImage} />
                        </Back>
                        <Details />
                    </Fragment>
                ) : (
                        <Search onLocationSelected={this.handleLocationSelected} />
                    )}

            </View >
        )
    }
}