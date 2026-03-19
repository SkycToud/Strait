'use client';
import { useState } from 'react';
import TimelineView, { CalendarEvent } from './TimelineView';
import { CalendarIcon, List, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarTabs({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<'timeline' | 'grid'>('timeline');

  return (
    <div className="w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="glass p-1.5 rounded-xl inline-flex relative shadow-sm">
          <button
            onClick={() => setView('timeline')}
            className={cn("relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all z-10 flex items-center gap-2", view === 'timeline' ? "text-accent" : "text-slate-600 dark:text-slate-400 hover:text-foreground")}
          >
            <List className="w-4 h-4" /> タイムライン
          </button>
          <button
            onClick={() => setView('grid')}
            className={cn("relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all z-10 flex items-center gap-2", view === 'grid' ? "text-accent" : "text-slate-600 dark:text-slate-400 hover:text-foreground")}
          >
            <CalendarIcon className="w-4 h-4" /> リスト
          </button>
          
          <div 
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-accent/15 dark:bg-accent/25 rounded-lg transition-transform duration-300 ease-out z-0"
            style={{ transform: view === 'timeline' ? 'translateX(0)' : 'translateX(100%)' }}
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 glass-card !rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-colors">
          <Download className="w-4 h-4" /> iCalエクスポート
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'timeline' ? (
            <TimelineView events={events} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event, i) => (
                <div key={event.id} className="glass-card p-5 hover:scale-[1.02] transition-transform animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{event.date}</p>
                    </div>
                    <span className="text-xs font-bold bg-accent/10 text-accent px-2 py-1 rounded-full">{event.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
