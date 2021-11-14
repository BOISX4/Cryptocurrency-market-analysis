import { createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Charts = () => {
    const chartRef = useRef(null);
    const chartProperties = {
        width : 800,
        height : 700,
    }
    const [pair, setPair] = useState('BTCUSDT');
    const { register, handleSubmit } = useForm();
    const onSubmit = (data, e) => {
        setPair(data.pair);
        console.log(data.pair, e);
    }
    const onError = (errors, e) => console.log(errors, e);
    

    useEffect(() => {
        //console.log("activates")
        const chart = createChart(chartRef.current, chartProperties);
        const candleSeries = chart.addCandlestickSeries();
        fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=1000`).then(res => res.json()).then(data => {
	    const cdata = data.map(d => {
		    return { 
                time : d[0]/1000,
                open : parseFloat(d[1]),
                high : parseFloat(d[2]),
                low : parseFloat(d[3]),
                close : parseFloat(d[4])}
	        })
	    candleSeries.setData(cdata);
        }).catch(err => console.log(err))
    }, [pair]);

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
            <label htmlFor="pair">Pair: </label>
            <input {...register("pair")} />
            <button type="submit">Submit</button>
        </form>
        <div ref={chartRef} /></>
    );
}
 
export default Charts;