import style from '../style.module.css'
import { daysHoursMinutesBetweenTimes, daysHoursMinutesToString } from '../_assets/assets';
export default function TestRunInfo(props) {

    let startTime = props.test.startTime;
    let endTime = props.test.endTime;
    let startDate = new Date(props.test.testDates[0].date);
    let endDate = new Date(props.test.testDates[0].date);

    
    let [ startTimeHours, startTimeMinutes, _startTimeSeconds ] = startTime.split(":").map(t => parseInt(t));
    let [ endTimeHours, endTimeMinutes, _endTimeSeconds ] = endTime.split(":").map(t => parseInt(t));

    // Check if endtime is on the next day

    if(endTimeHours < startTimeHours || (endTimeHours == startTimeHours && endTimeMinutes <= startTimeMinutes)) {
        // Add one day to the endDate
        endDate.setDate(endDate.getDate() + 1);
    }

    // Add time to the date
    startDate.setHours(startDate.getHours() + startTimeHours);
    startDate.setMinutes(startDate.getMinutes() + startTimeMinutes);
    endDate.setHours(endDate.getHours() + endTimeHours);
    endDate.setMinutes(endDate.getMinutes() + endTimeMinutes);

    // Add leading zeroes to time values
    startTimeHours = String(startTimeHours).padStart(2,'0');
    startTimeMinutes = String(startTimeMinutes).padStart(2,'0')
    endTimeHours = String(endTimeHours).padStart(2,'0');
    endTimeMinutes = String(endTimeMinutes).padStart(2,'0')

    let info = {
        startDateTime: startDate.getDate() + "." + startDate.getMonth() 
        +  "." + startDate.getFullYear() + " " + startTimeHours + ":" + startTimeMinutes,
        endDateTime: endDate.getDate() + "." + endDate.getMonth() 
        +  "." + endDate.getFullYear() + " " + endTimeHours + ":" + endTimeMinutes,
        testDuration: daysHoursMinutesToString(daysHoursMinutesBetweenTimes(startDate, endDate)),
        
    }

    return (
 
          <table style={{marginBottom: 50}} className="border-collapse border-b border-gray-400 text-sm text-center rtl:text-right text-gray-500">
              <tr><th colspan={2} className="border border-gray-400 bg-gray-300 py-2" >{props.test.title}</th></tr>
              <tr>
                  <th  className="border border-gray-400 bg-gray-300 py-2">Testkjøringer</th>
                  <td className='border border-gray-400 bg-gray-50' >{props.test.testDates.length}</td>
              </tr>
              <tr>
                  <th  width="50%" className="border border-gray-400 bg-gray-300 py-2">Tid pr test</th>
                  <td className='border border-gray-400 bg-gray-50' >{info.testDuration}</td>
              </tr>
              <tr>
                  <td colspan={2} className="border border-gray-400 bg-gray-300 py-2">Gjennomsnittverdier</td>
              </tr>

          </table>
 
    )

}