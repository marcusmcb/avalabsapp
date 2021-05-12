import React, { useEffect, useState } from 'react'

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
        <h5>
            {coinData.map((coin, i) => <p key={i}>{coin.name} | {coin.symbol.toUpperCase()} | {coin.market_cap_change_24h} 24h vol | {coin.current_price}</p>)}
        </h5>        
      )}      
    </div>
  )
}

export default Dashboard
