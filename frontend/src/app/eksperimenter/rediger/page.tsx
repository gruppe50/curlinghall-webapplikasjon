'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Experiment, Test, TestDate } from '@/_lib/definitions';

import { TextInput, TextArea } from '@/_components/form-elements/text-inputs';
import { DateInput, TimeInput } from '@/_components/form-elements/time-inputs';
import TemperatureInput from '@/_components/form-elements/temperature-input';
import LoadingSpinner from '@/_components/loading-spinner.tsx/page';
import SaveModal from '@/_components/modals/save-modal';
import EditModal from '@/_components/modals/edit-modal';
import { IoAddSharp, IoTrash } from 'react-icons/io5';
import { useModalContext } from '@/_lib/context/modal-context';
import { RiEditFill } from 'react-icons/ri';

type DraftTest = Omit<Test, 'id' | 'testDates'> 

const RedigerEksperiment = () => {

  const allowPastDates: boolean = true;  // Change this to true if you want to allow past dates, e.g. for testing.

  const params = useSearchParams();
  const { isSaveModalOpen, setIsSaveModalOpen, isEditModalOpen, setIsEditModalOpen } = useModalContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experiment, setExperiment] = useState<Experiment>({
    id:          -1,
    title:       '',
    description: '',
    tests:       [],
  });
  const [draftTest, setDraftTest] = useState<DraftTest>({
    title:          '',
    endTime:        '00:00:00',
    endTimeHours:   '00',
    endTimeMinutes: '00',
    instructions:   [
      {
        startTime:        '00:00:00',
        startTimeHours:   '00',
        startTimeMinutes: '00',
        iceTempBigLane:    0,
        iceTempSmallLane:  0,
        glycolTemp:        0,
      },
    ],
  });

  const [selectedTest, setSelectedTest] = useState<Test['id']>();
  const [selectedDate, setSelectedDate] = useState<Date | "">(new Date());
  const [tooLateToday, setTooLateToday] = useState<boolean>(false);
  const [allTestDates, setAllTestDates] = useState<TestDate[]>([]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = parseInt(event.target.value, 10);
    setSelectedTest(selected);
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setSelectedDate("");
    } else {
      setSelectedDate(new Date(event.target.value));
    }
  }

  useEffect(() => {
    const testObject = experiment.tests.find(test => test.id === selectedTest);
    if (selectedTest) {
      const startTime = testObject?.instructions[0].startTime;

      if (!startTime) {
        return;
      } else {
        const [hours, minutes, seconds] = startTime.split(':').map(Number);
        const timestamp = new Date().setHours(hours, minutes, seconds, 0);
        
        timestamp < new Date().getTime() 
          ? setTooLateToday(true) 
          : setTooLateToday(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTest, selectedDate]);

  const toggleLagreModal = () => {
    setIsSaveModalOpen(!isSaveModalOpen);
  };

  const toggleRedigerModal = (testId: Test['id'] | undefined) => {
    if (!testId) {
      return;
    }
    setDraftTest(prevDraftTest => {
      const updatedDraftTest = experiment.tests.find(test => test.id === testId);
      return updatedDraftTest || prevDraftTest;
    });
    setIsEditModalOpen(!isEditModalOpen);
  }
  
  const handleUpdateExperiment = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const {name, value} = event.target;
    setExperiment((prev) => ({...prev, [name] : value}));
  }

  const handleSaveExperiment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/experiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experiment),
      });
      if (!response.ok) {
        throw new Error('Failed to save experiment');
        // TODO: Provide feedback to the user that the experiment is saved if response.ok is true
      }
    } catch (error) {
      console.error('Error saving experiment:', error);
    }
  };

  const handleAddTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (draftTest.title.trim() === '') {
        throw new Error('Test title cannot be empty.');
      }
      if (experiment.tests.some(test => test.title === draftTest.title)) {
        throw new Error('A test with the same title already exists in the experiment.');
      }

      const response = await fetch('http://localhost:8080/test?id=' + params.get('id'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draftTest),
      });
      if (!response.ok) {
        throw new Error('Failed to add test.');
      }

      const data = await response.json();

      const newTest: Test = {
        ...draftTest,
        id: data,
        testDates: [],
      };

      setExperiment((prevExperiment) => ({
        ...prevExperiment,
        tests: [...prevExperiment.tests, newTest]
      }));

      setSelectedTest(data);

      setDraftTest({
        title: '',
        endTime: '00:00:00',
        endTimeHours: '00',
        endTimeMinutes: '00',
        instructions: [
          {
            startTime: '00:00:00',
            startTimeHours: '00',
            startTimeMinutes: '00',
            iceTempBigLane: 0,
            iceTempSmallLane: 0,
            glycolTemp: 0,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Error adding test:', error);
      return false;
    }
  };

  const handleEditTest = async (event: React.FormEvent<HTMLFormElement>, testId: Test['id'] | undefined) => {
    event.preventDefault();
    try {
      if (!testId) {
        throw new Error('No test selected.');
      }
      if (draftTest.title.trim() === '') {
        throw new Error('Test title cannot be empty.');
      }

      const testIndex = experiment.tests.findIndex(test => test.id === testId);

      const updatedTest: Test = {
        ...draftTest,
        id: testId,
        testDates: experiment.tests[testIndex].testDates,
      };
      const updatedTests: Test[] = [
        ...experiment.tests.slice(0, testIndex),
        updatedTest,
        ...experiment.tests.slice(testIndex + 1),
      ];
      const updatedExperiment: Experiment = {
        ...experiment,
        tests: updatedTests,
      };

      const response = await fetch('http://localhost:8080/experiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExperiment),
      });
      if (!response.ok) {
        throw new Error('Failed to save experiment');
        // TODO: Provide feedback to the user that the experiment is saved if response.ok is true
      }

      await fetchExperimentData();

      setDraftTest({
        title: '',
        endTime: '00:00:00',
        endTimeHours: '00',
        endTimeMinutes: '00',
        instructions: [
          {
            startTime: '00:00:00',
            startTimeHours: '00',
            startTimeMinutes: '00',
            iceTempBigLane: 0,
            iceTempSmallLane: 0,
            glycolTemp: 0,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Error editing test:', error);
      return false;
    }
  };

  const handleDeleteTest = async (testId: Test['id'] | undefined) => {
    try {
      if (!testId) {
        throw new Error('No test selected.');
      }

      const testIndex = experiment.tests.findIndex(test => test.id === testId);

      const updatedTests: Test[] = [
        ...experiment.tests.slice(0, testIndex),
        ...experiment.tests.slice(testIndex + 1),
      ];
      const updatedExperiment: Experiment = {
        ...experiment,
        tests: updatedTests,
      };
      const response = await fetch('http://localhost:8080/experiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExperiment),
      });
      if (!response.ok) {
        throw new Error('Failed to save experiment');
        // TODO: Provide feedback to the user that the experiment is saved if response.ok is true
      }

      await fetchExperimentData();

      setDraftTest({
        title: '',
        endTime: '00:00:00',
        endTimeHours: '00',
        endTimeMinutes: '00',
        instructions: [
          {
            startTime: '00:00:00',
            startTimeHours: '00',
            startTimeMinutes: '00',
            iceTempBigLane: 0,
            iceTempSmallLane: 0,
            glycolTemp: 0,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Error deleting test:', error);
      return false;
    }
  };

  const handleAddTestRun = async (testId: Test['id'] | undefined, date: Date | "", allowPastDate: boolean) => {
    
    let errorFlag: boolean = false;

    if (testId === undefined) {
      console.error('A test must be selected.');
      errorFlag = true;
    }
    if (date === "") {
      console.error('A valid date must be selected.');
      errorFlag = true;
    } else if (!allowPastDate && (tooLateToday 
      ? (date.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0))
      : (date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)))) {
      console.error('The start time cannot be in the past.');
      errorFlag = true;
    }
    if (errorFlag) {
      return;
    }
  
    try {
      // testId must be cast to number, since it can also be undefined. However, if it is
      // undefined, the function will have already returned, preventing any errors.
      testId = testId as number;
      date = new Date(date as Date);
      // Find the index of the test in the experiment.tests array:
      const testIndex = experiment.tests.findIndex(test => test.id === testId);
      
      if (testIndex === -1) {
        console.error('Test not found.');
        return;
      }

      const newTestDate: TestDate = {
        id: -1,
        date: date.toISOString().split('T')[0],
      };

      const isDuplicateDate = experiment.tests[testIndex].testDates.some(td => td.date === newTestDate.date);

      if (isDuplicateDate) {
        console.error('This test is already planned for this date.');
        return;
      }
      const updatedExperiment = {
        ...experiment,
        tests: experiment.tests.map((test, index) => {
          if (index === testIndex) {
            return {
              ...test,
              testDates: [...test.testDates, newTestDate],
            };
          }
          return test;
        }),
      };    
      const response = await fetch('http://localhost:8080/experiment?=' + params.get('id'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExperiment),
      });
      if (!response.ok) {
        throw new Error('Failed to add test run.');
      }
      await fetchExperimentData();

    } catch (error) {
      console.error('Error adding test run:', error);
    }
  };

  const handleDeleteTestRun = async (testDateId: TestDate['id']) => {
    const removeTestRun = (testDateId: TestDate['id']) => {
      const updatedExperiment = {
        ...experiment,
        tests: experiment.tests.map(test => ({
          ...test,
          testDates: test.testDates.filter(td => td.id !== testDateId),
        })),
      };
      return updatedExperiment;
    }
    try {
      const updatedExperiment = removeTestRun(testDateId);
      const response = await fetch('http://localhost:8080/experiment?=' + params.get('id'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExperiment),
      });

      if (!response.ok) {
      throw new Error('Failed to remove test run.');
      }
      await fetchExperimentData();
    } catch (error) {
      console.error('Error removing test run:', error);
    }
  };

  const handleUpdateDraftTest = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setDraftTest(prevDraftTest => {
        if (name === 'title') {
            return { ...prevDraftTest, [name]: value };
        } else if (name === 'endTimeHours') {
            return { ...prevDraftTest, [name]: value, endTime: `${value}:${prevDraftTest.endTimeMinutes}:00` };
        } else if (name === 'endTimeMinutes') {
            return { ...prevDraftTest, [name]: value, endTime: `${prevDraftTest.endTimeHours}:${value}:00` };
        } else {
            const updatedInstructions = prevDraftTest.instructions.map((instruction, index) => {
                if (name === `instructions[${index}].startTimeHours`) {
                    return { ...instruction, startTimeHours: value, startTime: `${value}:${instruction.startTimeMinutes}:00` };
                } else if (name === `instructions[${index}].startTimeMinutes`) {
                    return { ...instruction, startTimeMinutes: value, startTime: `${instruction.startTimeHours}:${value}:00` };
                } else if (name === `instructions[${index}].iceTempBigLane`) {
                    return { ...instruction, iceTempBigLane: parseFloat(value) };
                } else if (name === `instructions[${index}].iceTempSmallLane`) {
                  return { ...instruction, iceTempSmallLane: parseFloat(value) };
                } else if (name === `instructions[${index}].glycolTemp`) {
                    return { ...instruction, glycolTemp: parseFloat(value) };
                } else {
                    return instruction;
                }
            });
            return { ...prevDraftTest, instructions: updatedInstructions };
        }
    });
  };

  const resetDraftTest = () => {
    setDraftTest({
      title: '',
      endTime: '00:00:00',
      endTimeHours: '00',
      endTimeMinutes: '00',
      instructions: [
        {
          startTime: '00:00:00',
          startTimeHours: '00',
          startTimeMinutes: '00',
          iceTempBigLane: 0,
          iceTempSmallLane: 0,
          glycolTemp: 0,
        }
      ],
    });
  }

  const handleAddInstruction = () => {
    setDraftTest((prevDraftTest) => ({
      ...prevDraftTest,
      instructions: [
        ...prevDraftTest.instructions,
        {
          startTime: '00:00:00',
          startTimeHours: '00',
          startTimeMinutes: '00',
          iceTempBigLane: 0,
          iceTempSmallLane: 0,
          glycolTemp: 0,
        }
      ]
    }));
  }

  const handleDeleteInstruction = (index: number) => {
    setDraftTest((prevDraftTest) => {
      const updatedInstructions = [...prevDraftTest.instructions];
      updatedInstructions.splice(index, 1);
  
      return {
        ...prevDraftTest,
        instructions: updatedInstructions,
      };
    });
  };

  const fetchExperimentData = async () => {
    try {
      const response = await fetch('http://localhost:8080/experiment?id=' + params.get('id'));
      const data = await response.json();
      setExperiment(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching experiment:', error);
    }
  };

  useEffect(() => {
    fetchExperimentData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Flatten the testDates arrays from all tests into a single array
    const updatedTestDates = experiment.tests.flatMap(test => test.testDates);
    // Sort by date
    updatedTestDates.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
  });
    setAllTestDates(updatedTestDates);
  }, [experiment]);
  
  const uniqueEvents = experiment.tests
    .filter(e => e.testDates.length > 0)
    .flatMap(plannedTest =>
      plannedTest.testDates.map(date => ({
        ...plannedTest,
        date: date,
        id: plannedTest.id + "-" + new Date(date.date).getTime()
      }))
  );

  const fullCalendarEvents = uniqueEvents.map(plannedTest => {
    const title = plannedTest.title;
    const id = plannedTest.id;
    let startTime = new Date(plannedTest.date['date']);
    let endTime = new Date(plannedTest.date['date']);
  
    // Filter out the correct test, based on title.
    let testDefinition = experiment.tests.find(test => test.title === title);
  
    if (testDefinition) {
      const startTimeHours = parseInt(testDefinition.instructions[0].startTimeHours);
      const startTimeMinutes = parseInt(testDefinition.instructions[0].startTimeMinutes);
      const stopTimeHours = parseInt(testDefinition.endTimeHours);
      const stopTimeMinutes = parseInt(testDefinition.endTimeMinutes);
      
      startTime.setHours(startTimeHours);
      startTime.setMinutes(startTimeMinutes);
      endTime.setHours(stopTimeHours);
      endTime.setMinutes(stopTimeMinutes);
      
      // If endtime less than starttime, endtime is the next day. Does not account for multiple days.
      if (endTime < startTime) {
        endTime.setHours(endTime.getHours() + 24);
      }
    }
  
    return { id: id, title: title, start: startTime, end: endTime };
  });

  return (
    <>
      {isLoading ? ( <LoadingSpinner /> )
        : (
          <>
            <div className="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-6">
              <div className="w-full lg:w-2/5">
                <h2 className="mb-4 text-2xl font-bold leading-7 text-gray-900">Rediger eksperiment</h2>
                <form onSubmit={handleSaveExperiment} className="space-y-3">
                  <TextInput 
                    label="Tittel"
                    name="title"
                    value={experiment.title}
                    updateEvent={handleUpdateExperiment}
                  />
                  <TextArea 
                    label="Beskrivelse"
                    name="description"
                    value={experiment.description}
                    updateEvent={handleUpdateExperiment}
                  />
                  <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Lagre endringer
                  </button>    
                </form>
                <hr className="mt-4 mb-2" />

                <h2 className="mb-4 text-xl font-bold leading-7 text-gray-900">Legg inn tester</h2>

                <div className="flex flex-row items-center space-x-3 mb-4">
                  <select
                    value={selectedTest}
                    defaultValue={""}
                    onChange={(event) => handleSelectChange(event)}
                    className="flex-grow shadow border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >              
                    <option value="" disabled>
                      {experiment.tests.length > 0 ? 'Velg test' : 'Ingen tester funnet'}
                    </option>
                    {experiment.tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className={`${selectedTest === undefined ? "cursor-not-allowed bg-gray-300" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-2 rounded text-center flex items-center`}
                    onClick={() => toggleRedigerModal(selectedTest)}
                    disabled={selectedTest === undefined}
                  >
                    <RiEditFill size={21}/>
                    <span className="mx-1">Endre</span>
                  </button>
                  <button
                    className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-2 rounded text-center flex items-center"
                    onClick={() => toggleLagreModal()}
                  >
                    <IoAddSharp size={22}/>
                    <span className="mx-1">Ny&nbsp;test</span>
                  </button>
                </div>

                <div className="flex flex-row items-center space-x-3 mb-2">
                  <DateInput
                    value={selectedDate !== "" ? selectedDate.toISOString().split('T')[0] : ""}
                    allowPastDates={allowPastDates}
                    tooLateToday={tooLateToday}
                    label="Velg dato"
                    showLabel={false}
                    name="endTime"
                    updateEvent={(event) => handleDateChange(event)}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded text-center flex items-center"
                    onClick={() => handleAddTestRun(selectedTest, selectedDate, allowPastDates)}
                  >
                    <span className="mx-1">Legg&nbsp;til</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="mt-4 mb-4 min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planlagte tester</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dato</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allTestDates.map(testDate => (
                        <tr key={`${testDate.id}-${testDate.date}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {experiment.tests.find(test => test.testDates.some(td => td.id === testDate.id))?.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(testDate.date).toLocaleDateString(undefined, {
                              weekday: 'long', // Full weekday name (e.g., onsdag)
                              month: 'long',   // Full month name (e.g., april)
                              day: 'numeric',  // Numeric day of the month (e.g., 4.)
                              year: 'numeric', // Numeric year (e.g., 2024)
                            })}
                          </td>
                          <td>
                              <button
                              onClick={() => handleDeleteTestRun(testDate.id)}
                              type="button"
                              className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            > 
                              <IoTrash size={18}/>
                              <span className="sr-only">Avlys planlagt kjøring av test</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> 
              <hr className="my-4 lg:hidden" />
              <div className="w-full lg:w-3/5">
                <FullCalendar
                  plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  allDaySlot={false}
                  headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  height={"95vh"}
                  handleWindowResize={true}
                  events={fullCalendarEvents}
                  eventClick={() => {}}
                />
              </div>
            </div>

            <SaveModal
              heading="Definer ny test"
              cancelFunction={resetDraftTest}
              saveFunction={handleAddTest}
            >
              <div className="space-y-3">
                <TextInput 
                  label="Tittel"
                  name="title"
                  value={draftTest.title}
                  updateEvent={handleUpdateDraftTest}
                />
                <div className="flex space-x-4 justify-between">
                  <h3 className="text-md font-bold leading-7 text-gray-700">Instruksjoner:</h3>
                  <button
                    onClick={handleAddInstruction}
                    type="button"
                    className="bg-lime-400 hover:bg-lime-500 text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  > 
                    <IoAddSharp size={25}/>
                    <span className="sr-only">Ny instruksjon</span>
                  </button>
                </div>
                <hr />
                { /* TODO: Make scrollable if too many entries*/ } 
                {draftTest.instructions.map((instruction, index) => (
                  <div className="flex space-x-2" key={index}>
                    <div className="flex space-x-4">  
                      { draftTest.instructions.length > 1 && (
                          <span className="self-end mb-2.5 text-sm font-bold text-gray-500">{index+1}</span> 
                      )}                 
                      <div className="w-1/3">
                        <TimeInput
                          key={index}
                          label="Starttidspunkt"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].startTime`}
                          value={instruction.startTime}
                          updateEvent={handleUpdateDraftTest}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Is: stor bane"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].iceTempBigLane`}
                          value={instruction.iceTempBigLane}
                          updateEvent={handleUpdateDraftTest}
                          maxValue={0}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Is: liten bane"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].iceTempSmallLane`}
                          value={instruction.iceTempSmallLane}
                          updateEvent={handleUpdateDraftTest}
                          maxValue={0}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Glykoltemperatur"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].glycolTemp`}
                          value={instruction.glycolTemp}
                          updateEvent={handleUpdateDraftTest}
                        />
                      </div>
                    </div>
                    {draftTest.instructions.length > 1 && (
                      <div className="self-end mb-1">
                        <button
                          onClick={() => handleDeleteInstruction(index)}
                          type="button"
                          className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        > 
                          <IoTrash size={18}/>
                          <span className="sr-only">Slett instruksjon</span>
                        </button>
                      </div>
                    )} 
                  </div>
                ))}

                <hr />
                  <TimeInput
                    label="Sluttidspunkt"
                    showLabel={true}
                    name="endTime"
                    value={draftTest.endTime}
                    updateEvent={handleUpdateDraftTest}
                  />
              </div>
            </SaveModal>
            
            <EditModal
              heading="Endre test"
              cancelFunction={resetDraftTest}
              saveFunction={(event) => handleEditTest(event, selectedTest)}
              deleteFunction={() => handleDeleteTest(selectedTest)}
              idToDelete={selectedTest as number}
            >
              <div className="space-y-3">
                <TextInput 
                  label="Tittel"
                  name="title"
                  value={draftTest.title}
                  updateEvent={handleUpdateDraftTest}
                />
                <div className="flex space-x-4 justify-between">
                  <h3 className="text-md font-bold leading-7 text-gray-700">Instruksjoner:</h3>
                  <button
                    onClick={handleAddInstruction}
                    type="button"
                    className="bg-lime-400 hover:bg-lime-500 text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  > 
                    <IoAddSharp size={25}/>
                    <span className="sr-only">Ny instruksjon</span>
                  </button>
                </div>
                <hr />
                { /* TODO: Make scrollable if too many entries*/ } 
                {draftTest.instructions.map((instruction, index) => (
                  <div className="flex space-x-2" key={index}>
                    <div className="flex space-x-4">  
                      { draftTest.instructions.length > 1 && (
                          <span className="self-end mb-2.5 text-sm font-bold text-gray-500">{index+1}</span> 
                      )}                 
                      <div className="w-1/3">
                        <TimeInput
                          key={index}
                          label="Starttidspunkt"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].startTime`}
                          value={instruction.startTime}
                          updateEvent={handleUpdateDraftTest}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Is: stor bane"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].iceTempBigLane`}
                          value={instruction.iceTempBigLane}
                          updateEvent={handleUpdateDraftTest}
                          maxValue={0}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Is: liten bane"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].iceTempSmallLane`}
                          value={instruction.iceTempSmallLane}
                          updateEvent={handleUpdateDraftTest}
                          maxValue={0}
                        />
                      </div>
                      <div className="w-1/3">
                        <TemperatureInput 
                          label="Glykoltemperatur"
                          showLabel={index === 0 ? true : false}
                          name={`instructions[${index}].glycolTemp`}
                          value={instruction.glycolTemp}
                          updateEvent={handleUpdateDraftTest}
                        />
                      </div>
                    </div>
                    {draftTest.instructions.length > 1 && (
                      <div className="self-end mb-1">
                        <button
                          onClick={() => handleDeleteInstruction(index)}
                          type="button"
                          className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        > 
                          <IoTrash size={18}/>
                          <span className="sr-only">Slett instruksjon</span>
                        </button>
                      </div>
                    )} 
                  </div>
                ))}

                <hr />
                  <TimeInput
                    label="Sluttidspunkt"
                    showLabel={true}
                    name="endTime"
                    value={draftTest.endTime}
                    updateEvent={handleUpdateDraftTest}
                  />
              </div>
            </EditModal>
          </>
        )
      }
    </>
  );
};

export default RedigerEksperiment;