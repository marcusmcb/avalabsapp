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
        <div>
          {coinData.map((coin, i) => (
            <div className='dashboard-row' key={i}>
              <span className='coin-image'>
                {coin.image === "missing_large.png" ? (<p></p>) : (<img src={coin.image} alt={coin.name} width='20' height='20' />)}
                
              </span>

              <span className='coin-name'>
                <ul>
                  <li>{coin.symbol.toUpperCase()}-USD</li>
                  <li className='coin-name-label'>{coin.name}</li>
                </ul>
              </span>

              <span className='sparkline'>
                <Sparkline
                  values={[...coin.sparkline_in_7d.price]}
                  viewBoxHeight={30}
                  width={50}
                  stroke={coin.price_change_24h > 0 ? '#4DAB50' : '#E35406'}
                />
              </span>

              <span>
                <ul>
                  <li>{coin.low_24h.toFixed(2)} / {coin.high_24h.toFixed(2)}</li>
                  <li className="coin-high-low">24 Hour Low / High</li>
                </ul>
              </span>

              <span>
                <ul>
                  <li>${coin.current_price.toFixed(2)}</li>
                  <li>
                    {coin.price_change_24h > 0 ? (
                      <span className="coin-price-change" style={{ color: '#4DAB50' }}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="coin-price-change" style={{ color: '#E35406' }}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    )}
                  </li>
                </ul>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
