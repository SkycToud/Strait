import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export type CalendarEvent = {
  id: number;
  date: string;
  endDate?: string;
  title: string;
  type: string;
  description: string;
};

export default function TimelineView({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="relative space-y-6 mt-6">
      {/* Vertical line connecting events */}
      <div className="absolute left-[23px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 to-purple-500/20" />
      
      {events.map((event, index) => (
        <div 
          key={event.id} 
          className="relative pl-14 animate-slide-up" 
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          {/* Timeline Dot */}
          <div className="absolute left-[17px] w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-background mt-1.5 shadow-sm" />
          
          <div className="glass-card p-5 group">
            <span className="text-sm font-bold text-accent mb-1.5 inline-block bg-accent/10 px-2.5 py-0.5 rounded-full">
              {format(parseISO(event.date), 'M月d日 (E)', { locale: ja })}
              {event.endDate && event.endDate !== event.date && ` - ${format(parseISO(event.endDate), 'M月d日 (E)', { locale: ja })}`}
            </span>
            <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">{event.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
