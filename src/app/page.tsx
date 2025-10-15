"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Copy, Wand2, ArrowRight, CheckCircle, Loader, Brain, Sparkles, Target, PenTool, Download } from 'lucide-react';

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

// Download utility functions
const downloadHTML = (filename: string, htmlContent: string) => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadDOC = (filename: string, htmlContent: string) => {
  const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${filename}</title></head>
    <body>${htmlContent}</body>
    </html>
  `;
  const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadCSV = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadPDF = (htmlContent: string) => {
  // Create a temporary container
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      // Note: User needs to select "Save as PDF" in print dialog
    };
  }
};

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

  // ==================== DOWNLOAD FUNCTIONS ====================
  const downloadStage1 = () => {
    if (!projectData.stage1.brandFundamentals) {
      alert('No brand analysis data to download');
      return;
    }

    const bf = projectData.stage1.brandFundamentals;
    const campaigns = projectData.stage1.campaigns;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Analysis - ${projectData.stage1.websiteUrl}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; max-width: 1200px; margin: 0 auto; padding: 24px; background: linear-gradient(to bottom right, #eff6ff, #f5f3ff, #fef2f2); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    h1, h2, h3, h4, h5, h6, p { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div style="background: linear-gradient(to right, #eff6ff, #dbeafe); padding: 24px; border-radius: 12px; border: 1px solid #3b82f6; margin-bottom: 24px;">
    <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">BrandStory Master Researcher</h2>
    <p style="color: #4b5563; font-size: 14px;">Comprehensive brand analysis</p>
  </div>

  <!-- Success Banner -->
  <div style="background: linear-gradient(to right, #d1fae5, #a7f3d0); padding: 24px; border-radius: 12px; border: 2px solid #86efac; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 28px;">✅</span>
      <h3 style="font-size: 24px; font-weight: 700; color: #1f2937;">✅ Brand Analysis Complete</h3>
    </div>
  </div>

  <!-- Business Nature -->
  <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid #93c5fd; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
      <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 24px;">🧠</span>
      </div>
      <h4 style="font-weight: 700; font-size: 20px;">Business Nature</h4>
    </div>
    <p style="color: #374151; line-height: 1.6;">${bf.businessNature}</p>
  </div>

  <!-- Mission & Vision -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
    <div style="background: linear-gradient(to bottom right, #faf5ff, #f3e8ff); padding: 24px; border-radius: 12px; border: 2px solid #c084fc;">
      <h5 style="font-weight: 700; color: #6b21a8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">🎯</span> Mission
      </h5>
      <p style="color: #7c3aed; line-height: 1.6;">${bf.mission}</p>
    </div>
    <div style="background: linear-gradient(to bottom right, #eef2ff, #e0e7ff); padding: 24px; border-radius: 12px; border: 2px solid #818cf8;">
      <h5 style="font-weight: 700; color: #3730a3; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">🌟</span> Vision
      </h5>
      <p style="color: #4f46e5; line-height: 1.6;">${bf.vision}</p>
    </div>
  </div>

  <!-- Core Values -->
  <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid #fdba74; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">💎</span> Core Values
    </h4>
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      ${bf.values.map(v => `<div style="padding: 8px 16px; background: linear-gradient(to right, #fed7aa, #fef3c7); color: #9a3412; border-radius: 20px; font-weight: 600; border: 2px solid #fb923c;">${v}</div>`).join('')}
    </div>
  </div>

  <!-- Target Audience -->
  <div style="background: linear-gradient(to bottom right, #eff6ff, #cffafe); padding: 24px; border-radius: 12px; border: 2px solid #93c5fd; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">👥</span> Target Audience Intelligence
    </h4>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #93c5fd;">
        <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 8px; font-size: 14px;">📊 Demographics</h5>
        <p style="font-size: 14px; color: #374151;">${bf.targetAudience.demographic}</p>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #93c5fd;">
        <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 8px; font-size: 14px;">🧠 Psychographics</h5>
        <p style="font-size: 14px; color: #374151;">${bf.targetAudience.psychographic}</p>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #93c5fd;">
        <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 8px; font-size: 14px;">😰 Pain Points</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.targetAudience.painPoints.map(p => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 4px;">
              <span style="color: #ef4444; margin-top: 4px;">•</span>
              <span>${p}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #93c5fd;">
        <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 8px; font-size: 14px;">✨ Aspirations</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.targetAudience.aspirations.map(a => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 4px;">
              <span style="color: #22c55e; margin-top: 4px;">•</span>
              <span>${a}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #93c5fd;">
      <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 8px; font-size: 14px;">📱 Content Habits</h5>
      <p style="font-size: 14px; color: #374151;">${bf.targetAudience.contentHabits}</p>
    </div>
  </div>

  <!-- Unique Value Proposition -->
  <div style="background: linear-gradient(to bottom right, #d1fae5, #a7f3d0); padding: 24px; border-radius: 12px; border: 2px solid #86efac; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">🚀</span> Unique Value Proposition
    </h4>
    <p style="font-size: 18px; font-weight: 600; color: #065f46; margin-bottom: 16px;">${bf.uniqueValue.primary}</p>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #86efac;">
        <h5 style="font-weight: 600; color: #065f46; margin-bottom: 8px; font-size: 14px;">Supporting Points</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.uniqueValue.supporting.map(s => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <span style="color: #059669; font-weight: 700; margin-top: 4px;">✓</span>
              <span>${s}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #86efac;">
        <h5 style="font-weight: 600; color: #065f46; margin-bottom: 8px; font-size: 14px;">Proof Points</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.uniqueValue.proofPoints.map(p => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <span style="color: #059669; font-weight: 700; margin-top: 4px;">•</span>
              <span>${p}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  </div>

  <!-- Brand Voice -->
  <div style="background: linear-gradient(to bottom right, #fdf2f8, #fce7f3); padding: 24px; border-radius: 12px; border: 2px solid #f9a8d4; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">🎤</span> Brand Voice & Personality
    </h4>
    <p style="color: #701a75; margin-bottom: 16px; line-height: 1.6;">${bf.brandVoice.description}</p>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 16px;">
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #f9a8d4;">
        <h5 style="font-weight: 600; color: #701a75; margin-bottom: 8px; font-size: 14px;">Tone Attributes</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${bf.brandVoice.toneAttributes.map(attr => `<span style="font-size: 12px; padding: 4px 12px; background: #f3e8ff; color: #6b21a8; border-radius: 20px; font-weight: 500;">${attr}</span>`).join('')}
        </div>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #f9a8d4;">
        <h5 style="font-weight: 600; color: #065f46; margin-bottom: 8px; font-size: 14px;">✅ Do</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.brandVoice.doStatements.map(d => `<li style="font-size: 12px; color: #374151; margin-bottom: 4px;">${d}</li>`).join('')}
        </ul>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #f9a8d4;">
        <h5 style="font-weight: 600; color: #7f1d1d; margin-bottom: 8px; font-size: 14px;">❌ Don't</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.brandVoice.dontStatements.map(d => `<li style="font-size: 12px; color: #374151; margin-bottom: 4px;">${d}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #f9a8d4;">
      <h5 style="font-weight: 600; color: #701a75; margin-bottom: 8px; font-size: 14px;">Example</h5>
      <p style="font-size: 14px; color: #374151; font-style: italic;">"${bf.brandVoice.example}"</p>
    </div>
  </div>

  <!-- Competitive Advantages -->
  <div style="background: linear-gradient(to bottom right, #fef3c7, #fed7aa); padding: 24px; border-radius: 12px; border: 2px solid #fbbf24; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">🏆</span> Competitive Advantages
    </h4>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
      ${bf.competitiveAdvantages.map((adv, i) => `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #fbbf24;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #eab308; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">${i + 1}</div>
            <div>
              <h5 style="font-weight: 700; color: #1f2937; margin-bottom: 8px;">${adv.advantage}</h5>
              <p style="font-size: 14px; color: #374151; margin-bottom: 8px;">${adv.description}</p>
              <p style="font-size: 12px; color: #b45309; font-weight: 500;"><strong>Impact:</strong> ${adv.impact}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Strategic Priorities -->
  <div style="background: linear-gradient(to bottom right, #eef2ff, #dbeafe); padding: 24px; border-radius: 12px; border: 2px solid #818cf8; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">🎯</span> Strategic Priorities
    </h4>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${bf.strategicPriorities.map((priority, i) => `
        <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #818cf8;">
          <div style="display: flex; align-items: start; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #4f46e5; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 14px;">${i + 1}</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <h5 style="font-weight: 700; color: #1f2937;">${priority.priority}</h5>
                <span style="font-size: 12px; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 20px; font-weight: 600;">${priority.timeline}</span>
              </div>
              <p style="font-size: 14px; color: #374151; margin-bottom: 8px;">${priority.description}</p>
              <p style="font-size: 12px; color: #4338ca; font-weight: 500;"><strong>Expected Impact:</strong> ${priority.impact}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Industry Context -->
  <div style="background: linear-gradient(to bottom right, #f9fafb, #f1f5f9); padding: 24px; border-radius: 12px; border: 2px solid #e5e7eb; margin-bottom: 16px;">
    <h4 style="font-weight: 700; font-size: 18px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">📊</span> Industry Context: ${projectData.stage1.businessVertical}
    </h4>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h5 style="font-weight: 600; color: #1e3a8a; margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; gap: 8px;"><span>📈</span> Trends</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.industryContext.trends.map(t => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <span style="color: #2563eb; margin-top: 4px;">•</span>
              <span>${t}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h5 style="font-weight: 600; color: #065f46; margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; gap: 8px;"><span>💡</span> Opportunities</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.industryContext.opportunities.map(o => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <span style="color: #059669; margin-top: 4px;">•</span>
              <span>${o}</span>
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h5 style="font-weight: 600; color: #7f1d1d; margin-bottom: 12px; font-size: 14px; display: flex; align-items: center; gap: 8px;"><span>⚠️</span> Challenges</h5>
        <ul style="list-style: none; padding: 0;">
          ${bf.industryContext.challenges.map(c => `
            <li style="font-size: 14px; color: #374151; display: flex; align-items: start; gap: 8px; margin-bottom: 8px;">
              <span style="color: #dc2626; margin-top: 4px;">•</span>
              <span>${c}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  </div>

  <!-- Strategic Campaigns -->
  <div style="background: linear-gradient(to bottom right, #fff1f2, #fce7f3); padding: 24px; border-radius: 12px; border: 2px solid #fda4af; margin-bottom: 16px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <h4 style="font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">🎪</span> Strategic Campaign Recommendations
        <span style="font-size: 14px; font-weight: 400; color: #4b5563; margin-left: 8px;">(${campaigns.length} Campaigns)</span>
      </h4>
    </div>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${campaigns.map((campaign, i) => `
        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #fda4af;">
          <div style="display: flex; align-items: start; gap: 16px;">
            <div style="width: 48px; height: 48px; background: linear-gradient(to bottom right, #f43f5e, #ec4899); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-shrink: 0;">${i + 1}</div>
            <div style="flex: 1;">
              <div style="margin-bottom: 12px;">
                <h5 style="font-weight: 700; color: #1f2937; font-size: 18px; margin-bottom: 4px;">${campaign.name}</h5>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="font-size: 12px; padding: 4px 12px; background: #ffe4e6; color: #be123c; border-radius: 20px; font-weight: 600;">${campaign.objective}</span>
                  <span style="font-size: 12px; padding: 4px 12px; background: #f3e8ff; color: #6b21a8; border-radius: 20px; font-weight: 600;">${campaign.duration}</span>
                  <span style="font-size: 12px; padding: 4px 12px; background: #fef3c7; color: #b45309; border-radius: 20px; font-weight: 600;">${campaign.budget} Budget</span>
                </div>
              </div>
              <p style="font-size: 14px; color: #374151; margin-bottom: 12px; line-height: 1.6;">${campaign.description}</p>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
                <div style="background: #eff6ff; padding: 12px; border-radius: 8px; border: 1px solid #93c5fd;">
                  <h6 style="font-size: 12px; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">🎯 Target</h6>
                  <p style="font-size: 14px; color: #374151;">${campaign.targetSegment}</p>
                </div>
                <div style="background: #d1fae5; padding: 12px; border-radius: 8px; border: 1px solid #86efac;">
                  <h6 style="font-size: 12px; font-weight: 600; color: #065f46; margin-bottom: 8px;">💬 Message</h6>
                  <p style="font-size: 14px; color: #374151;">${campaign.keyMessage}</p>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div>
                  <h6 style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Platforms</h6>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${campaign.platforms.map(p => `<span style="font-size: 12px; padding: 4px 8px; background: #f3f4f6; border-radius: 4px;">${p}</span>`).join('')}
                  </div>
                </div>
                <div>
                  <h6 style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">Content Types</h6>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${campaign.contentTypes.map(c => `<span style="font-size: 12px; padding: 4px 8px; background: #f3f4f6; border-radius: 4px;">${c}</span>`).join('')}
                  </div>
                </div>
              </div>
              <div style="margin-top: 12px;">
                <h6 style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px;">KPIs</h6>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${campaign.kpis.map(kpi => `<span style="font-size: 12px; padding: 4px 8px; background: #e0e7ff; color: #4338ca; border-radius: 4px;">${kpi}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 8px; text-align: center; border: 1px solid #cbd5e1;">
    <p style="color: #6b7280;">Generated by BrandStory AI Content Platform</p>
  </div>
</body>
</html>
    `;

    downloadHTML('Brand_Analysis.html', htmlContent);
  };

  const downloadStage1PDF = () => {
    if (!projectData.stage1.brandFundamentals) {
      alert('No brand analysis data to download');
      return;
    }

    const bf = projectData.stage1.brandFundamentals;
    const campaigns = projectData.stage1.campaigns;

    const pdfHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Analysis - ${projectData.stage1.websiteUrl}</title>
  <style>
    @media print {
      @page { margin: 1cm; }
      body { margin: 0; }
    }
    body { font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: white; }
    h1 { color: #1e40af; font-size: 28px; margin-bottom: 20px; }
    h2 { color: #4f46e5; font-size: 20px; margin-top: 20px; margin-bottom: 12px; padding: 10px; background: #dbeafe; border-radius: 6px; page-break-after: avoid; }
    h3 { color: #374151; font-size: 16px; margin-top: 15px; margin-bottom: 8px; }
    h4 { color: #6b7280; font-size: 14px; font-weight: 600; margin-top: 10px; margin-bottom: 6px; }
    .section { background: #f9fafb; padding: 12px; margin: 12px 0; border-radius: 6px; border: 1px solid #e5e7eb; page-break-inside: avoid; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 10px 0; }
    .card { background: white; padding: 10px; border-radius: 6px; border: 1px solid #e5e7eb; page-break-inside: avoid; }
    ul { list-style: none; padding: 0; margin: 5px 0; }
    li { padding: 3px 0; font-size: 13px; }
    li:before { content: "• "; color: #6366f1; font-weight: bold; }
    p { font-size: 14px; margin: 5px 0; line-height: 1.5; }
    .value-tag { display: inline-block; padding: 4px 10px; margin: 3px; background: #fed7aa; border-radius: 12px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <h1>🧠 Brand Analysis Report</h1>
  <p><strong>Website:</strong> ${projectData.stage1.websiteUrl}</p>
  <p><strong>Industry:</strong> ${projectData.stage1.businessVertical}</p>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  <hr/>

  <h2>Business Nature</h2>
  <div class="section">
    <p>${bf.businessNature}</p>
  </div>

  <h2>Mission & Vision</h2>
  <div class="grid">
    <div class="card">
      <h4>🎯 Mission</h4>
      <p>${bf.mission}</p>
    </div>
    <div class="card">
      <h4>🌟 Vision</h4>
      <p>${bf.vision}</p>
    </div>
  </div>

  <h2>Core Values</h2>
  <div class="section">
    ${bf.values.map(v => `<span class="value-tag">${v}</span>`).join('')}
  </div>

  <h2>Target Audience Intelligence</h2>
  <div class="section">
    <div class="grid">
      <div class="card">
        <h4>📊 Demographics</h4>
        <p>${bf.targetAudience.demographic}</p>
      </div>
      <div class="card">
        <h4>🧠 Psychographics</h4>
        <p>${bf.targetAudience.psychographic}</p>
      </div>
    </div>
    <div class="grid" style="margin-top: 10px;">
      <div class="card">
        <h4>😰 Pain Points</h4>
        <ul>${bf.targetAudience.painPoints.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h4>✨ Aspirations</h4>
        <ul>${bf.targetAudience.aspirations.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="card" style="margin-top: 10px;">
      <h4>📱 Content Habits</h4>
      <p>${bf.targetAudience.contentHabits}</p>
    </div>
  </div>

  <h2>Unique Value Proposition</h2>
  <div class="section">
    <p style="font-weight: 600; margin-bottom: 10px; font-size: 16px;">${bf.uniqueValue.primary}</p>
    <div class="grid">
      <div class="card">
        <h4>Supporting Points</h4>
        <ul>${bf.uniqueValue.supporting.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h4>Proof Points</h4>
        <ul>${bf.uniqueValue.proofPoints.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    </div>
  </div>

  <h2>Brand Voice & Personality</h2>
  <div class="section">
    <p style="margin-bottom: 10px;">${bf.brandVoice.description}</p>
    <div class="grid">
      <div class="card">
        <h4>Tone Attributes</h4>
        <p>${bf.brandVoice.toneAttributes.join(', ')}</p>
      </div>
      <div class="card">
        <h4>✅ Do</h4>
        <ul>${bf.brandVoice.doStatements.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="grid" style="margin-top: 10px;">
      <div class="card">
        <h4>❌ Don't</h4>
        <ul>${bf.brandVoice.dontStatements.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>
      <div class="card">
        <h4>Example</h4>
        <p><em>"${bf.brandVoice.example}"</em></p>
      </div>
    </div>
  </div>

  <h2>Competitive Advantages</h2>
  ${bf.competitiveAdvantages.map((adv, i) => `
    <div class="section">
      <h3>${i + 1}. ${adv.advantage}</h3>
      <p>${adv.description}</p>
      <p style="font-size: 12px; color: #b45309;"><strong>Impact:</strong> ${adv.impact}</p>
    </div>
  `).join('')}

  <h2>Strategic Priorities</h2>
  ${bf.strategicPriorities.map((priority, i) => `
    <div class="section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 style="margin: 0;">${i + 1}. ${priority.priority}</h3>
        <span style="font-size: 11px; padding: 3px 8px; background: #e0e7ff; color: #4338ca; border-radius: 10px; font-weight: 600;">${priority.timeline}</span>
      </div>
      <p>${priority.description}</p>
      <p style="font-size: 12px; color: #4338ca;"><strong>Expected Impact:</strong> ${priority.impact}</p>
    </div>
  `).join('')}

  <h2>Industry Context: ${projectData.stage1.businessVertical}</h2>
  <div class="section">
    <h4>📈 Trends</h4>
    <ul>${bf.industryContext.trends.map(t => `<li>${t}</li>`).join('')}</ul>
    <h4 style="margin-top: 15px;">💡 Opportunities</h4>
    <ul>${bf.industryContext.opportunities.map(o => `<li>${o}</li>`).join('')}</ul>
    <h4 style="margin-top: 15px;">⚠️ Challenges</h4>
    <ul>${bf.industryContext.challenges.map(c => `<li>${c}</li>`).join('')}</ul>
  </div>

  <h2>Strategic Campaign Recommendations (${campaigns.length} Campaigns)</h2>
  ${campaigns.map((campaign, i) => `
    <div class="section">
      <h3>${i + 1}. ${campaign.name}</h3>
      <div style="margin: 8px 0;">
        <span style="font-size: 11px; padding: 3px 8px; margin-right: 5px; background: #ffe4e6; color: #be123c; border-radius: 10px; font-weight: 600;">${campaign.objective}</span>
        <span style="font-size: 11px; padding: 3px 8px; margin-right: 5px; background: #f3e8ff; color: #6b21a8; border-radius: 10px; font-weight: 600;">${campaign.duration}</span>
        <span style="font-size: 11px; padding: 3px 8px; background: #fef3c7; color: #b45309; border-radius: 10px; font-weight: 600;">${campaign.budget} Budget</span>
      </div>
      <p style="margin: 10px 0;">${campaign.description}</p>
      <div class="grid">
        <div class="card">
          <h4>🎯 Target</h4>
          <p>${campaign.targetSegment}</p>
        </div>
        <div class="card">
          <h4>💬 Key Message</h4>
          <p>${campaign.keyMessage}</p>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <h4>Platforms</h4>
        <p>${campaign.platforms.join(', ')}</p>
        <h4>Content Types</h4>
        <p>${campaign.contentTypes.join(', ')}</p>
        <h4>KPIs</h4>
        <p>${campaign.kpis.join(', ')}</p>
      </div>
    </div>
  `).join('')}

  <div style="margin-top: 40px; padding: 15px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb;">
    <p>Generated by BrandStory AI Content Platform</p>
  </div>
</body>
</html>
    `;

    downloadPDF(pdfHTML);
  };

  const downloadStage1DOC = () => {
    if (!projectData.stage1.brandFundamentals) {
      alert('No brand analysis data to download');
      return;
    }

    const bf = projectData.stage1.brandFundamentals;
    const campaigns = projectData.stage1.campaigns;

    let docContent = '<h1>Brand Analysis Report</h1>';
    docContent += `<p><strong>Website:</strong> ${projectData.stage1.websiteUrl}</p>`;
    docContent += `<p><strong>Industry:</strong> ${projectData.stage1.businessVertical}</p>`;
    docContent += `<p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p><hr/>`;

    docContent += '<h2>Business Nature</h2>';
    docContent += `<p>${bf.businessNature}</p>`;

    docContent += '<h2>Mission</h2>';
    docContent += `<p>${bf.mission}</p>`;

    docContent += '<h2>Vision</h2>';
    docContent += `<p>${bf.vision}</p>`;

    docContent += '<h2>Core Values</h2>';
    docContent += `<p>${bf.values.join(' • ')}</p>`;

    docContent += '<h2>Target Audience Intelligence</h2>';
    docContent += `<p><strong>Demographics:</strong> ${bf.targetAudience.demographic}</p>`;
    docContent += `<p><strong>Psychographics:</strong> ${bf.targetAudience.psychographic}</p>`;
    docContent += '<p><strong>Pain Points:</strong></p><ul>';
    bf.targetAudience.painPoints.forEach(p => {
      docContent += `<li>${p}</li>`;
    });
    docContent += '</ul>';
    docContent += '<p><strong>Aspirations:</strong></p><ul>';
    bf.targetAudience.aspirations.forEach(a => {
      docContent += `<li>${a}</li>`;
    });
    docContent += '</ul>';
    docContent += `<p><strong>Content Habits:</strong> ${bf.targetAudience.contentHabits}</p>`;

    docContent += '<h2>Unique Value Proposition</h2>';
    docContent += `<p>${bf.uniqueValue.primary}</p>`;
    docContent += '<p><strong>Supporting Points:</strong></p><ul>';
    bf.uniqueValue.supporting.forEach(s => {
      docContent += `<li>${s}</li>`;
    });
    docContent += '</ul>';
    docContent += '<p><strong>Proof Points:</strong></p><ul>';
    bf.uniqueValue.proofPoints.forEach(p => {
      docContent += `<li>${p}</li>`;
    });
    docContent += '</ul>';

    docContent += '<h2>Brand Voice & Personality</h2>';
    docContent += `<p>${bf.brandVoice.description}</p>`;
    docContent += '<p><strong>Tone Attributes:</strong></p>';
    docContent += `<p>${bf.brandVoice.toneAttributes.join(', ')}</p>`;
    docContent += '<p><strong>Do:</strong></p><ul>';
    bf.brandVoice.doStatements.forEach(d => {
      docContent += `<li>${d}</li>`;
    });
    docContent += '</ul>';
    docContent += '<p><strong>Don\'t:</strong></p><ul>';
    bf.brandVoice.dontStatements.forEach(d => {
      docContent += `<li>${d}</li>`;
    });
    docContent += '</ul>';
    docContent += `<p><strong>Example:</strong> "${bf.brandVoice.example}"</p>`;

    docContent += '<h2>Competitive Advantages</h2>';
    bf.competitiveAdvantages.forEach((adv, i) => {
      docContent += `<h3>${i + 1}. ${adv.advantage}</h3>`;
      docContent += `<p>${adv.description}</p>`;
      docContent += `<p><strong>Impact:</strong> ${adv.impact}</p>`;
    });

    docContent += '<h2>Strategic Priorities</h2>';
    bf.strategicPriorities.forEach((priority, i) => {
      docContent += `<h3>${i + 1}. ${priority.priority}</h3>`;
      docContent += `<p><strong>Timeline:</strong> ${priority.timeline}</p>`;
      docContent += `<p>${priority.description}</p>`;
      docContent += `<p><strong>Expected Impact:</strong> ${priority.impact}</p>`;
    });

    docContent += `<h2>Industry Context: ${projectData.stage1.businessVertical}</h2>`;
    docContent += '<p><strong>Trends:</strong></p><ul>';
    bf.industryContext.trends.forEach(t => {
      docContent += `<li>${t}</li>`;
    });
    docContent += '</ul>';
    docContent += '<p><strong>Opportunities:</strong></p><ul>';
    bf.industryContext.opportunities.forEach(o => {
      docContent += `<li>${o}</li>`;
    });
    docContent += '</ul>';
    docContent += '<p><strong>Challenges:</strong></p><ul>';
    bf.industryContext.challenges.forEach(c => {
      docContent += `<li>${c}</li>`;
    });
    docContent += '</ul>';

    docContent += `<h2>Strategic Campaign Recommendations (${campaigns.length} Campaigns)</h2>`;
    campaigns.forEach((campaign, i) => {
      docContent += `<h3>${i + 1}. ${campaign.name}</h3>`;
      docContent += `<p><strong>Objective:</strong> ${campaign.objective}</p>`;
      docContent += `<p><strong>Duration:</strong> ${campaign.duration}</p>`;
      docContent += `<p><strong>Budget:</strong> ${campaign.budget}</p>`;
      docContent += `<p>${campaign.description}</p>`;
      docContent += `<p><strong>Target Segment:</strong> ${campaign.targetSegment}</p>`;
      docContent += `<p><strong>Key Message:</strong> ${campaign.keyMessage}</p>`;
      docContent += `<p><strong>Platforms:</strong> ${campaign.platforms.join(', ')}</p>`;
      docContent += `<p><strong>Content Types:</strong> ${campaign.contentTypes.join(', ')}</p>`;
      docContent += `<p><strong>KPIs:</strong> ${campaign.kpis.join(', ')}</p><br/>`;
    });

    downloadDOC('Brand_Analysis.doc', docContent);
  };

  const downloadStage1CSV = () => {
    if (!projectData.stage1.brandFundamentals) {
      alert('No brand analysis data to download');
      return;
    }

    const bf = projectData.stage1.brandFundamentals;
    const campaigns = projectData.stage1.campaigns;

    const escapeCSV = (str: string) => {
      if (!str) return '';
      return `"${str.replace(/"/g, '""')}"`;
    };

    let csvContent = 'Section,Field,Content\n';

    // Basic Info
    csvContent += `Basic Info,Website,${escapeCSV(projectData.stage1.websiteUrl)}\n`;
    csvContent += `Basic Info,Industry,${escapeCSV(projectData.stage1.businessVertical)}\n`;
    csvContent += `Basic Info,Business Nature,${escapeCSV(bf.businessNature)}\n`;

    // Mission & Vision
    csvContent += `Mission & Vision,Mission,${escapeCSV(bf.mission)}\n`;
    csvContent += `Mission & Vision,Vision,${escapeCSV(bf.vision)}\n`;

    // Core Values
    bf.values.forEach((value, i) => {
      csvContent += `Core Values,Value ${i + 1},${escapeCSV(value)}\n`;
    });

    // Target Audience
    csvContent += `Target Audience,Demographics,${escapeCSV(bf.targetAudience.demographic)}\n`;
    csvContent += `Target Audience,Psychographics,${escapeCSV(bf.targetAudience.psychographic)}\n`;
    bf.targetAudience.painPoints.forEach((pain, i) => {
      csvContent += `Target Audience,Pain Point ${i + 1},${escapeCSV(pain)}\n`;
    });
    bf.targetAudience.aspirations.forEach((asp, i) => {
      csvContent += `Target Audience,Aspiration ${i + 1},${escapeCSV(asp)}\n`;
    });
    csvContent += `Target Audience,Content Habits,${escapeCSV(bf.targetAudience.contentHabits)}\n`;

    // UVP
    csvContent += `Value Proposition,Primary UVP,${escapeCSV(bf.uniqueValue.primary)}\n`;
    bf.uniqueValue.supporting.forEach((point, i) => {
      csvContent += `Value Proposition,Supporting Point ${i + 1},${escapeCSV(point)}\n`;
    });
    bf.uniqueValue.proofPoints.forEach((proof, i) => {
      csvContent += `Value Proposition,Proof Point ${i + 1},${escapeCSV(proof)}\n`;
    });

    // Brand Voice
    csvContent += `Brand Voice,Description,${escapeCSV(bf.brandVoice.description)}\n`;
    bf.brandVoice.toneAttributes.forEach((attr, i) => {
      csvContent += `Brand Voice,Tone Attribute ${i + 1},${escapeCSV(attr)}\n`;
    });
    bf.brandVoice.doStatements.forEach((stmt, i) => {
      csvContent += `Brand Voice,Do ${i + 1},${escapeCSV(stmt)}\n`;
    });
    bf.brandVoice.dontStatements.forEach((stmt, i) => {
      csvContent += `Brand Voice,Don't ${i + 1},${escapeCSV(stmt)}\n`;
    });
    csvContent += `Brand Voice,Example,${escapeCSV(bf.brandVoice.example)}\n`;

    // Competitive Advantages
    bf.competitiveAdvantages.forEach((adv, i) => {
      csvContent += `Competitive Advantage ${i + 1},Name,${escapeCSV(adv.advantage)}\n`;
      csvContent += `Competitive Advantage ${i + 1},Description,${escapeCSV(adv.description)}\n`;
      csvContent += `Competitive Advantage ${i + 1},Impact,${escapeCSV(adv.impact)}\n`;
    });

    // Strategic Priorities
    bf.strategicPriorities.forEach((priority, i) => {
      csvContent += `Strategic Priority ${i + 1},Name,${escapeCSV(priority.priority)}\n`;
      csvContent += `Strategic Priority ${i + 1},Description,${escapeCSV(priority.description)}\n`;
      csvContent += `Strategic Priority ${i + 1},Timeline,${escapeCSV(priority.timeline)}\n`;
      csvContent += `Strategic Priority ${i + 1},Impact,${escapeCSV(priority.impact)}\n`;
    });

    // Industry Context
    bf.industryContext.trends.forEach((trend, i) => {
      csvContent += `Industry Context,Trend ${i + 1},${escapeCSV(trend)}\n`;
    });
    bf.industryContext.opportunities.forEach((opp, i) => {
      csvContent += `Industry Context,Opportunity ${i + 1},${escapeCSV(opp)}\n`;
    });
    bf.industryContext.challenges.forEach((challenge, i) => {
      csvContent += `Industry Context,Challenge ${i + 1},${escapeCSV(challenge)}\n`;
    });

    // Campaigns
    campaigns.forEach((campaign, i) => {
      csvContent += `Campaign ${i + 1},Name,${escapeCSV(campaign.name)}\n`;
      csvContent += `Campaign ${i + 1},Objective,${escapeCSV(campaign.objective)}\n`;
      csvContent += `Campaign ${i + 1},Duration,${escapeCSV(campaign.duration)}\n`;
      csvContent += `Campaign ${i + 1},Budget,${escapeCSV(campaign.budget)}\n`;
      csvContent += `Campaign ${i + 1},Description,${escapeCSV(campaign.description)}\n`;
      csvContent += `Campaign ${i + 1},Target,${escapeCSV(campaign.targetSegment)}\n`;
      csvContent += `Campaign ${i + 1},Key Message,${escapeCSV(campaign.keyMessage)}\n`;
      csvContent += `Campaign ${i + 1},Platforms,${escapeCSV(campaign.platforms.join(', '))}\n`;
      csvContent += `Campaign ${i + 1},Content Types,${escapeCSV(campaign.contentTypes.join(', '))}\n`;
      csvContent += `Campaign ${i + 1},KPIs,${escapeCSV(campaign.kpis.join(', '))}\n`;
    });

    downloadCSV('Brand_Analysis.csv', csvContent);
  };

  const downloadStage3 = () => {
    if (projectData.stage2.generatedContents.length === 0) {
      alert('No generated content to download');
      return;
    }

    const renderContentHTML = (content: GeneratedContent): string => {
      // CAROUSEL
      if (content.contentStructure === 'multi-slide' && content.slides) {
        return `
          <div style="margin-bottom: 12px;">
            ${content.slides.map((slide: Slide) => `
              <div style="padding: 16px; margin: 12px 0; border-radius: 8px; border: 2px solid ${
                slide.type === 'cover' ? '#a78bfa' :
                slide.type === 'cta' ? '#86efac' :
                '#93c5fd'
              }; background: ${
                slide.type === 'cover' ? '#faf5ff' :
                slide.type === 'cta' ? '#f0fdf4' :
                '#eff6ff'
              };">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 32px; height: 32px; background: #1f2937; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">${slide.slideNumber}</div>
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280;">${slide.type || 'content'}</span>
                </div>
                <h5 style="font-weight: 700; margin-bottom: 4px; font-size: 16px;">${slide.headline}</h5>
                ${slide.subheadline ? `<p style="font-size: 14px; margin-bottom: 8px;">${slide.subheadline}</p>` : ''}
                ${slide.content ? `<p style="font-size: 14px; margin-bottom: 8px;">${slide.content}</p>` : ''}
                ${slide.cta ? `<p style="font-weight: 700; color: #059669; font-size: 14px;">👉 ${slide.cta}</p>` : ''}
                <p style="font-size: 12px; color: #6b7280; font-style: italic; margin-top: 8px;">Visual: ${slide.visualDirection}</p>
              </div>
            `).join('')}
            ${content.caption ? `
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 12px;">
                <p style="font-size: 11px; font-weight: 700; margin-bottom: 8px; color: #374151;">CAPTION</p>
                <p style="font-size: 14px;">${content.caption}</p>
              </div>
            ` : ''}
          </div>
        `;
      }

      // INFOGRAPHIC
      if (content.contentStructure === 'data-visual' && content.dataPoints) {
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: linear-gradient(to right, #eff6ff, #f3e8ff); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
              <h5 style="font-weight: 700; font-size: 20px; margin-bottom: 4px;">${content.title}</h5>
              ${content.subtitle ? `<p style="font-size: 14px; color: #4b5563;">${content.subtitle}</p>` : ''}
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              ${content.dataPoints.map((point: DataPoint) => `
                <div style="background: white; padding: 16px; border-radius: 8px; border: 2px solid #e5e7eb;">
                  <div style="font-size: 30px; font-weight: 700; color: #2563eb; margin-bottom: 8px;">${point.statistic}</div>
                  <p style="font-size: 14px; margin-bottom: 4px;">${point.description}</p>
                  <p style="font-size: 12px; color: #6b7280;">Source: ${point.source}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // THREAD
      if (content.contentStructure === 'thread' && content.tweets) {
        return `
          <div style="margin-bottom: 8px;">
            ${content.tweets.map((tweet: Tweet) => {
              const isOver = (tweet.characterCount ?? 0) > 280;
              return `
                <div style="padding: 12px; margin: 8px 0; border-radius: 8px; border: 2px solid ${isOver ? '#fca5a5' : '#93c5fd'}; background: ${isOver ? '#fee2e2' : '#eff6ff'};">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 12px; font-weight: 600;">Tweet ${tweet.tweetNumber}</span>
                    <span style="font-size: 12px; font-weight: 700; color: ${isOver ? '#dc2626' : '#059669'};">${tweet.characterCount}/280</span>
                  </div>
                  <p style="font-size: 14px;">${tweet.content}</p>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      // VIDEO SCRIPT
      if (content.contentStructure === 'video-script' && content.script) {
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; border: 2px solid #fbbf24; margin: 12px 0;">
              <h5 style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">🎬 HOOK (${content.script.hook.timing})</h5>
              <p style="font-size: 14px; margin-bottom: 4px;"><strong>Voiceover:</strong> ${content.script.hook.voiceover}</p>
              <p style="font-size: 12px; color: #4b5563;"><strong>Visual:</strong> ${content.script.hook.visual}</p>
              <p style="font-size: 12px; color: #4b5563;"><strong>Text:</strong> ${content.script.hook.textOverlay}</p>
            </div>
            ${content.script.content.map((seg: ScriptSegment, idx: number) => `
              <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
                <h5 style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">📹 SEGMENT ${idx + 1} (${seg.timing})</h5>
                <p style="font-size: 14px; margin-bottom: 4px;"><strong>Voiceover:</strong> ${seg.voiceover}</p>
                <p style="font-size: 12px; color: #4b5563;"><strong>Visual:</strong> ${seg.visual}</p>
              </div>
            `).join('')}
            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; border: 2px solid #34d399; margin: 12px 0;">
              <h5 style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">📢 CTA (${content.script.cta.timing})</h5>
              <p style="font-size: 14px;">${content.script.cta.voiceover}</p>
            </div>
          </div>
        `;
      }

      // STORY FRAMES
      if (content.contentStructure === 'story-frames' && content.frames) {
        return `
          <div style="margin-bottom: 12px;">
            ${content.frames.map((frame: Frame) => `
              <div style="padding: 16px; margin: 12px 0; border-radius: 8px; border: 2px solid ${
                frame.type === 'opener' ? '#a78bfa' :
                frame.type === 'cta' ? '#86efac' :
                '#93c5fd'
              }; background: ${
                frame.type === 'opener' ? '#faf5ff' :
                frame.type === 'cta' ? '#f0fdf4' :
                '#eff6ff'
              };">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 32px; height: 32px; background: #1f2937; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">${frame.frameNumber}</div>
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #6b7280;">${frame.type}</span>
                </div>
                <p style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">${frame.text}</p>
                <p style="font-size: 12px; color: #4b5563;">📸 ${frame.visual}</p>
                <p style="font-size: 12px; color: #9333ea;">💫 ${frame.interactive}</p>
              </div>
            `).join('')}
          </div>
        `;
      }

      // EMAIL
      if (content.contentStructure === 'email' && content.subjectLine) {
        const body = content.body as EmailBody;
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: #faf5ff; padding: 16px; border-radius: 8px; border: 2px solid #c084fc; margin-bottom: 12px;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">📧 SUBJECT</p>
              <p style="font-size: 18px; font-weight: 700;">${content.subjectLine}</p>
              ${content.preheader ? `<p style="font-size: 14px; color: #4b5563; margin-top: 8px;">${content.preheader}</p>` : ''}
            </div>
            ${body ? `
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="font-size: 14px; margin-bottom: 8px;">${body.greeting}</p>
                <p style="font-size: 14px; margin-bottom: 12px;">${body.opening}</p>
                <p style="font-size: 14px; margin-bottom: 12px;">${body.mainContent}</p>
                ${body.benefits ? `
                  <ul style="margin-bottom: 12px; padding-left: 0; list-style: none;">
                    ${body.benefits.map((b: string) => `
                      <li style="font-size: 14px; display: flex; gap: 8px; margin-bottom: 4px;">
                        <span style="color: #059669;">✓</span>
                        <span>${b}</span>
                      </li>
                    `).join('')}
                  </ul>
                ` : ''}
                <div style="text-align: center; margin: 16px 0;">
                  <button style="padding: 12px 24px; background: #2563eb; color: white; border-radius: 8px; font-weight: 600; border: none; font-size: 14px;">${body.cta}</button>
                </div>
                <p style="font-size: 14px;">${body.closing}</p>
              </div>
            ` : ''}
          </div>
        `;
      }

      // BLOG
      if (content.contentStructure === 'long-form' && content.sections) {
        return `
          <div style="margin-bottom: 16px;">
            <div style="background: #eef2ff; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
              <h5 style="font-weight: 700; font-size: 24px; margin-bottom: 8px;">${content.title}</h5>
              ${content.metaDescription ? `<p style="font-size: 14px; font-style: italic;">${content.metaDescription}</p>` : ''}
            </div>
            ${content.introduction ? `
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 12px;">
                <p style="font-size: 14px;">${content.introduction}</p>
              </div>
            ` : ''}
            ${content.sections.map((sec: Section) => `
              <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
                <h6 style="font-weight: 700; font-size: 18px; margin-bottom: 8px;">${sec.heading}</h6>
                <p style="font-size: 14px; margin-bottom: 8px;">${sec.content}</p>
                ${sec.keyPoints ? `
                  <ul style="padding-left: 0; list-style: none; margin-top: 8px;">
                    ${sec.keyPoints.map((p: string) => `
                      <li style="font-size: 14px; display: flex; gap: 8px; margin-bottom: 4px;">
                        <span>•</span>
                        <span>${p}</span>
                      </li>
                    `).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      // AD
      if (content.contentStructure === 'ad' && content.headline) {
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; border: 2px solid #fbbf24; margin-bottom: 12px;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">📢 HEADLINE</p>
              <p style="font-size: 20px; font-weight: 700;">${content.headline}</p>
            </div>
            ${content.primaryText ? `
              <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
                <p style="font-size: 14px;">${content.primaryText}</p>
              </div>
            ` : ''}
            <div style="text-align: center; margin: 12px 0;">
              <button style="padding: 12px 24px; background: #2563eb; color: white; border-radius: 8px; font-weight: 700; border: none; font-size: 14px;">${content.cta}</button>
            </div>
          </div>
        `;
      }

      // DEFAULT SINGLE POST
      return `
        <div style="margin-bottom: 16px;">
          ${content.hook ? `
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 12px 0;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">🪝 HOOK</p>
              <p style="font-size: 14px;">${content.hook}</p>
            </div>
          ` : ''}
          ${content.body && typeof content.body === 'string' ? `
            <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">📝 CONTENT</p>
              <p style="font-size: 14px;">${content.body}</p>
            </div>
          ` : ''}
          ${content.cta ? `
            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; margin: 12px 0;">
              <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">📢 CTA</p>
              <p style="font-size: 14px; font-weight: 600;">${content.cta}</p>
            </div>
          ` : ''}
        </div>
      `;
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; max-width: 1200px; margin: 0 auto; padding: 24px; background: linear-gradient(to bottom right, #fff7ed, #fed7aa); }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    h1, h2, h3, h4, h5, h6, p { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div style="background: linear-gradient(to right, #fff7ed, #fed7aa); padding: 24px; border-radius: 12px; border: 1px solid #fb923c; margin-bottom: 24px;">
    <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">AI Content Writer</h2>
    <p style="color: #4b5563; font-size: 14px;">Review and refine your generated content</p>
  </div>

  <div style="background: #d1fae5; padding: 16px; border-radius: 8px; border: 2px solid #86efac; margin-bottom: 24px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 24px;">✅</span>
      <p style="font-weight: 600; color: #065f46;">${projectData.stage2.generatedContents.length} content pieces loaded and ready</p>
    </div>
  </div>

  ${projectData.stage2.generatedContents.map((content: GeneratedContent) => `
    <div style="background: white; padding: 24px; border-radius: 12px; border: 2px solid #e5e7eb; margin-bottom: 16px; page-break-inside: avoid;">
      <div style="display: flex; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #f3f4f6;">
        <div style="width: 48px; height: 48px; background: #ea580c; color: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0;">
          #${content.contentNumber}
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${content.title}</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 12px; padding: 4px 8px; background: #fed7aa; color: #9a3412; border-radius: 4px; font-weight: 600;">${content.platform}</span>
            <span style="font-size: 12px; padding: 4px 8px; background: #bfdbfe; color: #1e3a8a; border-radius: 4px; font-weight: 600;">${content.contentType}</span>
          </div>
        </div>
      </div>
      
      ${renderContentHTML(content)}
      
      ${content.hashtags && content.hashtags.length > 0 ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;"># HASHTAGS</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${content.hashtags.map((tag: string) => `<span style="font-size: 14px; padding: 4px 12px; background: #f3f4f6; border-radius: 20px;">#${tag}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div style="margin-top: 32px; background: linear-gradient(to right, #d1fae5, #a7f3d0); padding: 24px; border-radius: 12px; border: 2px solid #86efac; text-align: center;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
      <span style="font-size: 32px;">✅</span>
      <h3 style="font-size: 24px; font-weight: 700; color: #065f46;">Content Creation Complete!</h3>
    </div>
    <p style="color: #047857;">Your AI-generated content is ready for use. You can copy, edit, and share your content across all selected platforms.</p>
  </div>

  <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 8px; text-align: center; border: 1px solid #cbd5e1;">
    <p style="color: #6b7280;">Generated by BrandStory AI Content Platform</p>
  </div>
</body>
</html>
    `;

    downloadHTML('Generated_Content.html', htmlContent);
  };

  const downloadStage3DOC = () => {
    if (projectData.stage2.generatedContents.length === 0) {
      alert('No generated content to download');
      return;
    }

    const renderContentDOC = (content: GeneratedContent): string => {
      let docContent = `<h3>#${content.contentNumber} - ${content.title}</h3>`;
      docContent += `<p><strong>Platform:</strong> ${content.platform} | <strong>Type:</strong> ${content.contentType}</p><hr/>`;

      // CAROUSEL
      if (content.contentStructure === 'multi-slide' && content.slides) {
        content.slides.forEach((slide: Slide) => {
          docContent += `<h4>Slide ${slide.slideNumber} (${slide.type || 'content'})</h4>`;
          docContent += `<p><strong>${slide.headline}</strong></p>`;
          if (slide.subheadline) docContent += `<p>${slide.subheadline}</p>`;
          if (slide.content) docContent += `<p>${slide.content}</p>`;
          if (slide.cta) docContent += `<p><strong>CTA:</strong> ${slide.cta}</p>`;
          docContent += `<p><em>Visual: ${slide.visualDirection}</em></p><br/>`;
        });
        if (content.caption) docContent += `<p><strong>Caption:</strong> ${content.caption}</p>`;
      }
      // INFOGRAPHIC
      else if (content.contentStructure === 'data-visual' && content.dataPoints) {
        docContent += `<h4>${content.title}</h4>`;
        if (content.subtitle) docContent += `<p>${content.subtitle}</p>`;
        content.dataPoints.forEach((point: DataPoint) => {
          docContent += `<p><strong>${point.statistic}</strong> - ${point.description}</p>`;
          docContent += `<p><em>Source: ${point.source}</em></p>`;
        });
      }
      // THREAD
      else if (content.contentStructure === 'thread' && content.tweets) {
        content.tweets.forEach((tweet: Tweet) => {
          docContent += `<p><strong>Tweet ${tweet.tweetNumber}</strong> (${tweet.characterCount}/280):</p>`;
          docContent += `<p>${tweet.content}</p><br/>`;
        });
      }
      // VIDEO SCRIPT
      else if (content.contentStructure === 'video-script' && content.script) {
        docContent += `<h4>HOOK (${content.script.hook.timing})</h4>`;
        docContent += `<p><strong>Voiceover:</strong> ${content.script.hook.voiceover}</p>`;
        docContent += `<p><strong>Visual:</strong> ${content.script.hook.visual}</p>`;
        docContent += `<p><strong>Text:</strong> ${content.script.hook.textOverlay}</p><br/>`;
        content.script.content.forEach((seg: ScriptSegment, idx: number) => {
          docContent += `<h4>SEGMENT ${idx + 1} (${seg.timing})</h4>`;
          docContent += `<p><strong>Voiceover:</strong> ${seg.voiceover}</p>`;
          docContent += `<p><strong>Visual:</strong> ${seg.visual}</p><br/>`;
        });
        docContent += `<h4>CTA (${content.script.cta.timing})</h4>`;
        docContent += `<p>${content.script.cta.voiceover}</p>`;
      }
      // STORY FRAMES
      else if (content.contentStructure === 'story-frames' && content.frames) {
        content.frames.forEach((frame: Frame) => {
          docContent += `<h4>Frame ${frame.frameNumber} (${frame.type})</h4>`;
          docContent += `<p>${frame.text}</p>`;
          docContent += `<p><em>Visual: ${frame.visual}</em></p>`;
          docContent += `<p><em>Interactive: ${frame.interactive}</em></p><br/>`;
        });
      }
      // EMAIL
      else if (content.contentStructure === 'email' && content.subjectLine) {
        docContent += `<p><strong>Subject:</strong> ${content.subjectLine}</p>`;
        if (content.preheader) docContent += `<p><strong>Preheader:</strong> ${content.preheader}</p>`;
        const body = content.body as EmailBody;
        if (body) {
          docContent += `<p>${body.greeting}</p>`;
          docContent += `<p>${body.opening}</p>`;
          docContent += `<p>${body.mainContent}</p>`;
          if (body.benefits) {
            docContent += '<ul>';
            body.benefits.forEach((b: string) => {
              docContent += `<li>${b}</li>`;
            });
            docContent += '</ul>';
          }
          docContent += `<p><strong>CTA:</strong> ${body.cta}</p>`;
          docContent += `<p>${body.closing}</p>`;
        }
        if (content.ps) docContent += `<p><strong>P.S.</strong> ${content.ps}</p>`;
      }
      // BLOG
      else if (content.contentStructure === 'long-form' && content.sections) {
        docContent += `<h4>${content.title}</h4>`;
        if (content.metaDescription) docContent += `<p><em>${content.metaDescription}</em></p>`;
        if (content.introduction) docContent += `<p>${content.introduction}</p>`;
        content.sections.forEach((sec: Section) => {
          docContent += `<h4>${sec.heading}</h4>`;
          docContent += `<p>${sec.content}</p>`;
          if (sec.keyPoints) {
            docContent += '<ul>';
            sec.keyPoints.forEach((p: string) => {
              docContent += `<li>${p}</li>`;
            });
            docContent += '</ul>';
          }
        });
        if (content.conclusion) docContent += `<p>${content.conclusion}</p>`;
      }
      // AD
      else if (content.contentStructure === 'ad' && content.headline) {
        docContent += `<p><strong>Headline:</strong> ${content.headline}</p>`;
        if (content.primaryText) docContent += `<p>${content.primaryText}</p>`;
        if (content.description) docContent += `<p>${content.description}</p>`;
        docContent += `<p><strong>CTA:</strong> ${content.cta}</p>`;
      }
      // DEFAULT POST
      else {
        if (content.hook) docContent += `<p><strong>Hook:</strong> ${content.hook}</p>`;
        if (content.body && typeof content.body === 'string') docContent += `<p>${content.body}</p>`;
        if (content.cta) docContent += `<p><strong>CTA:</strong> ${content.cta}</p>`;
      }

      if (content.hashtags && content.hashtags.length > 0) {
        docContent += `<p><strong>Hashtags:</strong> ${content.hashtags.map(t => `#${t}`).join(' ')}</p>`;
      }
      
      return docContent + '<br/><br/>';
    };

    let fullDoc = '<h1>Generated Content</h1>';
    fullDoc += `<p><strong>Total Content Pieces:</strong> ${projectData.stage2.generatedContents.length}</p>`;
    fullDoc += `<p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p><hr/>`;
    
    projectData.stage2.generatedContents.forEach((content: GeneratedContent) => {
      fullDoc += renderContentDOC(content);
    });

    downloadDOC('Generated_Content.doc', fullDoc);
  };

  const downloadStage3CSV = () => {
    if (projectData.stage2.generatedContents.length === 0) {
      alert('No generated content to download');
      return;
    }

    const escapeCSV = (str: string) => {
      if (!str) return '';
      return `"${str.replace(/"/g, '""')}"`;
    };

    let csvContent = 'Content Number,Title,Platform,Content Type,Structure,Full Content,Hashtags\n';

    projectData.stage2.generatedContents.forEach((content: GeneratedContent) => {
      let contentText = '';
      
      // CAROUSEL
      if (content.contentStructure === 'multi-slide' && content.slides) {
        contentText = content.slides.map((slide: Slide) => 
          `Slide ${slide.slideNumber} (${slide.type || 'content'}): ${slide.headline}${slide.subheadline ? ' - ' + slide.subheadline : ''}${slide.content ? ' - ' + slide.content : ''}${slide.cta ? ' [CTA: ' + slide.cta + ']' : ''} [Visual: ${slide.visualDirection}]`
        ).join(' || ');
        if (content.caption) contentText += ` || Caption: ${content.caption}`;
      } 
      // INFOGRAPHIC
      else if (content.contentStructure === 'data-visual' && content.dataPoints) {
        contentText = `Title: ${content.title}${content.subtitle ? ' - ' + content.subtitle : ''} || `;
        contentText += content.dataPoints.map((point: DataPoint) => 
          `${point.statistic}: ${point.description} (Source: ${point.source})`
        ).join(' || ');
      }
      // THREAD
      else if (content.contentStructure === 'thread' && content.tweets) {
        contentText = content.tweets.map((tweet: Tweet) => 
          `Tweet ${tweet.tweetNumber} (${tweet.characterCount}/280): ${tweet.content}`
        ).join(' || ');
      }
      // VIDEO SCRIPT
      else if (content.contentStructure === 'video-script' && content.script) {
        contentText = `HOOK (${content.script.hook.timing}): ${content.script.hook.voiceover} || `;
        contentText += content.script.content.map((seg: ScriptSegment, idx: number) => 
          `SEGMENT ${idx + 1} (${seg.timing}): ${seg.voiceover}`
        ).join(' || ');
        contentText += ` || CTA (${content.script.cta.timing}): ${content.script.cta.voiceover}`;
        if (content.caption) contentText += ` || Caption: ${content.caption}`;
      }
      // STORY FRAMES
      else if (content.contentStructure === 'story-frames' && content.frames) {
        contentText = content.frames.map((frame: Frame) => 
          `Frame ${frame.frameNumber} (${frame.type}): ${frame.text} [Visual: ${frame.visual}, Interactive: ${frame.interactive}]`
        ).join(' || ');
      }
      // EMAIL
      else if (content.contentStructure === 'email' && content.subjectLine) {
        const body = content.body as EmailBody;
        contentText = `Subject: ${content.subjectLine}`;
        if (content.preheader) contentText += ` || Preheader: ${content.preheader}`;
        if (body) {
          contentText += ` || ${body.greeting} || ${body.opening} || ${body.mainContent}`;
          if (body.benefits) contentText += ` || Benefits: ${body.benefits.join(', ')}`;
          contentText += ` || CTA: ${body.cta} || ${body.closing}`;
        }
        if (content.ps) contentText += ` || P.S. ${content.ps}`;
      }
      // BLOG
      else if (content.contentStructure === 'long-form' && content.sections) {
        contentText = `Title: ${content.title}`;
        if (content.metaDescription) contentText += ` || Meta: ${content.metaDescription}`;
        if (content.introduction) contentText += ` || Intro: ${content.introduction}`;
        contentText += ` || ` + content.sections.map((sec: Section) => 
          `${sec.heading}: ${sec.content}${sec.keyPoints ? ' [' + sec.keyPoints.join(', ') + ']' : ''}`
        ).join(' || ');
        if (content.conclusion) contentText += ` || Conclusion: ${content.conclusion}`;
        if (content.cta) contentText += ` || CTA: ${content.cta}`;
      }
      // AD
      else if (content.contentStructure === 'ad' && content.headline) {
        contentText = `Headline: ${content.headline}`;
        if (content.primaryText) contentText += ` || ${content.primaryText}`;
        if (content.description) contentText += ` || ${content.description}`;
        contentText += ` || CTA: ${content.cta}`;
      }
      // DEFAULT POST
      else {
        const parts = [];
        if (content.hook) parts.push(`Hook: ${content.hook}`);
        if (content.body && typeof content.body === 'string') parts.push(`Body: ${content.body}`);
        if (content.cta) parts.push(`CTA: ${content.cta}`);
        contentText = parts.join(' || ');
      }

      const hashtags = content.hashtags ? content.hashtags.map(t => `#${t}`).join(' ') : '';

      csvContent += `${content.contentNumber},${escapeCSV(content.title)},${escapeCSV(content.platform)},${escapeCSV(content.contentType)},${escapeCSV(content.contentStructure)},${escapeCSV(contentText)},${escapeCSV(hashtags)}\n`;
    });

    downloadCSV('Generated_Content.csv', csvContent);
  };

  const downloadStage3PDF = () => {
    if (projectData.stage2.generatedContents.length === 0) {
      alert('No generated content to download');
      return;
    }

    const renderContentHTML = (content: GeneratedContent): string => {
      // CAROUSEL
      if (content.contentStructure === 'multi-slide' && content.slides) {
        return `
          <div style="margin-bottom: 12px;">
            ${content.slides.map((slide: Slide) => `
              <div style="padding: 12px; margin: 8px 0; border-radius: 6px; border: 1px solid #cbd5e1; background: #f9fafb;">
                <p style="margin-bottom: 6px;"><strong>Slide ${slide.slideNumber} (${slide.type || 'content'})</strong></p>
                <p style="font-weight: 600; margin-bottom: 4px;">${slide.headline}</p>
                ${slide.subheadline ? `<p style="font-size: 13px; margin-bottom: 6px;">${slide.subheadline}</p>` : ''}
                ${slide.content ? `<p style="font-size: 13px; margin-bottom: 6px;">${slide.content}</p>` : ''}
                ${slide.cta ? `<p style="font-weight: 600;">CTA: ${slide.cta}</p>` : ''}
                <p style="font-size: 11px; color: #6b7280; font-style: italic;">Visual: ${slide.visualDirection}</p>
              </div>
            `).join('')}
            ${content.caption ? `<p style="margin-top: 8px;"><strong>Caption:</strong> ${content.caption}</p>` : ''}
          </div>
        `;
      }
      // INFOGRAPHIC
      else if (content.contentStructure === 'data-visual' && content.dataPoints) {
        return `
          <div style="margin-bottom: 12px;">
            <h4 style="margin-bottom: 8px;">${content.title}</h4>
            ${content.subtitle ? `<p style="font-size: 13px; margin-bottom: 10px;">${content.subtitle}</p>` : ''}
            ${content.dataPoints.map((point: DataPoint) => `
              <div style="padding: 10px; margin: 6px 0; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb;">
                <p style="font-size: 18px; font-weight: 700; color: #2563eb; margin-bottom: 4px;">${point.statistic}</p>
                <p style="font-size: 13px; margin-bottom: 4px;">${point.description}</p>
                <p style="font-size: 11px; color: #6b7280;">Source: ${point.source}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
      // THREAD
      else if (content.contentStructure === 'thread' && content.tweets) {
        return `
          <div style="margin-bottom: 12px;">
            ${content.tweets.map((tweet: Tweet) => `
              <div style="padding: 10px; margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f9fafb;">
                <p style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">Tweet ${tweet.tweetNumber} (${tweet.characterCount}/280)</p>
                <p style="font-size: 13px;">${tweet.content}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
      // VIDEO SCRIPT
      else if (content.contentStructure === 'video-script' && content.script) {
        return `
          <div style="margin-bottom: 12px;">
            <div style="padding: 10px; margin: 6px 0; background: #fef3c7; border-radius: 6px;">
              <p style="font-weight: 600; margin-bottom: 4px;">HOOK (${content.script.hook.timing})</p>
              <p style="font-size: 13px;"><strong>Voiceover:</strong> ${content.script.hook.voiceover}</p>
              <p style="font-size: 12px;"><strong>Visual:</strong> ${content.script.hook.visual}</p>
              <p style="font-size: 12px;"><strong>Text:</strong> ${content.script.hook.textOverlay}</p>
            </div>
            ${content.script.content.map((seg: ScriptSegment, idx: number) => `
              <div style="padding: 10px; margin: 6px 0; background: #eff6ff; border-radius: 6px;">
                <p style="font-weight: 600; margin-bottom: 4px;">SEGMENT ${idx + 1} (${seg.timing})</p>
                <p style="font-size: 13px;"><strong>Voiceover:</strong> ${seg.voiceover}</p>
                <p style="font-size: 12px;"><strong>Visual:</strong> ${seg.visual}</p>
              </div>
            `).join('')}
            <div style="padding: 10px; margin: 6px 0; background: #d1fae5; border-radius: 6px;">
              <p style="font-weight: 600; margin-bottom: 4px;">CTA (${content.script.cta.timing})</p>
              <p style="font-size: 13px;">${content.script.cta.voiceover}</p>
            </div>
          </div>
        `;
      }
      // STORY FRAMES
      else if (content.contentStructure === 'story-frames' && content.frames) {
        return `
          <div style="margin-bottom: 12px;">
            ${content.frames.map((frame: Frame) => `
              <div style="padding: 10px; margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f9fafb;">
                <p style="font-weight: 600; margin-bottom: 4px;">Frame ${frame.frameNumber} (${frame.type})</p>
                <p style="font-size: 13px; margin-bottom: 4px;">${frame.text}</p>
                <p style="font-size: 11px; color: #6b7280;">Visual: ${frame.visual}</p>
                <p style="font-size: 11px; color: #6b7280;">Interactive: ${frame.interactive}</p>
              </div>
            `).join('')}
          </div>
        `;
      }
      // EMAIL
      else if (content.contentStructure === 'email' && content.subjectLine) {
        const body = content.body as EmailBody;
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: #faf5ff; padding: 12px; border-radius: 6px; border: 1px solid #c084fc; margin-bottom: 10px;">
              <p style="font-weight: 600; margin-bottom: 4px;">Subject: ${content.subjectLine}</p>
              ${content.preheader ? `<p style="font-size: 13px; color: #6b7280;">${content.preheader}</p>` : ''}
            </div>
            ${body ? `
              <div style="background: white; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;">
                <p style="margin-bottom: 8px;">${body.greeting}</p>
                <p style="margin-bottom: 8px;">${body.opening}</p>
                <p style="margin-bottom: 8px;">${body.mainContent}</p>
                ${body.benefits ? `
                  <ul style="margin-bottom: 8px;">
                    ${body.benefits.map((b: string) => `<li>${b}</li>`).join('')}
                  </ul>
                ` : ''}
                <p style="font-weight: 600; margin-bottom: 8px;">CTA: ${body.cta}</p>
                <p>${body.closing}</p>
              </div>
            ` : ''}
            ${content.ps ? `<p style="margin-top: 8px; font-style: italic;">P.S. ${content.ps}</p>` : ''}
          </div>
        `;
      }
      // BLOG
      else if (content.contentStructure === 'long-form' && content.sections) {
        return `
          <div style="margin-bottom: 12px;">
            <h4 style="margin-bottom: 8px;">${content.title}</h4>
            ${content.metaDescription ? `<p style="font-style: italic; font-size: 13px; margin-bottom: 10px;">${content.metaDescription}</p>` : ''}
            ${content.introduction ? `<p style="margin-bottom: 10px;">${content.introduction}</p>` : ''}
            ${content.sections.map((sec: Section) => `
              <div style="margin-bottom: 10px;">
                <h5 style="font-weight: 600; margin-bottom: 6px;">${sec.heading}</h5>
                <p style="font-size: 13px; margin-bottom: 6px;">${sec.content}</p>
                ${sec.keyPoints ? `
                  <ul>
                    ${sec.keyPoints.map((p: string) => `<li style="font-size: 13px;">${p}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
            ${content.conclusion ? `<p style="margin-top: 10px;">${content.conclusion}</p>` : ''}
          </div>
        `;
      }
      // AD
      else if (content.contentStructure === 'ad' && content.headline) {
        return `
          <div style="margin-bottom: 12px;">
            <div style="background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
              <p style="font-weight: 600; margin-bottom: 4px;">Headline</p>
              <p style="font-size: 16px; font-weight: 700;">${content.headline}</p>
            </div>
            ${content.primaryText ? `<p style="margin-bottom: 8px;">${content.primaryText}</p>` : ''}
            ${content.description ? `<p style="margin-bottom: 8px;">${content.description}</p>` : ''}
            <p style="font-weight: 600;">CTA: ${content.cta}</p>
          </div>
        `;
      }
      // DEFAULT POST
      else {
        return `
          <div style="margin-bottom: 12px;">
            ${content.hook ? `
              <div style="background: #fef3c7; padding: 12px; border-radius: 6px; margin: 8px 0;">
                <p style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">HOOK</p>
                <p style="font-size: 13px;">${content.hook}</p>
              </div>
            ` : ''}
            ${content.body && typeof content.body === 'string' ? `
              <div style="background: #eff6ff; padding: 12px; border-radius: 6px; margin: 8px 0;">
                <p style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">CONTENT</p>
                <p style="font-size: 13px;">${content.body}</p>
              </div>
            ` : ''}
            ${content.cta ? `
              <div style="background: #d1fae5; padding: 12px; border-radius: 6px; margin: 8px 0;">
                <p style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">CTA</p>
                <p style="font-size: 13px; font-weight: 600;">${content.cta}</p>
              </div>
            ` : ''}
          </div>
        `;
      }
    };

    const pdfHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Content - PDF</title>
  <style>
    @media print {
      @page { margin: 1cm; }
      body { margin: 0; }
    }
    body { 
      font-family: Arial, Helvetica, sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px; 
      background: white;
    }
    h1 { color: #1f2937; font-size: 28px; margin-bottom: 20px; }
    .content-card { 
      background: white; 
      padding: 20px; 
      margin: 15px 0; 
      border: 2px solid #e5e7eb; 
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .content-header { 
      display: flex; 
      gap: 12px; 
      margin-bottom: 16px; 
      padding-bottom: 12px; 
      border-bottom: 2px solid #f3f4f6;
    }
    .content-number { 
      width: 40px; 
      height: 40px; 
      background: #ea580c; 
      color: white; 
      border-radius: 6px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: 700;
      font-size: 16px;
    }
    .content-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .badge { 
      display: inline-block; 
      padding: 4px 8px; 
      margin: 3px; 
      border-radius: 4px; 
      font-size: 11px; 
      font-weight: 600;
    }
    .badge-platform { background: #fed7aa; color: #9a3412; }
    .badge-type { background: #bfdbfe; color: #1e3a8a; }
  </style>
</head>
<body>
  <h1>✍️ Generated Content</h1>
  <p><strong>Total Content Pieces:</strong> ${projectData.stage2.generatedContents.length}</p>
  <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;"/>

  ${projectData.stage2.generatedContents.map((content: GeneratedContent) => `
    <div class="content-card">
      <div class="content-header">
        <div class="content-number">#${content.contentNumber}</div>
        <div style="flex: 1;">
          <div class="content-title">${content.title}</div>
          <div>
            <span class="badge badge-platform">${content.platform}</span>
            <span class="badge badge-type">${content.contentType}</span>
          </div>
        </div>
      </div>
      
      ${renderContentHTML(content)}
      
      ${content.hashtags && content.hashtags.length > 0 ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;"># HASHTAGS</p>
          <div>
            ${content.hashtags.map((tag: string) => `<span style="font-size: 14px; padding: 4px 8px; margin: 3px; background: #f3f4f6; border-radius: 12px; display: inline-block;">#${tag}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div style="margin-top: 40px; padding: 20px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb;">
    <p>Generated by BrandStory AI Content Platform</p>
  </div>
</body>
</html>
    `;

    downloadPDF(pdfHTML);
  };

  // ==================== STAGE 1: AI MASTER RESEARCHER ====================
  const Stage1Researcher = () => {
    const [websiteUrl, setWebsiteUrl] = useState(projectData.stage1.websiteUrl);
    const [businessVertical, setBusinessVertical] = useState(projectData.stage1.businessVertical);
    const [businessDetails, setBusinessDetails] = useState(projectData.stage1.businessDetails);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    // Close download menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (showDownloadMenu && !target.closest('.download-menu-container')) {
          setShowDownloadMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDownloadMenu]);

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
            max_tokens: 6000,
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
    },
    {
      "name": "Seventh campaign",
      "objective": "conversion",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1", "Platform 2"],
      "contentTypes": ["Type 1", "Type 2"],
      "duration": "4 months",
      "kpis": ["KPI 1", "KPI 2"],
      "budget": "Medium"
    },
    {
      "name": "Eighth campaign",
      "objective": "awareness",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1", "Platform 2", "Platform 3"],
      "contentTypes": ["Type 1", "Type 2"],
      "duration": "12 months",
      "kpis": ["KPI 1", "KPI 2", "KPI 3"],
      "budget": "High"
    },
    {
      "name": "Ninth campaign",
      "objective": "retention",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1"],
      "contentTypes": ["Type 1"],
      "duration": "6 months",
      "kpis": ["KPI 1", "KPI 2"],
      "budget": "Medium"
    },
    {
      "name": "Tenth campaign",
      "objective": "engagement",
      "description": "Description",
      "targetSegment": "Target",
      "keyMessage": "Message",
      "platforms": ["Platform 1", "Platform 2"],
      "contentTypes": ["Type 1", "Type 2", "Type 3"],
      "duration": "3 months",
      "kpis": ["KPI 1", "KPI 2"],
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">BrandStory Master Researcher</h2>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative download-menu-container">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Brand Analysis
                  <span className="ml-2">▼</span>
                </button>

                {showDownloadMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        downloadStage1();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">HTML Format</p>
                        <p className="text-xs text-gray-600">Styled webpage with exact design</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage1PDF();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-red-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">PDF Format</p>
                        <p className="text-xs text-gray-600">Print-ready document (opens print dialog)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage1DOC();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">DOC Format</p>
                        <p className="text-xs text-gray-600">Microsoft Word compatible document</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage1CSV();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-green-50 transition-colors flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">CSV Format</p>
                        <p className="text-xs text-gray-600">Spreadsheet data (Excel compatible)</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCurrentStage(2)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
              >
                Proceed to Content Strategy <ArrowRight className="w-5 h-5" />
              </button>
            </div>
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<GeneratedContent | null>(null);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

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

    // Close download menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (showDownloadMenu && !target.closest('.download-menu-container')) {
          setShowDownloadMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDownloadMenu]);

    const copyToClipboard = (content: GeneratedContent) => {
      let textToCopy = '';

      // Build text based on content type
      textToCopy += `${content.title}\n`;
      textToCopy += `Platform: ${content.platform}\n`;
      textToCopy += `Type: ${content.contentType}\n\n`;

      if (content.contentStructure === 'multi-slide' && content.slides) {
        content.slides.forEach((slide: Slide) => {
          textToCopy += `Slide ${slide.slideNumber} (${slide.type || 'content'}):\n`;
          textToCopy += `${slide.headline}\n`;
          if (slide.subheadline) textToCopy += `${slide.subheadline}\n`;
          if (slide.content) textToCopy += `${slide.content}\n`;
          if (slide.cta) textToCopy += `CTA: ${slide.cta}\n`;
          textToCopy += `Visual: ${slide.visualDirection}\n\n`;
        });
        if (content.caption) textToCopy += `Caption: ${content.caption}\n`;
      } else if (content.contentStructure === 'data-visual' && content.dataPoints) {
        textToCopy += `${content.title}\n`;
        if (content.subtitle) textToCopy += `${content.subtitle}\n\n`;
        content.dataPoints.forEach((point: DataPoint) => {
          textToCopy += `${point.statistic}: ${point.description}\n`;
          textToCopy += `Source: ${point.source}\n\n`;
        });
      } else if (content.contentStructure === 'thread' && content.tweets) {
        content.tweets.forEach((tweet: Tweet) => {
          textToCopy += `Tweet ${tweet.tweetNumber} (${tweet.characterCount}/280):\n`;
          textToCopy += `${tweet.content}\n\n`;
        });
      } else if (content.contentStructure === 'video-script' && content.script) {
        textToCopy += `HOOK (${content.script.hook.timing}):\n`;
        textToCopy += `${content.script.hook.voiceover}\n\n`;
        content.script.content.forEach((seg: ScriptSegment, idx: number) => {
          textToCopy += `SEGMENT ${idx + 1} (${seg.timing}):\n`;
          textToCopy += `${seg.voiceover}\n\n`;
        });
        textToCopy += `CTA (${content.script.cta.timing}):\n`;
        textToCopy += `${content.script.cta.voiceover}\n`;
      } else if (content.contentStructure === 'story-frames' && content.frames) {
        content.frames.forEach((frame: Frame) => {
          textToCopy += `Frame ${frame.frameNumber} (${frame.type}):\n`;
          textToCopy += `${frame.text}\n`;
          textToCopy += `Visual: ${frame.visual}\n`;
          textToCopy += `Interactive: ${frame.interactive}\n\n`;
        });
      } else if (content.contentStructure === 'email' && content.subjectLine) {
        textToCopy += `Subject: ${content.subjectLine}\n`;
        if (content.preheader) textToCopy += `Preheader: ${content.preheader}\n\n`;
        const body = content.body as EmailBody;
        if (body) {
          textToCopy += `${body.greeting}\n\n`;
          textToCopy += `${body.opening}\n\n`;
          textToCopy += `${body.mainContent}\n\n`;
          if (body.benefits) {
            body.benefits.forEach((b: string) => {
              textToCopy += `✓ ${b}\n`;
            });
            textToCopy += `\n`;
          }
          textToCopy += `CTA: ${body.cta}\n\n`;
          textToCopy += `${body.closing}\n`;
        }
        if (content.ps) textToCopy += `\nP.S. ${content.ps}\n`;
      } else if (content.contentStructure === 'long-form' && content.sections) {
        textToCopy += `${content.title}\n\n`;
        if (content.metaDescription) textToCopy += `${content.metaDescription}\n\n`;
        if (content.introduction) textToCopy += `${content.introduction}\n\n`;
        content.sections.forEach((sec: Section) => {
          textToCopy += `${sec.heading}\n`;
          textToCopy += `${sec.content}\n`;
          if (sec.keyPoints) {
            sec.keyPoints.forEach((p: string) => {
              textToCopy += `• ${p}\n`;
            });
          }
          textToCopy += `\n`;
        });
        if (content.conclusion) textToCopy += `${content.conclusion}\n`;
      } else if (content.contentStructure === 'ad' && content.headline) {
        textToCopy += `Headline: ${content.headline}\n\n`;
        if (content.primaryText) textToCopy += `${content.primaryText}\n\n`;
        if (content.description) textToCopy += `${content.description}\n\n`;
        textToCopy += `CTA: ${content.cta}\n`;
      } else {
        if (content.hook) textToCopy += `HOOK:\n${content.hook}\n\n`;
        if (content.body && typeof content.body === 'string') textToCopy += `CONTENT:\n${content.body}\n\n`;
        if (content.cta) textToCopy += `CTA:\n${content.cta}\n`;
      }

      if (content.hashtags && content.hashtags.length > 0) {
        textToCopy += `\nHashtags: ${content.hashtags.map(t => `#${t}`).join(' ')}`;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('✅ Content copied to clipboard!');
      }).catch(() => {
        alert('❌ Failed to copy content');
      });
    };

    const startEditing = (content: GeneratedContent) => {
      setEditingId(content.id);
      setEditedContent(JSON.parse(JSON.stringify(content))); // Deep copy
    };

    const cancelEditing = () => {
      setEditingId(null);
      setEditedContent(null);
    };

    const saveEditing = () => {
      if (editedContent) {
        const updatedContent = displayContent.map(c => 
          c.id === editedContent.id ? editedContent : c
        );
        setDisplayContent(updatedContent);
        
        // Update project data
        setProjectData(prev => ({
          ...prev,
          stage2: {
            ...prev.stage2,
            generatedContents: updatedContent
          }
        }));
        
        setEditingId(null);
        setEditedContent(null);
        alert('✅ Content saved successfully!');
      }
    };

    const updateEditedField = (field: string, value: string | string[]) => {
      if (editedContent) {
        setEditedContent({
          ...editedContent,
          [field]: value
        });
      }
    };

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
                        <button 
                          onClick={() => copyToClipboard(content)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors" 
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                        </button>
                        <button 
                          onClick={() => startEditing(content)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors" 
                          title="Edit content"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </button>
                      </div>
                    </div>

                    {editingId === content.id && editedContent ? (
                      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-yellow-900 flex items-center gap-2">
                            <Edit2 className="w-5 h-5" />
                            Editing Mode
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={saveEditing}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        
                        {/* Title Edit */}
                        <div className="mb-3">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={editedContent.title}
                            onChange={(e) => updateEditedField('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        {/* Simple content types (hook, body, cta) */}
                        {editedContent.hook !== undefined && (
                          <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hook</label>
                            <textarea
                              value={editedContent.hook}
                              onChange={(e) => updateEditedField('hook', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {editedContent.body !== undefined && typeof editedContent.body === 'string' && (
                          <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Body</label>
                            <textarea
                              value={editedContent.body}
                              onChange={(e) => updateEditedField('body', e.target.value)}
                              rows={5}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {editedContent.cta !== undefined && (
                          <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Call to Action</label>
                            <input
                              type="text"
                              value={editedContent.cta}
                              onChange={(e) => updateEditedField('cta', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Hashtags Edit */}
                        {editedContent.hashtags && (
                          <div className="mb-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hashtags (comma-separated)</label>
                            <input
                              type="text"
                              value={editedContent.hashtags.join(', ')}
                              onChange={(e) => updateEditedField('hashtags', e.target.value.split(',').map(t => t.trim()))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        <p className="text-sm text-yellow-800 italic">
                          💡 Note: Advanced editing for complex content types (carousels, threads, etc.) will be available in the next update. For now, you can edit basic fields above.
                        </p>
                      </div>
                    ) : null}

                    {renderContent(content)}

                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold mb-2"># HASHTAGS</p>
                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag: string, i: number) => (
                              <span key={i} className="text-sm px-3 py-1 bg-gray-100 rounded-full">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative download-menu-container">
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-6 h-6" />
                  Download All Generated Content
                  <span className="ml-2">▼</span>
                </button>

                {showDownloadMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-200 rounded-lg shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        downloadStage3();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">HTML Format</p>
                        <p className="text-xs text-gray-600">Styled webpage with exact design</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage3PDF();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-red-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">PDF Format</p>
                        <p className="text-xs text-gray-600">Print-ready document (opens print dialog)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage3DOC();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3 border-b border-gray-200"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">DOC Format</p>
                        <p className="text-xs text-gray-600">Microsoft Word compatible document</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        downloadStage3CSV();
                        setShowDownloadMenu(false);
                      }}
                      className="w-full px-6 py-4 text-left hover:bg-green-50 transition-colors flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">CSV Format</p>
                        <p className="text-xs text-gray-600">Spreadsheet data (Excel compatible)</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-800">Content Creation Complete!</h3>
                </div>
                <p className="text-green-700">Your AI-generated content is ready for use. You can copy, edit, and share your content across all selected platforms.</p>
              </div>
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
            BrandStory AI Content Platform
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

