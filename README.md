# COINEST - Expense Tracker Software

![](/Screenshot.png)
COINEST is an educational project built with intention to learn React.


# Frameworks and libraries used

- Laravel 12.0 / PHP 8.2
- React 19.0 / InertiaJs 2.0
- maatwebsite/excel v3.1 - Excel Transaction Exports (requires additional linux packages that are installed automatically via Docker)
- MySQL
- axios - dynamic transaction retrieval, filtering and pagination
- dayjs - date formatting library
- flowbite-react - UI Component library
- react-date-range - dropdown that allows to select a date range (used in transaction filters)
- react-icons, lucide-react - icon libraries
- react-simple-wysiwyg - WYSIWYG editor for creating savings tips ("Savings Plans" page)
- recharts - React charts package - used to create income/expense and cashflow charts on Dashboard, Wallets, Cards and Savings Plans pages
- Tailwind

# Features

- **Dashboard** (set monthly spending limit, expense breakdown chart (by transaction categories), total cashflow chart (calculated using SQL CTEs to fill empty month gaps), Balance statistics for cards and wallets, Savings plan completion statistics, 5 recent transaction list, Income/Expense/Savings statistics for current month and relative gain (calculated using SQL WIndow Functions) compared to previous month)
- **Transactions** (Columns - transactions name, source and destination accounts, date&time of transaction, amount of money transferred, additinal notes, status, attachments. Features - permanent deletion of transaction, cancellation of transaction, transaction search&filtering with ability to export to Excel)
- **Payments** (creating and editing Payment templates/Payment categories, making payments, viewing recent transactions for current payment)
- Transaction categories (creating and editing)
- **Wallets** (creating and editing wallets, adding income/expense transactions, viewing cashflow chart for current wallet within current year)
- **Cards** (same as Wallets, but adding a transaction is not allowed if the card is expired)
- **Savings Plans** (creating and editing plans, Savings tips are created using WYSIWYG-editor, top row with total savings (monthly diff is calculated using SQL Window Functions) and total target statistics. Main properties of savings plan - due date, target amount. Features - adding a transaction for current savings plan with amount that can't exceed highest or lowest limit of this savings plan, recent transactions list)
- **Transfers** (creating and editing Contacts who you can transfer money to, creating transfer for specific contact, list of recent transfers for current contact)
- **Inbox** (reading emails(notifications) sent by admins - INCOMPLETE FEATURE)
- **Recurring Payments** - recurring payments on a specific day of each month 

# Login credentials

Email: test@example.com
Password: 12345

# How to run

1. run this command from project directory: 

`sudo docker compose up --build`

2. after starting the application run these commands (get id of the expense-tracker-app container through docker ps):

`sudo docker exec -it container-id-of-expense-tracker-app-container php artisan migrate:fresh --seed`
`sudo docker exec -it container-id-of-expense-tracker-app-container php artisan storage:link`

3. Site is accessible at http://127.0.0.1:8000/

# Author
Danil Lebediantsev, snakee0101@gmail.com