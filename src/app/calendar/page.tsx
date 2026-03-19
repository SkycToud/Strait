import CalendarTabs from '@/components/calendar/CalendarTabs';
import calendarData from '@/data/calendar.json';

const transformedEvents = calendarData.events.map((event, index) => ({
  id: index,
  date: event.date || event.startDate || '',
  endDate: event.endDate,
  title: event.label,
  type: event.endDate ? '期間' : '単日',
  description: ''
}));

export default function CalendarPage() {
  return (
    <div className="space-y-6 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      <header className="mb-0 sm:mb-8 animate-fade-in p-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">学期予定</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">東京外国語大学の年間スケジュールカレンダーとタイムライン。</p>
      </header>
      <CalendarTabs events={transformedEvents} />
    </div>
  );
}
