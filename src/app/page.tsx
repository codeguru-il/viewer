"use client";

import HighchartsReact from "highcharts-react-official";
import {useEffect, useRef, useState} from "react";
import * as Highcharts from "highcharts";
import {convertScoresToData, CurrentScore, getTopGroups, GroupScore} from "@/utils/scores";


export default function Home() {
    const chartComponent = useRef(null);
    const [currentScore, setCurrentScore] = useState<CurrentScore>({battlesRun: 0, totalBattles: 1000, scores: []});

    useEffect(() => {
        setTimeout(async () => {
            const response = await fetch(process.env["AZURE_INSTANCE_LINK"]);
            const json = await response.json();
            const warResult = json.customStatus;

            if (typeof warResult == "string" || typeof warResult == "undefined" || warResult == null) return;

            const scores = [];

            for (const [group, score] of Object.entries(warResult.scores)) {
                scores.push({group, score});
            }

            const calculatedScore = {
                battlesRan: warResult.battlesRan,
                totalBattles: 100000,
                scores: scores,
            }

            setCurrentScore(calculatedScore);
        }, 2500)
    })

    const groupRows = [];
    for (const group of getTopGroups(currentScore, 100)) {
        groupRows.push(<>
            <tr>
                <th>{group.group}</th>
                <td className="ps-1">{group.score}</td>
            </tr>
        </>);
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-1 sm:p-1 font-[family-name:var(--font-space-mono)]">
            <p>Current battles: {currentScore.battlesRan} / {currentScore.totalBattles}</p>
            <main className="flex flex-row gap-2 row-start-2 items-center sm:items-start">
                <HighchartsReact ref={chartComponent} highcharts={Highcharts}
                                 options={getChartOptions(getTopGroups(currentScore))}>

                </HighchartsReact>
                <table>
                    <thead>
                    <tr>
                        <th>Group</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groupRows}
                    </tbody>
                </table>

            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <small>&copy; CodeGuru IL 2024</small>
            </footer>
        </div>
    );
}

const getChartOptions = (groupScores: GroupScore[]): Highcharts.Options => {
    return {
        chart: {
            type: "bar",
            animation: true,
            width: 1200,
            height: 800,
        },
        title: {
            text: 'CodeGuru Xtreme'
        },
        yAxis: {
            title: {
                text: 'Score'
            },
            enabled: false,
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category',
        },
        series: [
            {
                zoneAxis: "x",
                zones: [
                    {
                        value: 1,
                        color: "#FFD700"
                    },
                    {
                        value: 2,
                        color: "#C0C0C0"
                    },
                    {
                        value: 3,
                        color: "#cd7f32"
                    },
                    {
                        value: 10,
                        color: "#55FF77"
                    }
                ],
                dataLabels: {
                    enabled: true,
                    format: "{name}",
                    align: "right",
                    inside: true,
                    style: {
                        fontSize: "1.3em",
                        fontFamily: "Space Mono"
                    }
                },
                dataSorting: {
                    enabled: true,
                    matchByName: true,
                },
                data: convertScoresToData(groupScores),
                type: "bar"
            }
        ]
    }
};
