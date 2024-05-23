"use client"
import { useEffect, useState } from 'react';
import StatusChart from './statusChart.js'
import ElectricityPrice from '@/eksperimenter/resultater/_components/electricityPrice.js';

export default function StatusCharts() {
    const [ measurements, setMeasurements ] = useState([])
    const [ powerUsage, setPowerUsage ] = useState([])
    const [ period, setPeriod ] = useState("week")

    useEffect(() => {

        fetch("http://localhost:8080/weekStatus")
        .then(res => res.json())
        .then(data => {

            let newMeasurements = data.measurementDTOList;

            newMeasurements = newMeasurements.filter((e,i) => i % 6 == 0)
            
            newMeasurements = newMeasurements.map(d => {
                let epoch = new Date(d["time"]);
                epoch = epoch.getTime();

                // Quick fix because the opcua server had some downtime.
                // Some values can be + 4.5
                const bigLaneIceTemp = d.bigLaneIceTemp > 0 ? d.bigLaneIceTemp * -1 : d.bigLaneIceTemp;
                const smallLaneIceTemp = d.smallLaneIceTemp > 0 ? d.smallLaneIceTemp * -1 : d.smallLaneIceTemp;

                return {...d, epoch: epoch, bigLaneIceTemp: bigLaneIceTemp, smallLaneIceTemp: smallLaneIceTemp}
            })
            
            setMeasurements(newMeasurements);
            let newPowerUsage = data.powerUsageDTOList;
            newPowerUsage = newPowerUsage.map(p => ({
                time: p.Start,
                epoch: new Date(p.Start).getTime(),
                powerUsage: p.Value,
                electricityPrice: p.electricityPrice
            }))

            setPowerUsage(newPowerUsage);
        })

    }, [])

    function handleChangePeriod(e) {
      setPeriod(e.target.value)
    }

    return (
<>
        <table className="w-full text-sm text-gray-500">
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
            <tr>
                <th>Velg periode</th>
                <td className="content-center" colSpan={3}>
                    <form className="flex space-x-6">
                        <label for="radio-week">Siste uke</label>
                        <input type="radio" id="radio-week" name="week" value="week" onChange={handleChangePeriod} defaultChecked/>
                        <label for="radio-day">Siste døgn</label>
                        <input type="radio" id="radio-day" name="week" value="day" onChange={handleChangePeriod}/>
                    </form>
                </td>
            </tr>
          
            </thead>
        </table>

        <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
          <tr>
            <th colSpan={2}>Istemperatur</th>
          </tr>
          <tr>
            <th>Venstre felt</th>
            <th>Høyre felt</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                <StatusChart period={period} measurements={measurements} measurementType="bigLaneIceTemp"/>
                </td>
                <td>
                <StatusChart period={period} measurements={measurements} measurementType="smallLaneIceTemp"/>
                </td>
            </tr>
        </tbody>
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
          <tr>
            <th colSpan={2}>Hall</th>
          </tr>
          <tr>
            <th>Temperatur</th>
            <th>Luftfuktighet</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                <StatusChart period={period} measurements={measurements} measurementType="hallTemp"/>
                </td>
                <td>
                <StatusChart period={period} measurements={measurements} measurementType="humidity"/>
                </td>
            </tr>
        </tbody>
        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
          <tr>
            <th colSpan={2}>Strøm</th>
          </tr>
          <tr>
            <th>Strømforbruk</th>
            <th>Pris</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                <StatusChart period={period} measurements={powerUsage} measurementType="powerUsage"/>
                </td>
                <td>
                <StatusChart period={period} measurements={powerUsage} measurementType="electricityPrice"/>
                </td>
            </tr>
        </tbody>
      </table>
      </>
    )

}