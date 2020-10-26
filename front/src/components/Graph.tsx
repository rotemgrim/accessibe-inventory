import React from "react";
import { Chart } from 'react-charts'
import CanvasJSReact from '../lib/canvasjs.react';
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class Graph extends React.Component<any, any> {

    options = {
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: this.props.title
        },
        axisX: {
            valueFormatString: "MMM YYYY"
        },
        axisY: {
            title: this.props.s1,
            includeZero: true,
            suffix: " "
        },
        data: [{
            type: "rangeColumn",
            indexLabel: "{y[#index]}",
            xValueFormatString: "MMM YYYY",
            toolTipContent: `<strong>{x}</strong></br> ${this.props.s1}: {y[1]}<br/> Demand: {y[0]}`,
            dataPoints: [
                { x: new Date("2017- 01- 01"), y: [29, 26] },
                { x: new Date("2017- 02- 01"), y: [19, 26] },
                { x: new Date("2017- 03- 01"), y: [18, 25] },
                { x: new Date("2017- 04- 01"), y: [15, 23] },
                { x: new Date("2017- 05- 01"), y: [12, 20] },
                { x: new Date("2017- 06- 01"), y: [10, 18] },
                { x: new Date("2017- 07- 01"), y: [8, 17] },
                { x: new Date("2017- 08- 01"), y: [9, 18] },
                { x: new Date("2017- 09- 01"), y: [12, 20] },
                { x: new Date("2017- 10- 01"), y: [14, 22] },
                { x: new Date("2017- 11- 01"), y: [16, 24] },
                { x: new Date("2017- 12- 01"), y: [18, 26] }
            ]
        }]
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    render() {
        return (
            <div style={{width: '100%', height: '400px'}}>
                <CanvasJSChart options={this.options}/>
            </div>
        );
    }
}

