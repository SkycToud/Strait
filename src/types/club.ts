export type Club = Pick<ClubDetail, 'id' | 'nameJa' | 'nameEn' | 'categories' | 'description' | 'thumbnail' | 'instagram' | 'instagramRecruitment' | 'xUrl' | 'isSample'>;

export interface ClubDetail {
  // Existing fields
  id: string;
  nameJa: string;
  nameEn: string;
  categories: string[];
  categorySlugs?: string[];
  primaryCategorySlug?: string;
  description: string;
  thumbnail?: string;
  instagram?: string;
  instagramRecruitment?: string;
  xUrl?: string;
  metadata?: string;
  isSample?: boolean;
  
  // New comprehensive fields
  overview: {
    philosophy?: string;
    guidelines?: string;
    activities?: string;
  };
  operations: {
    executiveMembers?: string[];
    organization?: string;
  };
  membership: {
    memberCount?: number;
    yearDistribution?: string[];
    isIntraUniversity?: boolean;
    demographics?: string;
  };
  schedule: {
    frequency?: string;
    location?: string;
    annualPlan?: string[];
  };
  recruitment: {
    appeal?: string;
    challenges?: string;

    welcomeEvents?: string;
    applicationDeadline?: string;
    annualFee?: string;
    hasSelection?: boolean;
    selectionDetail?: string;
    targetGrades: string[];
    targetAudience?: string;
    contact: {
      facebook?: string;
      website?: string;
      media?: string;
      line?: string;
      instagram?: string;
      instagramRecruitment?: string;
      xUrl?: string;
    };
  };
  lastUpdated?: string;
}

