import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api'

const coinGeckoClient = new CoinGecko()

export default function Home(props) {

  // destructuring data
  const { data } = props.result
  // console.log(data)

  // function to format percentage
  const formatPercent = number => {
    const num = new Number(number);
    if (num >= 0) {
      return `+${num.toFixed(2)}%`
    } else {
      return `${num.toFixed(2)}%`
    }
  }

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
    <div>
      <Head>
        <title>Cryptly</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div className={styles.des}>
          <h1 className={styles.heading}>We are Cryptly</h1>
            <p className={styles.para}>
              We help you with technical analysis and chart viewing of any cryptocurrency
            </p>
        </div>
        <div className={styles.gif}>
          <img src="https://cdn.dribbble.com/users/24711/screenshots/4023317/media/c46113437c4a7e54e51f617f7e97d53e.gif" alt="a gif" width="600" height="450"/>
        </div>
      </div>

      <div className={styles.feargreed}>
        <img src="https://alternative.me/crypto/fear-and-greed-index.png" alt="Latest Crypto Fear & Greed Index" />
      </div>

      <h1 className={styles.title}>Top 50 Coins by Market Cap</h1>

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
    order: CoinGecko.ORDER.MARKET_CAP_DESC,
    per_page: 50,
  }

  // api call to coingecko-api with the above param
  const result = await coinGeckoClient.coins.markets(params)

  // return result in props object
  return {
    props: {
      result
    }
  }
}