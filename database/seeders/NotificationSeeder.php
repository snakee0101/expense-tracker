<?php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\InboxMessage;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        User::all()->each(function ($user) {
            $user->notify(new InboxMessage('Account Security Update', 'Your password was successfully updated', "
            <p>Starting today, you can access these features through your Coinest dashboard. Here's what you can look forward to:</p>
            <ul>
                <li><b>Custom Budget Categories</b>: <i>Tailor your budget</i> to match your spending habits with customizable categories.</li>
                <li><b>Spending Alerts</b>: Set up alerts to notify you when you're close to reaching your budget limit in any category.</li>
                <li><b>Financial Health Score</b>: <span style='color: red'>Use our new tool to get</span> a snapshot of your financial health based on your income, expenses, and savings.</li>
            </ul>"));

            $user->notify(new InboxMessage('Successful transfer completed', 'Your transfer of $1000 to Sarah Connors is complete', "
            <p>Starting today, you can access these features through your Coinest dashboard. Here's what you can look forward to:</p>
            <ul>
                <li><b>Custom Budget Categories</b>: <i>Tailor your budget</i> to match your spending habits with customizable categories.</li>
                <li><b>Spending Alerts</b>: Set up alerts to notify you when you're close to reaching your budget limit in any category.</li>
                <li><b>Financial Health Score</b>: <span style='color: red'>Use our new tool to get</span> a snapshot of your financial health based on your income, expenses, and savings.</li>
            </ul>"));

            $user->notify(new InboxMessage('Payment received', 'You have received payment of $750 from Mike Johnson', "
            <p>Starting today, you can access these features through your Coinest dashboard. Here's what you can look forward to:</p>
            <ul>
                <li><b>Custom Budget Categories</b>: <i>Tailor your budget</i> to match your spending habits with customizable categories.</li>
                <li><b>Spending Alerts</b>: Set up alerts to notify you when you're close to reaching your budget limit in any category.</li>
                <li><b>Financial Health Score</b>: <span style='color: red'>Use our new tool to get</span> a snapshot of your financial health based on your income, expenses, and savings.</li>
            </ul>"));
        });
    }
}
