import React, { Fragment, useEffect, useState } from 'react'
import Sparkline from 'react-sparkline-svg'

import './dashboard.css'

const Dashboard = () => {
  const [coinData, setCoinData] = useState({})
  const [isBusy, setBusy] = useState(true)
  const [didFail, setDidFail] = useState(false)

  const [q, setQ] = useState('')
  const [searchParam] = useState(['name', 'symbol'])

  useEffect(() => {
    const getCoins = async () => {
      try {
        let req = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=volume_desc&per_page=99&page=1&sparkline=true'
        )
        let response = await req.json()              
        return response
      } catch (err) {
        return err
      }
    }

    getCoins().then((data) => {
      if (data.error) {
        console.log(data.error)
        setCoinData(data)
        setDidFail(true)
        setBusy(false)
      } else {
        setCoinData(data)
        setTopTen(data)
        setBusy(false)
      }
    })
  }, [])

  function setTopTen(data) {
    let topTen = data.sort(function(a, b) {
      return a.price_change_percentage_24h < b.price_change_percentage_24h ? 1 : -1
    }).slice(0, 10)  
    console.log("TOP TEN", topTen)  
  }

  // logic to find token w/biggest 24 hour price gain
  let highestValue = 0;
  let highestValueData;
  for (let i = 0; i < coinData.length; i++) {
    let value = Number(coinData[i]['price_change_percentage_24h'])
    if (value > highestValue) {
      highestValue = value
      highestValueData = coinData[i]
    }
  }
  console.log(`Highest Value: ${highestValue}`)
  console.log("Highest Value Data", highestValueData)  

  // search form to filter results
  function search(coinData) {
    return coinData.filter((coin) => {
      return searchParam.some((newCoin) => {
        return (
          coin[newCoin].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        )
      })
    })
  }

  return (
    <div>
      {isBusy ? (
        <p className='loading-data'>Loading Coin Data...</p>
      ) : !isBusy && didFail ? (
        <p className='loading-data'>Error: {coinData.error}</p>
      ) : (
        <div>

          <form className='search-form'>
            {/* <p>Biggest Gainer: {highestValueData.name} {highestValue.toFixed(2)}%</p> */}
            <input
              type='search'
              name='search-form'
              id='search-form'              
              placeholder='Search Token Name/Symbol'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>

          {search(coinData).map((coin, i) => (
            <Fragment>
              <div className='dashboard-row' label={coin.name} key={i}>
                <span className='coin-image'>
                  {coin.image === 'missing_large.png' ? (
                    <p></p>
                  ) : (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width='20'
                      height='20'
                    />
                  )}
                </span>

                <span className='coin-name fade-in-text'>
                  <ul>
                    <li className='coin-conversion-label'>
                      {coin.symbol.toUpperCase()}-USD
                    </li>
                    <li className='coin-name-label'>{coin.name}</li>
                  </ul>
                </span>

                <span className='sparkline'>
                  <Sparkline
                    values={[...coin.sparkline_in_7d.price]}
                    height={50}
                    width={50}
                    stroke={coin.price_change_24h > 0 ? '#4DAB50' : '#E35406'}
                  />
                </span>

                <span className='coin-change fade-in-text'>
                  <ul>
                    <li className='coin-high-low'>
                      ${coin.price_change_24h.toFixed(2)}
                    </li>
                    <li className='coin-high-low-label'>24h change</li>
                  </ul>
                </span>

                <span className='coin-change fade-in-text'>
                  <ul>
                    <li className='coin-current-price'>
                      ${coin.current_price.toLocaleString()}
                    </li>
                    <li>
                      {coin.price_change_24h > 0 ? (
                        <span
                          className='coin-price-change'
                          style={{ color: '#4DAB50' }}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      ) : (
                        <span
                          className='coin-price-change'
                          style={{ color: '#E35406' }}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      )}
                    </li>
                  </ul>
                </span>
              </div>

              <div className='full-sparkline' key={i + Math.random()}>
                <li className='sparkline-data fade-in-text'>
                  <p className='sparkline-data-label'>Market Cap Change:</p>
                  {coin.market_cap_change_percentage_24h > 0 ? (
                    <p
                      className='sparkline-data-label'
                      style={{ color: '#4DAB50' }}
                    >
                      {coin.market_cap_change_percentage_24h.toFixed(2)}%
                    </p>
                  ) : (
                    <p
                      className='sparkline-data-label'
                      style={{ color: '#E35406' }}
                    >
                      {coin.market_cap_change_percentage_24h.toFixed(2)}%
                    </p>
                  )}
                </li>
                <Sparkline
                  values={[...coin.sparkline_in_7d.price]}
                  height={100}
                  width={100}
                  stroke={coin.price_change_24h > 0 ? '#4DAB50' : '#E35406'}
                />
                <li className='sparkline-data fade-in-text'>
                  <p>24h Low/High:</p>
                  <p>
                    ${coin.low_24h.toLocaleString()} / $
                    {coin.high_24h.toLocaleString()}
                  </p>
                </li>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
