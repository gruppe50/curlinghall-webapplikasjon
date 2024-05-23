import { LineChart, Customized, Rectangle, Line,XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import style from '../style.module.css'

export default function ResultChart(props) {


  const color = ["red", "blue", "green"]

  // Power usage and the measurments from the hall have different time resoulutions.
  // It is handled differntly.

  let timeList = [];
  let testData = [];

  if(props.resultType == "powerUsage") {

    timeList = props.test.testDates[0].powerUsage.map(p => p.startTime.slice(0,5))
    testData = []
      
    timeList.forEach((clockTime, index) => {
      let newObj = {avg: 0};
      newObj.name = clockTime;
      props.test.testDates.forEach(test => {
        newObj[test.date] = test.powerUsage[index].value;
        newObj["avg"] += test.powerUsage[index].value
      })
      newObj["avg"] /= props.test.testDates.length;
      testData.push(newObj);  
      })
    } else {
      timeList = props.test.testDates[0].measurement.map(p => p.time.slice(0,5))
      console.log("Timelist: ")
      console.log(timeList)
      testData = []
      
      timeList.forEach((clockTime, index) => {
        let newObj = {avg: 0};
        newObj.name = clockTime;
        props.test.testDates.forEach(test => {
          try {
            newObj[test.date] = test.measurement[index][props.resultType];
            newObj["avg"] += test.measurement[index][props.resultType];
          } catch(err) {
            console.log("Crashed at index: " + index)
            console.log(test)
          }
        })  
        newObj["avg"] /= props.test.testDates.length;
        testData.push(newObj);    
      })    
    }

  return (
    <div className={style.resultchart_container}>
      <LineChart width={500} height={300} data={testData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" category="category" />
        <YAxis domain={[
          props.maxmin[props.resultType].min, props.maxmin[props.resultType].max]}
          tickFormatter={(tick) => tick.toFixed(3)}
        />
        <Tooltip />
        <Legend />
        {props.test.testDates.map((t, i) =>
          // eslint-disable-next-line react/jsx-key 
          <Line dataKey={t.date} stroke="#8899a5" dot={false}></Line>)}
        <Line dataKey="avg" strokeWidth="1.5" stroke="black" dot={false}></Line>
      </LineChart>
    </div>
  )
}