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

interface LogisticsState {
    isLoading: boolean,
    showRequested: boolean,
    products: ProductInterface[],
    productsFiltered: ProductInterface[],
    showReport: boolean,
}

class Logistics extends React.Component<{}, LogisticsState> {

    query: string = "";

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showRequested: false,
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

    toggleRequested(e) {
        e.preventDefault();
        if (!this.state.showRequested) {
            let filteredProducts = this.state.products.filter((p) => {
                let activeRequested = p.requests.map(x => x.isActive ? x.amount : 0).reduce((a, b) => a + b, 0);
                p.activeRequested = activeRequested;
                return activeRequested > 0;
            });
            filteredProducts = filteredProducts.sort((a, b) => {
                if (a && b && b.activeRequested && a.activeRequested) {
                    return b.activeRequested - a.activeRequested;
                }
                return 0;
            });
            this.setState({
                productsFiltered: filteredProducts,
                showRequested: true,
            });
        } else {
            this.setState({
                productsFiltered: this.state.products,
                showRequested: false,
            });
        }
    }

    addInventory(result) {
        if (result?.data?.err === 0 && result.status === 200) {
            toast.success("added one item to quantity");
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
            toast.error("could not add inventory item");
        }
    }

    toggleReport() {
        this.setState({showReport: !this.state.showReport});
    }

    render() {
        return <div className="sales">
            <h2>Logistics</h2>
            <Loading isLoading={this.state.isLoading}>
                <div className="head-container">
                    <div>
                        <input onChange={(e) => this.search(e)} type="text" placeholder="Search... "/>
                    </div>
                    <div>
                        <button onClick={(e) => this.toggleRequested(e)}>Toggle requested</button>
                    </div>
                </div>
                <ToastContainer />
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
                        <Product type="logistics" key={product._id} data={product} addInventory={this.addInventory.bind(this)}/>)}
                    </tbody>
                </table>
                <br/>
                <br/>
                <button onClick={() => this.toggleReport()}>Inventory Report</button>
                <br/>
                <br/>
                {this.state.showReport ? <Graph title="Inventory Report - NOT IMPLEMENTED" s1="Inventory"/> : ''}
            </Loading>
        </div>;
    }
}

export default Logistics;
