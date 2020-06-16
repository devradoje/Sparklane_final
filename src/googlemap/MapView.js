import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

class DirectionMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null
        }
    }
  
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.validData !== true)
            return false;
        return true;
    }

    componentDidMount() {
        this.address = "";
    }
  
    componentDidUpdate(nextProps, nextState) {
        if (this.address !== this.props.location) {
            this.address = this.props.location;
            const google = window.google;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': this.props.location}, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    var myLatLng = {lat: latitude, lng: longitude};
                    this.setState({ location: myLatLng });
                }  
            });
        }
    }

    render() {
        const defaultMapOptions = {
            fullscreenControl: false,
        };
        const GoogleMapView = (withGoogleMap(props => (
            <GoogleMap        
                defaultZoom={13}
                defaultOptions = {defaultMapOptions}
                defaultCenter={this.state.location}
            >
                { this.state.location && <Marker position={this.state.location} /> }
            </GoogleMap>
        )));
        return(  
            <div style={{ width: '100%', height: '100%' }}>
                <GoogleMapView
                    style={{ width:'100%', height: '100%' }}
                    containerElement={ <div style={{ height: '100%', width: '100%' }} /> }
                    mapElement={ <div style={{ height: '100%', width: '100%' }} /> }
                />
            </div>
        );
    }
};

DirectionMap.propTypes = {
    location: PropTypes.string,
    ValidData: PropTypes.bool
}

DirectionMap.defaultProps = {
    location: "",
    ValidData: false
}

export default DirectionMap;