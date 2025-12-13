# accessibility
The web app must be ADA compliant

# color and format guides
The webapp must follow purdue university guidelines on color and formatting:
Purdue's official colors are gold and black, with specific color codes for different applications. The primary colors include Athletic Gold (#CEB888), Campus Gold (#C28E0E), Black (#000000), and supporting grays (#9D968D and #373A36)

Campus Gold (#C28E0E) - Primary gold for highlights and accents 
Athletic Gold (#CEB888) - Softer gold for secondary elements
Purdue Black (#000000) - Primary text and strong accents
Gray (#9D968D) - Supporting text and borders
Dark Gray (#373A36) - Secondary text
White - Clean backgrounds and contrast


# updates
- All release/version metadata now lives in `version-history.js` (window.CourseInventoryVersion).
- When you make a code change that affects behavior or UI, bump the version by updating the `current` object and appending a new entry to the `history` array in `version-history.js` with a one-sentence summary.
- Do NOT add per-file version banners or header comments in individual source files; the UI footer and change log modal read from `version-history.js`.


# context tracking
**CRITICAL - MANDATORY REQUIREMENT:**

Every time you run a task and make changes or answer a question, you MUST update the file prompts.md BEFORE considering the task complete. This is NOT optional.

Update prompts.md with two pieces of information:
1. The exact prompt you received from me (not a summary, but the verbatim prompt)
2. A brief summary of the list of changes you made or the answer you gave in response
3. Include which agent you are (Codex, Claude, Gemini Jules, etc)

**IMPORTANT:** Latest changes must be added to the TOP of the prompts.md file, not the bottom. The counter should increment upward with each new task. For example, if the latest entry is "## 5. Feature X", the next entry should be "## 6. Feature Y" and should be placed ABOVE entry #5.

**WORKFLOW ENFORCEMENT:**
- When using TodoWrite tool, ALWAYS add "Update prompts.md" as the final todo item
- A task is NOT complete until prompts.md has been updated
- If you finish code changes without updating prompts.md, the task is NOT finished

If the prompts.md file doesn't exist yet, then create it first. The purpose of this file is to keep track of what the user requested and what has been done so that the context is always available for review.
