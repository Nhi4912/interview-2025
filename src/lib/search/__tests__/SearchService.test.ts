import { describe, test, expect, beforeEach } from "vitest";
import { SearchService } from "../SearchService";
import { SerializableSearchIndex } from "../SearchIndexBuilder";
import { Locale } from "@/types/content";

describe("SearchService", () => {
  let searchService: SearchService;
  let mockIndex: SerializableSearchIndex;

  beforeEach(() => {
    searchService = new SearchService();

    // Create mock search index
    mockIndex = {
      version: "1.0.0",
      locale: "en" as Locale,
      lastBuilt: new Date().toISOString(),
      documents: [
        {
          id: "js-closures",
          slug: "closures",
          title: "Understanding JavaScript Closures",
          description: "Learn about closures in JavaScript",
          content:
            "Closures are functions that have access to variables from outer scope",
          category: "javascript",
          difficulty: "intermediate",
          tags: ["closures", "scope", "functions"],
          tokens: [
            "understanding",
            "javascript",
            "closures",
            "learn",
            "functions",
            "scope",
            "variables",
            "outer",
            "access",
          ],
          metadata: {
            id: "js-closures",
            slug: "closures",
            title: { en: "Understanding JavaScript Closures", vi: "" },
            description: { en: "Learn about closures in JavaScript", vi: "" },
            category: "javascript",
            difficulty: "intermediate",
            estimatedTime: 30,
            prerequisites: [],
            relatedTopics: [],
            tags: ["closures", "scope", "functions"],
            interviewCompanies: ["google", "meta"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
        },
        {
          id: "react-hooks",
          slug: "hooks",
          title: "React Hooks Guide",
          description: "Complete guide to React Hooks",
          content:
            "React Hooks allow you to use state and lifecycle features in functional components",
          category: "react",
          difficulty: "intermediate",
          tags: ["react", "hooks", "state"],
          tokens: [
            "react",
            "hooks",
            "guide",
            "complete",
            "state",
            "lifecycle",
            "functional",
            "components",
          ],
          metadata: {
            id: "react-hooks",
            slug: "hooks",
            title: { en: "React Hooks Guide", vi: "" },
            description: { en: "Complete guide to React Hooks", vi: "" },
            category: "react",
            difficulty: "intermediate",
            estimatedTime: 45,
            prerequisites: [],
            relatedTopics: [],
            tags: ["react", "hooks", "state"],
            interviewCompanies: ["meta", "amazon"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: true,
          },
        },
        {
          id: "ts-generics",
          slug: "generics",
          title: "TypeScript Generics",
          description: "Master TypeScript generics",
          content:
            "Generics provide a way to create reusable components in TypeScript",
          category: "typescript",
          difficulty: "advanced",
          tags: ["typescript", "generics", "types"],
          tokens: [
            "typescript",
            "generics",
            "master",
            "reusable",
            "components",
            "types",
          ],
          metadata: {
            id: "ts-generics",
            slug: "generics",
            title: { en: "TypeScript Generics", vi: "" },
            description: { en: "Master TypeScript generics", vi: "" },
            category: "typescript",
            difficulty: "advanced",
            estimatedTime: 60,
            prerequisites: [],
            relatedTopics: [],
            tags: ["typescript", "generics", "types"],
            interviewCompanies: ["google", "microsoft"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: false,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
        },
      ],
      tokenMap: {
        javascript: ["js-closures"],
        closures: ["js-closures"],
        react: ["react-hooks"],
        hooks: ["react-hooks"],
        typescript: ["ts-generics"],
        generics: ["ts-generics"],
        functions: ["js-closures"],
        scope: ["js-closures"],
        state: ["react-hooks"],
        components: ["react-hooks", "ts-generics"],
      },
      categoryMap: {
        javascript: ["js-closures"],
        react: ["react-hooks"],
        typescript: ["ts-generics"],
      },
      tagMap: {
        closures: ["js-closures"],
        scope: ["js-closures"],
        functions: ["js-closures"],
        react: ["react-hooks"],
        hooks: ["react-hooks"],
        state: ["react-hooks"],
        typescript: ["ts-generics"],
        generics: ["ts-generics"],
        types: ["ts-generics"],
      },
      difficultyMap: {
        intermediate: ["js-closures", "react-hooks"],
        advanced: ["ts-generics"],
      },
    };
  });

  describe("search", () => {
    test("should return empty array when no index is loaded", async () => {
      const results = await searchService.search("test", "en");
      expect(results).toEqual([]);
    });

    test("should find documents matching query tokens", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("javascript closures", "en");

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].contentId).toBe("js-closures");
      expect(results[0].title).toContain("JavaScript");
    });

    test("should return results sorted by relevance", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("react", "en");

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].contentId).toBe("react-hooks");
      expect(results[0].relevanceScore).toBeGreaterThan(0);
    });

    test("should apply category filter", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("components", "en", {
        filters: { categories: ["react"] },
      });

      expect(results.length).toBe(1);
      expect(results[0].category).toBe("react");
    });

    test("should apply difficulty filter", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("typescript", "en", {
        filters: { difficulty: ["advanced"] },
      });

      expect(results.length).toBe(1);
      expect(results[0].difficulty).toBe("advanced");
    });

    test("should apply pagination", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("components", "en", {
        limit: 1,
        offset: 0,
      });

      expect(results.length).toBe(1);
    });

    test("should generate highlights", async () => {
      await searchService.loadIndex("en", mockIndex);
      const results = await searchService.search("closures", "en");

      expect(results[0].highlights.length).toBeGreaterThan(0);
    });
  });

  describe("searchWithFacets", () => {
    test("should return faceted results with counts", async () => {
      await searchService.loadIndex("en", mockIndex);
      const result = await searchService.searchWithFacets(
        "javascript react typescript",
        "en"
      );

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.facets.categories).toBeDefined();
      expect(result.facets.difficulties).toBeDefined();
      expect(result.facets.tags).toBeDefined();
      expect(result.totalResults).toBeGreaterThan(0);
    });

    test("should count categories correctly", async () => {
      await searchService.loadIndex("en", mockIndex);
      const result = await searchService.searchWithFacets("components", "en");

      expect(result.facets.categories["react"]).toBe(1);
      expect(result.facets.categories["typescript"]).toBe(1);
    });

    test("should apply filters to results", async () => {
      await searchService.loadIndex("en", mockIndex);
      const result = await searchService.searchWithFacets("components", "en", {
        categories: ["react"],
      });

      expect(result.results.length).toBe(1);
      expect(result.results[0].category).toBe("react");
    });

    test("should count companies in facets", async () => {
      await searchService.loadIndex("en", mockIndex);
      const result = await searchService.searchWithFacets(
        "javascript react",
        "en"
      );

      expect(result.facets.companies["google"]).toBeGreaterThan(0);
      expect(result.facets.companies["meta"]).toBeGreaterThan(0);
    });
  });

  describe("getSuggestions", () => {
    test("should return empty array for short queries", async () => {
      await searchService.loadIndex("en", mockIndex);
      const suggestions = await searchService.getSuggestions("a", "en");

      expect(suggestions).toEqual([]);
    });

    test("should return token suggestions matching prefix", async () => {
      await searchService.loadIndex("en", mockIndex);
      const suggestions = await searchService.getSuggestions("clo", "en");

      expect(suggestions).toContain("closures");
    });

    test("should return phrase suggestions from titles", async () => {
      await searchService.loadIndex("en", mockIndex);
      const suggestions = await searchService.getSuggestions("react", "en");

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some((s) => s.toLowerCase().includes("react"))).toBe(
        true
      );
    });

    test("should limit suggestions to 10", async () => {
      await searchService.loadIndex("en", mockIndex);
      const suggestions = await searchService.getSuggestions("co", "en");

      expect(suggestions.length).toBeLessThanOrEqual(10);
    });

    test("should sort suggestions by length", async () => {
      await searchService.loadIndex("en", mockIndex);
      const suggestions = await searchService.getSuggestions("typ", "en");

      if (suggestions.length > 1) {
        for (let i = 0; i < suggestions.length - 1; i++) {
          expect(suggestions[i].length).toBeLessThanOrEqual(
            suggestions[i + 1].length
          );
        }
      }
    });
  });

  describe("getIndexStats", () => {
    test("should return null when index not loaded", () => {
      const stats = searchService.getIndexStats("en");
      expect(stats).toBeNull();
    });

    test("should return index statistics", async () => {
      await searchService.loadIndex("en", mockIndex);
      const stats = searchService.getIndexStats("en");

      expect(stats).not.toBeNull();
      expect(stats?.documentCount).toBe(3);
      expect(stats?.tokenCount).toBeGreaterThan(0);
      expect(stats?.categoryCount).toBe(3);
      expect(stats?.tagCount).toBeGreaterThan(0);
    });
  });
});
