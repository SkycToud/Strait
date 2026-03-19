import FacilityStatusCard from '@/components/facilities/FacilityStatusCard';
import facilityData from '@/data/facilities.json';

export default function FacilitiesPage() {
  return (
    <div className="space-y-8 relative">
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl -z-10" />
      <header className="animate-fade-in p-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">施設情報</h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">各施設の開館時間・営業状況をリアルタイムに確認できます。</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilityData.map((facility, index) => (
          <FacilityStatusCard key={facility.id} facility={facility} index={index} />
        ))}
      </div>
    </div>
  );
}
