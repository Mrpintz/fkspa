
export enum Plan {
  FREE = 'Free',
  PREMIUM = 'Premium',
  PRO = 'Pro',
}

export interface User {
  id: number;
  name: string;
  plan: Plan;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  albumArtUrl: string;
  audioUrl: string;
  requiredPlan: Plan;
}

export enum Page {
  LIBRARY = 'Library',
  PRICING = 'Pricing',
}
