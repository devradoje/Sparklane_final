import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';

var addr1 = "";
var addr2 = "";

class DistanceView extends Component {
    constructor(props) {
      super(props);
      this.state = {
          distance : 0,
          duration : 0
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
            var service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [this.props.mapaddr1],
                destinations: [this.props.mapaddr2],
                travelMode: window.google.maps.TravelMode.DRIVING,
                avoidHighways: false,
                avoidTolls: false,
                unitSystem: window.google.maps.UnitSystem.METRIC
            }, (response, status) => {
                if(status === "OK") {
                    if (response.rows[0].elements[0].status === "ZERO_RESULTS"){
            
                    } else if (response.rows[0].elements[0].status === "OK"){
                        var data = response.rows[0].elements[0];
                        this.setState({ distance: data.distance.value, duration: Math.round(data.duration.value/60) });
                    }
                } else {
                }
            }
            );
        }
    }

    render() {
        return (
            <div>
                <Label>{Math.round(this.state.distance/1000)}KM {Math.round(this.state.duration/60)}H {this.state.duration%60}mins</Label>
            </div>
        );
    }
}

DistanceView.propTypes = {
    mapAddr1: PropTypes.string,
    mapAddr2: PropTypes.string,
    ValidData: PropTypes.bool
}

DistanceView.defaultProps = {
    mapAddr1: "",
    mapAddr2: "",
    ValidData: false
}

export default DistanceView;