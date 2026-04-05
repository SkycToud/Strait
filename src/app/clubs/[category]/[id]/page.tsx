import { getAllClubs, getClubById } from '@/lib/clubs';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ClubDetailPage from '@/components/clubs/ClubDetailPage';
import { ClubDetail } from '@/types/club';

export async function generateStaticParams() {
  const paths: Array<{ category: string; id: string }> = [];
  const clubsData = getAllClubs();
  
  clubsData.forEach((club) => {
    club.categories.forEach((cat) => {
      paths.push({
        category: slugify(cat),
        id: club.id,
      });
    });
  });
  
  return paths;
}

export default async function ClubDetailPageWrapper({ 
  params 
}: { 
  params: Promise<{ category: string; id: string }> 
}) {
  const { category: categorySlug, id } = await params;
  
  // Find the club by ID
  const club = getClubById(id);
  
  // Verify the category matches
  if (!club || !club.categories.some(cat => slugify(cat) === categorySlug)) {
    notFound();
  }

  // Ensure the club has the comprehensive structure
  const comprehensiveClub: ClubDetail = {
    ...club,
    overview: club.overview || {
      philosophy: "準備中",
      guidelines: "準備中",
      activities: "準備中"
    },
    operations: club.operations || {
      executiveMembers: ["準備中"],
      organization: "準備中"
    },
    membership: club.membership || {
      memberCount: 0,
      yearDistribution: ["準備中"],
      isIntraUniversity: false
    },
    schedule: club.schedule || {
      frequency: "準備中",
      location: "準備中",
      annualPlan: ["準備中"]
    },
    recruitment: club.recruitment ? {
      ...club.recruitment,
      targetGrades: (club.recruitment as any).targetGrades || [],
    } : {
      appeal: "準備中",
      challenges: "準備中",
      applicationFlow: "準備中",
      welcomeEvents: "準備中",
      applicationDeadline: "準備中",
      annualFee: "準備中",
      hasSelection: false,
      targetGrades: [],
      targetAudience: "準備中",
      contact: {
        facebook: "",
        website: "",
        line: ""
      }
    },
    lastUpdated: club.lastUpdated || "2024-03-20"
  };

  return (
    <div className="animate-fade-in">

      {/* Club Detail Page */}
      <ClubDetailPage club={comprehensiveClub} categorySlug={categorySlug} />
    </div>
  );
}
