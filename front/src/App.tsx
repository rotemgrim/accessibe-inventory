import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
} from "react-router-dom";

import Logistics from "./components/Logistics";
import Sales from "./components/Sales";
import logo from './logo.svg';
import './scss/main.scss';


class App extends Component<{}, {page: string}> {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>accessiBe - Inventory Management System</h1>
                </header>
                <div className="page-container">
                    <Router>
                        <nav>
                            <ul>
                                <li className="home">
                                    <Link to="/">Login</Link>
                                </li>
                                <li className="logistics">
                                    <Link to="/logistics">Logistics & Supplies</Link>
                                </li>
                                <li className="sales">
                                    <Link to="/sales">Sales & Marketing</Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="content">
                            <Switch>
                                <PrivateRoute path="/logistics">
                                    <Logistics/>
                                </PrivateRoute>
                                <PrivateRoute path="/sales">
                                    <Sales/>
                                </PrivateRoute>
                                <Route path="/">
                                    <div>
                                        <h2>Login</h2>
                                        <p>You must login before you can continue</p>
                                        <br/>
                                        <LoginPage/>
                                    </div>
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                </div>
                <footer>
                    Built by Rotem Grimberg
                </footer>
            </div>
        );
    }

}


// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) => {
                let allow = false;
                if (location.pathname === "/logistics" && fakeAuth.isLogistics) {
                    allow = true;
                    document.body.classList.add("logistics");
                    document.body.classList.remove("sales");
                    document.body.classList.remove("home");
                } else if (location.pathname === "/sales" && fakeAuth.isSales) {
                    allow = true;
                    document.body.classList.remove("logistics");
                    document.body.classList.add("sales");
                    document.body.classList.remove("home");
                }
                if (!allow) {
                    document.body.classList.remove("logistics");
                    document.body.classList.remove("sales");
                    document.body.classList.add("home");
                }
                return allow ? (children) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {from: location}
                        }}
                    />
                )
            }}
        />
    );
}

const fakeAuth = {
    isAuthenticated: false,
    isLogistics: false,
    isSales: false,

    authenticateLogistics(cb) {
        fakeAuth.isAuthenticated = true;
        fakeAuth.isLogistics = true;
        fakeAuth.isSales = false;
        setTimeout(cb, 100); // fake async
    },
    authenticateSales(cb) {
        fakeAuth.isAuthenticated = true;
        fakeAuth.isLogistics = false;
        fakeAuth.isSales = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        fakeAuth.isLogistics = false;
        fakeAuth.isSales = false;
        setTimeout(cb, 100);
    }
};

function LoginPage() {
    let history = useHistory();
    document.body.classList.remove("logistics");
    document.body.classList.remove("sales");
    document.body.classList.add("home");

    let loginAsLogistics = () => {
        fakeAuth.authenticateLogistics(() => {
            document.body.classList.add("logistics");
            document.body.classList.remove("sales");
            document.body.classList.remove("home");
            history.replace("/logistics");
        });
    };

    let loginAsSales = () => {
        fakeAuth.authenticateSales(() => {
            document.body.classList.remove("logistics");
            document.body.classList.add("sales");
            document.body.classList.remove("home");
            history.replace("/sales");
        });
    };

    return (
        <div>
            <button onClick={loginAsLogistics}>
                Login as Logistics
            </button>
            <br/><br/>
            <button onClick={loginAsSales}>
                Login as Sales
            </button>
        </div>
    );
}

export default App;
