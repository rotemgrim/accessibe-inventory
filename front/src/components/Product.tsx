import React from "react";
import ProductInterface from "../Models/ProductInterface";
import axios from "axios";
import {config} from "../config";
import UserRequestInterface from "../Models/UserRequestInterface";

export default class Product extends React.Component<any, any> {

    state: {
        product: ProductInterface;
        isLoading: boolean;
    };

    constructor(props) {
        super(props);
        this.state = {
            product: this.props.data,
            isLoading: false,
        };
    }

    innerAddRequest(e) {
        e.preventDefault();
        const isbn = this.state.product.isbn;
        const data: UserRequestInterface = {
            user: "rotem",
            amount: 1,
            isActive: true,
        };
        axios.put(`${config.backUrl}/api/products/add-request`, {
            isbn: isbn,
            pRequest: data,
        }).then(result => {
            console.log(result);
            if (result?.data?.err === 0) {
                const newProduct = result.data.payload as ProductInterface;
                this.setState({product: newProduct});
                this.props.addRequest(result);
            }
        }).catch(e => {
            console.error(e);
            this.props.addRequest(e);
        });
    }

    innerAddToInventory(e) {
        e.preventDefault();
        const isbn = this.state.product.isbn;
        const data: UserRequestInterface = {
            user: "rotem",
            amount: 1,
            isActive: true,
        };
        axios.put(`${config.backUrl}/api/products/add-to-inventory`, {
            isbn: isbn,
            pRequest: data,
        }).then(result => {
            console.log(result);
            if (result?.data?.err === 0) {
                const newProduct = result.data.payload as ProductInterface;
                this.setState({product: newProduct});
                this.props.addInventory(result);
            }
        }).catch(e => {
            console.error(e);
            this.props.addRequest(e);
        });
    }

    render() {
        if (this.props.type === "sales") {
            return <tr key={this.state.product._id}>
                <td>{this.state.product.isbn}</td>
                <td className="text-left">{this.state.product.name}</td>
                <td>{this.state.product.quantity}</td>
                <td>{this.state.product?.requests && this.state.product.requests.length > 0 ?
                    this.state.product.requests.map(x => x.isActive ? x.amount : 0).reduce((a, b) => a + b, 0) : "0"}</td>
                <td><button onClick={(e) => this.innerAddRequest(e)}>Request + </button></td>
            </tr>;
        } else {
            return <tr key={this.state.product._id}>
                <td>{this.state.product.isbn}</td>
                <td className="text-left">{this.state.product.name}</td>
                <td>{this.state.product.quantity}</td>
                <td>{this.state.product?.requests && this.state.product.requests.length > 0 ?
                    this.state.product.requests.map(x => x.isActive ? x.amount : 0).reduce((a, b) => a + b, 0) : "0"}</td>
                <td><button onClick={(e) => this.innerAddToInventory(e)}>Add to Inventory</button></td>
            </tr>;
        }
    }
}
