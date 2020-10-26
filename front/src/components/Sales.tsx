import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import ProductInterface from "../Models/ProductInterface";
import Product from "./Product";
import AddNewProduct from "./AddNewProduct";
import score from '../utils/string-score';
import {config} from "../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Graph from "./Graph";

interface SalesState {
    isLoading: boolean,
    isAddNew: boolean,
    products: ProductInterface[],
    productsFiltered: ProductInterface[],
    showReport: boolean,
}

class Sales extends React.Component<{}, SalesState> {

    query: string = "";

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isAddNew: false,
            products: [],
            productsFiltered: [],
            showReport: false,
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.get(`${config.backUrl}/api/products`)
            .then(result => {
                console.log("result", result);
                if (result.data?.err === 0) {
                    this.setState({
                        isLoading: false,
                        products: result.data.payload,
                        productsFiltered: result.data.payload,
                    });
                } else {
                    this.setState({isLoading: false});
                }
            })
            .catch(e => {
                console.error(e);
                this.setState({isLoading: false});
            });
    }

    search(e) {
        e.preventDefault();
        this.query = e.target.value;
        this.searchQuery();
    }

    searchQuery() {
        if (this.query) {
            let filteredProducts = this.state.products.filter((p) => {
                const nameScore = score(p.name, this.query, 0.5);
                const isbnScore = score(p.isbn, this.query, 0.5);
                p.stringScore = nameScore > isbnScore ? nameScore : isbnScore;
                return p.stringScore > 0.3;
            });
            filteredProducts = filteredProducts.sort((a, b) => {
                if (a && b && b.stringScore && a.stringScore) {
                    return b.stringScore - a.stringScore;
                }
                return 0;
            });
            this.setState({
                productsFiltered: filteredProducts,
            })
        } else {
            this.setState({productsFiltered: this.state.products})
        }
    }

    toggleAddNew(e) {
        e.preventDefault();
        console.log(e);
        this.setState({isAddNew: !this.state.isAddNew});
    }

    createdHandler(result) {
        if (result?.data?.err === 0 && result.status === 201) {
            toast.success("created!");
            let newList = [...this.state.products, result.data.payload];
            this.setState({
                products: newList,
                productsFiltered: newList,
                isAddNew: false,
            });
        } else if (result?.response?.data) {
            toast.error(result.response.data.message);
        } else if (result instanceof Error) {
            toast.error(result.message)
        } else {
            toast.error("could not create product");
        }
    }

    addRequest(result) {
        if (result?.data?.err === 0 && result.status === 200) {
            toast.success("request added!");
            const newProduct = result.data.payload;
            let newProducts = this.state.products.map(x => {
                if (x.isbn === newProduct.isbn) {
                    x.requests = newProduct.requests;
                }
                return x;
            });
            this.setState({
                products: [...newProducts],
                productsFiltered: [...newProducts],
            });
            this.searchQuery();
        } else if (result?.response?.data) {
            toast.error(result.response.data.message);
        } else if (result instanceof Error) {
            toast.error(result.message)
        } else {
            toast.error("could not create product");
        }
    }

    toggleReport() {
        this.setState({showReport: !this.state.showReport});
    }

    render() {
        return <div className="sales">
            <h2>Sales</h2>
            <Loading isLoading={this.state.isLoading}>
                <div className="head-container">
                    <div>
                        <input onChange={(e) => this.search(e)} type="text" placeholder="Search... "/>
                    </div>
                    <div>
                        <button onClick={(e) => this.toggleAddNew(e)}>Add New Product +</button>
                    </div>
                </div>
                <ToastContainer />
                {this.state.isAddNew ? <AddNewProduct createHandler={this.createdHandler.bind(this)}/> : ''}
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">ISBN</th>
                        <th scope="col">Name</th>
                        <th scope="col">Available</th>
                        <th scope="col">Requested</th>
                        <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.productsFiltered.map(product =>
                        <Product type="sales" key={product._id} data={product} addRequest={this.addRequest.bind(this)}/>)}
                    </tbody>
                </table>
                <br/>
                <br/>
                <button onClick={() => this.toggleReport()}>Sales Report</button>
                <br/>
                <br/>
                {this.state.showReport ? <Graph title="Sales Report - NOT IMPLEMENTED" s1="Orders"/> : ''}
            </Loading>
        </div>;
    }
}

export default Sales;
