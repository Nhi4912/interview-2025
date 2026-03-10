"use client";

import { useState } from "react";
import styles from "./page.module.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const folderTree = `interview-2025/
├── CLAUDE.md               ← Agent reads EVERY session
├── docs/                   ← SDD Brain
│   ├── steering/           ← [00] Project Constitution
│   │   ├── product.md      ← vision, problem, target users
│   │   ├── tech.md         ← stack, conventions, constraints
│   │   └── structure.md    ← folder map, naming rules
│   │
│   ├── product/            ← [01] Product Definition
│   │   └── prd.md
│   │
│   ├── interview/          ← [02] Interview Content
│   │   ├── shared/         ← Language-agnostic fundamentals
│   │   │   ├── 01-cs-fundamentals/
│   │   │   ├── 02-system-design/
│   │   │   ├── 03-database/
│   │   │   └── 05-software-engineering/
│   │   │
│   │   ├── fe-track/       ← Frontend (JS/TS/React)
│   │   │   ├── 01-javascript/
│   │   │   ├── 02-typescript/
│   │   │   ├── 03-react/
│   │   │   ├── 06-browser-performance/
│   │   │   └── 08-fe-system-design/
│   │   │
│   │   └── be-track/       ← Backend (Go)
│   │       ├── 01-golang/
│   │       ├── 02-backend-knowledge/
│   │       ├── 03-database-advanced/
│   │       └── 04-be-system-design/
│   │
│   ├── specs/              ← [03] Feature Specs
│   │   └── [feature]/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   │
│   └── design/             ← [04] Design Assets
│       └── tokens.md
│
├── content/                ← MDX content (app-rendered)
│   ├── en/
│   ├── vi/
│   └── shared/
│
├── src/                    ← Application code
│   ├── app/                ← Next.js App Router
│   ├── components/
│   │   ├── mdx/            ← Quiz, InteractiveDemo, CodeExample
│   │   ├── search/         ← SearchBar, SearchResults
│   │   └── layout/         ← LanguageSelector
│   ├── lib/
│   │   ├── content/        ← ContentService
│   │   ├── i18n/           ← LocaleContext
│   │   └── search/         ← SearchService
│   └── types/
│
└── scripts/                ← Build/migration scripts`;

interface FileTemplate {
  label: string;
  color: string;
  desc: string;
  content: string;
}

const fileTemplates: Record<string, FileTemplate> = {
  "CLAUDE.md": {
    label: "CLAUDE.md",
    color: "#FF6B35",
    desc: "Agent reads this EVERY session — project DNA",
    content: `# Interview 2025 — Project Constitution
> Agent: Read this file before doing ANY task.

## App Vision (1 sentence)
Interview 2025 is a bilingual (EN/VI) interview preparation 
platform helping developers prepare for Frontend (JS/TS/React) 
and Backend (Go) roles at top tech companies.

## Docs Structure
- Steering: @docs/steering/
- Product: @docs/product/prd.md
- Interview Content:
  - Shared: @docs/interview/shared/
  - FE Track: @docs/interview/fe-track/
  - BE Track: @docs/interview/be-track/
- Design: @docs/design/tokens.md

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript strict
- MDX for interactive content
- CSS Modules for component styling
- D3 for visualizations, Mermaid for diagrams

## Content Rules
1. Shared fundamentals live in shared/ — ONE source of truth
2. Track-specific content references shared/ for theory
3. No duplicate theory between fe-track/ and be-track/
4. BE content: ~80-90% theory, 10-20% code
5. FE content: Can include more code examples`,
  },
  "product.md": {
    label: "docs/steering/product.md",
    color: "#4ECDC4",
    desc: "Vision, problem statement, target users",
    content: `# Product Steering Document

## Problem Statement
Vietnamese developers preparing for technical interviews 
lack a structured, bilingual study resource covering both 
Frontend and Backend tracks.

## Target Users
### Primary: Minh — Mid-level Developer
- 2-4 years experience
- Gaps in CS theory despite daily coding
- Needs structured path to Grab/Zalo/Microsoft

### Secondary: Hoa — Senior Developer  
- 4-7 years, strong in practice
- Weak in system design interviews
- Targeting Google/Microsoft

## Core Value Proposition
1. Bilingual — EN terms + VI explanations
2. Two tracks — FE (JS/TS/React) + BE (Go)
3. Company-targeted — specific prep guides
4. Progressive — Junior → Middle → Senior`,
  },
  "requirements.md": {
    label: "docs/specs/[feature]/requirements.md",
    color: "#F59E0B",
    desc: "WHAT to build — not HOW",
    content: `# Feature: [Feature Name]
**Status:** Draft | Review | Approved
**Linked journey:** @docs/product/user-journeys/

## User Stories
### Must Have (MVP)
- [ ] As a developer, I want to browse topics by track
- [ ] As a developer, I want bilingual explanations

### Should Have
- [ ] As a developer, I want difficulty filtering

## Acceptance Criteria (EARS Format)
- WHEN user selects a track, system SHALL show topics
- IF content is not translated, system SHALL fallback to EN
- WHEN user completes a quiz, system SHALL show score

## Performance
- Page SHALL render < 300ms
- Content SHALL load with skeleton < 100ms`,
  },
  "design.md": {
    label: "docs/specs/[feature]/design.md",
    color: "#10B981",
    desc: "HOW to build — Architecture, components, data",
    content: `# Design: [Feature Name]
**References:** @docs/specs/[feature]/requirements.md

## Component Tree
[FeatureName]Page (Server Component)
├── Header
│   ├── TrackSelector
│   └── LanguageToggle
├── ContentArea
│   ├── TopicList (Server Component)
│   │   └── TopicCard (memoized)
│   └── ContentRenderer (MDX)
└── Sidebar
    └── TableOfContents

## File Structure
src/app/[route]/
  page.tsx           ← server component entry
src/components/[feature]/
  [Feature].tsx      ← composition
  [Feature].module.css
src/lib/[feature]/
  [feature]Service.ts

## State Architecture
### Server State (ContentService)
- Content loaded at build time via gray-matter
- Locale from LocaleContext

### Client State (useState)
- selectedTrack: 'fe' | 'be' | 'shared'
- expandedTopics: Set<string>`,
  },
  "tasks.md": {
    label: "docs/specs/[feature]/tasks.md",
    color: "#EC4899",
    desc: "Atomic tasks with dependency graph",
    content: `# Tasks: [Feature Name]
**References:** @docs/specs/[feature]/design.md

## Dependency Graph
T01 ──┐
T02 ──┼──> T05 ──> T06 (verify)
T03 ──┘
       T04 ──────> T07 (test)

## Parallel Group A — Foundation
- [ ] T01: Create TypeScript types
- [ ] T02: Create UI components  
- [ ] T03: Create ContentService methods

## Sequential — Integration  
- [ ] T04: Create page route (requires T01-T03)
- [ ] T05: Wire up locale switching

## Verification
- [ ] T06: Visual verification
- [ ] T07: TypeScript check (npx tsc --noEmit)`,
  },
  "tokens.md": {
    label: "docs/design/tokens.md",
    color: "#64748B",
    desc: "Design tokens — colors, spacing, typography",
    content: `# Design Tokens
> Source of truth for colors, typography, spacing.

## Colors
/* Semantic */
--color-primary: #FF6B35;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;

/* Neutral (dark mode) */
--color-bg: #0D0D0D;
--color-surface: #1A1A1A;
--color-border: #2A2A2A;
--color-text-primary: #FFFFFF;
--color-text-secondary: #9CA3AF;

## Typography
--font-mono: 'JetBrains Mono', monospace;
--font-size-sm: 13px;
--font-size-base: 15px;
--font-size-lg: 17px;

## Spacing (4px base unit)
1 = 4px  | 4 = 16px | 8 = 32px
2 = 8px  | 5 = 20px | 10 = 40px
3 = 12px | 6 = 24px | 12 = 48px`,
  },
};

interface WorkflowStep {
  phase: string;
  color: string;
  steps: string[];
}

const workflowSteps: WorkflowStep[] = [
  {
    phase: "Idea",
    color: "#FF6B35",
    steps: [
      "Define product vision in steering/product.md",
      "Identify target users and their pain points",
      "Map user journeys for each track (FE/BE)",
      "Set up design tokens in docs/design/tokens.md",
    ],
  },
  {
    phase: "Define",
    color: "#4ECDC4",
    steps: [
      "Create feature spec: requirements.md",
      "Answer clarifying questions thoroughly",
      "Review requirements — approve before design",
      "Generate design.md — review component tree",
    ],
  },
  {
    phase: "Plan",
    color: "#A855F7",
    steps: [
      "Generate tasks.md with dependency graph",
      "Review task list — adjust if needed",
      "Identify parallel vs sequential groups",
      "Approve — agent begins implementation",
    ],
  },
  {
    phase: "Build",
    color: "#10B981",
    steps: [
      "Implement tasks following dependency order",
      "Sub-agents run parallel per groups",
      "Each task = 1 atomic commit",
      "Review only at phase gates, not each edit",
    ],
  },
];

interface ScreenshotRule {
  rule: string;
  detail: string;
}

const screenshotRules: ScreenshotRule[] = [
  { rule: "1 screenshot = 1 state", detail: "Don't combine multiple states in 1 image" },
  { rule: "Name = order + name", detail: "01-splash.png, 02-welcome.png" },
  { rule: "Folder = user flow", detail: "01-onboarding/, 02-home/, 03-profile/" },
  { rule: "Include both themes", detail: "screen-dark.png & screen-light.png" },
  { rule: "Annotate edge cases", detail: "error-state.png, empty-state.png, loading.png" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

type TabId = "structure" | "templates" | "workflow" | "screenshots";

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: "structure", label: "Folder Structure" },
  { id: "templates", label: "File Templates" },
  { id: "workflow", label: "Workflow" },
  { id: "screenshots", label: "Screenshots" },
];

interface FolderInfo {
  folder: string;
  color: string;
  role: string;
  desc: string;
}

const folderInfos: FolderInfo[] = [
  { folder: "CLAUDE.md", color: "#FF6B35", role: "Root config", desc: "Agent reads EVERY session. Defines stack, conventions, rules. Single source for project understanding." },
  { folder: "docs/steering/", color: "#4ECDC4", role: "Phase 00", desc: "Product vision, tech stack, project structure. Rarely changes — only on architectural decisions." },
  { folder: "docs/interview/shared/", color: "#A855F7", role: "Shared", desc: "Language-agnostic CS fundamentals, system design theory, database theory. ONE source of truth for both tracks." },
  { folder: "docs/interview/fe-track/", color: "#F59E0B", role: "FE Track", desc: "JavaScript, TypeScript, React, browser performance, web security. References shared/ for theory." },
  { folder: "docs/interview/be-track/", color: "#10B981", role: "BE Track", desc: "Go language, backend knowledge, database internals, BE system design. References shared/ for theory." },
];

interface CommandCard {
  title: string;
  color: string;
  code: string;
}

const commandCards: CommandCard[] = [
  {
    title: "Start new content",
    color: "#FF6B35",
    code: `# Step 1: Check shared/ for existing theory
# Don't duplicate!

# Step 2: Create track-specific file  
# FE: docs/interview/fe-track/01-javascript/
# BE: docs/interview/be-track/01-golang/

# Step 3: Reference shared content
# See @docs/interview/shared/01-cs-fundamentals/

# Step 4: Follow format
# Q&A style, bilingual, difficulty tags`,
  },
  {
    title: "Add new feature",
    color: "#4ECDC4",
    code: `# Step 1: Create spec
# docs/specs/[feature]/requirements.md
# → Define WHAT, not HOW

# Step 2: Design
# docs/specs/[feature]/design.md
# → Component tree, data model

# Step 3: Plan tasks
# docs/specs/[feature]/tasks.md
# → Dependency graph, parallel groups

# Step 4: Implement
# Each task = 1 atomic commit`,
  },
  {
    title: "Review content structure",
    color: "#F59E0B",
    code: `# Check for duplication
# Theory MUST be in shared/
# Track files MUST reference shared/

# Verify cross-references
# @docs/interview/shared/ for theory
# @docs/interview/fe-track/ for JS/TS/React
# @docs/interview/be-track/ for Go/Backend

# Content format check
# Bilingual: EN headings + VI explanations
# Difficulty: Junior | Middle | Senior`,
  },
  {
    title: "Verify project health",
    color: "#A855F7",
    code: `# TypeScript check
npx tsc --noEmit

# Content validation
# Frontmatter: id, title, category, difficulty
# No broken cross-references

# Structure check  
# shared/ = language-agnostic only
# fe-track/ = JS/TS/React only
# be-track/ = Go/Backend only
# No duplicate theory files`,
  },
];

interface ProTip {
  tip: string;
  detail: string;
}

const proTips: ProTip[] = [
  { tip: "Shared first, track second", detail: "Always check if theory exists in shared/ before writing track-specific content. Reference, don't duplicate." },
  { tip: "Bilingual = EN terms + VI explanations", detail: "English for technical terms and headings. Vietnamese for explanations and context. This helps readers learn both." },
  { tip: "Difficulty tags matter", detail: "Tag every question: Junior (green), Middle (yellow), Senior (red). Users filter by their level and target role." },
];

export default function SDDWorkspace() {
  const [activeTab, setActiveTab] = useState<TabId>("structure");
  const [activeFile, setActiveFile] = useState<string>("CLAUDE.md");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const template = fileTemplates[activeFile];

  return (
    <div className={styles.workspace}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <div className={styles.headerLabel}>
              SDD × INTERVIEW 2025
            </div>
            <div className={styles.headerTitle}>
              From Idea → Spec → Code
              <span className={styles.headerBadge}>
                WORKSPACE GUIDE
              </span>
            </div>
          </div>
          <div className={styles.tabBar}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB: STRUCTURE ── */}
      {activeTab === "structure" && (
        <div className={styles.structureGrid}>
          <div className={styles.treePane}>
            <div className={styles.sectionLabel}>
              PROJECT FOLDER STRUCTURE
            </div>
            <div className={styles.codeBlock}>
              <button
                onClick={() => handleCopy(folderTree)}
                className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ""}`}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
              <pre className={styles.treePre}>
                {folderTree.split("\n").map((line, i) => {
                  const isHighlight = line.includes("docs/") || line.includes("CLAUDE.md") || line.includes("steering");
                  const isComment = line.includes("\u2190");
                  const className = isComment
                    ? styles.treeLineComment
                    : isHighlight
                    ? styles.treeLineHighlight
                    : styles.treeLine;
                  return (
                    <div key={i} className={className}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          <div className={styles.explanationPane}>
            <div className={styles.sectionLabel} style={{ marginBottom: "20px" }}>
              KEY FOLDERS
            </div>
            {folderInfos.map((item) => (
              <div
                key={item.folder}
                className={styles.folderCard}
                style={{ borderLeft: `3px solid ${item.color}` }}
              >
                <div className={styles.folderCardHeader}>
                  <code className={styles.folderCardName} style={{ color: item.color }}>
                    {item.folder}
                  </code>
                  <span className={styles.folderCardRole}>
                    {item.role}
                  </span>
                </div>
                <div className={styles.folderCardDesc}>
                  {item.desc}
                </div>
              </div>
            ))}

            <div className={styles.initBox}>
              <div className={styles.initBoxLabel}>
                CONTENT ARCHITECTURE — NO DUPLICATION
              </div>
              <pre className={styles.initBoxPre}>
{`shared/          → Theory (CS, system design, DB)
                   ONE source of truth
                   
fe-track/        → JS/TS/React implementations
                   References shared/ for theory
                   
be-track/        → Go implementations
                   References shared/ for theory

Rule: If it's language-agnostic → shared/
      If it has JS/TS code → fe-track/
      If it has Go code → be-track/`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: TEMPLATES ── */}
      {activeTab === "templates" && (
        <div className={styles.templatesGrid}>
          <div className={styles.templateSidebar}>
            <div className={styles.templateSidebarLabel}>
              FILE TEMPLATES
            </div>
            {Object.entries(fileTemplates).map(([key, tpl]) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={styles.templateSidebarBtn}
                style={{
                  background: activeFile === key ? `${tpl.color}15` : "transparent",
                  borderColor: activeFile === key ? tpl.color + "44" : "transparent",
                  color: activeFile === key ? tpl.color : "#555",
                }}
              >
                <div className={styles.templateSidebarBtnName}>{key}</div>
                <div className={styles.templateSidebarBtnDesc}>
                  {tpl.desc.split(" \u2014 ")[0]}
                </div>
              </button>
            ))}
          </div>

          <div className={styles.templateContent}>
            <div className={styles.templateHeader}>
              <div>
                <code className={styles.templateLabel} style={{ color: template.color }}>
                  {template.label}
                </code>
                <div className={styles.templateDesc}>
                  {template.desc}
                </div>
              </div>
              <button
                onClick={() => handleCopy(template.content)}
                className={`${styles.templateCopyBtn} ${copied ? styles.templateCopyBtnCopied : ""}`}
              >
                {copied ? "COPIED" : "COPY TEMPLATE"}
              </button>
            </div>
            <pre
              className={styles.templatePre}
              style={{ borderLeft: `3px solid ${template.color}` }}
            >
              {template.content.split("\n").map((line, i) => {
                const isHeading = line.startsWith("#");
                const isComment = line.startsWith(">") || line.startsWith("//");
                const isBracket = line.includes("[") && line.includes("]");
                const className = isHeading
                  ? styles.templateLineHeading
                  : isComment
                  ? styles.templateLineComment
                  : isBracket
                  ? styles.templateLineBracket
                  : styles.templateLineNormal;
                return (
                  <div key={i} className={className} style={isBracket ? { color: template.color + "BB" } : undefined}>
                    {line}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      )}

      {/* ── TAB: WORKFLOW ── */}
      {activeTab === "workflow" && (
        <div className={styles.workflowSection}>
          <div className={styles.sectionLabel} style={{ marginBottom: "32px" }}>
            END-TO-END WORKFLOW
          </div>

          <div className={styles.phaseGrid}>
            {workflowSteps.map((w, wi) => (
              <div
                key={wi}
                className={styles.phaseCard}
                style={{ borderTop: `3px solid ${w.color}` }}
              >
                <div className={styles.phaseTitle}>{w.phase}</div>
                {w.steps.map((step, si) => (
                  <div key={si} className={styles.phaseStep}>
                    <span className={styles.phaseStepNum} style={{ color: w.color }}>
                      {si + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.sectionLabel} style={{ marginBottom: "14px" }}>
            COMMON OPERATIONS
          </div>
          <div className={styles.commandGrid}>
            {commandCards.map((item, i) => (
              <div
                key={i}
                className={styles.commandCard}
                style={{ borderLeft: `3px solid ${item.color}` }}
              >
                <div className={styles.commandCardTitle}>{item.title}</div>
                <pre className={styles.commandCardPre}>
                  {item.code.split("\n").map((line, li) => {
                    const isComment = line.startsWith("#");
                    const isCmd = line.startsWith("npx") || line.startsWith("/");
                    const isRef = line.includes("@docs");
                    const className = isComment
                      ? styles.commandLineComment
                      : isCmd
                      ? styles.commandLineCmd
                      : isRef
                      ? styles.commandLineRef
                      : styles.commandLineNormal;
                    return (
                      <div
                        key={li}
                        className={className}
                        style={isCmd ? { color: item.color } : undefined}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SCREENSHOTS ── */}
      {activeTab === "screenshots" && (
        <div className={styles.screenshotsSection}>
          <div className={styles.screenshotsGrid}>
            <div>
              <div className={styles.sectionLabel} style={{ marginBottom: "20px" }}>
                DESIGN SCREENSHOT RULES
              </div>
              {screenshotRules.map((r, i) => (
                <div key={i} className={styles.ruleCard}>
                  <span className={styles.ruleArrow}>→</span>
                  <div>
                    <div className={styles.ruleTitle}>{r.rule}</div>
                    <div className={styles.ruleDetail}>{r.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className={styles.sectionLabel} style={{ marginBottom: "20px" }}>
                FOLDER STRUCTURE EXAMPLE
              </div>
              <div className={styles.folderExample}>
                <pre className={styles.folderExamplePre}>
{`docs/design/
├── tokens.md
└── screens/
    ├── 01-home/
    │   ├── 01-landing.png
    │   ├── 01-landing-dark.png
    │   └── 02-track-select.png
    │
    ├── 02-learn/
    │   ├── 01-topic-list.png
    │   ├── 01-topic-list-empty.png
    │   ├── 02-content-view.png
    │   └── 02-content-view-dark.png
    │
    └── 03-quiz/
        ├── 01-quiz-start.png
        └── 02-quiz-result.png`}
                </pre>
              </div>

              <div className={styles.refSyntaxBox}>
                <div className={styles.refSyntaxLabel}>
                  HOW TO REFERENCE IN SPEC FILES
                </div>
                <pre className={styles.refSyntaxPre}>
{`# In requirements.md:
Design refs: @docs/design/screens/01-home/

# In tasks.md (specific screen):
Design ref: @docs/design/screens/01-home/01-landing.png

# In CLAUDE.md (global):
Design tokens: @docs/design/tokens.md
Screenshots: @docs/design/screens/`}
                </pre>
              </div>
            </div>
          </div>

          <div className={styles.proTipsSection}>
            <div className={styles.sectionLabel} style={{ marginBottom: "16px" }}>
              PRO TIPS
            </div>
            <div className={styles.proTipsGrid}>
              {proTips.map((item, i) => (
                <div key={i} className={styles.proTipCard}>
                  <div className={styles.proTipTitle}>{item.tip}</div>
                  <div className={styles.proTipDesc}>{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerQuote}>
          &quot;Spec first, code later — AI executes, not guesses&quot;
        </div>
        <div className={styles.footerPipeline}>
          CLAUDE.md → STEERING → PRODUCT → SPECS → DESIGN → CODE
        </div>
      </div>
    </div>
  );
}
