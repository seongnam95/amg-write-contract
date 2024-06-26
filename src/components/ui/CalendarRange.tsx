'use client';

import { useEffect, useState } from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';

import { cn } from '@/lib/cn';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface CalendarRangeProps {
  className?: string;
  value?: DateRange | null;
  onChange?: (date: DateRange | null) => void;
}

const months = Array.from({ length: 13 }, (_, i) => addMonths(subMonths(new Date(), 1), i));

const CalendarRange = ({ className, value, onChange }: CalendarRangeProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value) {
      setStartDate(value.startDate);
      setEndDate(value.endDate);
    }
  }, [value]);

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      onChange?.(null);
    } else if (startDate && !endDate && date > startDate) {
      setEndDate(date);
      onChange?.({ startDate, endDate: date });
    }
  };

  const renderMonth = (month: Date) => {
    const days = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    return (
      <div key={month.toISOString()} className={cn('mb-8', className)}>
        <h3 className="mb-4 text-center text-lg font-semibold">
          {format(month, 'yyyy년 MMMM', { locale: ko })}
        </h3>

        <div className="grid grid-cols-7 gap-y-2">
          {days.map((day) => {
            const isToday = isSameDay(day, new Date());
            const isSelectedStart = startDate && isSameDay(day, startDate);
            const isSelectedEnd = endDate && isSameDay(day, endDate);
            const isInRange =
              startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'cursor-pointer rounded-md p-2 text-center transition-colors duration-150',
                  !isSameMonth(day, month) ? 'text-foreground-muted' : 'text-foreground',
                  isInRange && 'rounded-none bg-surface-accent text-secondary',
                  isSelectedStart && 'rounded-l-md',
                  isSelectedEnd && 'rounded-r-md',
                  (isSelectedStart || isSelectedEnd) &&
                    'bg-secondary font-semibold text-secondary-foreground',
                  isToday && 'font-bold',
                  !isInRange && !isSelectedStart && !isSelectedEnd && 'hover:bg-surface hover:text-secondary',
                )}
                onClick={() => handleDateClick(day)}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background px-5 py-4">
      <div className="grid grid-cols-7 gap-2 border-b border-border pb-3 text-center">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className={cn(
              'text-sm text-foreground-muted',
              day === '일' && 'text-[#F5A898]',
              day === '토' && 'text-[#8EC8F6]',
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="max-h-[400px] overflow-y-scroll py-6 scrollbar-hide">
        {months.map((month) => renderMonth(month))}
      </div>
    </div>
  );
};

export default CalendarRange;
