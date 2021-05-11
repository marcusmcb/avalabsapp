import React from 'react'

const getCoins = () => {    
        try {
            fetch('https://api.coingecko.com/api/v3/coins/list')
                .then((response) => response.json())
                .then((data) => console.log("DATA? * * * * * * ", data))
        } catch (err) {
            console.log(err)
        } 
}

getCoins()

const Dashboard = () => {
  return (
    <div>
      <h2>It Works</h2>
    </div>
  )
}

export default Dashboard
