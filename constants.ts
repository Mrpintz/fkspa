import { User, Plan, Track } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Free User', plan: Plan.FREE },
  { id: 2, name: 'Premium User', plan: Plan.PREMIUM },
  { id: 3, name: 'Pro User', plan: Plan.PRO },
];

export const PLAN_DETAILS = [
  {
    plan: Plan.FREE,
    price: '$0/mo',
    features: ['Access to free tracks', 'Standard quality audio', 'Contains ads'],
    color: 'gray-700',
  },
  {
    plan: Plan.PREMIUM,
    price: '$9.99/mo',
    features: ['Access to premium tracks', 'High quality audio', 'Ad-free listening'],
    color: 'indigo-600',
  },
  {
    plan: Plan.PRO,
    price: '$19.99/mo',
    features: ['Access all tracks', 'Lossless audio quality', 'Early access to new music'],
    color: 'purple-600',
  },
];

export const TRACKS: Track[] = [
  {
    id: 1,
    title: 'Neon Tides',
    artist: 'Synthwave AI',
    albumArtUrl: 'https://picsum.photos/seed/neontides/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    requiredPlan: Plan.FREE,
  },
  {
    id: 2,
    title: 'Solar Flare',
    artist: 'Cosmic Gen',
    albumArtUrl: 'https://picsum.photos/seed/solarflare/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    requiredPlan: Plan.FREE,
  },
  {
    id: 3,
    title: 'Quantum Dreams',
    artist: 'Logic Weaver',
    albumArtUrl: 'https://picsum.photos/seed/quantumdreams/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    requiredPlan: Plan.PREMIUM,
  },
  {
    id: 4,
    title: 'Crystal Caverns',
    artist: 'Melody Muse',
    albumArtUrl: 'https://picsum.photos/seed/crystalcaverns/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    requiredPlan: Plan.PREMIUM,
  },
  {
    id: 5,
    title: 'Midnight Protocol',
    artist: 'Data Flow',
    albumArtUrl: 'https://picsum.photos/seed/midnightprotocol/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    requiredPlan: Plan.PREMIUM,
  },
  {
    id: 6,
    title: 'Ethereal Echo',
    artist: 'AuraBot',
    albumArtUrl: 'https://picsum.photos/seed/etherealecho/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    requiredPlan: Plan.PRO,
  },
   {
    id: 7,
    title: 'Galactic Drift',
    artist: 'Stellar Engine',
    albumArtUrl: 'https://picsum.photos/seed/galacticdrift/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    requiredPlan: Plan.PRO,
  },
  {
    id: 8,
    title: 'City Lights',
    artist: 'Urban AI',
    albumArtUrl: 'https://picsum.photos/seed/citylights/500/500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    requiredPlan: Plan.FREE,
  },
];