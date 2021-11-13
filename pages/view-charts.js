import dynamic from "next/dynamic"

const Chart = dynamic(() => import("../components/Charts"), {
    ssr: false
});
    
const ViewCharts = () => {
    return ( 
        <div>
            <h1>View Charts</h1>
            <Chart />
        </div>
    );
}

export default ViewCharts;
