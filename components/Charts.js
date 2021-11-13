import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

const Charts = () => {
    const chartRef = useRef(null);
    const chartProperties = {
        width : 800,
        height : 700,
    }
    useEffect(() => {
        const chart = createChart(chartRef.current, chartProperties);
        const candleSeries = chart.addCandlestickSeries();
        fetch(`https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1d&limit=1000`).then(res => res.json()).then(data => {
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
    }, []);

    return (
        <div ref={chartRef} />
    );
}
 
export default Charts;