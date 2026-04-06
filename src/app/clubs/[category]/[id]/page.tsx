import { getAllClubs, getClubById } from '@/lib/clubs';
import { normalizeCategorySlug, toCategorySlug } from '@/lib/club-categories';
import { notFound } from 'next/navigation';
import ClubDetailPage from '@/components/clubs/ClubDetailPage';
import { ClubDetail } from '@/types/club';

export async function generateStaticParams() {
  const paths: Array<{ category: string; id: string }> = [];
  const clubsData = getAllClubs();
  
  clubsData.forEach((club) => {
    const slugs = club.categorySlugs ?? club.categories.map((cat) => toCategorySlug(cat));
    slugs.forEach((category) => {
      paths.push({
        category,
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
  const normalizedCategorySlug = normalizeCategorySlug(categorySlug);
  
  // Find the club by ID
  const club = getClubById(id);
  if (!club) {
    notFound();
  }
  
  const clubCategorySlugs = club.categorySlugs ?? club.categories.map((cat) => toCategorySlug(cat));
  const resolvedCategorySlug = clubCategorySlugs.includes(normalizedCategorySlug)
    ? normalizedCategorySlug
    : (club.primaryCategorySlug ?? clubCategorySlugs[0] ?? normalizedCategorySlug);

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
      targetGrades: Array.isArray(club.recruitment.targetGrades) ? club.recruitment.targetGrades : [],
    } : {
      appeal: "準備中",
      challenges: "準備中",

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
      <ClubDetailPage club={comprehensiveClub} categorySlug={resolvedCategorySlug} />
    </div>
  );
}
