import { Card } from 'flowbite-react';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

function generateUniqueChartColors(count) {
    const colors = new Set();

    while (colors.size < count) {
        // Generate a color with distinct hue
        const hue = Math.floor((360 / count) * colors.size); // evenly spaced hue
        const saturation = 70 + Math.floor(Math.random() * 20); // 70–90%
        const lightness = 50 + Math.floor(Math.random() * 10); // 50–60%

        const color = hslToHex(hue, saturation, lightness);
        colors.add(color);
    }

    return Array.from(colors);
}

// Helper function to convert HSL to HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ExpenseBreakdown({breakdown}) {
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

    return (
        <Card href="#">
            <div className="flex justify-between">
                <h5 className="mr-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Expense Breakdown</h5>
                <p>filters</p>
            </div>

            <ResponsiveContainer height={500} width={600}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
                    <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                </RadialBarChart>
            </ResponsiveContainer>
        </Card>
    );
}
