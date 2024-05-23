"use client"
import { LineChart, Line,XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PureComponent } from 'react';

export default function StatusChart(props) {
  let {period, measurements, measurementType} = props;

  if(period == "day") {

    console.log(measurements)
    let date = new Date().getTime()
    let firstDay = date  - (1000 * 60 * 60 * 24)
    measurements = measurements.filter(d => d.epoch >= firstDay)

  }

  class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
          
      // payload.value is the epoch time
      // Convert it to minutes
      let days = (payload.value - firstDay) / (1000 * 60 * 60 * 24)
      
      let date = new Date(payload.value)

      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-30)">
            {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}
          </text>
        </g>
      );
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {

    if (active && payload && payload.length) {

      let date = new Date(label);

      label = date.getDate() + "/" + (date.getMonth() + 1 ) + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
        
      return (
        <div style={{backgroundColor: "white", padding: 10}}className="custom-tooltip">
          <p className="label">{label}:</p>
          <p>{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <LineChart width={400} height={200} data={measurements}>
        <CartesianGrid stroke="#ccc" />
        <XAxis  interval="preserveStartEnd" dataKey="epoch" category="number" tick={false}/>
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line dataKey={measurementType} strokeWidth="1.5" stroke="gray" dot={false}></Line>
      </LineChart>
    </>
  )
}