import { Experiment } from '@/_lib/definitions';

const fetchExperiment = async (id: number): Promise<Experiment> => {
  const response = await fetch(`http://localhost:8080/findExperimentById?id=${id}`);
  const data = await response.json();
  return data;
};

const fetchExperimentList = async (): Promise<Experiment[]> => {
  const response = await fetch('http://localhost:8080/findAllExperiments');
  const data = await response.json();
  return data;
};

export const fetchExperiments = async (id?: Experiment['id']): Promise<Experiment| Experiment[]> => {
  if (id) {
    return fetchExperiment(id);
  } else {
    return fetchExperimentList();
  };
};