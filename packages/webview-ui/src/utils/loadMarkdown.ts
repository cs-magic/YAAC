// Fetch markdown content at runtime instead of importing
const MARKDOWN_URLS = {
  "commit-specification": "https://raw.githubusercontent.com/cs-magic/YAAC/main/docs/yet-another-best-practice/commit-specification.md"
};

export const loadMarkdown = async (name: "commit-specification"): Promise<string> => {
  const url = MARKDOWN_URLS[name];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading markdown:', error);
    return "Failed to load markdown content. Please try again later.";
  }
};
