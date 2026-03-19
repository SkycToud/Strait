import Link from 'next/link';
import { ArrowRight, CalendarDays, Building2, ExternalLink } from 'lucide-react';
import calendarData from '@/data/calendar.json';
import facilityData from '@/data/facilities.json';
import FacilityStatusCard from '@/components/facilities/FacilityStatusCard';

export default function Home() {
  const rawEvent = calendarData.events[0];
  const nextEvent = {
    title: rawEvent.label,
    date: rawEvent.date || rawEvent.startDate || '',
  }; // Simplified for dashboard
  const topFacilities = facilityData.slice(0, 2);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-bold mb-4 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Phase 1 稼働中
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          あなたの<span className="text-gradient">大学生活</span>の<br className="hidden sm:block" />要所となる。
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg pt-4">
          Straitは東京外国語大学の学生向け情報プラットフォームです。学期予定や施設情報、サークル情報を一つの場所に。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Event Widget */}
        <section className="glass-card p-6 flex flex-col justify-between group cursor-pointer hover:border-accent/50 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-accent font-bold">
                <CalendarDays className="w-5 h-5" />
                <h2>直近の予定</h2>
              </div>
              <Link href="/calendar" className="text-sm font-bold text-slate-500 hover:text-accent flex items-center gap-1 transition-colors">
                すべて見る <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="py-4">
              <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-md mb-2 inline-block">
                {nextEvent.date}
              </span>
              <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">{nextEvent.title}</h3>
            </div>
          </div>
        </section>

        {/* Quick Links Widget */}
        <section className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
              <ExternalLink className="w-5 h-5" />
              <h2>よく使うリンク</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <a href="https://gakumu-web1.tufs.ac.jp/campusweb/campusportal.do" target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm">学務情報システム</a>
            <a href="https://moodle.tufs.ac.jp/" target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm">TUFS Moodle</a>
            <a href="https://mail.google.com/a/tufs.ac.jp" target="_blank" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm">大学メール</a>
            <Link href="/links" className="flex items-center justify-center gap-2 p-4 rounded-xl text-accent hover:bg-accent/10 transition-colors font-bold text-sm">その他のリンク <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>
      </div>

      {/* Facilities Widget */}
      <section className="pt-6">
         <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xl">
              <Building2 className="w-6 h-6 text-accent" />
              <h2>施設の営業状況</h2>
            </div>
            <Link href="/facilities" className="text-sm font-bold text-slate-500 hover:text-accent flex items-center gap-1 transition-colors">
              すべて見る <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topFacilities.map((fac, i) => (
              <FacilityStatusCard key={fac.id} facility={fac} index={i} />
            ))}
          </div>
      </section>
    </div>
  );
}
