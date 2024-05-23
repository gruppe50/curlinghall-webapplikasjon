
export function daysHoursMinutesBetweenTimes(t1, t2) {
  
  const MILLIS_DAY = 1000 * 3600 * 24 
  const MILLIS_HOUR = 1000 * 3600
  const MILLIS_MIN = 1000 * 60

  let dateTime1 = new Date(t1);
  let dateTime2 = new Date(t2);

  let timeDiff = Math.abs(dateTime2.getTime() - dateTime1.getTime());

  let days = Math.floor(timeDiff / MILLIS_DAY);
  timeDiff -= days * MILLIS_DAY;
  let hours = Math.floor(timeDiff / MILLIS_HOUR);
  timeDiff -= hours * MILLIS_HOUR;
  let minutes = Math.floor(timeDiff / MILLIS_MIN);

  return { days: days, hours: hours, minutes: minutes };
}

export function daysHoursMinutesToString(obj) {
  let out = ""

  let {days, hours, minutes } = obj;
  // 1 dag, 2 timer og 5 minutter
  if(days > 0) {
    out += days + " dag";
    if(days > 1)
      out += "er";

    if (hours > 0 && minutes > 0) {
      out += ", "
    } else if(hours > 0) {
      out += " og "
    }   
  }

  if(hours > 0) {
    out += hours + " time";
    if(hours > 1)
      out += "r";
    out += " ";

    if (days > 0 && minutes > 0) {
      out += " og "
    }
  }

  if(minutes > 0) {
    out += minutes + " minutt";
    if(minutes > 1) {
      out += "er";
    }
  }

  return out;
}

/*
    Helper function for creating date objects for startTime and endTime of a test.
    Adding a day to the endTime if the test is running over one day.
*/

export function createStartAndEndTime(date, startTime, endTime) {

  console.log("Date from create function: " + date)
  let [ startTimeHours, startTimeMinutes, _startTimeSeconds ] = startTime.split(":").map(t => parseInt(t));
  let [ endTimeHours, endTimeMinutes, _endTimeSeconds ] = endTime.split(":").map(t => parseInt(t));

  let startDate = new Date(date);
  let endDate = new Date(date);

  console.log("startdate and enddate from create function before: ")
  console.log("Startdate: " + startDate + " endDate: " + endDate)

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

  console.log("startdate and enddate from create function: ")
  console.log("Startdate: " + startDate + " endDate: " + endDate)

  return [ startDate, endDate ];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { daysHoursMinutesBetweenTimes, daysHoursMinutesToString, createStartAndEndTime }