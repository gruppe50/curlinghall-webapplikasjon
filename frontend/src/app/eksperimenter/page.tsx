'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddSharp } from "react-icons/io5";
import { fetchExperiments } from '@/_lib/api/eksperimenter';
import { Experiment } from '@/_lib/definitions';
import LoadingSpinner from '@/_components/loading-spinner.tsx/page';
import DeleteModal from '@/_components/modals/delete-modal';
import SaveModal from '@/_components/modals/save-modal';
import { TextArea, TextInput } from '@/_components/form-elements/text-inputs';
import { useModalContext } from '@/_lib/context/modal-context';

const Eksperimenter = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [newExperimentTitle, setNewExperimentTitle] = useState<string>('');
  const [newExperimentDescription, setNewExperimentDescription] = useState<string>('');
  const [experimentIdToDelete, setExperimentIdToDelete] = useState<number>(-1);

  const { isSaveModalOpen, setIsSaveModalOpen, isDeleteModalOpen, setIsDeleteModalOpen } = useModalContext();

  const toggleLagreModal = () => {
    setIsSaveModalOpen(!isSaveModalOpen);
  };
  const toggleDeleteModal = (idToDelete: Experiment['id']) => {
    isDeleteModalOpen 
      ? setExperimentIdToDelete(-1) 
      : setExperimentIdToDelete(idToDelete);

    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(event.target.value);
  };

  const resetNewExperimentInfo = () => {
    setNewExperimentTitle('');
    setNewExperimentDescription('');
  }

  const handleNewExperimentButton = async (title: Experiment['title'], description: Experiment['description']) => {
    const experimentData = {id: -1, title: title, description: description, tests: []};    
    try {
      const newExperiment = await saveNewExperiment(experimentData);
      router.push('/eksperimenter/rediger?id=' + newExperiment);
      return true;
    } catch (error) {
      console.error('Error saving new experiment:', error);
      return false;
    }
  };

  const saveNewExperiment = async (experiment: Experiment): Promise<string | undefined> => {
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
      }
  
      const data = await response.text();
      return data;
  
    } catch (error) {
      console.error('Error saving experiment:', error);
    }
  };

  useEffect(() => {
    const fetchExperimentData = async () => {
      try {
        const data = await fetchExperiments();
        if (Array.isArray(data)) {
          setExperiments(data);
        } else {
          setExperiments([data]);
        }

      } catch (error) {
        console.error('Error fetching experiments:');

      } finally {
        setIsLoading(false); 
      }
    };
    fetchExperimentData();
  }, []);

  const handleDeleteExperiment = async (idToDelete: number) => {
    try {
      const idString = idToDelete.toString();  // The backend expects a Long, not an integer.
      const response = await fetch(`http://localhost:8080/deleteExperiment?id=${idString}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete experiment');
      }
      setExperiments(prevExperiments => prevExperiments.filter(experiment => experiment.id !== idToDelete));
      console.log('Experiment deleted successfully');

    } catch (error) {
      console.error('Error deleting experiment:');
    }
  };

  return (
    <>
      {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <SaveModal
              heading="Nytt eksperiment"
              cancelFunction={() => resetNewExperimentInfo()}
              saveFunction={() => handleNewExperimentButton(newExperimentTitle, newExperimentDescription)}
            >
              <TextInput 
                label="Tittel"
                name="title"
                value={newExperimentTitle}
                updateEvent={handleInputChange(setNewExperimentTitle)}
              />
              <TextArea 
                label="Beskrivelse"
                name="description"
                value={newExperimentDescription}
                updateEvent={handleInputChange(setNewExperimentDescription)}
              />
            </SaveModal>
            
            {experiments.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-screen">
                  <p className="pb-4 text-gray-700 text-center leading-7">
                    <strong>Ingen eksperimenter funnet.</strong>
                  </p>
                  <button 
                    className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-3 rounded text-center flex items-center"
                    onClick={() => toggleLagreModal()}
                  >
                    <IoAddSharp size={25}/>
                    <span className='ml-2'>Nytt eksperiment</span>
                  </button>
                </div>
              ) : (
                <>
                  <DeleteModal 
                    whatToDelete="eksperimentet"
                    deleteFunction={() => handleDeleteExperiment(experimentIdToDelete)}
                    idToDelete={experimentIdToDelete}
                  />
                  <div className="relative overflow-x-auto">
                    <div className="w-full flex justify-between items-center mb-5">
                      <h2 className="ml-2 text-2xl font-bold leading-7 text-gray-900">Eksperimenter</h2>
                      <button
                        className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-2 rounded text-center flex items-center"
                        onClick={() => toggleLagreModal()}
                      >
                        <IoAddSharp size={22}/>
                        <span className="ml-1">Nytt eksperiment</span>
                      </button>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">Tittel</th>
                          <th className="px-6 py-3">Beskrivelse</th>
                          <th className="px-6 py-3">Har&nbsp;tester</th>
                          <th className="px-6 py-3">Handlinger</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiments.map((experiment: Experiment) => (
                          <tr key={experiment.id} className="bg-white border-b">
                            {experiment.title ? (
                              <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{experiment.title}</td>
                            ) : (
                              <td scope="row" className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">–</td>
                            )}
                            <td><span className="line-clamp-1">{experiment.description}</span></td>
                            <td className="text-center">{experiment.tests.length > 0 ? 'Ja' : 'Nei'}</td>
                            <td>
                              <span className="space-x-1 flex justify-center items-center">
                                <a 
                                  className="underline text-blue-600 hover:text-blue-800"
                                  href={`/eksperimenter/rediger?id=${experiment.id}`}
                                >
                                  Endre
                                </a>
                                <a 
                                  className="underline text-blue-600 hover:text-blue-800"
                                  href={`/eksperimenter/resultater?id=${experiment.id}`}
                                >
                                  Se resultater
                                </a>
                                <a
                                  className="underline text-red-600 hover:text-red-800 cursor-pointer"
                                  onClick={() => {toggleDeleteModal(experiment.id)}}
                                >
                                  Slett
                                </a>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            }
          </>
        )
      }
    </>
  );
};

export default Eksperimenter;