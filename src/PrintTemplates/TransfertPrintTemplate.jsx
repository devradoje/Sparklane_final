import React from "react";
import {  Row, Col, Label } from "reactstrap";
import DirectionMap from '../googlemap/DirectionMap';

class TransfertPrintTemplate extends React.Component {
  render() {
    return (
        <div style={{ width: "100%" }}>
            <Row>
                <Col xs={12} sm={12}>
                    <p >
                        tel : {this.props.phone}
                        {" | "} email : {this.props.email}
                    </p>
                </Col>
                <Col xs={12} sm={12}>
                <Label xs={12} sm={6}>
                    <i className="fa fa-clock-o" />
                    {" "}Pickup Time : {this.props.date1}
                        </Label>

                <Label  xs={12} sm={6}>
                    <i className="fa fa-clock-o" />
                    {" "}DropOff Time : {this.props.date2}
                    </Label>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12}>
                    <Label xs={12} sm={6}>
                        <i className="fa fa-map-marker text-danger" />
                        {" "}{this.props.addr1}
                        </Label>

                    <Label xs={12} sm={6}>
                        <i className="fa fa-map-marker text-success" />
                        {" "}{this.props.addr2}
                        </Label>
                </Col>
            </Row>

            <Row style={{ width: '100%', height: '300px' }} >
                <DirectionMap mapaddr1={this.props.addr1} mapaddr2={this.props.addr2} validData={ true } onError={() => {}} style={{ width:'100%', height:'100%' }} />
            </Row>
        </div>
    );
  }
}

export default TransfertPrintTemplate;