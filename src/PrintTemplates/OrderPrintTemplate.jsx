import React from "react";
import {  Row, Col, Label } from "reactstrap";
import ReactTable from "react-table";
import CommandServiceAPI from '../services/CommandEntity';    // import CommandService
import PropTypes from 'prop-types';

class OrderPrintTemplate extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            name: "",
            addr: "",
            sum: "",
            table_data: []
        }
        
        this.CommandService = new CommandServiceAPI(this);
    }

    componentDidMount() {
        this.getCommand(this.props.order_id);
    }

    getCommand(id) {
        this.CommandService.fetch(id)
            .then(data => {
                if (data.transferts !== undefined) {
                    data.transferts.sort(function(a, b){return a.id > b.id});
                    let price_sum = 0;
                    data.transferts.map((prop, key) => {
                        price_sum += prop.customer_price;
                        return prop.customer_price;
                    });
                    this.setState({
                        name: data.customer.contact,
                        addr: data.customer.adresse,
                        sum: price_sum,
                        table_data: data.transferts.map((prop, key) => {
                            return this.produceData(prop.id, prop.transport_fullname, prop.chauffeur.contact, prop.customer_price, prop.status);
                        })
                    });
                }
            });
    }

    produceData(id, contact, chauffeur, customer_price, status) {
        return {
            transfer: id,
            contact: contact,
            chauffeur: chauffeur,
            customer_price: customer_price,
            status: status
        };
    }

    render() {
        const columns = [
            {
                Header: "Transfer",
                accessor: "transfer"
            }, 
            {
                Header: "Contact",
                accessor: "contact",
            }, 
            {
                Header: "Chauffeur",
                accessor: "chauffeur",
            },  
            {
                Header: "Status",
                accessor: "status",
            }, 
            {
                Header: "Customer_price",
                accessor: "customer_price",
                style: { textAlign: 'right' }
            }];
        return (
            <div id="section-to-print" style={{ width: "100%", padding: 50 }}>
                <Row>
                    <Col md={6} style={{ textAlign: 'left' }}>
                        <Label style={{ textAlign: 'center' }}>SPARKLANE<br/>ORDER #{this.props.order_id}</Label>
                    </Col>
                    <Col md={6} style={{ textAlign: 'right' }}>
                        <Label style={{ textAlign: 'center' }}>{this.state.name}<br/>{this.state.addr}</Label>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ReactTable
                            data={this.state.table_data}
                            columns={columns}
                            showPagination={false}
                            sortable={false}
                            className="-striped -highlight"
                            pageSize={this.state.table_data.length}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Label md={12} style={{ textAlign: 'right' }}>Total : {this.state.sum}</Label>
                    </Col>
                </Row>
            </div>
        );
    }
}

OrderPrintTemplate.propTypes = {
    order_id: PropTypes.number
}

OrderPrintTemplate.defaultProps = {
    order_id: 0
}

export default OrderPrintTemplate;