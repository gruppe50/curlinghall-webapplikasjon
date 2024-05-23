"use client"
import style from './style.module.css';
import { useEffect, useState } from 'react';
import  TestRun  from './_components/resultChart.js';
import FullGraphExperiment from './_components/fullGraphExperiment';
import ElectricityPrice from './_components/electricityPrice';
import TestRunInfo from './_components/testRunInfo.js';
import { daysHoursMinutesBetweenTimes, daysHoursMinutesToString } from './_assets/assets';
import ResultTable from './_components/resultTable.js'

const Resultater = () => {
  const [ experiment, setExperiment ] = useState({
    title: "", 
    description: "", 
    startTime: new Date(), 
    endTime: new Date(), 
    startTimeString: "",
    endTimeString: "",
    duration: "", 
    maxmins: {},
    tests: []
  })
  
  useEffect(() => {
    
    setExperiment((prev) => ({...prev, title: "hello"}))
    
    fetch("http://localhost:8080/getResult?experimentID=1")
      .then(res => res.json())
      .then(data => {
        
        // Get lists of epoch-times for each testrun of each test.
        // Start times
        let startTimes = data.tests.map(test => {
          return test.testDates.map(testDate => new Date(testDate.date + "T" + test.startTime + "Z").getTime())
        }).flat(2);
        const startTime = new Date(Math.min(...startTimes));
        
        let endTimes = data.tests.map(test => {
          return test.testDates.map(testDate => {
            
            let date = new Date(testDate.date)
            let [ startTimeHours, startTimeMinutes, _startTimeSeconds ] = test.startTime.split(":").map(t => parseInt(t));
            let [ endTimeHours, endTimeMinutes, _endTimeSeconds ] = test.endTime.split(":").map(t => parseInt(t));
            
            // Check if endtime is on the next day                
            if(endTimeHours < startTimeHours || (endTimeHours == startTimeHours && endTimeMinutes <= startTimeMinutes)) {
              // Add one day to the endDate
              date.setDate(date.getDate() + 1);
            }
            
            date.setHours(date.getHours() + endTimeHours)
            date.setMinutes(date.getMinutes() + endTimeMinutes);
            return date.getTime()
          })
        }).flat(2);
        
        const endTime = new Date(Math.max(...endTimes));
            
        let experimentDuration = daysHoursMinutesToString(daysHoursMinutesBetweenTimes(startTime, endTime));
        let startTimeString = startTime.getDate() + "." + (startTime.getMonth() + 1) + "." + startTime.getFullYear();
        let endTimeString = endTime.getDate() + "." + (endTime.getMonth() + 1) + "." + endTime.getFullYear()
        
        // Calculate max / min values of the different result types
        let maxmins = {};
        maxmins.powerUsage = {}
        const powerUsages = data.tests.map(test => test.testDates.map(testDate => testDate.powerUsage.map(powerUsage => powerUsage.value))).flat(3);
        maxmins.powerUsage.max = parseFloat(Math.max(...powerUsages).toFixed(2))
        maxmins.powerUsage.min = parseFloat(Math.min(...powerUsages).toFixed(2))
        
        const resultTypes = ["bigLaneIceTemp", "smallLaneIceTemp", "hallTemp"]
        resultTypes.forEach(resultType => {
          let allValues = data.tests.map(test => test.testDates.map(testDate => testDate.measurement.map(measurement => measurement[resultType]))).flat(3);
          maxmins[resultType] = {
            max: parseFloat(Math.max(...allValues).toFixed(2)),
            min: parseFloat(Math.min(...allValues).toFixed(2)),
          }
        })
        
        console.log("maxmin: ")
        console.log(maxmins)
        
        setExperiment({
          ...data, 
          startTime: startTime,
          endTime: endTime,
          startTimeString: startTimeString,
          endTimeString: endTimeString,
          duration: experimentDuration,
          maxmin: maxmins
        })
      })
  }, [])
  
  return (
    <div className="content-container overflow-auto">
      <div style={{width: "fit-content"}}>
        <table style={{width: "100%"}} className="border-collapse border-b border-gray-400 text-sm text-center">
          <thead className="text-xs text-gray-800 uppercase bg-gray-400">
            <tr >
              <th className="bg-gray-600 text-gray-200  py-2" colspan={6}>Eksperiment rapport</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-800  bg-gray-400">
            <tr>
              <th className="border-b border-gray-400 bg-gray-300 py-2" colspan={2}>Tittel</th>
              <td colspan={4} className='border-b border-gray-400 bg-gray-50'>{experiment.title}</td>
            </tr>
            <tr>
              <th className="py-2 border-b border-gray-400 bg-gray-300" colspan={6}>Beskrivelse</th>
            </tr>
            <tr>
              <td className='border-b border-gray-400 bg-gray-50' colSpan={6}>
              <div className='py-10'>{experiment.description}</div></td>
            </tr>
            <tr>
              <th className="py-2 border-b border-gray-400 bg-gray-300">Fra</th>
              <td className='border-b border-gray-400 bg-gray-50'>17.02.2024</td>
              <th className="py-2 border-b border-gray-400 bg-gray-300">Til</th>
              <td className='border-b border-gray-400 bg-gray-50'>23.02.2024</td>
              <th className="py-2 border-b border-gray-400 bg-gray-300">Antall dager</th>
              <td className='border-b border-gray-400 bg-gray-50'>6</td>
            </tr>
            <tr>
              <th className="bg-gray-600 text-gray-200 py-2" colSpan={6}>Tester i eksperimentet</th>
            </tr>
          </tbody>
        </table>
        <div style={{display: "grid", gridAutoFlow: "column"}}>
          {
            experiment.tests.map(test => (
              <TestRunInfo key={test.id} test={test} />
            ))
          }
        </div>

        <ResultTable title="Strømbruk" resultType="powerUsage" experiment={experiment} />
        <ResultTable title="Strømpris" resultType="electricityPrice" experiment={experiment} />
        <ResultTable title="Istemperatur venstre felt" resultType="bigLaneIceTemp" experiment={experiment} />
        <ResultTable title="Istemperatur høyre felt" resultType="smallLaneIceTemp" experiment={experiment} />
        <ResultTable title="Temperatur i hall" resultType="hallTemp" experiment={experiment} />
      </div>
    </div>
  )
};

export default Resultater;