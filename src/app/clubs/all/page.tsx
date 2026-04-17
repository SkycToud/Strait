import Link from 'next/link';
import { getAllClubs } from '@/lib/clubs';
import AllClubsList from '@/components/clubs/AllClubsList';

export const revalidate = 300;

export default async function AllClubsPage() {
  const allClubs = await getAllClubs();

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 px-4 sm:px-6">
      {/* Title */}
      <div className="mb-10">
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
