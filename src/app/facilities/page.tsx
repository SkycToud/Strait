'use client';

import { useState } from 'react';
import FacilityStatusCard from '@/components/facilities/FacilityStatusCard';
import { Facility } from '@/components/facilities/FacilityStatusCard';
import facilityData from '@/data/facilities.json';
import PageHeader from '@/components/layout/PageHeader';
import { logUserBehavior } from '@/lib/firebaseClient';

export default function FacilitiesPage() {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter);

    logUserBehavior('select_content', {
      content_type: 'facility_filter',
      item_id: nextFilter,
      filter_name: nextFilter,
      source_page: window.location.pathname,
    });
  };

  const filteredData = facilityData.filter(f => {
    if (filter === 'all') return true;
    if (filter === 'study') return ['student-affairs', 'admissions-office', 'accounting-office', 'certificate-machine', 'health-care-center'].includes(f.id);
    if (filter === 'library') return f.id === 'library';
    if (filter === 'amenity') return f.type === 'food' || f.type === 'store';
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Main Content Area centered by removing the aside and wrapping in a narrower max-width container */}
      <div className="flex-1">
        {/* Page Header */}
        <PageHeader
          title="施設情報"
          subtitle="Facility Information"
          description="キャンパス内の主要施設、食堂、事務窓口の開館状況を確認できます。"
        />
        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-10 justify-start">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all shadow-md ${filter === 'all' ? 'bg-primary text-on-primary shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            全て (All)
          </button>
          <button
            onClick={() => handleFilterChange('study')}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${filter === 'study' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            本部管理棟
          </button>
          <button
            onClick={() => handleFilterChange('library')}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${filter === 'library' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            図書館
          </button>
          <button
            onClick={() => handleFilterChange('amenity')}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${filter === 'amenity' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
          >
            食生活・厚生
          </button>
        </div>
        {/* Facility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((facility) => (
            <FacilityStatusCard key={facility.id} facility={facility as Facility} />
          ))}
        </div>

        {/* Campus Map Link Section */}
        <div className="mt-12 p-6 md:p-8 bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center justify-start gap-2">
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
            onClick={() =>
              logUserBehavior('select_content', {
                content_type: 'facility_external_link',
                item_id: 'campus-map',
                item_title: 'Campus Map',
                destination_type: 'external',
                destination_path_or_url: 'https://www.tufs.ac.jp/abouttufs/contactus/campusmap.html',
                source_page: window.location.pathname,
              })
            }
            className="shrink-0 px-6 py-3 bg-surface-container-high text-on-surface font-medium rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            マップを開く
            <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}
