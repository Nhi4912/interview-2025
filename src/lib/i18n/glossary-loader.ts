import { GlossaryService, GlossaryDatabase } from "./GlossaryService";
import glossaryData from "@/data/glossary.json";

let isInitialized = false;

/**
 * Initialize the glossary service with data
 * This should be called once at app startup
 */
export async function initializeGlossary(): Promise<void> {
  if (isInitialized) {
    return;
  }

  await GlossaryService.initialize(glossaryData as GlossaryDatabase);
  isInitialized = true;
}

/**
 * Check if glossary is initialized
 */
export function isGlossaryInitialized(): boolean {
  return isInitialized;
}
