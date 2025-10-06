"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Copy, Wand2, ArrowRight, CheckCircle, Loader, Brain, Sparkles, Target, PenTool } from 'lucide-react';

// Type definitions
interface BrandFundamentals {
  businessNature: string;
  mission: string;
  vision: string;
  values: string[];
  targetAudience: {
    demographic: string;
    psychographic: string;
    painPoints: string[];
    aspirations: string[];
    contentHabits: string;
    summary: string;
  };
  uniqueValue: {
    primary: string;
    supporting: string[];
    proofPoints: string[];
  };
  brandVoice: {
    description: string;
    toneAttributes: string[];
    doStatements: string[];
    dontStatements: string[];
    example: string;
  };
  competitiveAdvantages: Array<{
    advantage: string;
    description: string;
    impact: string;
  }>;
  strategicPriorities: Array<{
    priority: string;
    description: string;
    timeline: string;
    impact: string;
  }>;
  industryContext: {
    trends: string[];
    opportunities: string[];
    challenges: string[];
  };
}

interface Campaign {
  name: string;
  objective: string;
  description: string;
  targetSegment: string;
  keyMessage: string;
  platforms: string[];
  contentTypes: string[];
  duration: string;
  kpis: string[];
  budget: string;
}

interface ContentType {
  id: string;
  label: string;
  icon: string;
  structure: string;
  slideCount?: number;
  tweetCount?: number;
  frameCount?: number;
}

interface Platform {
  id: string;
  label: string;
  icon: string;
  limits: {
    post?: { max: number };
    caption?: { max: number };
    tweet?: { max: number };
    description?: { max: number };
  };
}

interface Slide {
  slideNumber: number;
  type?: string;
  headline: string;
  subheadline?: string;
  content?: string;
  visualDirection: string;
  cta?: string;
}

interface Tweet {
  tweetNumber: number;
  content: string;
  characterCount?: number;
}

interface DataPoint {
  statistic: string;
  description: string;
  source: string;
}

interface ScriptSegment {
  timing: string;
  voiceover: string;
  visual: string;
  textOverlay?: string;
}

interface Frame {
  frameNumber: number;
  type: string;
  text: string;
  visual: string;
  interactive: string;
}

interface EmailBody {
  greeting: string;
  opening: string;
  mainContent: string;
  benefits?: string[];
  cta: string;
  closing: string;
}

interface Section {
  heading: string;
  content: string;
  keyPoints?: string[];
}

interface GeneratedContent {
  id: string;
  contentNumber: number;
  contentType: string;
  platform: string;
  contentStructure: string;
  title: string;
  hook?: string;
  body?: string | EmailBody;
  cta?: string;
  caption?: string;
  hashtags?: string[];
  slides?: Slide[];
  tweets?: Tweet[];
  dataPoints?: DataPoint[];
  script?: {
    hook: ScriptSegment;
    content: ScriptSegment[];
    cta: ScriptSegment;
  };
  frames?: Frame[];
  subjectLine?: string;
  preheader?: string;
  ps?: string;
  metaDescription?: string;
  introduction?: string;
  sections?: Section[];
  conclusion?: string;
  keywords?: string[];
  headline?: string;
  primaryText?: string;
  description?: string;
  adFormat?: string;
  subtitle?: string;
  visualStructure?: string;
  colorScheme?: string;
}

const V28Platform = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [projectData, setProjectData] = useState<{
    stage1: {
      websiteUrl: string;
      businessVertical: string;
      businessDetails: string;
      brandFundamentals: BrandFundamentals | null;
      campaigns: Campaign[];
    };
    stage2: {
      contentQuantum: string;
      customQuantum: string;
      selectedContentTypes: ContentType[];
      selectedPlatforms: Platform[];
      generatedContents: GeneratedContent[];
      contentStrategy: null;
    };
    stage3: {
      generatedContent: GeneratedContent[];
      editMode: Record<string, boolean>;
    };
  }>({
    stage1: {
      websiteUrl: '',
      businessVertical: '',
      businessDetails: '',
      brandFundamentals: null,
      campaigns: []
    },
    stage2: {
      contentQuantum: '',
      customQuantum: '',
      selectedContentTypes: [],
      selectedPlatforms: [],
      generatedContents: [],
      contentStrategy: null
    },
    stage3: {
      generatedContent: [],
      editMode: {}
    }
  });

  // ==================== STAGE 1: AI MASTER RESEARCHER ====================
  const Stage1Researcher = () => {
    const [websiteUrl, setWebsiteUrl] = useState(projectData.stage1.websiteUrl);
    const [businessVertical, setBusinessVertical] = useState(projectData.stage1.businessVertical);
    const [businessDetails, setBusinessDetails] = useState(projectData.stage1.businessDetails);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);

    const businessVerticals = [
      'Technology & Software', 'E-commerce & Retail', 'Healthcare & Medical',
      'Finance & Banking', 'Education & E-learning', 'Real Estate',
      'Food & Beverage', 'Fashion & Apparel', 'Travel & Hospitality',
      'Marketing & Advertising', 'Consulting & Professional Services',
      'Media & Entertainment', 'Automotive', 'Manufacturing',
      'Non-profit & Social Impact', 'Beauty & Cosmetics', 'Sports & Fitness',
      'Gaming & Entertainment', 'Legal Services', 'Energy & Sustainability', 'Other'
    ];

    const analyzeWebsite = async () => {
      if (!websiteUrl || !businessVertical) {
        alert('Please enter website URL and select business vertical');
        return;
      }

      setIsAnalyzing(true);
      setProgress(10);

      try {
        setProgress(30);
        
        const contextPrompt = businessDetails 
          ? `\n\nADDITIONAL CONTEXT:\n${businessDetails}` 
          : '';

        // Brand Analysis
        const brandResponse = await fetch("/api/anthropic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 5000,
            messages: [{
              role: "user",
              content: `You are an ELITE Brand Strategy Consultant analyzing: ${websiteUrl}, Industry: ${businessVertical}${contextPrompt}

Generate EXACT JSON (NO markdown, NO backticks):
{
  "businessNature": "Detailed 2-3 sentence description of what the business does",
  "mission": "Compelling 2-3 sentence mission statement",
  "vision": "Inspiring 1-2 sentence vision statement",
  "values": ["Value 1", "Value 2", "Value 3", "Value 4", "Value 5", "Value 6", "Value 7"],
  "targetAudience": {
    "demographic": "Detailed demographic profile with age, location, role, income",
    "psychographic": "Values, motivations, behaviors, lifestyle",
    "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
    "aspirations": ["Aspiration 1", "Aspiration 2", "Aspiration 3"],
    "contentHabits": "How and where they consume content",
    "summary": "Concise summary of primary target audience"
  },
  "uniqueValue": {
    "primary": "Main unique value proposition (1-2 sentences)",
    "supporting": ["Supporting point 1", "Supporting point 2", "Supporting point 3"],
    "proofPoints": ["Evidence 1", "Evidence 2", "Evidence 3"]
  },
  "brandVoice": {
    "description": "Comprehensive 3-4 sentence description of brand voice",
    "toneAttributes": ["Attribute 1", "Attribute 2", "Attribute 3", "Attribute 4"],
    "doStatements": ["Do: Statement 1", "Do: Statement 2", "Do: Statement 3"],
    "dontStatements": ["Don&apos;t: Statement 1", "Don&apos;t: Statement 2", "Don&apos;t: Statement 3"],
    "example": "Brief example of how the brand would communicate"
  },
  "competitiveAdvantages": [
    {
      "advantage": "Competitive advantage name",
      "description": "Why this matters and how it differentiates",
      "impact": "Business impact of this advantage"
    },
    {
      "advantage": "Second advantage",
      "description": "Why this matters",
      "impact": "Business impact"
    },
    {
      "advantage": "Third advantage",
      "description": "Why this matters",
      "impact": "Business impact"
    }
  ],
  "strategicPriorities": [
    {
      "priority": "Priority name",
      "description": "What this involves",
      "timeline": "12 months",
      "impact": "Expected business impact"
    },
    {
      "priority": "Second priority",
      "description": "What this involves",
      "timeline": "24 months",
      "impact": "Expected impact"
    },
    {
      "priority": "Third priority",
      "description": "What this involves",
      "timeline": "Ongoing",
      "impact": "Expected impact"
    }
  ],
  "industryContext": {
    "trends": ["Trend 1 in ${businessVertical}", "Trend 2", "Trend 3"],
    "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"]
  }
}`
            }]
          })
        });

        const brandData = await brandResponse.json();
        const brandText = brandData.content[0].text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const brandFundamentals = JSON.parse(brandText);
        
        setProgress(70);

        // Campaign Recommendations
        const campaignResponse = await fetch("/api/anthropic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [{
              role: "user",
              content: `You are a MASTER Marketing Campaign Strategist for ${businessVertical}.

Brand: ${brandFundamentals.mission}
Target: ${brandFundamentals.targetAudience.summary}
UVP: ${brandFundamentals.uniqueValue.primary}

Generate EXACT JSON (NO markdown):
{
  "campaigns": [
    {
      "name": "Campaign name (creative and memorable)",
      "objective": "awareness",
      "description": "Detailed 2-3 sentence description",
      "targetSegment": "Specific audience segment",
      "keyMessage": "Core message",
      "platforms": ["Platform 1", "Platform 2", "Platform 3"],
      "contentTypes": ["Content type 1", "Content type 2", "Content type 3"],
      "duration": "3 months",
      "kpis": ["KPI 1 with target", "KPI 2", "KPI 3"],
      "budget": "Medium"
    },
    {
      "name": "Second campaign",
      "objective": "engagement",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1", "Platform 2"],
      "contentTypes": ["Type 1", "Type 2"],
      "duration": "6 months",
      "kpis": ["KPI 1", "KPI 2"],
      "budget": "High"
    },
    {
      "name": "Third campaign",
      "objective": "conversion",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1"],
      "contentTypes": ["Type 1"],
      "duration": "3 months",
      "kpis": ["KPI 1", "KPI 2"],
      "budget": "Low"
    },
    {
      "name": "Fourth campaign",
      "objective": "retention",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1"],
      "contentTypes": ["Type 1"],
      "duration": "Ongoing",
      "kpis": ["KPI 1"],
      "budget": "Medium"
    },
    {
      "name": "Fifth campaign",
      "objective": "awareness",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1", "Platform 2"],
      "contentTypes": ["Type 1", "Type 2"],
      "duration": "6 months",
      "kpis": ["KPI 1", "KPI 2"],
      "budget": "High"
    },
    {
      "name": "Sixth campaign",
      "objective": "engagement",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1"],
      "contentTypes": ["Type 1"],
      "duration": "3 months",
      "kpis": ["KPI 1"],
      "budget": "Low"
    }
  ]
}`
            }]
          })
        });

        const campaignData = await campaignResponse.json();
        const campaignText = campaignData.content[0].text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const campaignsResult = JSON.parse(campaignText);

        setProgress(100);

        setProjectData(prev => ({
          ...prev,
          stage1: {
            websiteUrl,
            businessVertical,
            businessDetails,
            brandFundamentals,
            campaigns: campaignsResult.campaigns
          }
        }));

        setTimeout(() => {
          setIsAnalyzing(false);
          setProgress(0);
          alert('✅ Brand Analysis Complete!');
        }, 500);

      } catch (error) {
        console.error('Analysis error:', error);
        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'error' in error) {
          errorMessage = (error as { error: string }).error;
        }
        
        alert(`Error: ${errorMessage}\n\nPlease check:\n1. Your API key is set in .env.local\n2. Your internet connection\n3. The Anthropic API is accessible`);
        setIsAnalyzing(false);
        setProgress(0);
      }
    };

  return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Master Researcher</h2>
              <p className="text-gray-600">Comprehensive brand analysis</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL *</label>
            <input
              type="url"
              placeholder="https://www.example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Vertical *</label>
            <select
              value={businessVertical}
              onChange={(e) => setBusinessVertical(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select industry...</option>
              {businessVerticals.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Context (Optional)</label>
            <textarea
              placeholder="Any additional information..."
              value={businessDetails}
              onChange={(e) => setBusinessDetails(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={analyzeWebsite}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing... {progress}%
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Start AI Analysis
              </>
            )}
          </button>

          {isAnalyzing && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
          )}
        </div>

        {projectData.stage1.brandFundamentals && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-7 h-7 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800">✅ Brand Analysis Complete</h3>
              </div>
            </div>

            {/* Business Nature */}
            <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-xl">Business Nature</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">{projectData.stage1.brandFundamentals.businessNature}</p>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <h5 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Mission
                </h5>
                <p className="text-purple-800 leading-relaxed">{projectData.stage1.brandFundamentals.mission}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200">
                <h5 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌟</span> Vision
                </h5>
                <p className="text-indigo-800 leading-relaxed">{projectData.stage1.brandFundamentals.vision}</p>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white p-6 rounded-xl border-2 border-orange-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">💎</span> Core Values
              </h4>
              <div className="flex flex-wrap gap-3">
                {projectData.stage1.brandFundamentals.values.map((value, i) => (
                  <div key={i} className="px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 rounded-full font-semibold border-2 border-orange-200">
                    {value}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span> Target Audience Intelligence
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 text-sm">📊 Demographics</h5>
                  <p className="text-sm text-gray-700">{projectData.stage1.brandFundamentals.targetAudience.demographic}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 text-sm">🧠 Psychographics</h5>
                  <p className="text-sm text-gray-700">{projectData.stage1.brandFundamentals.targetAudience.psychographic}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 text-sm">😰 Pain Points</h5>
                  <ul className="space-y-1">
                    {projectData.stage1.brandFundamentals.targetAudience.painPoints.map((pain, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{pain}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-900 mb-2 text-sm">✨ Aspirations</h5>
                  <ul className="space-y-1">
                    {projectData.stage1.brandFundamentals.targetAudience.aspirations.map((asp, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{asp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-white p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2 text-sm">📱 Content Habits</h5>
                <p className="text-sm text-gray-700">{projectData.stage1.brandFundamentals.targetAudience.contentHabits}</p>
              </div>
            </div>

            {/* Unique Value Proposition */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span> Unique Value Proposition
              </h4>
              <p className="text-lg text-green-900 font-semibold mb-4">{projectData.stage1.brandFundamentals.uniqueValue.primary}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2 text-sm">Supporting Points</h5>
                  <ul className="space-y-2">
                    {projectData.stage1.brandFundamentals.uniqueValue.supporting.map((point, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-900 mb-2 text-sm">Proof Points</h5>
                  <ul className="space-y-2">
                    {projectData.stage1.brandFundamentals.uniqueValue.proofPoints.map((proof, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-1">•</span>
                        <span>{proof}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Brand Voice */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🎤</span> Brand Voice & Personality
              </h4>
              <p className="text-purple-900 mb-4 leading-relaxed">{projectData.stage1.brandFundamentals.brandVoice.description}</p>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-2 text-sm">Tone Attributes</h5>
                  <div className="flex flex-wrap gap-2">
                    {projectData.stage1.brandFundamentals.brandVoice.toneAttributes.map((attr, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">{attr}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-green-900 mb-2 text-sm">✅ Do</h5>
                  <ul className="space-y-1">
                    {projectData.stage1.brandFundamentals.brandVoice.doStatements.map((stmt, i) => (
                      <li key={i} className="text-xs text-gray-700">{stmt}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-red-900 mb-2 text-sm">❌ Don&apos;t</h5>
                  <ul className="space-y-1">
                    {projectData.stage1.brandFundamentals.brandVoice.dontStatements.map((stmt, i) => (
                      <li key={i} className="text-xs text-gray-700">{stmt}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-2 text-sm">Example</h5>
                <p className="text-sm text-gray-700 italic">&ldquo;{projectData.stage1.brandFundamentals.brandVoice.example}&rdquo;</p>
              </div>
            </div>

            {/* Competitive Advantages */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span> Competitive Advantages
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {projectData.stage1.brandFundamentals.competitiveAdvantages.map((adv, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                      <div>
                        <h5 className="font-bold text-gray-800 mb-2">{adv.advantage}</h5>
                        <p className="text-sm text-gray-700 mb-2">{adv.description}</p>
                        <p className="text-xs text-yellow-800 font-medium"><strong>Impact:</strong> {adv.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Priorities */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Strategic Priorities
              </h4>
              <div className="space-y-3">
                {projectData.stage1.brandFundamentals.strategicPriorities.map((priority, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-800">{priority.priority}</h5>
                          <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">{priority.timeline}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{priority.description}</p>
                        <p className="text-xs text-indigo-800 font-medium"><strong>Expected Impact:</strong> {priority.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Context */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border-2 border-gray-200">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span> Industry Context: {projectData.stage1.businessVertical}
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2"><span>📈</span> Trends</h5>
                  <ul className="space-y-2">
                    {projectData.stage1.brandFundamentals.industryContext.trends.map((trend, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{trend}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-green-900 mb-3 text-sm flex items-center gap-2"><span>💡</span> Opportunities</h5>
                  <ul className="space-y-2">
                    {projectData.stage1.brandFundamentals.industryContext.opportunities.map((opp, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-red-900 mb-3 text-sm flex items-center gap-2"><span>⚠️</span> Challenges</h5>
                  <ul className="space-y-2">
                    {projectData.stage1.brandFundamentals.industryContext.challenges.map((challenge, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Campaigns */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-xl border-2 border-rose-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <span className="text-2xl">🎪</span> Strategic Campaign Recommendations
                  <span className="text-sm font-normal text-gray-600 ml-2">({projectData.stage1.campaigns.length} Campaigns)</span>
                </h4>
              </div>
              <div className="space-y-4">
                {projectData.stage1.campaigns.map((campaign, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border-2 border-rose-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-bold text-gray-800 text-lg mb-1">{campaign.name}</h5>
                            <div className="flex gap-2 flex-wrap">
                              <span className="text-xs px-3 py-1 bg-rose-100 text-rose-700 rounded-full font-semibold">{campaign.objective}</span>
                              <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">{campaign.duration}</span>
                              <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold">{campaign.budget} Budget</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{campaign.description}</p>
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h6 className="text-xs font-semibold text-blue-900 mb-2">🎯 Target</h6>
                            <p className="text-sm text-gray-700">{campaign.targetSegment}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <h6 className="text-xs font-semibold text-green-900 mb-2">💬 Message</h6>
                            <p className="text-sm text-gray-700">{campaign.keyMessage}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <h6 className="text-xs font-semibold text-gray-700 mb-2">Platforms</h6>
                            <div className="flex flex-wrap gap-1">
                              {campaign.platforms.map((p, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">{p}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h6 className="text-xs font-semibold text-gray-700 mb-2">Content Types</h6>
                            <div className="flex flex-wrap gap-1">
                              {campaign.contentTypes.map((c, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-xs font-semibold text-gray-700 mb-2">KPIs</h6>
                          <div className="flex flex-wrap gap-1">
                            {campaign.kpis.map((kpi, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">{kpi}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentStage(2)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
            >
              Proceed to Content Strategy <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ==================== STAGE 2: CONTENT STRATEGY ====================
  const Stage2Strategy = () => {
    const [contentQuantum, setContentQuantum] = useState(projectData.stage2.contentQuantum || '');
    const [customQuantum, setCustomQuantum] = useState(projectData.stage2.customQuantum || '');
    const [selectedContentTypes, setSelectedContentTypes] = useState(projectData.stage2.selectedContentTypes || []);
    const [selectedPlatforms, setSelectedPlatforms] = useState(projectData.stage2.selectedPlatforms || []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState('');

    // Debug current selections
    useEffect(() => {
      console.log('Stage 2 State:', {
        contentQuantum,
        customQuantum,
        selectedContentTypesCount: selectedContentTypes.length,
        selectedPlatformsCount: selectedPlatforms.length
      });
    }, [contentQuantum, customQuantum, selectedContentTypes, selectedPlatforms]);

    const quantumOptions = [
      { value: '5', label: '5 Content Pieces' },
      { value: '10', label: '10 Content Pieces' },
      { value: '15', label: '15 Content Pieces' },
      { value: 'custom', label: 'Custom Quantity' }
    ];

    const contentTypes: ContentType[] = [
      { 
        id: 'post', 
        label: 'Social Posts', 
        icon: '📱',
        structure: 'single'
      },
      { 
        id: 'carousel', 
        label: 'Carousels', 
        icon: '🎠',
        structure: 'multi-slide',
        slideCount: 5
      },
      { 
        id: 'infographic', 
        label: 'Infographics', 
        icon: '📊',
        structure: 'data-visual'
      },
      { 
        id: 'thread', 
        label: 'Twitter Threads', 
        icon: '🧵',
        structure: 'thread',
        tweetCount: 8
      },
      { 
        id: 'reel', 
        label: 'Reels/Shorts', 
        icon: '🎬',
        structure: 'video-script'
      },
      { 
        id: 'story', 
        label: 'Stories', 
        icon: '⚡',
        structure: 'story-frames',
        frameCount: 5
      },
      { 
        id: 'email', 
        label: 'Email Copy', 
        icon: '📧',
        structure: 'email'
      },
      { 
        id: 'blog', 
        label: 'Blog Articles', 
        icon: '📝',
        structure: 'long-form'
      },
      { 
        id: 'ad', 
        label: 'Ad Copy', 
        icon: '🎯',
        structure: 'ad'
      }
    ];

    const platformOptions: Platform[] = [
      { id: 'linkedin', label: 'LinkedIn', icon: '💼', limits: { post: { max: 3000 }, caption: { max: 3000 } } },
      { id: 'instagram', label: 'Instagram', icon: '📸', limits: { caption: { max: 2200 } } },
      { id: 'facebook', label: 'Facebook', icon: '👥', limits: { post: { max: 63206 } } },
      { id: 'twitter', label: 'Twitter/X', icon: '🐦', limits: { tweet: { max: 280 } } },
      { id: 'tiktok', label: 'TikTok', icon: '🎵', limits: { caption: { max: 2200 } } },
      { id: 'youtube', label: 'YouTube', icon: '▶️', limits: { description: { max: 5000 } } }
    ];

    const toggleContentType = (type: ContentType) => {
      setSelectedContentTypes(prev => 
        prev.find(t => t.id === type.id) ? prev.filter(t => t.id !== type.id) : [...prev, type]
      );
    };

    const togglePlatform = (platform: Platform) => {
      setSelectedPlatforms(prev =>
        prev.find(p => p.id === platform.id) ? prev.filter(p => p.id !== platform.id) : [...prev, platform]
      );
    };

    const generateContent = async () => {
      if (!projectData.stage1.brandFundamentals) {
        alert('Please complete Stage 1 first');
        return;
      }

      const totalPieces = contentQuantum === 'custom' ? parseInt(customQuantum) : parseInt(contentQuantum);
      if (!totalPieces || totalPieces < 1) {
        alert('Please select content quantity');
        return;
      }

      if (selectedContentTypes.length === 0 || selectedPlatforms.length === 0) {
        alert('Please select at least one content type and platform');
        return;
      }

      setIsGenerating(true);
      setGenerationProgress('Initializing AI Content Generator...');
      const allGeneratedContent: GeneratedContent[] = [];
      let contentNumber = 1;

      try {
        const piecesPerType = Math.ceil(totalPieces / selectedContentTypes.length);

        for (let typeIndex = 0; typeIndex < selectedContentTypes.length; typeIndex++) {
          const contentType = selectedContentTypes[typeIndex];
          
          for (let i = 0; i < piecesPerType && contentNumber <= totalPieces; i++) {
            const platform = selectedPlatforms[i % selectedPlatforms.length];
            
            setGenerationProgress(`Generating ${contentNumber}/${totalPieces} - ${contentType.label} for ${platform.label}...`);

            let promptContent = '';
            let expectedStructure = '';

            // Define structure based on content type
            if (contentType.structure === 'multi-slide') {
              promptContent = `Create a 5-slide carousel for ${platform.label}`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "multi-slide",
  "title": "Carousel title",
  "slides": [
    {"slideNumber": 1, "type": "cover", "headline": "Main headline", "subheadline": "Supporting text", "visualDirection": "Visual description"},
    {"slideNumber": 2, "headline": "Slide 2 title", "content": "Slide 2 content (30-40 words)", "visualDirection": "Visual description"},
    {"slideNumber": 3, "headline": "Slide 3 title", "content": "Slide 3 content (30-40 words)", "visualDirection": "Visual description"},
    {"slideNumber": 4, "headline": "Slide 4 title", "content": "Slide 4 content (30-40 words)", "visualDirection": "Visual description"},
    {"slideNumber": 5, "type": "cta", "headline": "CTA headline", "cta": "Call to action", "visualDirection": "Visual description"}
  ],
  "caption": "Post caption (100-150 words)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
            } else if (contentType.structure === 'data-visual') {
              promptContent = `Create data-heavy infographic content with 5+ statistics`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "data-visual",
  "title": "Infographic title",
  "subtitle": "Supporting subtitle",
  "dataPoints": [
    {"statistic": "75%", "description": "What this stat means", "source": "Data source"},
    {"statistic": "3.5x", "description": "Growth metric", "source": "Data source"},
    {"statistic": "$2.4M", "description": "Financial insight", "source": "Data source"},
    {"statistic": "500K+", "description": "Volume metric", "source": "Data source"},
    {"statistic": "92%", "description": "Percentage insight", "source": "Data source"}
  ],
  "visualStructure": "How to organize visually",
  "colorScheme": "Color suggestions",
  "caption": "Post caption",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
            } else if (contentType.structure === 'thread') {
              promptContent = `Create an 8-tweet thread. CRITICAL: Each tweet MUST be under 280 characters`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "thread",
  "title": "Thread topic",
  "tweets": [
    {"tweetNumber": 1, "content": "Hook tweet (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 2, "content": "Tweet 2 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 3, "content": "Tweet 3 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 4, "content": "Tweet 4 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 5, "content": "Tweet 5 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 6, "content": "Tweet 6 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 7, "content": "Tweet 7 (under 280 chars)", "characterCount": 0},
    {"tweetNumber": 8, "content": "CTA tweet (under 280 chars)", "characterCount": 0}
  ]
}`;
            } else if (contentType.structure === 'video-script') {
              promptContent = `Create short-form video script with timing, voiceover, and visual directions`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "video-script",
  "title": "Video concept",
  "script": {
    "hook": {"timing": "0-3 sec", "voiceover": "Opening line", "visual": "What viewer sees", "textOverlay": "On-screen text"},
    "content": [
      {"timing": "3-10 sec", "voiceover": "Segment 1", "visual": "Visual", "textOverlay": "Text"},
      {"timing": "10-20 sec", "voiceover": "Segment 2", "visual": "Visual", "textOverlay": "Text"},
      {"timing": "20-30 sec", "voiceover": "Segment 3", "visual": "Visual", "textOverlay": "Text"}
    ],
    "cta": {"timing": "30-35 sec", "voiceover": "CTA", "visual": "Final visual", "textOverlay": "CTA text"}
  },
  "caption": "Video caption",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
            } else if (contentType.structure === 'story-frames') {
              promptContent = `Create 5 story frames for ephemeral content`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "story-frames",
  "title": "Story series title",
  "frames": [
    {"frameNumber": 1, "type": "opener", "text": "Frame 1 text (15 words)", "visual": "Visual", "interactive": "Poll/Question"},
    {"frameNumber": 2, "type": "content", "text": "Frame 2 text", "visual": "Visual", "interactive": "Element"},
    {"frameNumber": 3, "type": "content", "text": "Frame 3 text", "visual": "Visual", "interactive": "Element"},
    {"frameNumber": 4, "type": "content", "text": "Frame 4 text", "visual": "Visual", "interactive": "Element"},
    {"frameNumber": 5, "type": "cta", "text": "CTA text", "visual": "Visual", "interactive": "Swipe up"}
  ],
  "hashtags": ["tag1", "tag2"]
}`;
            } else if (contentType.structure === 'email') {
              promptContent = `Create email campaign with subject, preheader, body, and P.S.`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "email",
  "title": "Email campaign name",
  "subjectLine": "Subject (40-50 chars)",
  "preheader": "Preheader text (80-100 chars)",
  "body": {
    "greeting": "Hi [Name],",
    "opening": "Opening paragraph",
    "mainContent": "Main content",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "cta": "CTA button text",
    "closing": "Closing"
  },
  "ps": "P.S. Additional note"
}`;
            } else if (contentType.structure === 'long-form') {
              promptContent = `Create blog article structure with SEO`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "long-form",
  "title": "SEO blog title",
  "metaDescription": "Meta description (150-160 chars)",
  "introduction": "Introduction (150 words)",
  "sections": [
    {"heading": "Section 1", "content": "Content (200 words)", "keyPoints": ["Point 1", "Point 2"]},
    {"heading": "Section 2", "content": "Content (200 words)", "keyPoints": ["Point 1", "Point 2"]},
    {"heading": "Section 3", "content": "Content (200 words)", "keyPoints": ["Point 1", "Point 2"]}
  ],
  "conclusion": "Conclusion (150 words)",
  "cta": "CTA",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`;
            } else if (contentType.structure === 'ad') {
              promptContent = `Create high-converting ad copy`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "ad",
  "title": "Ad campaign",
  "headline": "Ad headline (40 chars)",
  "primaryText": "Main ad copy (125 words)",
  "description": "Additional description",
  "cta": "Button text",
  "adFormat": "Single image"
}`;
            } else {
              promptContent = `Create social media post`;
              expectedStructure = `{
  "contentNumber": ${contentNumber},
  "contentType": "${contentType.label}",
  "platform": "${platform.label}",
  "contentStructure": "single",
  "title": "Post title",
  "hook": "Opening hook (20-40 words)",
  "body": "Main content (80-150 words)",
  "cta": "Call to action (10-20 words)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
            }

            const contentResponse = await fetch("/api/anthropic", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 3500,
                messages: [{
                  role: "user",
                  content: `${promptContent} for ${projectData.stage1.businessVertical}.

Brand: ${projectData.stage1.brandFundamentals.mission}
Target: ${projectData.stage1.brandFundamentals.targetAudience.summary}
Voice: ${projectData.stage1.brandFundamentals.brandVoice.description}

Generate EXACT JSON (NO markdown, NO backticks, NO explanations):
${expectedStructure}

CRITICAL: Output ONLY valid JSON. No markdown. No text before or after.`
                }]
              })
            });

            const contentData = await contentResponse.json();
            let contentText = contentData.content[0].text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            
            // Additional cleanup
            if (contentText.startsWith('{') === false) {
              const jsonStart = contentText.indexOf('{');
              if (jsonStart !== -1) {
                contentText = contentText.substring(jsonStart);
              }
            }
            if (contentText.endsWith('}') === false) {
              const jsonEnd = contentText.lastIndexOf('}');
              if (jsonEnd !== -1) {
                contentText = contentText.substring(0, jsonEnd + 1);
              }
            }

            const content = JSON.parse(contentText);
            
            // Add character counts for tweets if thread
            if (content.contentStructure === 'thread' && content.tweets) {
              content.tweets = content.tweets.map((tweet: Tweet) => ({
                ...tweet,
                characterCount: tweet.content.length
              }));
            }
            
            allGeneratedContent.push({
              ...content,
              id: `content-${contentNumber}`
            });
            
            contentNumber++;
          }
        }

        console.log('✅ Generated content:', allGeneratedContent.length, 'pieces');
        console.log('Sample:', allGeneratedContent[0]);

        setProjectData(prev => ({
          ...prev,
          stage2: {
            ...prev.stage2,
            contentQuantum,
            customQuantum,
            selectedContentTypes,
            selectedPlatforms,
            generatedContents: allGeneratedContent
          }
        }));

        setGenerationProgress('');
        alert(`✅ Generated ${allGeneratedContent.length} pieces! Moving to Stage 3...`);
        
        setTimeout(() => {
          setIsGenerating(false);
          setCurrentStage(3);
        }, 1500);

      } catch (error) {
        console.error('Generation error:', error);
        alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setIsGenerating(false);
        setGenerationProgress('');
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Content Strategist</h2>
          <p className="text-gray-600">Plan and generate your content</p>
        </div>

        {!projectData.stage1.brandFundamentals ? (
          <div className="bg-yellow-50 p-6 rounded-xl">
            <p className="text-yellow-800">Please complete Stage 1 first.</p>
            <button onClick={() => setCurrentStage(1)} className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg">
              Go to Stage 1
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Content Quantum */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-bold mb-4">Content Quantity</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {quantumOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setContentQuantum(opt.value)}
                    className={`p-4 rounded-lg border-2 font-semibold ${
                      contentQuantum === opt.value ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {contentQuantum === 'custom' && (
                <input
                  type="number"
                  placeholder="Enter quantity (1-50)"
                  value={customQuantum}
                  onChange={(e) => setCustomQuantum(e.target.value)}
                  max="50"
                  className="mt-3 w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                />
              )}
            </div>

            {/* Content Types */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-bold mb-4">
                Content Types 
                {selectedContentTypes.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({selectedContentTypes.length} selected)
                  </span>
                )}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {contentTypes.map(type => {
                  const isSelected = selectedContentTypes.find(t => t.id === type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        console.log('Toggling content type:', type.label);
                        toggleContentType(type);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-purple-600 bg-purple-50 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-semibold text-sm">{type.label}</span>
    </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platforms */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-bold mb-4">
                Platforms
                {selectedPlatforms.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({selectedPlatforms.length} selected)
                  </span>
                )}
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {platformOptions.map(platform => {
                  const isSelected = selectedPlatforms.find(p => p.id === platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => {
                        console.log('Toggling platform:', platform.label);
                        togglePlatform(platform);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-purple-600 bg-purple-50 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl">{platform.icon}</span>
                          <div className="font-semibold text-sm mt-1">{platform.label}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <h3 className="text-sm font-bold text-blue-900 mb-2">📋 Your Selections</h3>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-semibold">Quantity:</span>{' '}
                  <span className={contentQuantum ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {contentQuantum === 'custom' ? `${customQuantum || '?'} pieces` : contentQuantum ? `${contentQuantum} pieces` : '❌ Not selected'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Content Types:</span>{' '}
                  <span className={selectedContentTypes.length > 0 ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {selectedContentTypes.length > 0 ? `✓ ${selectedContentTypes.length} selected` : '❌ None selected'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Platforms:</span>{' '}
                  <span className={selectedPlatforms.length > 0 ? 'text-green-600 font-bold' : 'text-red-600'}>
                    {selectedPlatforms.length > 0 ? `✓ ${selectedPlatforms.length} selected` : '❌ None selected'}
                  </span>
                </div>
              </div>
              {(!contentQuantum || selectedContentTypes.length === 0 || selectedPlatforms.length === 0) && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-800 font-semibold">⚠️ Please complete all selections to generate content:</p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                    {!contentQuantum && <li>• Select content quantity</li>}
                    {selectedContentTypes.length === 0 && <li>• Select at least one content type</li>}
                    {selectedPlatforms.length === 0 && <li>• Select at least one platform</li>}
                  </ul>
                </div>
              )}
            </div>

            {isGenerating ? (
              <div className="bg-white p-12 rounded-xl text-center">
                <Loader className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">AI Generating Content</h3>
                <p className="text-gray-600">{generationProgress}</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  console.log('Generate button clicked!');
                  console.log('Quantum:', contentQuantum, 'Types:', selectedContentTypes.length, 'Platforms:', selectedPlatforms.length);
                  generateContent();
                }}
                disabled={!contentQuantum || selectedContentTypes.length === 0 || selectedPlatforms.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wand2 className="w-6 h-6" />
                {!contentQuantum || selectedContentTypes.length === 0 || selectedPlatforms.length === 0 
                  ? 'Complete Selections Above' 
                  : 'Generate Content'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== STAGE 3: CONTENT WRITER ====================
  const Stage3Writer = () => {
    const [displayContent, setDisplayContent] = useState<GeneratedContent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Load content from Stage 2
      if (projectData.stage2.generatedContents.length > 0) {
        console.log('Loading Stage 2 content:', projectData.stage2.generatedContents);
        setDisplayContent(projectData.stage2.generatedContents);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, []);

    const getCharacterStatus = (content: GeneratedContent) => {
      const platform = projectData.stage2.selectedPlatforms.find(p => p.id === content.platform?.toLowerCase());
      
      if (content.contentStructure === 'thread' && content.tweets) {
        const overLimit = content.tweets.some((t: Tweet) => (t.characterCount ?? 0) > 280);
        return { 
          color: overLimit ? 'red' : 'green', 
          status: overLimit ? '⚠️ Some tweets over 280 chars!' : '✓ All tweets within limit'
        };
      }

      if (content.caption) {
        const count = content.caption.length;
        const max = platform?.limits?.caption?.max || platform?.limits?.post?.max || 3000;
        if (count > max) {
          return { color: 'red', status: `${count}/${max} - Over limit!` };
        } else if (count > max * 0.8) {
          return { color: 'yellow', status: `${count}/${max} - Near limit` };
        } else {
          return { color: 'green', status: `${count}/${max} - Good` };
        }
      }

      return { color: 'gray', status: 'No limit' };
    };

    const renderContent = (content: GeneratedContent) => {
      // CAROUSEL
      if (content.contentStructure === 'multi-slide' && content.slides) {
        return (
          <div className="space-y-3">
            {content.slides.map((slide: Slide, idx: number) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${
                slide.type === 'cover' ? 'bg-purple-50 border-purple-300' :
                slide.type === 'cta' ? 'bg-green-50 border-green-300' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {slide.slideNumber}
                  </div>
                  <span className="text-xs font-semibold uppercase">{slide.type || 'content'}</span>
                </div>
                <h5 className="font-bold mb-1">{slide.headline}</h5>
                {slide.subheadline && <p className="text-sm mb-2">{slide.subheadline}</p>}
                {slide.content && <p className="text-sm mb-2">{slide.content}</p>}
                {slide.cta && <p className="text-sm font-bold text-green-700">👉 {slide.cta}</p>}
                <p className="text-xs text-gray-500 italic mt-2">Visual: {slide.visualDirection}</p>
              </div>
            ))}
            {content.caption && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs font-semibold mb-2">CAPTION</p>
                <p className="text-sm">{content.caption}</p>
              </div>
            )}
          </div>
        );
      }

      // INFOGRAPHIC
      if (content.contentStructure === 'data-visual' && content.dataPoints) {
        return (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h5 className="font-bold text-xl">{content.title}</h5>
              {content.subtitle && <p className="text-sm text-gray-600">{content.subtitle}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {content.dataPoints.map((point: DataPoint, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{point.statistic}</div>
                  <p className="text-sm mb-1">{point.description}</p>
                  <p className="text-xs text-gray-500">Source: {point.source}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // THREAD
      if (content.contentStructure === 'thread' && content.tweets) {
        return (
          <div className="space-y-2">
            {content.tweets.map((tweet: Tweet, idx: number) => {
              const isOver = (tweet.characterCount ?? 0) > 280;
              return (
                <div key={idx} className={`p-3 rounded-lg border-2 ${isOver ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold">Tweet {tweet.tweetNumber}</span>
                    <span className={`text-xs font-bold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                      {tweet.characterCount}/280
                    </span>
                  </div>
                  <p className="text-sm">{tweet.content}</p>
                </div>
              );
            })}
          </div>
        );
      }

      // VIDEO SCRIPT
      if (content.contentStructure === 'video-script' && content.script) {
        return (
          <div className="space-y-3">
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
              <h5 className="font-bold text-sm mb-2">🎬 HOOK ({content.script.hook.timing})</h5>
              <p className="text-sm mb-1"><strong>Voiceover:</strong> {content.script.hook.voiceover}</p>
              <p className="text-xs text-gray-600"><strong>Visual:</strong> {content.script.hook.visual}</p>
              <p className="text-xs text-gray-600"><strong>Text:</strong> {content.script.hook.textOverlay}</p>
            </div>
            {content.script.content.map((seg: ScriptSegment, idx: number) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-bold text-sm mb-2">📹 SEGMENT {idx + 1} ({seg.timing})</h5>
                <p className="text-sm mb-1"><strong>Voiceover:</strong> {seg.voiceover}</p>
                <p className="text-xs text-gray-600"><strong>Visual:</strong> {seg.visual}</p>
              </div>
            ))}
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h5 className="font-bold text-sm mb-2">📢 CTA ({content.script.cta.timing})</h5>
              <p className="text-sm">{content.script.cta.voiceover}</p>
            </div>
          </div>
        );
      }

      // STORY FRAMES
      if (content.contentStructure === 'story-frames' && content.frames) {
        return (
          <div className="space-y-3">
            {content.frames.map((frame: Frame, idx: number) => (
              <div key={idx} className={`p-4 rounded-lg border-2 ${
                frame.type === 'opener' ? 'bg-purple-50 border-purple-300' :
                frame.type === 'cta' ? 'bg-green-50 border-green-300' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {frame.frameNumber}
                  </div>
                  <span className="text-xs font-semibold uppercase">{frame.type}</span>
                </div>
                <p className="text-sm font-medium mb-2">{frame.text}</p>
                <p className="text-xs text-gray-600">📸 {frame.visual}</p>
                <p className="text-xs text-purple-600">💫 {frame.interactive}</p>
              </div>
            ))}
          </div>
        );
      }

      // EMAIL
      if (content.contentStructure === 'email' && content.subjectLine) {
        return (
          <div className="space-y-3">
            <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
              <p className="text-xs font-semibold mb-2">📧 SUBJECT</p>
              <p className="text-lg font-bold">{content.subjectLine}</p>
              {content.preheader && <p className="text-sm text-gray-600 mt-2">{content.preheader}</p>}
            </div>
            {content.body && typeof content.body === 'object' && 'greeting' in content.body && (
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm mb-2">{(content.body as EmailBody).greeting}</p>
                <p className="text-sm mb-3">{(content.body as EmailBody).opening}</p>
                <p className="text-sm mb-3">{(content.body as EmailBody).mainContent}</p>
                {(content.body as EmailBody).benefits && (
                  <ul className="mb-3">
                    {(content.body as EmailBody).benefits?.map((b: string, i: number) => (
                      <li key={i} className="text-sm flex gap-2 mb-1">
                        <span className="text-green-600">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="text-center my-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                    {(content.body as EmailBody).cta}
                  </button>
                </div>
                <p className="text-sm">{(content.body as EmailBody).closing}</p>
              </div>
            )}
          </div>
        );
      }

      // BLOG
      if (content.contentStructure === 'long-form' && content.sections) {
        return (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h5 className="font-bold text-2xl mb-2">{content.title}</h5>
              {content.metaDescription && <p className="text-sm italic">{content.metaDescription}</p>}
            </div>
            {content.introduction && (
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm">{content.introduction}</p>
              </div>
            )}
            {content.sections.map((sec: Section, idx: number) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-lg">
                <h6 className="font-bold text-lg mb-2">{sec.heading}</h6>
                <p className="text-sm mb-2">{sec.content}</p>
                {sec.keyPoints && (
                  <ul className="space-y-1">
                    {sec.keyPoints.map((p: string, i: number) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span>•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      // AD
      if (content.contentStructure === 'ad' && content.headline) {
        return (
          <div className="space-y-3">
            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
              <p className="text-xs font-semibold mb-2">📢 HEADLINE</p>
              <p className="text-xl font-bold">{content.headline}</p>
            </div>
            {content.primaryText && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">{content.primaryText}</p>
              </div>
            )}
            <div className="text-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">
                {content.cta}
              </button>
            </div>
          </div>
        );
      }

      // DEFAULT SINGLE POST
      return (
        <div className="space-y-4">
          {content.hook && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-xs font-semibold mb-2">🪝 HOOK</p>
              <p className="text-sm">{content.hook}</p>
            </div>
          )}
          {content.body && typeof content.body === 'string' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs font-semibold mb-2">📝 CONTENT</p>
              <p className="text-sm">{content.body}</p>
            </div>
          )}
          {content.cta && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-xs font-semibold mb-2">📢 CTA</p>
              <p className="text-sm font-semibold">{content.cta}</p>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Content Writer</h2>
          <p className="text-gray-600">Review and refine your generated content</p>
        </div>

        {projectData.stage2.generatedContents.length === 0 ? (
          <div className="bg-yellow-50 p-6 rounded-xl">
            <p className="text-yellow-800">Please generate content in Stage 2 first.</p>
            <button onClick={() => setCurrentStage(2)} className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg">
              Go to Stage 2
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="font-semibold text-green-800">
                  ✅ {displayContent.length} content pieces loaded and ready
                </p>
              </div>
            </div>

            {/* Content Display */}
            {isLoading ? (
              <div className="bg-white p-12 rounded-xl text-center">
                <Loader className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                <p>Loading content...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayContent.map((content: GeneratedContent) => {
                  const charStatus = getCharacterStatus(content);
                  return (
                    <div key={content.id} className="bg-white p-6 rounded-xl border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold">
                            #{content.contentNumber}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{content.title}</h3>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              <span className="text-xs px-2 py-1 bg-orange-100 rounded">{content.platform}</span>
                              <span className="text-xs px-2 py-1 bg-blue-100 rounded">{content.contentType}</span>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                charStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                                charStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                charStatus.color === 'green' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {charStatus.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded hover:bg-gray-100" title="Copy">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded hover:bg-gray-100" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {renderContent(content)}

                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold mb-2"># HASHTAGS</p>
                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag: string, i: number) => (
                              <span key={i} className="text-sm px-3 py-1 bg-gray-100 rounded-full">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-green-800">Content Creation Complete!</h3>
              </div>
              <p className="text-green-700">Your AI-generated content is ready for use. You can copy, edit, and share your content across all selected platforms.</p>
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            V28 AI Content Platform
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { num: 1, name: 'Research', icon: Brain },
            { num: 2, name: 'Strategy', icon: Target },
            { num: 3, name: 'Writer', icon: PenTool }
          ].map(stage => (
            <button
              key={stage.num}
              onClick={() => setCurrentStage(stage.num)}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentStage === stage.num
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <stage.icon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Stage {stage.num}</div>
              <div className="text-xs text-gray-500">{stage.name}</div>
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          {currentStage === 1 && <Stage1Researcher />}
          {currentStage === 2 && <Stage2Strategy />}
          {currentStage === 3 && <Stage3Writer />}
        </div>
      </div>
    </div>
  );
};

export default V28Platform;

