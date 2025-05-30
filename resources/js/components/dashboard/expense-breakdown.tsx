import { Card, Select } from 'flowbite-react';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { getFilterFromDates, generateUniqueChartColors } from '@/lib/helpers';
import { handleSelectExpenseBreakdownFilter } from '@/components/dashboard/handle-select-expense-breakdown-filter';

export default function ExpenseBreakdown({breakdown, expenseBreakdownStartingDate, expenseBreakdownEndingDate}) {
    let data = [];
    let colors = generateUniqueChartColors(breakdown.length);

    for(let expense of breakdown) {
        data.push({
            name: `${expense.category.name} ($${expense.amount_spent ?? 0})`,
            value: expense.amount_spent * 100 ?? 0,
            fill: colors.pop()
        });
    }

    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };

    const selectedFilter = getFilterFromDates(expenseBreakdownStartingDate, expenseBreakdownEndingDate);

    return (
        <Card>
            <div className="flex justify-between">
                <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Expense Breakdown</h5>
                <Select id="expenseBreakdownFilters" onChange={(e) => handleSelectExpenseBreakdownFilter(e)} value={selectedFilter}>
                    <option value='this year'>This year</option>
                    <option value='these 6 months'>These 6 months</option>
                    <option value='this month'>This month</option>
                    <option value='this week'>This week</option>
                    <option value='this day'>This day</option>
                </Select>
            </div>

            <p>{breakdown.length == 0 && 'No transactions for this period'}</p>

            <ResponsiveContainer height={500} width={600}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                </RadialBarChart>
            </ResponsiveContainer>
        </Card>
    );
}
