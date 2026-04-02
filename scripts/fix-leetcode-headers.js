#!/usr/bin/env node
/**
 * Transform LeetCode problem files from wrong header patterns to the correct template.
 *
 * Correct template structure:
 * ---frontmatter---
 * # Title / Vietnamese Title
 * > metadata block
 * ---
 * ## 🧠 Intuition / Tư Duy
 *   **Analogy:** ...
 *   **Pattern Recognition:** ...
 *   **Visual — ...:**
 * ---
 * ## Problem Description
 * ---
 * ## 📝 Interview Tips
 * ---
 * ## Solutions
 *   ```typescript all solutions + test cases```
 * ---
 * ## 🔗 Related Problems
 */

const fs = require("fs");
const path = require("path");

function transformFile(filePath) {
	const content = fs.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	// Check if file already has correct structure
	if (content.includes("## 🧠 Intuition / Tư Duy")) {
		return { skipped: true, reason: "already correct" };
	}

	// Check if it's a stub
	if (content.includes("throw new Error('Not implemented')")) {
		return { skipped: true, reason: "stub file" };
	}

	// Parse frontmatter (lines 1-8)
	let frontmatterEnd = 0;
	let inFrontmatter = false;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === "---") {
			if (!inFrontmatter) {
				inFrontmatter = true;
			} else {
				frontmatterEnd = i;
				break;
			}
		}
	}

	const frontmatter = lines.slice(0, frontmatterEnd + 1).join("\n");
	const body = lines.slice(frontmatterEnd + 1).join("\n");

	// Detect pattern
	const pattern = detectPattern(body);

	// Parse sections based on pattern
	const sections = parseSections(body, pattern);

	// Reconstruct with correct template
	const newBody = buildCorrectBody(sections, filePath);

	const result = frontmatter + "\n" + newBody;
	fs.writeFileSync(filePath, result);

	return { transformed: true, pattern, file: path.basename(filePath) };
}

function detectPattern(body) {
	if (body.includes("## Tóm tắt bằng tiếng Việt")) return "A";
	if (/^## Tư duy$/m.test(body)) return "B";
	if (
		body.includes("## Tương tự thực tế") ||
		body.includes("## Analogy / Tương Tự")
	)
		return "C";
	if (
		body.includes("## Vietnamese Analogy") ||
		body.includes("## Solution 1 -")
	)
		return "D";
	if (body.includes("## Intuition / Tu Duy")) return "E";
	return "unknown";
}

function parseSections(body, pattern) {
	// Split by ## headers
	const sections = {};
	const sectionRegex = /^(#{1,3})\s+(.+)$/gm;
	const matches = [...body.matchAll(sectionRegex)];

	for (let i = 0; i < matches.length; i++) {
		const level = matches[i][1].length;
		const title = matches[i][2].trim();
		const start = matches[i].index;
		const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
		const content = body.slice(start + matches[i][0].length, end).trim();

		sections[`${level}:${title}`] = { level, title, content, start, end };
	}

	// Also extract h1 title and metadata block
	const h1Match = body.match(/^# (.+)$/m);
	sections._title = h1Match ? h1Match[1] : "";

	const metaMatch = body.match(/^> \*\*Track\*\*:.+$/m);
	sections._metadata = metaMatch ? metaMatch[0] : "";

	// Extract any additional > lines after metadata
	const metaLines = [];
	const bodyLines = body.split("\n");
	let inMeta = false;
	for (const line of bodyLines) {
		if (
			line.startsWith("> **Track**:") ||
			line.startsWith("> **Frequency**:") ||
			line.startsWith("> **See also**:")
		) {
			metaLines.push(line);
			inMeta = true;
		} else if (inMeta && line.startsWith("> ")) {
			metaLines.push(line);
		} else {
			inMeta = false;
		}
	}
	sections._metaBlock = metaLines.join("\n");

	return sections;
}

function findSection(sections, ...possibleKeys) {
	for (const key of possibleKeys) {
		// Try exact match first
		if (sections[key]) return sections[key].content;
		// Try partial match
		for (const [k, v] of Object.entries(sections)) {
			if (typeof v === "object" && v.title && v.title.includes(key))
				return v.content;
		}
	}
	return "";
}

function findSectionByPartial(sections, ...partials) {
	for (const partial of partials) {
		for (const [k, v] of Object.entries(sections)) {
			if (
				typeof v === "object" &&
				v.title &&
				v.title.toLowerCase().includes(partial.toLowerCase())
			) {
				return v.content;
			}
		}
	}
	return "";
}

function extractCodeBlocks(content) {
	const blocks = [];
	const regex = /```(\w*)\n([\s\S]*?)```/g;
	let match;
	while ((match = regex.exec(content)) !== null) {
		blocks.push({ lang: match[1], code: match[2].trim() });
	}
	return blocks;
}

function extractSolutions(sections) {
	// Find all solution-related sections
	const solutions = [];
	const testCases = [];

	for (const [k, v] of Object.entries(sections)) {
		if (typeof v !== "object") continue;

		const title = v.title.toLowerCase();
		if (title.includes("solution") || title.includes("giải pháp")) {
			const blocks = extractCodeBlocks(v.content);
			for (const block of blocks) {
				if (
					block.lang === "typescript" ||
					block.lang === "ts" ||
					block.lang === ""
				) {
					solutions.push(block.code);
				}
			}
		}
		if (title.includes("test case")) {
			const blocks = extractCodeBlocks(v.content);
			for (const block of blocks) {
				testCases.push(block.code);
			}
		}
	}

	return { solutions, testCases };
}

function buildCorrectBody(sections, filePath) {
	const title =
		sections._title ||
		path.basename(filePath, ".md").replace(/^\d+-/, "").replace(/-/g, " ");
	const metaBlock = sections._metaBlock || "";

	// Extract analogy content
	let analogy = findSectionByPartial(
		sections,
		"Tóm tắt bằng tiếng Việt",
		"Tương tự thực tế",
		"Vietnamese Analogy",
		"Analogy",
		"Tư duy",
		"Intuition",
	);

	// Clean up analogy - remove the section header if it leaked in
	analogy = analogy.replace(/^#+\s+.+\n/gm, "").trim();

	// Extract visual content
	let visual = findSectionByPartial(
		sections,
		"Minh họa",
		"ASCII Visual",
		"Visual",
		"ASCII",
	);
	visual = visual.replace(/^#+\s+.+\n/gm, "").trim();

	// If analogy has both analogy and visual embedded (Pattern B), split them
	if (!visual && analogy.includes("```")) {
		const codeBlockStart = analogy.indexOf("```");
		if (codeBlockStart > 0) {
			visual = analogy.slice(codeBlockStart).trim();
			analogy = analogy.slice(0, codeBlockStart).trim();
		}
	}

	// Extract problem description
	let problem = findSectionByPartial(
		sections,
		"Problem Description",
		"Problem",
		"Bài toán",
		"Mô tả bài toán",
	);
	problem = problem.replace(/^#+\s+.+\n/gm, "").trim();

	// Extract interview tips
	let tips = findSectionByPartial(
		sections,
		"Interview Tips",
		"Tips phỏng vấn",
		"Tips",
		"Mẹo phỏng vấn",
	);
	tips = tips.replace(/^#+\s+.+\n/gm, "").trim();

	// Extract solutions and test cases
	const { solutions, testCases } = extractSolutions(sections);

	// Also check for a single ## Solutions section with everything inside
	let solutionsBlock = findSectionByPartial(sections, "Solutions", "Giải pháp");
	if (solutionsBlock) {
		solutionsBlock = solutionsBlock.replace(/^#+\s+.+\n/gm, "").trim();
	}

	// Extract related problems
	let related = findSectionByPartial(
		sections,
		"Related Problems",
		"Bảng so sánh",
		"Related",
	);
	related = related.replace(/^#+\s+.+\n/gm, "").trim();

	// Build the new body
	const parts = [];

	// Title
	parts.push("");
	if (title) {
		parts.push(`# ${title}`);
		parts.push("");
	}

	// Metadata
	if (metaBlock) {
		parts.push(metaBlock);
		parts.push("");
	}

	parts.push("---");
	parts.push("");

	// Intuition section
	parts.push("## 🧠 Intuition / Tư Duy");
	parts.push("");

	if (analogy) {
		// Check if analogy already has **Analogy:** prefix
		if (!analogy.startsWith("**Analogy")) {
			parts.push(`**Analogy:** ${analogy}`);
		} else {
			parts.push(analogy);
		}
		parts.push("");
	}

	// Pattern Recognition (add if missing)
	const hasPatternRecognition =
		analogy.includes("**Pattern Recognition") ||
		Object.values(sections).some(
			(s) =>
				typeof s === "object" &&
				s.content &&
				s.content.includes("**Pattern Recognition"),
		);

	if (!hasPatternRecognition) {
		// Extract pattern from metadata or title
		parts.push("**Pattern Recognition:**");
		parts.push("- Key insight: see analogy above");
		parts.push("");
	}

	// Visual
	if (visual) {
		const titleClean = (sections._title || "").split("/")[0].trim();
		if (!visual.startsWith("**Visual")) {
			parts.push(`**Visual — ${titleClean} example:**`);
			parts.push("");
			parts.push(visual);
		} else {
			parts.push(visual);
		}
		parts.push("");
	}

	parts.push("---");
	parts.push("");

	// Problem Description
	parts.push("## Problem Description");
	parts.push("");
	if (problem) {
		parts.push(problem);
		parts.push("");
	}

	parts.push("---");
	parts.push("");

	// Interview Tips
	parts.push("## 📝 Interview Tips");
	parts.push("");
	if (tips) {
		parts.push(tips);
		parts.push("");
	}

	parts.push("---");
	parts.push("");

	// Solutions
	parts.push("## Solutions");
	parts.push("");

	if (solutions.length > 0) {
		// Merge all solutions and test cases into single code block
		const allCode = solutions.join("\n\n");
		const allTests =
			testCases.length > 0
				? "\n\n// === Test Cases ===\n" + testCases.join("\n")
				: "";
		parts.push("```typescript");
		parts.push(allCode + allTests);
		parts.push("```");
	} else if (solutionsBlock) {
		// Already has a single solutions block - just include it
		parts.push(solutionsBlock);
	}

	parts.push("");
	parts.push("---");
	parts.push("");

	// Related Problems
	parts.push("## 🔗 Related Problems");
	parts.push("");
	if (related) {
		parts.push(related);
	}
	parts.push("");

	return parts.join("\n");
}

// Main execution
const baseDir = process.argv[2] || "docs/leetcode";
const files = [];

// Find all .md files in problem directories
const categories = fs.readdirSync(baseDir).filter((d) => {
	const fullPath = path.join(baseDir, d);
	return fs.statSync(fullPath).isDirectory() && d !== "company-wise";
});

for (const cat of categories) {
	const problemsDir = path.join(baseDir, cat, "problems");
	if (!fs.existsSync(problemsDir)) continue;

	const mdFiles = fs
		.readdirSync(problemsDir)
		.filter((f) => f.endsWith(".md"))
		.map((f) => path.join(problemsDir, f));

	files.push(...mdFiles);
}

console.log(`Found ${files.length} files to check`);

let transformed = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
	try {
		const result = transformFile(file);
		if (result.skipped) {
			skipped++;
		} else if (result.transformed) {
			transformed++;
			console.log(`✓ ${result.pattern}: ${result.file}`);
		}
	} catch (err) {
		errors++;
		console.error(`✗ ${path.basename(file)}: ${err.message}`);
	}
}

console.log(
	`\nDone: ${transformed} transformed, ${skipped} skipped, ${errors} errors`,
);
