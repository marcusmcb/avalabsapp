import React, { useEffect, useState } from 'react'
import Sparkline from 'react-sparkline-svg'
import './dashboard.css'

const Dashboard = () => {
  const [coinData, setCoinData] = useState({})
  const [isBusy, setBusy] = useState(true)

  useEffect(() => {
    const getCoins = async () => {
      try {
        let req = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=volume_desc&per_page=100&page=1&sparkline=true'
        )
        let response = await req.json()
        return response
      } catch (err) {
        console.log('COIN GECKO API ERROR: ', err)
      }
    }

    getCoins().then((data) => {
      setCoinData(data)
      setBusy(false)
    })
  }, [])

  console.log(coinData[1])

  return (
    <div>
      {isBusy ? (
        <p>Loading Coin Data...</p>
      ) : (
        <span>
          {coinData.map((coin, i) => (
            <p className='dashboard-element' key={i}>

              <span>
                {coin.name} ({coin.symbol.toUpperCase()}){' '}
              </span>

              <span>
                <Sparkline
                  values={[...coin.sparkline_in_7d.price]}
                  viewBoxHeight={30}
                  width={50}
                />
              </span>

              <span>(24h volume) | </span>

              <span>{coin.current_price.toFixed(2)} | </span>
              
              {coin.price_change_24h > 0 ? (
                <span style={{ color: 'green' }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              )}
            </p>
          ))}
        </span>
      )}
    </div>
  )
}

export default Dashboard
