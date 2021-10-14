import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api'

const coinGeckoClient = new CoinGecko()

export default function Home(props) {

  // destructuring data
  const { data } = props.result
  console.log(data)

  // function to format percentage
  const formatPercent = number => 
    `${new Number(number).toFixed(2)}%`

  // function to format price into dollars 
  const formatPrice = (number, maximumSignificantDigits) => 
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'usd',
        maximumSignificantDigits
      }
    ).format(number)

  return (
    <div className={styles.main}>
      <Head>
        <title>Cryptly</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Top 100 Coins by Market Cap</h1>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>24H Change</th>
            <th>24H High</th>
            <th>24H Low</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {data.map(coin => (
            <tr key={coin.id}>
              <td>
                <span>
                  <img 
                  src={coin.image}
                  style={{width: 25, height: 25, marginRight: 10}}
                  />
                </span>
                {coin.symbol.toUpperCase()}
              </td>
              <td>
                {formatPrice(coin.current_price, 20)}
              </td>
              <td>
              <span
                  className={coin.price_change_percentage_24h > 0 ? (
                    'positive') : 'negative'}
                >
                {formatPercent(coin.price_change_percentage_24h)}
              </span>
              </td>
              <td>
                {formatPrice(coin.high_24h, 20)}
              </td>
              <td>
                {formatPrice(coin.low_24h, 20)}
              </td>
              <td>
                {formatPrice(coin.market_cap, 12)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


export async function getServerSideProps(context) {
  // parameter to get the top 100 coins with regards to martet cap
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  }

  // api call to coingecko-api with the above param
  const result = await coinGeckoClient.coins.markets({params})

  // return result in props object
  return {
    props: {
      result
    }
  }
}