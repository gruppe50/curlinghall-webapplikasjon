import style from '../style.module.css';
import  ResultChart  from './resultChart.js';
import ElectricityPrice from './electricityPrice';

export default function ResultTable(props) {

  const { experiment, resultType, title } = props;
  
  return (
    <div>
      <table  style={{width: 1400, marginBottom: 20}} className="border-collapse text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-800 uppercase bg-gray-200">
          <tr>
            <th colspan="100%" className="bg-gray-600 text-gray-200 px-6 py-3">{title}</th>
          </tr>
          <tr>
              {experiment.tests.map(test => (
                // eslint-disable-next-line react/jsx-key
                <th className="border-r border-gray-400 px-6 py-3">{test.title}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b">
            {experiment.tests.map(test => (
              resultType == "electricityPrice" ?
                // eslint-disable-next-line react/jsx-key
                <td className='border border-gray-400'><ElectricityPrice test={test} maxmin={experiment.maxmin}/></td>
                :
                // eslint-disable-next-line react/jsx-key
                <td className='border border-gray-400'><ResultChart resultType={resultType} test={test}  maxmin={experiment.maxmin}/></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}