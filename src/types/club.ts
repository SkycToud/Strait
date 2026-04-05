export type Club = Pick<ClubDetail, 'id' | 'nameJa' | 'nameEn' | 'categories' | 'description' | 'thumbnail' | 'instagram' | 'xUrl' | 'isSample'>;

export interface ClubDetail {
  // Existing fields
  id: string;
  nameJa: string;
  nameEn: string;
  categories: string[];
  description: string;
  thumbnail?: string;
  instagram?: string;
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
    applicationFlow?: string;
    welcomeEvents?: string;
    applicationDeadline?: string;
    annualFee?: string;
    hasSelection?: boolean;
    targetGrades: string[];
    targetAudience?: string;
    contact: {
      facebook?: string;
      website?: string;
      line?: string;
    };
  };
  lastUpdated?: string;
}

