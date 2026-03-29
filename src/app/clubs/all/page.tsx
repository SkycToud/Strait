import Link from 'next/link';
import { getAllClubs } from '@/lib/clubs';
import AllClubsList from '@/components/clubs/AllClubsList';

export default async function AllClubsPage() {
  const allClubs = await getAllClubs();

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 px-4 sm:px-6">
      {/* Breadcrumbs & Title */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-4 font-medium">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>home</span>
            Home
          </Link>
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
          <Link href="/clubs" className="hover:text-primary transition-colors">Categories</Link>
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
          <span className="text-on-surface">All Clubs</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline mb-3">サークル一括表示</h1>
            <p className="text-on-surface-variant text-lg">
              TUFSのすべてのサークル・部活動を一覧で確認できます。気になるサークルを探してみましょう。
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Clubs List */}
      <AllClubsList initialClubs={allClubs} />
    </div>
  );
}
