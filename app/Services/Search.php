<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Search
{
    protected $filtersCount = 0;

    public function __construct(protected Builder $query)
    {
        return $this;
    }

    public function setMultipleEqualityFilter(array $columns, $value)
    {
        if ($value) {
            $sql = '(';

            foreach ($columns as $key => $column) {
                if ($key == 0) {
                    $sql .= "$column LIKE \"%{$value}%\"";
                } else {
                    $sql .= " OR $column LIKE \"%{$value}%\"";
                }
            }
        
            $this->filtersCount++;

            $sql .= ')';
            $this->query = $this->query->whereRaw($sql);
        }

        return $this;
    }

    public function setMultipleOptionsFilter($column, array $values)
    {
        if (empty($values) === false) {
            $this->query = $this->query->whereIn($column, $values);

            $this->filtersCount++;
        }

        return $this;
    }

    public function setDateRangeFilter($column, $startDate, $endDate)
    {
        if($startDate == $endDate || is_null($startDate) || is_null($endDate)) {
            return $this;
        }

        $startDateCarbon = Carbon::parse($startDate)->startOfDay();
        $endDateCarbon = Carbon::parse($endDate)->endOfDay();

        $this->query = $this->query->whereBetween($column, [$startDateCarbon, $endDateCarbon]);

        $this->filtersCount++;

        return $this;
    }

    public function setAbsoluteRangeFilter($column, $start, $end)
    {
        if($start == $end || is_null($start) || is_null($end)) {
            return $this;
        }

        $this->query = $this->query->whereRaw("ABS($column) BETWEEN ? AND ?", [$start, $end]);

        $this->filtersCount++;

        return $this;
    }

    public function getQuery(): Builder
    {
        return $this->query;
    }
}
