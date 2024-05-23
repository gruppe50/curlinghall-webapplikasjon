'use client';
import { useEffect } from 'react';
import useHallStatus from '@/_lib/api/hallstatus';
import StatusCharts from './components/statusCharts';

const Status = () => {

  const { hallStatus, fetchHallStatus } = useHallStatus();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Prevent useEffect from running on unmount
    let keepGoing: boolean = true;

    const fetchAndSetHallStatus = async () => {
      try {
        await fetchHallStatus();
      } catch (error) {
        console.error('Error fetching hall status:', error);
      } finally {
        if (keepGoing) {
          interval = setTimeout(fetchAndSetHallStatus, 10000);
        }
      }
    };

    fetchAndSetHallStatus();

    return () => {
      keepGoing = false;
      clearTimeout(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TableHeaders: string[] = ["Bane", "Sensor 1 (°C)", "Sensor 2 (°C)", "Gjennomsnitt (°C)"];
  const TableRows: { label: string; value1?: number, value2?: number, avg?: number }[] = [
    { label: "Stor bane (x4)",     value1: hallStatus.bigLaneMidTemp, value2: hallStatus.bigLaneEndTemp, avg: (hallStatus.bigLaneMidTemp + hallStatus.bigLaneEndTemp) / 2 },
    { label: "Liten bane (x2)",    value1: hallStatus.smallLaneMidTemp, value2: hallStatus.smallLaneEndTemp, avg: (hallStatus.smallLaneMidTemp + hallStatus.smallLaneEndTemp) / 2 },
  ];

  const TableHeaders2: string[] = ["Sensor", "Målt verdi"];
  const TableRows2: { label: string; value1?: number}[] = [
    { label: "Lufttemperatur hall (°C)", value1: hallStatus.hallTemp },
    { label: "Luftfuktighet i hall (%)", value1: hallStatus.hallHumidity }
  ]

  return (
    <div className="relative overflow-x-auto space-y-6">
      <div className="w-full items-center mb-5">
        <h2 className="ml-2 text-2xl font-bold leading-7 text-gray-900">Sanntidsstatus i hall</h2>
      </div>
      <hr />

      
      <h2 className="ml-2 text-xl font-bold leading-7 text-gray-900">Istemperatur</h2>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {TableHeaders.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TableRows.map((item, index) => (
            <tr key={index} className="bg-white border-b">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.label}
              </th>
              <td>{item.value1?.toFixed(3)}</td>
              <td>{item.value2?.toFixed(3)}</td>
              <td>{item.avg?.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="ml-2 text-xl font-bold leading-7 text-gray-900">Luftforhold i hall</h2>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {TableHeaders2.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TableRows2.map((item, index) => (
            <tr key={index} className="bg-white border-b">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.label}
              </th>
              <td>{item.value1?.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <StatusCharts />
    </div>
  );
};

export default Status;