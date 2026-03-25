'use client';
import { useState, useRef, useEffect } from 'react';
import { CalendarEvent } from './TimelineView';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [popoverEvents, setPopoverEvents] = useState<CalendarEvent[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  
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
          const [, eventYear, eventMonth] = eventDateMatch;
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
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length === 0) return;
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
      setPopoverEvents(dayEvents);
    }
  };

  // クリック外でポップオーバーを閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSelectedDay(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  
  const days = getDaysInMonth(currentDate);

  const formatEventDate = (event: CalendarEvent) => {
    try {
      const start = format(parseISO(event.date), 'M月d日(E)', { locale: ja });
      if (event.endDate && event.endDate !== event.date) {
        const end = format(parseISO(event.endDate), 'M月d日(E)', { locale: ja });
        return `${start} – ${end}`;
      }
      return start;
    } catch {
      return event.date;
    }
  };
  
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
          const isSelected = day === selectedDay;
          
          return (
            <div
              key={index}
              onClick={() => day && handleDayClick(day)}
              className={cn(
                "min-h-[80px] p-2 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors",
                !day && "bg-slate-50 dark:bg-slate-800/50",
                isToday && "bg-accent/10 border-accent",
                isSelected && "ring-2 ring-blue-400 border-blue-400",
                day && !isToday && !isSelected && "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                day && dayEvents.length > 0 && "cursor-pointer"
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

      {/* Popover for selected day */}
      {selectedDay !== null && popoverEvents.length > 0 && (
        <div
          ref={popoverRef}
          className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl p-4 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月{selectedDay}日の予定
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-3">
            {popoverEvents.map((event, i) => {
              const gcUrl = buildGoogleCalendarUrl(event);
              return (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold mb-0.5 ${
                      event.isSemesterSchedule ? 'text-purple-500' : 'text-accent'
                    }`}>
                      {event.isSemesterSchedule ? '時期未定' : formatEventDate(event)}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
                    )}
                  </div>
                  {gcUrl && (
                    <a
                      href={gcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      title="Googleカレンダーに追加"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
                      </svg>
                      追加
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
