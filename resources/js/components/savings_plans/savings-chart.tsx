import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SavingsChart({savingsChartData, selectedSavingsPlanId}) {
    let chartDataForCurrentSavingsPlan = Object.values(savingsChartData).filter(savingsChart => savingsChart.savings_plan_id == selectedSavingsPlanId);

    let processedChartData = [];

    for (let chartItem of chartDataForCurrentSavingsPlan ?? []) {
        processedChartData.push({
            name: chartItem.month,
            balance: chartItem.savings_plan_balance,
        });
    }

    return (
        <div className="mt-4 text-center">
            <h2 className="my-4 text-2xl font-bold">Savings plan balance change over this year</h2>

            {processedChartData.length > 0 ? (
                <ResponsiveContainer height={500} width={600} className="m-auto">
                    <LineChart
                        width={500}
                        height={300}
                        data={processedChartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" label={{ value: 'Month number', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>No savings yet</p>
            )}
        </div>
    );
}
