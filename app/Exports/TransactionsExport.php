<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class TransactionsExport implements FromCollection, WithColumnFormatting, WithHeadings
{
    public function __construct(protected Collection $data)
    {
    }

    public function headings(): array
    {
        return ['Transaction Name', 'Transaction Category', 'Source', 'Destination', 'Date & Time', 'Amount ($)', 'Note', 'Status'];
    }

    public function collection()
    {
        return $this->data->map(function (Transaction $transaction) {
            return [
                $transaction->name,
                $transaction->category->name,
                $transaction->source ? "{$transaction->source?->typeName} {$transaction->source?->name}" : null,
                $transaction->destination ? "{$transaction->destination?->typeName} {$transaction->destination?->name}" : null,
                Date::dateTimeToExcel($transaction->date),
                $transaction->amount,
                $transaction->note,
                $transaction->status->label()
            ];
        });
    }

    public function columnFormats(): array
    {
        return [
            'E' => NumberFormat::FORMAT_DATE_DATETIME
        ];
    }
}
