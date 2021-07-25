import { useEffect, useState } from "react"
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from "victory";

declare var electron: any;


export default function Dashboard() {
    const [gameData, setGameData] = useState<any>();
    const [graphArray, setGraphArray] = useState<Array<any>>();
    const [graphMax, setGraphMax] = useState<number>(0);
    const [graphDate, setGraphDate] = useState<number>(0);

    useEffect(() => {
        var data = electron.loadGameActivity((data: any) => {
            console.log(data);
            setGameData(data);
        })
    }, [])

    useEffect(() => {
        if (gameData) {
            var dateArray: any = [];
            gameData.activity.forEach((item: any) => {
                var day = new Date(item.startDate).getDate();
                var duration = item.endDate - item.startDate;
                if (day > graphDate) setGraphDate(day);
                if (duration > graphMax) setGraphMax(duration);
                if (dateArray[day]) {
                    dateArray[day].y += ((duration / 1000) / 60) / 60;
                } else {
                    dateArray[day] = { x: day, y: ((duration / 1000) / 60) / 60 };
                }
            })

            for (var i = 1; i < dateArray.length; i++) {
                if (!dateArray[i]) {
                    dateArray[i] = { x: i, y: 0 };
                }
            }
            setGraphArray(dateArray);
        }
    }, [gameData])

    return <div className="p-2" >
        <h1>Your current game activity</h1>
        <div className="btn-group" >
            <button className="btn btn-primary" >Weekly</button>
            <button className="btn btn-primary" >Monthly</button>
            <button className="btn btn-primary" >Yearly</button>
        </div>
        <div className="w-25 h-25" >
            <div className="pt-4" >
                <div className="text-center" >
                    Game Activity Graph
                </div>
                <VictoryChart>
                    <VictoryLine
                        style={{
                            data: { stroke: "#0d6efd" }
                        }}

                        data={graphArray}
                    />
                    <VictoryAxis domain={[1, graphDate]} style={{ tickLabels: { fill: "white" }, axis: { stroke: "white" }, axisLabel: { fill: "white" } }} label="Date" />
                    <VictoryAxis dependentAxis domain={[0, Math.ceil(graphMax / 1000 / 60 / 60 * 2) / 2]} style={{ tickLabels: { fill: "white" }, axis: { stroke: "white" }, axisLabel: { fill: "white" } }} label="Hours" />
                </VictoryChart>
            </div>
        </div>
    </div>
}