'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, AlertCircle } from 'lucide-react';

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

export default function CalendarGrid({ events }: { events: EventData[] }) {
  const [selectedDate, setSelectedDate] = useState('2026-04-01');

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

  // Grid for April 2026 (starting Sunday Mar 29)
  const gridCells = [
    { day: 29, isCurrentMonth: false, dateKey: '2026-03-29' },
    { day: 30, isCurrentMonth: false, dateKey: '2026-03-30' },
    { day: 31, isCurrentMonth: false, dateKey: '2026-03-31' },
    { day: 1, isCurrentMonth: true, dateKey: '2026-04-01' },
    { day: 2, isCurrentMonth: true, dateKey: '2026-04-02' },
    { day: 3, isCurrentMonth: true, dateKey: '2026-04-03' },
    { day: 4, isCurrentMonth: true, dateKey: '2026-04-04' },
    { day: 5, isCurrentMonth: true, dateKey: '2026-04-05' },
    { day: 6, isCurrentMonth: true, dateKey: '2026-04-06' },
    { day: 7, isCurrentMonth: true, dateKey: '2026-04-07' },
    { day: 8, isCurrentMonth: true, dateKey: '2026-04-08' },
    { day: 9, isCurrentMonth: true, dateKey: '2026-04-09' },
    { day: 10, isCurrentMonth: true, dateKey: '2026-04-10' },
    { day: 11, isCurrentMonth: true, dateKey: '2026-04-11' },
    { day: 12, isCurrentMonth: true, dateKey: '2026-04-12' },
    { day: 13, isCurrentMonth: true, dateKey: '2026-04-13' },
    { day: 14, isCurrentMonth: true, dateKey: '2026-04-14' },
    { day: 15, isCurrentMonth: true, dateKey: '2026-04-15' },
    { day: 16, isCurrentMonth: true, dateKey: '2026-04-16' },
    { day: 17, isCurrentMonth: true, dateKey: '2026-04-17' },
    { day: 18, isCurrentMonth: true, dateKey: '2026-04-18' },
    { day: 19, isCurrentMonth: true, dateKey: '2026-04-19' },
    { day: 20, isCurrentMonth: true, dateKey: '2026-04-20' },
    { day: 21, isCurrentMonth: true, dateKey: '2026-04-21' },
    { day: 22, isCurrentMonth: true, dateKey: '2026-04-22' },
    { day: 23, isCurrentMonth: true, dateKey: '2026-04-23' },
    { day: 24, isCurrentMonth: true, dateKey: '2026-04-24' },
    { day: 25, isCurrentMonth: true, dateKey: '2026-04-25' },
    { day: 26, isCurrentMonth: true, dateKey: '2026-04-26' },
    { day: 27, isCurrentMonth: true, dateKey: '2026-04-27' },
    { day: 28, isCurrentMonth: true, dateKey: '2026-04-28' },
    { day: 29, isCurrentMonth: true, dateKey: '2026-04-29' },
    { day: 30, isCurrentMonth: true, dateKey: '2026-04-30' },
    { day: 1, isCurrentMonth: false, dateKey: '2026-05-01' },
    { day: 2, isCurrentMonth: false, dateKey: '2026-05-02' },
  ];

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
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-on-surface line-clamp-2">{event.label}</h3>
                            {isReg && <AlertCircle className="w-3.5 h-3.5 text-error shrink-0" />}
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

        {/* Next Month Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1c4b44] to-[#0c2a25] rounded-[2rem] p-6 shadow-md text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
          <h3 className="text-lg font-light text-white/90 leading-tight">Next Month Campus</h3>
          <p className="text-[10px] text-white/50 tracking-widest uppercase mb-4 opacity-50 italic">Informational</p>
          <p className="text-[9px] text-white/60 leading-relaxed mb-6">
            May brings the blooming of local events and the transition into full academic activities. Stay tuned for details on the school boat competition and more.
          </p>
          <span className="text-[10px] uppercase font-bold text-white/80 block mb-1">Upcoming</span>
          <p className="text-sm font-bold text-white">May 2026 Focus</p>
        </div>
      </div>
    </div>
  );
}
