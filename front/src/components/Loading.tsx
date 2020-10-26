import React from "react";

export default class Loading extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
       // console.log("prevProps", prevProps);
       // console.log("thisProps", this.props);
       // console.log("snapshot", snapshot);
    }

    render() {
        if (this.props.isLoading) {
            return <div>
                Loading...
            </div>;
        }
        return <div style={{width: "100%"}}>
            {this.props.children}
        </div>;
    }
}
