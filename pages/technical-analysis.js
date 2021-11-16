import { set, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
const MACD = require('technicalindicators').MACD;
const RSI = require('technicalindicators').RSI;
const EMA = require('technicalindicators').EMA;
const SMA = require('technicalindicators').SMA;


async function asyncCall(pair) {
    let data = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=180`)
    .then(res => res.json())
    .then(data => {
        const cdata = data.map(d => {
            return { 
                close : parseFloat(d[4])}
            })
        return(getData("close", cdata));
    })
    .catch(err => console.log(err))
    return(data);
}

function getData(name, data) {
    let ldata = []
    for (let i = 0; i < data.length; i++) {
        ldata.push(data[i][name]);
    }
    return ldata;
}

function calculateMACD(res) {
    let id = 0;
    let key, score;
    const macdInput = {
        values            : res,
        fastPeriod        : 12,
        slowPeriod        : 26,
        signalPeriod      : 3 ,
        SimpleMAOscillator: false,
        SimpleMASignal    : false
    }
    const MACD_values = MACD.calculate(macdInput);
    const last_value = (MACD_values[MACD_values.length - 1]);
    const last_macd_value = last_value['MACD'];
    const last_signal_value = last_value['signal'];
    if (last_macd_value < last_signal_value) {
        key = last_macd_value.toFixed(2); 
        score = -1;
    } else {
        key = last_macd_value.toFixed(2), 
        score = 1;
    }
    return {
        id: id,
        key: key,
        score: score
    }
}

function calculateRSI(res) {
    let id = 1;
    let key, score;
    const inputRSI = {
        values: res,
        period: 14
    }
    const RSI_values = RSI.calculate(inputRSI);
    const last_value = (RSI_values[RSI_values.length -1]);
    if (last_value >= 70) {
        key = last_value
        score = 1
    } else if (last_value < 30) {
        key = last_value 
        score = -1
    } else {
        key = last_value
        score = 0
    }
    return {
        id: id,
        key: key,
        score: score
    }
}

function calculateEMA(res) {
    let id = 2;
    let key, score;
    let period = 8;
    let values = res;
    const EMA_values = EMA.calculate({period: period, values: values});
    const last_value = EMA_values[EMA_values.length - 1];
    return {
        id : id,
        key: last_value.toFixed(2), 
        score: 0
    };
}

function calculateSMA(res) {
    let id = 3;
    let key, score;
    let period = 8;
    let values = res;
    const SMA_values = SMA.calculate({period: period, values: values});
    const last_value = SMA_values[SMA_values.length - 1];
    return {
        id: id,
        key: last_value.toFixed(2), 
        score: 0
    };
}

async function BullorBear(data) {
    let score = 0;
    data.map(d => score += d.score);
    // console.log(score);
    return score;
}


const TechAnalysis = () => {
    const [pair, setPair] = useState('');
    const [result, setResult] = useState([]);
    const [analysis, setAnalysis] = useState('');
    const { register, handleSubmit } = useForm();

    // let cdata = asyncCall(pair);
    // cdata = cdata.then(res => {
    // //console.log(res);
    // const macd_result = calculateMACD(res);
    // const rsi_result = calculateRSI(res);
    // const ema_result = calculateEMA(res);
    // const sma_result = calculateSMA(res);
    // setResult([macd_result, rsi_result, ema_result, sma_result]);
    // });
    
    async function getValues(data) {
        let res = await asyncCall(data);
        //console.log(res);
        const macd_result = calculateMACD(res);
        const rsi_result = calculateRSI(res);
        const ema_result = calculateEMA(res);
        const sma_result = calculateSMA(res);
        //console.log(result); 
        setResult([macd_result, rsi_result, ema_result, sma_result]);
        setPair(data);       
        //console.log("working")
        let bullorbear = await BullorBear(result);
        if (bullorbear > 0) {
            setAnalysis("Bullish");
        } else if (bullorbear < 0) {
            setAnalysis("Bearish");
        } else {
            setAnalysis("Consolidation");
        }
    }

    const onSubmit = (data, e) => {
        getValues(data.pair);
    }
    const onError = (errors, e) => console.log(errors, e);
    
    console.log(analysis);
    //console.log(result);
    return (  
        <div>
            <h1>Technical Analysis</h1>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <label htmlFor="pair">Pair: </label>
                <input {...register("pair")} />
                <button type="submit">Search</button>
            </form>
            <table>
            <thead>
            <tr>
                <th>NAME</th>
                <th>INDICATOR</th>
                <th>MACD</th>
                <th>RSI</th>
                <th>EMA</th>
                <th>SMA</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    {pair}
                </td>
                <td>
                    {analysis}
                </td>
                {result.map(res => (
                <td key={res.id}>
                    {res.key}
                </td>
                ))}
            </tr>
            </tbody>
            </table>
        </div>
    );
}
 
export default TechAnalysis;

