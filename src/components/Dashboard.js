import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Sparkline from 'react-sparkline-svg'

import './dashboard.css'

const Dashboard = () => {
  const [coinData, setCoinData] = useState({})
  const [isBusy, setBusy] = useState(true)
  const [didFail, setDidFail] = useState(false)

  const [q, setQ] = useState('')
  const [searchParam] = useState(['name', 'symbol'])

  useEffect(() => {

    // helper method to remove null values from api response
    const swapValue = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (!obj[key]) {
          obj[key] = ' n/a '
        }
      })
      return obj
    }

    const getCoins = async () => {
      let tempCoinArray = []
      await axios
        .get(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=volume_desc&per_page=99&page=1&sparkline=true'
        )
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            let newCoin = swapValue(response.data[i])
            tempCoinArray.push(newCoin)
          }
        })
        .catch((error) => {
          console.log('ERROR: ', error.response.data) 
          tempCoinArray.push(error.response.data)         
        })
      return tempCoinArray
    }

    getCoins().then((data) => {            
      if (data[0].error) {        
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
    let topTen = data
      .sort(function (a, b) {
        return a.price_change_percentage_24h < b.price_change_percentage_24h
          ? 1
          : -1
      })
      .slice(0, 10)
    console.log('TOP TEN', topTen)
  }

  // logic to find token w/biggest 24 hour price gain
  let highestValue = 0
  let highestValueData
  for (let i = 0; i < coinData.length; i++) {
    let value = Number(coinData[i]['price_change_percentage_24h'])
    if (value > highestValue) {
      highestValue = value
      highestValueData = coinData[i]
    }
  }
  console.log(`Highest Value: ${highestValue}`)
  console.log('Highest Value Data', highestValueData)

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
        <p className='loading-data'>Hmmm... that didn't work. {coinData[0].error}</p>
      ) : (
        <div>
          <form className='search-form'>
            {/* <p>Biggest Gainer: {highestValueData.name} {highestValue}%</p> */}
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
            <Fragment key={i}>
              <div className='dashboard-row' label={coin.name}>
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
                    <li className='coin-high-low'>${coin.price_change_24h}</li>
                    <li className='coin-high-low-label'>24h change</li>
                  </ul>
                </span>

                <span className='coin-change fade-in-text'>
                  <ul>
                    <li className='coin-current-price'>
                      ${coin.current_price}
                    </li>
                    <li>
                      {coin.price_change_24h > 0 ? (
                        <span
                          className='coin-price-change'
                          style={{ color: '#4DAB50' }}
                        >
                          {coin.price_change_percentage_24h}%
                        </span>
                      ) : (
                        <span
                          className='coin-price-change'
                          style={{ color: '#E35406' }}
                        >
                          {coin.price_change_percentage_24h}%
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
                      {coin.market_cap_change_percentage_24h}%
                    </p>
                  ) : (
                    <p
                      className='sparkline-data-label'
                      style={{ color: '#E35406' }}
                    >
                      {coin.market_cap_change_percentage_24h}%
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
                    ${coin.low_24h} / ${coin.high_24h}
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

// FUTURE UX

// top 5 gainers row at top
// on tap/click the list scrolls to the corresponding token
// widens out to show extended view

export default Dashboard
