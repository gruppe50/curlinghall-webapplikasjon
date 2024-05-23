import style from '../style.module.css'
export default function ElectricityPrice(props) {

  const totalPrices = props.test.testDates.map(testDate => {
    return {
      date: testDate.date,
      price: parseFloat(testDate.powerUsage.reduce((acc, curr) => (curr.electricityPrice * curr.value) + acc, 0).toFixed(2))
    };
  })

  
  return (
    <>
      <table style={{marginRight: 20}} className={style.table}>
        <thead>
          <tr>
            <th className={style.th}>Start dato</th>
            <th className={style.th}>Pris</th>
          </tr>
        </thead>
        <tbody>
          {totalPrices.map(e => (
            // eslint-disable-next-line react/jsx-key
            <tr>
              <td className={style.td}>{e.date}</td>
              <td className={style.td}>{e.price}</td>
            </tr>
          ))}
          <tr>
            <th className={style.td}>Total</th>
            <td className={style.td}>{totalPrices.reduce((acc,cur) => cur.price + acc,0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}