export interface ClubDetail {
  // Existing fields
  id: string;
  nameJa: string;
  nameEn: string;
  category: string;
  description: string;
  thumbnail?: string;
  instagram?: string;
  xUrl?: string;
  metadata?: string;
  
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
    annualFee?: string;
    hasSelection?: boolean;
    targetAudience?: string;
    contact: {
      facebook?: string;
      website?: string;
      line?: string;
    };
  };
  lastUpdated?: string;
}

// For backward compatibility with existing components
export type Club = Omit<ClubDetail, 'overview' | 'operations' | 'membership' | 'schedule' | 'recruitment' | 'lastUpdated'>;
