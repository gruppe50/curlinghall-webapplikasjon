'use client';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { Experiment } from '@/_lib/definitions';

const Kalender = () => {
  const [experiments, setExperiments] = useState<Experiment[] | null>(null)

  useEffect(() => {
    const fetchExperimentsData = async () => {
      try {
        const response = await fetch('http://localhost:8080/findAllExperiments');
        const data = await response.json();
        setExperiments(data);
      } catch (error) {
        console.error('Error fetching experiments:', error);
      }
    };
    fetchExperimentsData();
  }, []);

  const uniqueEvents = experiments?.flatMap(experiment =>
  experiment.tests
    .filter(test => test.testDates.length > 0) // Filter out tests with no dates
    .flatMap(test =>
      test.testDates.map(testDate => ({
        ...test, // Spread the test properties
        date: testDate, // Use the testDate object
        id: test.id + "-" + new Date(testDate.date).getTime() // Generate unique ID
      }))
    )
);


const fullCalendarEvents = uniqueEvents?.map(plannedTest => {
  const title = plannedTest.title;
  const id = plannedTest.id;
  const startTime = new Date(plannedTest.date.date);
  const endTime = new Date(plannedTest.date.date);

  let testDefinition = plannedTest;

  if (testDefinition) {
    const startTimeHours = parseInt(testDefinition.instructions[0].startTimeHours);
    const startTimeMinutes = parseInt(testDefinition.instructions[0].startTimeMinutes);
    const stopTimeHours = parseInt(testDefinition.endTimeHours);
    const stopTimeMinutes = parseInt(testDefinition.endTimeMinutes);
    
    startTime.setHours(startTime.getHours() - 1 + startTimeHours);
    startTime.setMinutes(startTime.getMinutes() + startTimeMinutes);
    endTime.setHours(endTime.getHours() - 1 + stopTimeHours);
    endTime.setMinutes(endTime.getMinutes() + stopTimeMinutes);
    
    if (endTime < startTime) {
      endTime.setHours(endTime.getHours() + 24);
    }
  }

  return { id: id, title: title, start: startTime, end: endTime };
});

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        allDaySlot={false}
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"95vh"}
        events={fullCalendarEvents || []} // Use empty array as fallback
        eventClick={() => {}}
      />
    </div>
  );
};

export default Kalender;