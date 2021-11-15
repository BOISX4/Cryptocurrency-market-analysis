import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
const MACD = require('technicalindicators').MACD;
const RSI = require('technicalindicators').RSI;
const EMA = require('technicalindicators').EMA;
const SMA = require('technicalindicators').SMA;

// export const getStaticProps = async() => {
//     const res = await fetch()
// }

async function asyncCall() {
    let data = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=100`)
    .then(res => res.json())
    .then(data => {
        const cdata = data.map(d => {
            return { 
                open : parseFloat(d[1]),
                high : parseFloat(d[2]),
                low : parseFloat(d[3]),
                close : parseFloat(d[4])}
        })
        let open = getData("open", cdata);
        let high = getData("high", cdata);
        let low = getData("low", cdata);
        let close = getData("close", cdata);
        let d = [open, high, low, close]
        return d;
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
    const macdInput = {
        values            : res[3],
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
        return {macd: last_macd_value.toFixed(2), score: -1};
    } else {
        return {macd: last_macd_value.toFixed(2), score: 1};
    }
}

function calculateRSI(res) {
    const inputRSI = {
        values: res[3],
        period: 14
    }
    const RSI_values = RSI.calculate(inputRSI);
    const last_value = (RSI_values[RSI_values.length -1]);
    if (last_value >= 70) {
        return {rsi: last_value, score: 1};
    } else if (last_value < 30) {
        return {rsi: last_value, score: -1};
    } else {
        return {rsi: last_value, score: 0};
    }
}

function calculateEMA(res) {
    let period = 8;
    let values = res[3];
    const EMA_values = EMA.calculate({period: period, values: values});
    const last_value = EMA_values[EMA_values.length - 1];
    return last_value.toFixed(2);
}

function calculateSMA(res) {
    let period = 8;
    let values = res[3];
    const SMA_values = SMA.calculate({period: period, values: values});
    const last_value = SMA_values[SMA_values.length - 1];
    return last_value.toFixed(2);
}

const TechAnalysis = () => {
    let data = asyncCall();
    data = data.then(res => {
        //console.log(res);
        const macd_result = calculateMACD(res);
        const rsi_result = calculateRSI(res);
        const ema_result = calculateEMA(res);
        const sma_result = calculateSMA(res);
        console.log({ macd_result }, { rsi_result }, ema_result, sma_result);
    });
    return (  
        <div>
            <h1>Technical Analysis</h1>
        </div>
    );
}
 
export default TechAnalysis;