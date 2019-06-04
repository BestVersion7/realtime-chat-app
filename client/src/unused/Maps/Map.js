import React, {useState} from 'react'
import {GoogleMap, withScriptjs, withGoogleMap, Marker} from 'react-google-maps'

const Map = () => {
    // http domain restricted
    const key = 'AIzaSyBma-80-HY_pUjP0AwuySeMvQDkYHUZSXw'
    return (
        <section className="container">
            <h4>Google Maps (Working on Places (for SearchBox) and Directions API </h4>
            <MapComponent 
                googleMapURL = {`//maps.googleapis.com/maps/api/js?key=${key}`}
                loadingElement = {<div className="loadingElement" />}
                mapElement = {<div className="mapElement" />}
                containerElement = {<div className="containerElement" />}
            />
            <br />
        </section>
    )
}

const MapComponent = withScriptjs(withGoogleMap(() => {
    // working on SearchBox
    const [coordinates, setCoordinates] = useState({lat: 42.361145, lng: -71.057083})
    return (
        <GoogleMap
            defaultZoom = {12}
            defaultCenter = {coordinates}
        >
            <Marker 
                position = {coordinates}
            />
        </GoogleMap>
    )   
}
))

export default Map