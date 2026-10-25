export type ActiveTab = 'captions' | 'ideas' | 'strategy' | 'replies' | 'copilot' | 'vault';

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  targetAudience: string;
  tone: string;
  offer: string;
  keywords: string[];
  prohibitedWords: string[];
  instagramHandle?: string;
  facebookPage?: string;
  avatarUrl?: string;
}

export interface InstagramCaptionData {
  caption: string;
  hook: string;
  alternativeHooks: string[];
  cta: string;
  hashtags: string[];
  hashtagBreakdown?: {
    trending: string[];
    niche: string[];
    community: string[];
  };
  postTip?: string;
  firstCommentSuggestion?: string;
}

export interface FacebookCaptionData {
  caption: string;
  headline: string;
  alternativeHooks: string[];
  cta: string;
  discussionQuestion: string;
  postTip?: string;
}

export interface CaptionResponse {
  instagram?: InstagramCaptionData;
  facebook?: FacebookCaptionData;
  suggestedVisualPrompt?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  format: 'Reels' | 'Carousel' | 'Single Image' | 'Story Poll' | 'Infographic';
  hook: string;
  visualConcept: string;
  scriptOrSlides: string[];
  captionAngle: string;
  cta: string;
  targetGoal: string;
  difficulty: 'Easy' | 'Medium' | 'High';
}

export interface CalendarEntry {
  day: string;
  pillar: string;
  title: string;
  platform: string;
  recommendedTime: string;
  format: string;
  hook: string;
}

export interface StrategicPillar {
  name: string;
  percentage: string;
  description: string;
}

export interface IdeasResponse {
  ideas: ContentIdea[];
  calendar: CalendarEntry[];
  strategicPillars?: StrategicPillar[];
}

export interface TargetPersona {
  personaName: string;
  demographics: string;
  corePain: string;
  desire: string;
  trigger: string;
}

export interface ContentPillarPlan {
  title: string;
  allocation: string;
  objective: string;
  exampleTopics: string[];
}

export interface PhasedRoadmapStep {
  phase: string;
  actions: string[];
}

export interface KPIPlan {
  metric: string;
  benchmark: string;
  notes: string;
}

export interface StrategyResponse {
  campaignName: string;
  tagline: string;
  executiveSummary: string;
  targetPersonas: TargetPersona[];
  contentPillars: ContentPillarPlan[];
  channelTactics: {
    instagram: {
      strategy: string;
      frequency: string;
      growthHack: string;
    };
    facebook: {
      strategy: string;
      frequency: string;
      growthHack: string;
    };
    paidAds: {
      budgetSplit: string;
      hookAngles: string[];
      recommendedObjective: string;
    };
  };
  phasedRoadmap: PhasedRoadmapStep[];
  kpis: KPIPlan[];
}

export interface ReplyVariation {
  tone: string;
  badge: string;
  reply: string;
  whyItWorks: string;
}

export interface RepliesResponse {
  detectedSentiment: string;
  sentimentSummary: string;
  keyIntent: string;
  variations: ReplyVariation[];
  internalAdvice: string;
  recommendedNextAction: string;
}

export interface SavedItem {
  id: string;
  type: 'caption' | 'idea' | 'strategy' | 'reply';
  title: string;
  createdAt: string;
  brandName: string;
  content: any;
  platform?: string;
}
