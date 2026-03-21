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
            キャンパス内の主要施設、カフェテリア、事務窓口の開館状況と混雑具合を確認できます。リアルタイムのデータを活用して、効率的な学生生活を送りましょう。
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
            講義・研究棟
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

        {/* Campus Map Preview Section */}
        <div className="mt-16 p-8 md:p-12 bg-[#f2f3fa] rounded-3xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-on-surface mb-6">学内マップで場所を確認</h2>
              <p className="text-on-surface-variant mb-8 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                初めての施設でも安心。インタラクティブなキャンパスマップで、目的地までのルートと詳細なフロアガイドを閲覧できます。
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-all">
                マップを開く
              </button>
            </div>
            <div className="flex-1 w-full max-w-lg aspect-[16/10] bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-white/50">
              <img className="w-full h-full object-cover" data-alt="Abstract minimalist campus map visualization" data-location="Tokyo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjdsxhZy9nxfcWpB51JbTM7z3PwnFjarZR5_WOmjLSxCr4q14RmScZNBnhsSFb0kIhG3LwK8yjQNx424CYn2AQEPzQdXWjrs1T3IH11BjEDxYlb6aH6omrzbLVFI8tJUmZus7ftXYCG4rkiCbFeivQ3eQr4GlgAxQiwSdF2tncCPv2xBxke-qjIYqNyIgiaDKsYYnXD42qZFyeeMxUbsz5vXdmdktheeWKShVohJpEVsksgsq5zM65lMZet2hasX_EWNjzl5zlQbhK" alt="Map Preview" />
            </div>
          </div>
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
