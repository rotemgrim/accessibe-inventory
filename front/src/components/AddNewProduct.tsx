import React from "react";
import ProductInterface from "../Models/ProductInterface";
import axios from "axios";
import { config } from "../config";
import Loading from "./Loading";


export default class AddNewProduct extends React.Component<any, any> {

    state: {
        isLoading: boolean,
        data: ProductInterface;
        createHandler: Function;
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: this.props.data,
            createHandler: this.props.createHandler,
        };
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {

    }

    async addProduct(e) {
        e.preventDefault();
        this.setState({isLoading: true});
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData) as {isbn: string, name: string};
        await axios.post(`${config.backUrl}/api/products`, data)
            .then(result => {
                this.state.createHandler(result);
            })
            .catch(e => {
                this.state.createHandler(e);
            });
    }

    render() {
        return <div className="add-new-product">
            <Loading isLoading={this.state.isLoading}>
            <form onSubmit={(e) => this.addProduct(e)}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">ISBN</label>
                    <input type="text"
                           className="form-control"
                           id="isbn"
                           name="isbn"
                           placeholder="ISBN (ex: NVIDIA-GTX-3080)" />
                        <small id="emailHelp" className="form-text text-muted">International Standard Book Number</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Product Name</label>
                    <input type="text"
                           className="form-control"
                           id="name"
                           name="name"
                           placeholder="Free text..." />
                </div>
                <button type="submit" className="btn btn-primary">Add product</button>
            </form>
            </Loading>
        </div>;
    }
}
