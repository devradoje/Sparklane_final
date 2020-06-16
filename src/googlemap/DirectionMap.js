import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from 'react-google-maps';

var addr1 = "";
var addr2 = "";

class DirectionMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.validData !== true)
      return false;
    return true;
  }

  componentDidMount() {
    addr1 = "";
    addr2 = "";
  }

  componentDidUpdate(nextProps, nextState) {
    if (addr1 !== this.props.mapaddr1 || addr2 !== this.props.mapaddr2) {
      addr1 = this.props.mapaddr1;
      addr2 = this.props.mapaddr2;
      const google = window.google;
      const DirectionsService = new google.maps.DirectionsService();
      DirectionsService.route({
        origin: this.props.mapaddr1,
        destination: this.props.mapaddr2,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          if (status === "NOT_FOUND")
            this.props.onError();
        }
      });
    }
  }

   render() {
    const defaultMapOptions = {
      fullscreenControl: false,
    };
   const GoogleMapDirection = (withGoogleMap(props => (
      <GoogleMap        
        center = {{ lat: 48.8566, lng: 2.3522 }}
        defaultZoom = { 13 }
        defaultOptions = {defaultMapOptions}
      >
        { this.state.directions && <DirectionsRenderer directions={this.state.directions}/>}
      </GoogleMap>
   )));
   return(  
      <div style={{ width: '100%', height: '100%' }}>
        <GoogleMapDirection
          style={{ width:'100%', height: '100%' }}
          containerElement={ <div style={{ height: '100%', width: '100%' }} /> }
          mapElement={ <div style={{ height: '100%', width: '100%' }} /> }
        />
      </div>
   );
   }
};

DirectionMap.propTypes = {
    mapAddr1: PropTypes.string,
    mapAddr2: PropTypes.string,
    ValidData: PropTypes.bool,
    onError: PropTypes.func.isRequired
}

DirectionMap.defaultProps = {
    mapAddr1: "",
    mapAddr2: "",
    ValidData: false
}

export default DirectionMap;