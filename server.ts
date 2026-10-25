import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.8-flash';

// Helper to sanitize brand context
function formatBrandContext(brand?: {
  name?: string;
  industry?: string;
  targetAudience?: string;
  tone?: string;
  offer?: string;
  keywords?: string[];
  prohibitedWords?: string[];
}) {
  if (!brand || !brand.name) return '';
  return `
Brand Profile Context:
- Brand Name: ${brand.name}
- Industry / Niche: ${brand.industry || 'General'}
- Target Audience: ${brand.targetAudience || 'General Consumers'}
- Voice & Tone: ${brand.tone || 'Friendly & Professional'}
- Main Product / Offer: ${brand.offer || 'Not specified'}
- Keywords to emphasize: ${(brand.keywords || []).join(', ') || 'None'}
- Prohibited / Negative words to avoid: ${(brand.prohibitedWords || []).join(', ') || 'None'}
`;
}

// 1. Caption Generator
app.post('/api/marketing/captions', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      platform = 'both', // 'instagram' | 'facebook' | 'both'
      goal = 'engagement',
      tone = 'friendly',
      cta = 'comment',
      customCta = '',
      includeHashtags = true,
      includeEmojis = true,
      length = 'medium', // 'short' | 'medium' | 'long'
      brand,
    } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic or product description is required' });
    }

    const brandInfo = formatBrandContext(brand);

    const prompt = `
You are an elite social media copywriter and growth marketer specializing in Facebook and Instagram organic & paid content.

Goal: Write high-converting, viral-ready social media caption packages based on the following specifications:
- Topic / Offer / Event: ${topic}
- Target Platform: ${platform} (if 'both', tailor distinct variants for Instagram and Facebook)
- Marketing Goal: ${goal}
- Tone of Voice: ${tone}
- Desired Call-to-Action (CTA): ${customCta ? customCta : cta}
- Length preference: ${length}
- Include Emojis: ${includeEmojis ? 'Yes, thoughtfully placed' : 'Minimal / No emojis'}
- Include Hashtags: ${includeHashtags ? 'Yes' : 'No'}
${brandInfo}

Provide your response in strict valid JSON format matching this structure:
{
  "instagram": {
    "caption": "Full formatted caption with line breaks and formatting for Instagram",
    "hook": "The punchy first line hook that stops scrolling in the feed",
    "alternativeHooks": ["Alternative hook 1 (Question style)", "Alternative hook 2 (Bold claim)", "Alternative hook 3 (Curiosity/Story)"],
    "cta": "The primary call to action text",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
    "hashtagBreakdown": {
      "trending": ["#tag1", "#tag2"],
      "niche": ["#tag3", "#tag4"],
      "community": ["#tag5", "#tag6"]
    },
    "postTip": "Strategic advice for posting this on Instagram (e.g. best carousel angle, story sticker pairing, audio recommendation)",
    "firstCommentSuggestion": "Optional first comment text if user prefers placing hashtags in comments"
  },
  "facebook": {
    "caption": "Optimized caption crafted specifically for Facebook feed algorithm (conversational, engaging, clean links/CTA)",
    "headline": "Bold headline or title line for Facebook post",
    "alternativeHooks": ["Alternative hook 1", "Alternative hook 2"],
    "cta": "Direct clear CTA suited for Facebook audience",
    "discussionQuestion": "A provocative or easy-to-answer question at the end to maximize Facebook comments algorithm",
    "postTip": "Algorithm tip for Facebook (e.g. share in groups, boost strategy, photo vs link post format)"
  },
  "suggestedVisualPrompt": "Detailed visual concept description that the marketer can create or photograph to accompany this caption"
}

Ensure the copy feels natural, human, persuasive, and completely free of cheesy AI cliches (like 'Unleash your inner...').
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Caption generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate captions. Please try again.',
    });
  }
});

// 2. Content Ideas & Calendar Generator
app.post('/api/marketing/ideas', async (req: Request, res: Response) => {
  try {
    const {
      niche,
      format = 'all', // 'reels' | 'carousel' | 'static' | 'stories' | 'all'
      count = 5,
      includeCalendar = true,
      timeframe = '7-day', // '7-day' | '14-day' | '30-day'
      brand,
    } = req.body;

    const brandInfo = formatBrandContext(brand);

    const prompt = `
You are a viral social media strategist. Generate creative, high-engagement content ideas and a structured posting calendar.

Specifications:
- Niche / Industry: ${niche || 'General Business'}
- Format Focus: ${format}
- Number of standalone content ideas: ${count}
- Include Calendar: ${includeCalendar} (${timeframe})
${brandInfo}

Return strict valid JSON with the following schema:
{
  "ideas": [
    {
      "id": "idea-1",
      "title": "Short catchy title",
      "format": "Reels" (or "Carousel" | "Single Image" | "Story Poll" | "Infographic"),
      "hook": "Scroll-stopping first 3 seconds or headline",
      "visualConcept": "What the viewer actually sees visually, camera angles, or graphics",
      "scriptOrSlides": [
        "Slide/Part 1: description",
        "Slide/Part 2: description",
        "Slide/Part 3: description"
      ],
      "captionAngle": "Summary of the caption message and value prop",
      "cta": "Specific CTA",
      "targetGoal": "Viral Reach / Leads / Brand Affinity / Saves & Shares",
      "difficulty": "Easy" (or "Medium" | "High")
    }
  ],
  "calendar": [
    {
      "day": "Day 1 (e.g. Monday)",
      "pillar": "Educational / Behind-the-Scenes / Social Proof / Promotional / Entertainment",
      "title": "Post Title",
      "platform": "Instagram & Facebook",
      "recommendedTime": "e.g. 11:30 AM EST",
      "format": "Reels / Carousel / Photo",
      "hook": "Hook sentence"
    }
  ],
  "strategicPillars": [
    {"name": "Pillar name", "percentage": "40%", "description": "Why this builds audience"}
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Ideas generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate ideas. Please try again.',
    });
  }
});

// 3. Marketing Strategy Generator
app.post('/api/marketing/strategy', async (req: Request, res: Response) => {
  try {
    const {
      productOrService,
      goal,
      budget,
      timeline = '30 days',
      competitors = '',
      brand,
    } = req.body;

    if (!productOrService) {
      return res.status(400).json({ error: 'Product or service description is required' });
    }

    const brandInfo = formatBrandContext(brand);

    const prompt = `
You are a Chief Marketing Officer (CMO) and digital growth consultant. Build a comprehensive, actionable, revenue-focused digital marketing campaign strategy.

Parameters:
- Product/Service: ${productOrService}
- Primary Campaign Goal: ${goal || 'Customer Acquisition & Sales'}
- Budget Range: ${budget || 'Bootstrapped / Organic + modest paid ad testing'}
- Campaign Duration: ${timeline}
- Key Competitors / Benchmark: ${competitors || 'Industry standard'}
${brandInfo}

Return strict valid JSON with this exact structure:
{
  "campaignName": "Memorable creative campaign title",
  "tagline": "Punchy campaign slogan",
  "executiveSummary": "Concise 3-sentence summary of the strategy",
  "targetPersonas": [
    {
      "personaName": "e.g. Frustrated Tech Lead Alex",
      "demographics": "Age, occupation, channels",
      "corePain": "Primary frustration they experience",
      "desire": "The ultimate transformation they want",
      "trigger": "What makes them pull out their credit card"
    }
  ],
  "contentPillars": [
    {
      "title": "Pillar name",
      "allocation": "30%",
      "objective": "Objective description",
      "exampleTopics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ],
  "channelTactics": {
    "instagram": {
      "strategy": "Core organic & reels strategy",
      "frequency": "e.g. 4x feed posts + daily stories",
      "growthHack": "Actionable tactic to gain traction"
    },
    "facebook": {
      "strategy": "Organic groups & page distribution strategy",
      "frequency": "e.g. 3x weekly",
      "growthHack": "Actionable Facebook tip"
    },
    "paidAds": {
      "budgetSplit": "Recommended split across platforms",
      "hookAngles": ["Angle 1", "Angle 2", "Angle 3"],
      "recommendedObjective": "e.g. Sales / Lead Generation"
    }
  },
  "phasedRoadmap": [
    {
      "phase": "Phase 1: Foundation & Teaser (Days 1-7)",
      "actions": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "phase": "Phase 2: Launch & Acquisition Blitz (Days 8-21)",
      "actions": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "phase": "Phase 3: Retargeting, Social Proof & Scale (Days 22-30)",
      "actions": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "kpis": [
    {"metric": "ROAS (Return on Ad Spend)", "benchmark": "3.5x+", "notes": "Target for bottom funnel"},
    {"metric": "Engagement Rate", "benchmark": "4.2%", "notes": "Across reels and carousels"},
    {"metric": "Cost Per Lead / Acquisition", "benchmark": "$12 - $18", "notes": "Based on industry norms"}
  ]
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Strategy generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate strategy. Please try again.',
    });
  }
});

// 4. Customer Message & Comment Replier
app.post('/api/marketing/replies', async (req: Request, res: Response) => {
  try {
    const {
      customerMessage,
      channel = 'instagram_dm', // 'instagram_dm' | 'facebook_comment' | 'facebook_messenger' | 'public_review'
      businessContext = '',
      sentimentHint = 'auto',
      brand,
    } = req.body;

    if (!customerMessage) {
      return res.status(400).json({ error: 'Customer message is required' });
    }

    const brandInfo = formatBrandContext(brand);

    const prompt = `
You are a senior social media community manager and customer success specialist.
Draft responses to this incoming customer communication:

Channel: ${channel}
Incoming Customer Message:
"${customerMessage}"

Additional Business Context / Policy / Details:
${businessContext || 'Standard policy: Friendly, helpful, solve issue fast, encourage conversion.'}
${brandInfo}

Analyze sentiment and provide 3 tailored response variations ready for copy-pasting.

Return strict valid JSON with this structure:
{
  "detectedSentiment": "Positive" | "Frustrated" | "Curious / Pre-Purchase" | "Neutral" | "Complaint / Escalation",
  "sentimentSummary": "1-sentence summary of customer mood and underlying question/concern",
  "keyIntent": "e.g., Inquiring about shipping times / Requesting refund / Complimenting product",
  "variations": [
    {
      "tone": "Warm & Enthusiastic",
      "badge": "Best for brand fans & social proof",
      "reply": "Draft message text...",
      "whyItWorks": "Short 1-sentence rationale"
    },
    {
      "tone": "Empathetic & Solution-First",
      "badge": "Best for complaints & de-escalation",
      "reply": "Draft message text...",
      "whyItWorks": "Short 1-sentence rationale"
    },
    {
      "tone": "Quick & Direct",
      "badge": "Best for high-volume inquiries & FAQs",
      "reply": "Draft message text...",
      "whyItWorks": "Short 1-sentence rationale"
    }
  ],
  "internalAdvice": "Tips for the agent (e.g. Check tracking portal before replying, offer 10% coupon if frustrated, do not argue in public comments)",
  "recommendedNextAction": "e.g. Move to DM / Issue replacement / Upsell related item"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Replies generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate replies. Please try again.',
    });
  }
});

// 5. Text Refiner / Polisher (e.g. Make punchier, translate, add hooks)
app.post('/api/marketing/refine', async (req: Request, res: Response) => {
  try {
    const { originalText, action, language, brand } = req.body;

    if (!originalText) {
      return res.status(400).json({ error: 'Original text is required' });
    }

    const brandInfo = formatBrandContext(brand);

    const prompt = `
You are a master digital copy editor.
Perform the following modification on this marketing copy:
Action requested: ${action} ${language ? `(Target language: ${language})` : ''}

Original Copy:
"""
${originalText}
"""

${brandInfo}

Return strict valid JSON:
{
  "refinedText": "The improved version",
  "changesMade": "Brief summary of what was enhanced (e.g. tightened hooks, removed fluff, boosted urgency)"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Refine error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to refine copy.',
    });
  }
});

// 6. Interactive Marketing Copilot Chat
app.post('/api/marketing/copilot', async (req: Request, res: Response) => {
  try {
    const { messages, brand } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const brandInfo = formatBrandContext(brand);

    const systemInstruction = `You are OmniMarket AI, an elite digital marketing consultant, copywriter, and growth engineer.
You give actionable, high-ROI advice on Facebook and Instagram marketing, ad creatives, conversion rate optimization, influencer partnerships, and retention strategies.
Keep responses well-structured with bullet points, bold highlights, and practical templates whenever useful.
${brandInfo}`;

    // Convert client messages to Gemini contents
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || 'No response generated.',
    });
  } catch (error: any) {
    console.error('Copilot error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to get copilot response.',
    });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Marketing Assistant Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
