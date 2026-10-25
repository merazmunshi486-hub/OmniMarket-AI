import { BrandProfile } from '../types/marketing';

export const PRESET_BRANDS: BrandProfile[] = [
  {
    id: 'glowaura',
    name: 'GlowAura Skincare',
    industry: 'Clean Beauty & Skincare',
    targetAudience: 'Women & skincare enthusiasts aged 22-38 seeking clean, dermatologically backed radiant glow without harsh chemicals',
    tone: 'Empowering, warm, educational, and aesthetic with calming emojis',
    offer: 'Botanical Ceramide Hydration Serum & Barrier Repair Cream ($38 - $54)',
    keywords: ['clean beauty', 'skin barrier', 'radiant glow', 'dermatologist tested', 'hydrated skin'],
    prohibitedWords: ['toxic', 'cure-all', 'miracle', 'cheap', 'instant fix'],
    instagramHandle: 'glowauraskin',
    facebookPage: 'GlowAura Clean Beauty',
    avatarUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'apexpulse',
    name: 'ApexPulse Performance',
    industry: 'Fitness & Athletic Wear',
    targetAudience: 'Gym-goers, CrossFitters, and hybrid athletes aged 20-35 who push for personal records and clean aesthetics',
    tone: 'High-energy, relentless, motivating, gritty yet modern',
    offer: 'Ultra-stretch Seamless Training Apparel & Hydration Electrolytes',
    keywords: ['break your limits', 'PR season', 'breathable fit', 'no excuses', 'hybrid athlete'],
    prohibitedWords: ['easy', 'lazy', 'skinny', 'lose weight fast'],
    instagramHandle: 'apexpulse_fit',
    facebookPage: 'ApexPulse Athletic',
    avatarUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cloudflow',
    name: 'CloudFlow CRM',
    industry: 'B2B SaaS / Productivity Software',
    targetAudience: 'Sales leaders, founders, and agency owners spending 10+ hours/week doing manual CRM data entry',
    tone: 'Authoritative, witty, data-driven, practical, and solution-focused',
    offer: 'AI-automated sales pipeline CRM starting at $49/seat/mo',
    keywords: ['pipeline velocity', 'automate admin work', 'close deals faster', 'zero data entry', 'sales ROI'],
    prohibitedWords: ['synergy', 'revolutionary paradigm', 'cheap', 'clunky'],
    instagramHandle: 'cloudflowhq',
    facebookPage: 'CloudFlow Software',
    avatarUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'artisanroast',
    name: 'Artisan Roast Co.',
    industry: 'Specialty Coffee & Direct-Trade',
    targetAudience: 'Coffee connoisseurs, home baristas, and remote workers looking for single-origin ethically sourced beans',
    tone: 'Cozy, sensory-rich, passionate, artisanal, and conversational',
    offer: 'Monthly Single-Origin Bean Subscription & Pour-over Starter Kits ($22/bag)',
    keywords: ['single origin', 'tasting notes', 'ethically sourced', 'slow morning', 'freshly roasted'],
    prohibitedWords: ['instant coffee', 'cheap beans', 'artificial flavor'],
    instagramHandle: 'artisanroastcoffee',
    facebookPage: 'Artisan Roast Roastery',
    avatarUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&auto=format&fit=crop&q=80',
  },
];

export const CAPTION_PROMPT_PRESETS = [
  {
    label: '🔥 Summer Flash Sale 25% Off',
    topic: 'Announcing our 48-Hour Summer Flash Sale with 25% off sitewide using code SUMMER25. Free shipping on orders over $60. Limited batch stock.',
    goal: 'Drive Direct Conversions & Urgency',
    cta: 'Tap link in bio to shop before stock sells out',
  },
  {
    label: '✨ Myth Busting / Education',
    topic: 'Debunking the top 3 biggest misconceptions people have in our industry that are wasting their money and slowing down their progress.',
    goal: 'Educate Audience & Build Authority',
    cta: 'Save this post for your next routine',
  },
  {
    label: '💬 Engagement Question & Giveaway',
    topic: 'Tag a friend in the comments and tell us your favorite weekend ritual for a chance to win our best-selling bundle ($120 value).',
    goal: 'Maximize Comments & Social Shares',
    cta: 'Drop your answer below & tag your buddy!',
  },
  {
    label: '🚀 Behind-the-Scenes & Founder Story',
    topic: 'A transparent behind-the-scenes look at how we formulated our signature product from a kitchen table experiment 3 years ago to shipping 50,000 orders.',
    goal: 'Emotional Brand Connection & Trust',
    cta: 'Tell us in the comments: what dream are you building right now?',
  },
];

export const REPLY_PRESETS = [
  {
    label: '📦 Delayed Package / Where is my order?',
    message: "Hey! I ordered 6 days ago (Order #49281) and tracking hasn't updated since Tuesday. Is it lost? I really needed this before the weekend...",
    channel: 'instagram_dm' as const,
    context: 'Standard shipping takes 3-7 business days. Carrier delays occasionally hold tracking for 24-48 hours. Offer expedited reshipment if not moving by tomorrow.',
  },
  {
    label: '⭐️ Super Happy Customer Review',
    message: "Just received my package today and honestly blown away! The quality is 10x better than I expected and the packaging smelled amazing. Definitely ordering again!",
    channel: 'facebook_comment' as const,
    context: 'Thank them, invite them to join the loyalty VIP club or tag us in their story for a 15% next-order gift code.',
  },
  {
    label: '❓ Pre-Purchase Question & Sizing',
    message: "Hi there! I am between a Medium and Large and I have broad shoulders. Should I size up or does it fit true to size? Also how do returns work if it doesn't fit?",
    channel: 'instagram_dm' as const,
    context: 'Athletic fit; recommend sizing up for broad shoulders or relaxed fit. Free 30-day exchanges with prepaid label included.',
  },
  {
    label: '😡 Damaged Item / Frustrated Complaint',
    message: "Very disappointed. The box arrived completely smashed and the bottle was leaking all over the packaging. Terrible shipping. Want my money back right now.",
    channel: 'facebook_comment' as const,
    context: 'Immediate de-escalation: do not argue, apologize sincerely, offer immediate 1-click free replacement + full refund or store credit bonus.',
  },
];
