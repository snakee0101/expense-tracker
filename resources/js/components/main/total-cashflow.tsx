import { Card } from 'flowbite-react';
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';

export default function TotalCashflow({cashflow, header}) {
    console.log(cashflow);

    let data = [];

    for(let monthData of cashflow) {
        data.push({
            name: monthData.month,
            expense: monthData.expense,
            income: monthData.income,
        });
    }

    return (
        <Card>
            <div className="flex justify-between">
                <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{header}</h5>
                This year
            </div>

            <p>{data.length == 0 && 'No transactions for this period'}</p>

            <ResponsiveContainer height={500} width={600}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    stackOffset="sign"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="income" fill="#8884d8" stackId="stack" />
                    <Bar dataKey="expense" fill="#82ca9d" stackId="stack" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}
