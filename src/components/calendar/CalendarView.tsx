'use client';
import { useState } from 'react';
import { CalendarEvent } from './TimelineView';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const getEventsForDate = (day: number) => {
    if (!day) return [];
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    return events.filter(event => {
      // Handle regular dates
      if (event.date === dateStr) return true;
      if (event.endDate) {
        const eventStart = new Date(event.date);
        const eventEnd = new Date(event.endDate);
        const current = new Date(dateStr);
        return current >= eventStart && current <= eventEnd;
      }
      
      // Handle semester schedule dates with timing descriptions
      if (event.isSemesterSchedule) {
        const eventDateMatch = event.date.match(/(\d{4})-(\d{2})-(.+)/);
        if (eventDateMatch) {
          const [, eventYear, eventMonth, timing] = eventDateMatch;
          if (parseInt(eventYear) === year && parseInt(eventMonth) === parseInt(month)) {
            // For semester schedule, show throughout the month
            return true;
          }
        }
      }
      
      return false;
    });
  };
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  
  const days = getDaysInMonth(currentDate);
  
  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold">
          {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "text-center text-sm font-bold py-2",
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-slate-600 dark:text-slate-400"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = day ? getEventsForDate(day) : [];
          const isToday = day === new Date().getDate() && 
                         currentDate.getMonth() === new Date().getMonth() && 
                         currentDate.getFullYear() === new Date().getFullYear();
          
          return (
            <div
              key={index}
              className={cn(
                "min-h-[80px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg",
                !day && "bg-slate-50 dark:bg-slate-800/50",
                isToday && "bg-accent/10 border-accent",
                day && !isToday && "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              {day && (
                <>
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    isToday ? "text-accent font-bold" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`text-xs p-1 rounded truncate ${
                          event.isSemesterSchedule
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:text-purple-300'
                            : 'bg-accent/20 text-accent dark:bg-accent/30'
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-slate-500">
                        +{dayEvents.length - 2}件
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
