'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle, CalendarPlus } from 'lucide-react';
import { buildGoogleCalendarUrl } from '@/lib/google-calendar';

interface EventData {
  date?: string;
  startDate?: string;
  endDate?: string;
  label: string;
  isSemesterSchedule?: boolean;
}

// Reuse logic from page.tsx (ideally these would be in a utils file)
const isRegistrationEvent = (label: string) => {
  return label.includes('履修') || label.includes('登録') || label.includes('抽選');
};

const getEventTheme = (event: EventData, index: number) => {
  if (isRegistrationEvent(event.label)) return 'registration';
  const colors = ['primary', 'tertiary', 'surface-dim'];
  return colors[index % 3];
};

const getThemeColorClass = (theme: string) => {
  switch (theme) {
    case 'registration': return 'bg-error';
    case 'tertiary': return 'bg-tertiary';
    case 'surface-dim': return 'bg-surface-dim';
    case 'primary':
    default: return 'bg-primary';
  }
};

const getThemeBorderClass = (theme: string) => {
  switch (theme) {
    case 'registration': return 'border-error';
    case 'tertiary': return 'border-tertiary';
    case 'surface-dim': return 'border-surface-dim';
    case 'primary':
    default: return 'border-primary';
  }
};

export default function CalendarGrid({ events, currentMonth }: { events: EventData[], currentMonth: Date }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const isSameMonth = 
      today.getFullYear() === currentMonth.getFullYear() && 
      today.getMonth() === currentMonth.getMonth();
    
    if (isSameMonth) {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  });

  // Reset selectedDate when month changes
  React.useEffect(() => {
    const today = new Date();
    const isSameMonth = 
      today.getFullYear() === currentMonth.getFullYear() && 
      today.getMonth() === currentMonth.getMonth();

    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    
    if (isSameMonth) {
      const day = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);
    } else {
      setSelectedDate(`${year}-${month}-01`);
    }
  }, [currentMonth]);

  // Helper to check if an event falls on a specific date string (YYYY-MM-DD)
  const getEventsForDate = (dateKey: string) => {
    return events.filter(event => {
      if (event.date === dateKey) return true;
      if (event.startDate && event.endDate) {
        return dateKey >= event.startDate && dateKey <= event.endDate;
      }
      return event.startDate === dateKey;
    });
  };

  // Dynamically generate grid cells for the current month
  const generateGridCells = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Day of the week of the first day (0-6)
    const startDayOfWeek = firstDayOfMonth.getDay();
    
    // Last day of the current month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    
    // Padding from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const cells = [];
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: false, dateKey });
    }
    
    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: true, dateKey });
    }
    
    // Padding from next month to fill the 7xN grid (usually 5 or 6 rows)
    const remainingCells = 42 - cells.length; // 6 rows * 7 days
    for (let d = 1; d <= remainingCells; d++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, isCurrentMonth: false, dateKey });
    }
    
    return cells;
  };

  const gridCells = generateGridCells();

  const getDayColor = (index: number) => {
    if (index % 7 === 0) return 'text-error';
    if (index % 7 === 6) return 'text-slate-600 dark:text-slate-400';
    return 'text-on-surface';
  };

  const selectedEvents = getEventsForDate(selectedDate);
  const formattedSelectedDate = selectedDate.split('-').map(s => parseInt(s, 10)).slice(1).join('/') + ' (Events)';

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 animate-fade-in">
      {/* Calendar Grid Box */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-outline-variant/10 p-8 pt-6 w-full min-h-[500px]">
        {/* Header Row */}
        <div className="grid grid-cols-7 mb-6 text-xs font-bold text-slate-500 uppercase">
          <div className="text-center text-error">SUN</div>
          <div className="text-center">MON</div>
          <div className="text-center">TUE</div>
          <div className="text-center">WED</div>
          <div className="text-center">THU</div>
          <div className="text-center">FRI</div>
          <div className="text-center">SAT</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
          {gridCells.map((cell, index) => {
            const isSelected = cell.dateKey === selectedDate;
            const dayEvents = getEventsForDate(cell.dateKey);
            const hasEvents = dayEvents.length > 0;
            
            return (
              <div 
                key={index} 
                onClick={() => setSelectedDate(cell.dateKey)}
                className={`relative h-24 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200
                  ${!cell.isCurrentMonth ? 'opacity-30' : 'hover:bg-surface'}
                  ${isSelected ? 'bg-primary/5 ring-1 ring-primary-container shadow-sm' : ''}
                  ${!isSelected && hasEvents && cell.isCurrentMonth ? 'bg-surface/30' : ''}
                `}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-primary' : getDayColor(index)}`}>
                  {cell.day}
                </span>
                
                {/* Dots inside the day cell */}
                <div className="flex flex-col gap-1 items-start mt-auto">
                    {dayEvents.slice(0, 3).map((ev, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${getThemeColorClass(getEventTheme(ev, i))}`} />
                    ))}
                    {dayEvents.length > 3 && (
                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0 space-y-6">
        
        {/* Selected Day Events */}
        <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm min-h-[200px]">
          <div className="flex items-center gap-2 text-primary font-bold mb-6">
            <CalendarIcon className="w-5 h-5" />
            <span className="text-lg">{formattedSelectedDate}</span>
          </div>
          
          <div className="space-y-6">
            {selectedEvents.length > 0 ? selectedEvents.map((event, i) => {
                const theme = getEventTheme(event, i);
                const isReg = isRegistrationEvent(event.label);
                return (
                    <div key={i} className={`relative pl-4 border-l-4 ${getThemeBorderClass(theme)}`}>
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-on-surface line-clamp-2 flex-1">{event.label}</h3>
                            {isReg && <AlertCircle className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                            <Clock className="w-3 h-3" />
                            <span>{event.startDate && event.endDate ? 'Period' : 'Day Event'}</span>
                            {event.isSemesterSchedule && (
                                <span className="flex items-center gap-1 ml-auto text-secondary font-bold">
                                    <MapPin className="w-2.5 h-2.5" /> TUFS
                                </span>
                            )}
                        </div>
                        {(() => {
                          const gcUrl = buildGoogleCalendarUrl(event);
                          return gcUrl ? (
                            <a
                              href={gcUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/70 transition-colors"
                            >
                              <CalendarPlus className="w-3 h-3" />
                              Googleカレンダーに追加
                            </a>
                          ) : null;
                        })()}
                    </div>
                );
            }) : (
                <p className="text-xs text-on-surface-variant italic">No events scheduled for this day.</p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/5">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Legend</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-on-surface">University Events</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="text-xs font-medium text-on-surface">Academic Orientations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-error" />
              <span className="text-xs font-medium text-on-surface">Registration Deadlines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-surface-dim" />
              <span className="text-xs font-medium text-on-surface">Examination Period</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
