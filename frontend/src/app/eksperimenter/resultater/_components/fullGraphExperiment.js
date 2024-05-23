import { LineChart, Customized, Rectangle, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { createStartAndEndTime } from '../_assets/assets.js';

export default function FullGraphExperiment(props) {


    const COLORS = ["#54bad7", "#e06666", "#f1c232", "#98c2a7"]

    const testData = [
        {
            name: 1,
            Value: 10
        },
        {
            name: 2,
            Value: 12
        },
        {
            name: 3,
            Value: 11
        }
    ]


    // Needs array of all testruns.
    // {title: "Title of testrun", startTime: "", endTime: ""}

    // Get the minimum start time, get the maximum endtime

    let testRuns = []

    props.experiment.tests.forEach((test, index) => {
        test.testDates.forEach(testDate => {

            // Find starttime and endtime

            let [ startTime, endTime ] = createStartAndEndTime(testDate.date, test.startTime,test.endTime);

            testRuns.push({
                title: test.title,
                startHour: Math.abs(startTime.getTime() - props.experiment.startTime.getTime()) / (1000 * 3600),
                duration: Math.abs(endTime.getTime() - startTime.getTime()) / (1000 * 3600),
                color: COLORS[index]
            })
        })
    });


    let totalHoursExperimentPeriod = Math.abs(props.experiment.endTime.getTime() - props.experiment.startTime.getTime()) / (1000 * 3600)
    let tests = [...Array(totalHoursExperimentPeriod).keys()].map((e,i) => {hour: i})

    const customRectangle = (customprops) => {

        const { formattedGraphicalItems } = customprops;
        const series = formattedGraphicalItems;

     
        const hourWidth = customprops.xAxisMap[0].width / 134

        return testRuns.map((test,index) => <Rectangle x={5 + test.startHour * hourWidth} y={50} width={test.duration * hourWidth} height={50} fill={test.color} />)
    }

    const CustomizedTick = (tickProps) => {
        const { x, y, stroke, index, payload } = tickProps;
        let startDate = props.experiment.startTime   
        startDate.setHours(startDate.getHours() + payload.index);

      
        // <CustomizedAxisTick />

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={5} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(0)">
                {payload.index % 24 == 0 && startDate.getDate() + "." + startDate.getMonth()}
                </text>
          </g>
        )
    }
  
  
    return (
        <>
        <LineChart width={1300} height={150} data={tests}>
            <XAxis dataKey="hour" category="number" tick={<CustomizedTick />} />
            <Tooltip />
            <Customized component={customRectangle} />
        </LineChart>
        <div style={{display: "flex", marginTop: -50}}>
        {props.experiment.tests.map((test,index) => (
            <div style={{display: "flex", marginLeft: "2rem"}}>
                <div style={{width: 15,height: 15, backgroundColor: COLORS[index]}}> </div>
                <p>{test.title}</p>
            </div>
        ))}
        </div>
        </>
    )

}