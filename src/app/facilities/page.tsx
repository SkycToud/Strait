'use client';

import { useState } from 'react';
import FacilityStatusCard from '@/components/facilities/FacilityStatusCard';
import facilityData from '@/data/facilities.json';

export default function FacilitiesPage() {
  const [filter, setFilter] = useState('all');

  const filteredData = facilityData.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'study') return f.id === 'research-lecture' || f.id === 'agora';
    if (filter === 'library') return f.id === 'library';
    if (filter === 'amenity') return f.type === 'food' || f.type === 'store';
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Main Content Area centered by removing the aside and wrapping in a narrower max-width container */}
      <div className="flex-1">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-baseline gap-3 mb-4 justify-center md:justify-start">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">施設情報</h1>
            <span className="text-lg text-on-surface-variant font-medium">Facility Information</span>
          </div>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed mx-auto md:mx-0">
            キャンパス内の主要施設、食堂、事務窓口の開館状況を確認できます。
          </p>
        </div>
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md ${filter === 'all' ? 'bg-primary text-on-primary shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            全て (All)
          </button>
          <button
            onClick={() => setFilter('study')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'study' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            本部管理棟
          </button>
          <button
            onClick={() => setFilter('library')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'library' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            図書館
          </button>
          <button
            onClick={() => setFilter('amenity')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === 'amenity' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            食生活・厚生
          </button>
        </div>
        {/* Facility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((facility, index) => (
            <FacilityStatusCard key={facility.id} facility={facility as any} index={index} />
          ))}
        </div>

        {/* Campus Map Link Section */}
        <div className="mt-12 p-6 md:p-8 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">map</span>
              キャンパスマップ
            </h2>
            <p className="text-on-surface-variant text-sm">
              キャンパス内の施設配置や詳細なフロアガイドは、大学公式サイトのキャンパスマップからご確認いただけます。
            </p>
          </div>
          <a
            href="https://www.tufs.ac.jp/abouttufs/contactus/campusmap.html"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 bg-surface-container-high text-on-surface font-medium rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            マップを開く
            <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
          </a>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-95 hover:scale-105 transition-all">
          <span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
        </button>
      </div>
    </div>
  );
}
