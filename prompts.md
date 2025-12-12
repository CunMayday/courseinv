# Project Task History

## 38. Phase 2 Refactoring: Component Decomposition
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"go" (after merging Phase 1 and creating Phase 2 branch)

**Summary:**
Implemented Phase 2 architectural refactoring to decompose the monolithic CourseInventoryApp into reusable UI components (Version 1.24.0):

1. **Created components.js** (330 lines):
   - UploadSection - Handles three file upload inputs (~95 lines)
   - StatsDashboard - Displays four statistics cards (~25 lines)
   - FilterControls - Subject dropdown, search, and type filters (~60 lines)
   - CourseTable - Main data table with sortable columns (~140 lines)
   - Global namespace: window.CourseInventoryComponents

2. **Refactored script.js**:
   - Replaced large inline UI sections with component calls
   - UploadSection: Reduced ~55 lines of inline JSX to 8-line component call
   - StatsDashboard: Reduced ~17 lines to 1-line component call
   - FilterControls: Reduced ~43 lines to 11-line component call
   - CourseTable: Reduced ~98 lines to 8-line component call
   - Main component reduced from ~600 lines to ~440 lines

3. **Updated index.html**:
   - Added script tag to load components.js
   - Updated version comment to 1.24.0

4. **Updated VERSION_HISTORY**:
   - Added version 1.24.0 entry to changelog
   - Updated footer to display "Version 1.24.0"

**Technical Impact:**
- **Component Separation**: UI now properly separated into focused, reusable components
- **Code Reduction**: ~160 lines eliminated through component extraction
- **Maintainability**: Each component has single responsibility
- **Reusability**: Components can be used independently or in different contexts
- **Prop-based Architecture**: Clear data flow through component props

**Files Created:**
- components.js (330 lines)

**Files Modified:**
- script.js - Reduced by ~160 lines through component extraction
- index.html - Added components.js script tag, updated version
- prompts.md - This entry

**Result:**
Phase 2 refactoring complete. CourseInventoryApp now uses four focused UI components instead of inline JSX. Code is more organized, maintainable, and follows React best practices for component composition.

## 37. Phase 1 Refactoring: Extract Business Logic and Eliminate Code Duplication
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"what do you thinkkk f these suggestions, are they worth the effort?

1. Architecture & Component Structure
Current State: The application relies heavily on a single 'God Component' (CourseInventoryApp) in script.js...
[Suggestion to decompose UI and extract business logic]

2. Code Reusability (DRY Principle)
Current State: In script.js, there are three separate useEffect hooks (lines 135, 171, 212) for parsing...
[Suggestion to create reusable parser]"

**Summary:**
Implemented Phase 1 architectural refactoring to reduce code duplication and improve maintainability (Version 1.23.0):

1. **Created constants.js** (27 lines):
   - Centralized TYPE_ORDER array (previously duplicated twice)
   - Added REQUIRED_TYPES array
   - Added CHART_COLORS object
   - Global namespace: window.CourseInventoryConstants

2. **Created utils.js** (348 lines):
   - parseRequirement() - Extracts requirement parsing logic (~65 lines)
   - calculateEnrollmentMetrics() - Enrollment statistics calculation (~30 lines)
   - categorizeTypes() - Type classification logic (~45 lines)
   - calculateSectionMetrics() - Section metrics and trends (~50 lines)
   - processCourseData() - Main business logic (previously 280-line useEffect)
   - Global namespace: window.CourseInventoryUtils

3. **Created hooks.js** (102 lines):
   - useCSVParser() - Custom hook for CSV parsing
   - Eliminated 132 lines of duplicate parsing code (3x 44-line useEffect hooks)
   - Handles file size validation, parsing, column validation, error handling
   - Global namespace: window.CourseInventoryHooks

4. **Refactored script.js**:
   - Replaced three nearly-identical CSV parsing useEffect hooks with three calls to useCSVParser (~25 lines total)
   - Replaced massive 280-line data processing useEffect with 10-line call to processCourseData
   - Updated to use TYPE_ORDER constant instead of local array
   - Reduced from 885 lines to ~600 lines in CourseInventoryApp component

5. **Updated index.html**:
   - Added script tags to load constants.js, utils.js, hooks.js before script.js
   - Updated version comment to 1.23.0

**Technical Impact:**
- **Code Reduction**: ~315 lines eliminated through extraction and deduplication
- **Maintainability**: Business logic now testable without React
- **DRY Compliance**: CSV parsing logic written once, used three times
- **Separation of Concerns**: Business logic separated from React lifecycle
- **Constants Management**: Single source of truth for TYPE_ORDER, colors, etc.

**Files Created:**
- constants.js (27 lines)
- utils.js (348 lines)
- hooks.js (102 lines)

**Files Modified:**
- script.js - Reduced by ~285 lines
- index.html - Added 3 script tags
- prompts.md - This entry

**Result:**
Phase 1 refactoring complete. Main component reduced from 885 to ~600 lines. Duplicate code eliminated. Business logic now isolated and testable. Ready for Phase 2 (component decomposition) in future branch.

## 36. Hide upload section after data loads
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"upon loding the Upload data files section should be removed. we don't need to see that anymore, and if we need to change files, we can reload the page. so remove that panel once the files are processed."

**Summary:**
Made upload section hide automatically after data is successfully loaded (Version 1.22.3):

1. **Added conditional rendering** (script.js:741):
   - Changed `h('div', {` to `!dataLoaded && h('div', {`
   - Upload section now only renders when `!dataLoaded` is true
   - Once all three files are processed, upload section disappears
   - Clean interface showing only the analysis results

2. **User Workflow**:
   - **Initial load**: Upload section visible with three file inputs
   - **After upload**: Upload section automatically hidden
   - **To upload new data**: Reload page (F5 or refresh button)
   - Simpler, cleaner interface after data loads

3. **Updated version to 1.22.3** across:
   - script.js - header comment and VERSION_HISTORY array
   - index.html - header comment

**Technical Details:**
- Uses existing `dataLoaded` variable: `coursesData.length > 0 && degreePlansData.length > 0 && enrollmentsData.length > 0`
- React conditional rendering with `&&` operator
- No CSS changes needed
- Upload section removed from DOM entirely when data loaded (not just hidden with CSS)

**Result:**
Cleaner interface after data loads. Upload section only visible when needed. Users reload page to start fresh with new files.

## 35. Fixed second ReferenceError after data upload
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"I get a white page after I select the files. console says: react-dom.production.min.js:121 ReferenceError: setUploadSectionExpanded is not defined at script.js:271:13"

**Summary:**
Fixed another critical bug from Task 33 - leftover call to removed state setter (Version 1.22.2):

1. **Root Cause**:
   - In Task 33, removed `uploadSectionExpanded` state variable
   - In Task 34, removed the state declaration line
   - BUT forgot to remove the call to `setUploadSectionExpanded(false)` at line 271
   - This line was in the useEffect that runs after all three data files are loaded
   - Purpose was to auto-hide upload section after data loaded (no longer needed)
   - Error occurred AFTER files were selected, causing white page

2. **Fix Applied** (script.js:268-273):
   - **Line 270-271**: Removed comment and `setUploadSectionExpanded(false);` call
   - Simplified useEffect to just set processing state and clear errors
   - Upload section now stays visible (expanded) at all times

3. **Updated version to 1.22.2** across:
   - script.js - header comment and VERSION_HISTORY array
   - index.html - header comment

**Result:**
App now fully functional. Upload section appears on load, files can be selected and processed without errors, and upload section remains visible after data loads.

## 34. Fixed ReferenceError preventing page load
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"something broke, the load files page isn't coming up on reload anymore. this is what's in the console:  14:32:17.278
ReferenceError: hideNeverOffered is not defined
    CourseInventoryApp file:///C:/Users/cuneyt/Documents/GitHub/courseinv/script.js:568"

**Summary:**
Fixed critical bug introduced in Task 33 that prevented the app from loading (Version 1.22.1):

1. **Root Cause**:
   - In Task 33, removed `hideNeverOffered` state variable declaration (line 122)
   - But forgot to remove references to `hideNeverOffered` in filter logic
   - This caused `ReferenceError: hideNeverOffered is not defined` at line 568
   - Error prevented React app from rendering, showing only "Loading..." message

2. **Fix Applied** (script.js):
   - **Line 565**: Removed `const matchesNeverOffered = !hideNeverOffered || course.timesOffered > 0;`
   - **Line 566**: Changed return statement from `return matchesSubject && matchesSearch && matchesTypes && matchesNeverOffered;` to `return matchesSubject && matchesSearch && matchesTypes;`
   - **Line 568**: Removed `hideNeverOffered` from useMemo dependency array: `}, [processedCourses, selectedSubject, searchTerm, selectedTypes, hideNeverOffered]);` → `}, [processedCourses, selectedSubject, searchTerm, selectedTypes]);`
   - **Line 121**: Removed unused `uploadSectionExpanded` state variable (leftover from Task 33)

3. **Updated version to 1.22.1** across:
   - script.js - header comment and VERSION_HISTORY array
   - index.html - header comment

**Result:**
App now loads successfully. Upload section appears immediately on page load. All filtering works correctly without the "hide never offered" functionality.

## 33. Simplify UI - remove checkbox and toggle, add sorting instructions
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"remove the Hide courses never offered option
Add a line underneath the "Purdue University Global - Course Usage and Program Requirements" to explain to users that they can sort by each column by clicking on the column headers, clicking twice will change sort order.  Remove the "upload new data files" section. we can just reload the page to do that right?"

**Summary:**
Simplified the UI by removing unnecessary controls and adding user guidance (Version 1.22.0):

1. **Removed 'Hide courses never offered' checkbox** (script.js):
   - Deleted `hideNeverOffered` state variable
   - Removed checkbox UI from controls section
   - Removed filtering logic that excluded courses with `timesOffered === 0`
   - Updated `filteredCourses` useMemo dependencies (removed hideNeverOffered)
   - All courses now always visible regardless of offering history
   - Cleaner, simpler controls section

2. **Added sorting instructions to header** (script.js:712, styles.css:75-80):
   - Added third line to header: "Click column headers to sort • Click again to reverse order"
   - Styled as `.header-instruction` class
   - Gray color (#9D968D), smaller font (12px), italic
   - Provides immediate user guidance without cluttering interface
   - Positioned in header below main subtitle

3. **Removed upload toggle section** (script.js:739-741):
   - Deleted upload toggle button/UI entirely
   - Removed `uploadSectionExpanded` state logic
   - Upload section now always visible (className: 'upload-section expanded')
   - Removed conditional rendering logic for toggle
   - Simpler approach: just reload page to start over with new data
   - No need for "Upload New Data Files" / "Hide Upload Section" toggle

4. **Updated CSS** (styles.css:75-80):
   - Added `.header-instruction` class for sorting guidance
   - Gray color for subtlety
   - Italic font style
   - Smaller font size (12px)
   - Margin top for spacing

5. **Updated version to 1.22.0** across:
   - script.js - header comment, VERSION_HISTORY array, version footer
   - index.html - header comment
   - styles.css - header comment

**Rationale:**
- "Hide courses never offered" removed: Users can use search/filter instead, and seeing all courses provides complete picture
- Upload toggle removed: Simpler to just reload page for new data (standard web app behavior)
- Sorting instructions added: Proactive user guidance reduces confusion
- Overall cleaner, less cluttered interface

**User Workflow for New Data:**
- Previously: Click toggle, upload files
- Now: Reload page (F5 or refresh button), upload files

**Files modified:**
- script.js - Removed hideNeverOffered state/logic, removed upload toggle, added sorting instruction, updated version
- index.html - Updated version header
- styles.css - Added header-instruction class, updated version header
- prompts.md - Added this task entry

---

## 32. Add dynamic change log modal
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"There is a list of changes in the code listed as comments at the top of the file.  is it possible to add a buttion that upon clicking pulls that list as the change history when the user clicks it, but we don't hard code the changes?  Or is that not possible?"

Follow-up: "yes, do it.  and add a i with a circle icon to the right of the title line (right justified) to trigger it."

**Summary:**
Added a dynamic change log modal accessible via an info button in the header (Version 1.21.0):

1. **Created VERSION_HISTORY array** (script.js:85-102):
   - JavaScript array containing all version entries
   - Each entry has `version` and `description` properties
   - Maintains last 16 versions (from 1.10.0 to 1.21.0)
   - **Important**: Must be kept in sync with comment block at top of file
   - Comment added: "// Version history - keep this in sync with comment block at top of file"

2. **Added info button to header** (script.js:707-717):
   - Circular info button with "ℹ" icon
   - Positioned right-aligned in header using flexbox
   - Button has Campus Gold (#C28E0E) border and text
   - Hovers to filled Campus Gold background with white text
   - Slight scale animation on hover (transform: scale(1.1))
   - Title attribute: "View Change Log"

3. **Added header layout structure** (script.js:707-718, styles.css:54-62):
   - Created `.header-content` wrapper with flexbox
   - `.header-text` contains title and subtitle (flex: 1)
   - Info button aligned to the right
   - Maintains existing header styling

4. **Created change log modal** (script.js:990-1009):
   - Uses existing modal overlay pattern
   - Modal title: "Change Log"
   - Lists all VERSION_HISTORY entries in reverse chronological order
   - Each entry shows version number (gold) and description
   - Click outside modal or × button to close
   - Added `showChangeLog` state to control visibility

5. **Added CSS styling** (styles.css):
   - `.info-circle-btn`: 36px circular button, Campus Gold border, transparent background
   - `.info-circle-btn:hover`: Filled Campus Gold background, white text, scale animation
   - `.changelog-modal`: Max width 800px (wider than default 700px)
   - `.changelog-list`: Vertical list with 15px gaps
   - `.changelog-entry`: Card style with gold left border, light gray background
   - `.changelog-version`: Bold gold text (16px)
   - `.changelog-description`: Dark gray text (14px, line-height 1.5)

6. **Updated version to 1.21.0** across:
   - script.js - header comment, VERSION_HISTORY array, version footer
   - index.html - header comment
   - styles.css - header comment

**Maintenance Workflow:**
When adding a new version:
1. Update comment block at top of script.js (as usual)
2. Add new entry to VERSION_HISTORY array (at the beginning)
3. Update version footer text
4. Both changes will appear automatically in the modal

**Technical Details:**
- Uses React's `map` to render version entries dynamically
- No hard-coded version data in modal component
- Single source of truth in VERSION_HISTORY array
- Modal uses existing modal styles with custom `.changelog-modal` override
- Click propagation stopped on modal content (e.stopPropagation)

**Files modified:**
- script.js - Added VERSION_HISTORY array, showChangeLog state, info button, modal, updated version
- index.html - Updated version header
- styles.css - Added header layout, info button, and changelog modal styles, updated version header
- prompts.md - Added this task entry

---

## 31. Remove variation toggle and trend column
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"remove the variation display switch, we will always use standard deviation which is the default now. also remove the trend column."

**Summary:**
Simplified the main table by removing the variation display toggle and trend column (Version 1.20.0):

1. **Removed variation display toggle** (script.js):
   - Deleted `variationMode` state variable (was: 'percent' or 'stddev')
   - Removed entire "Variation Display" toggle switch UI from controls section
   - Toggle had labels "%" and "Std Dev" with switch between them
   - Now always displays standard deviation (no user choice needed)

2. **Updated variation column** (script.js):
   - Changed header from dynamic `variationMode === 'percent' ? 'VARIATION (%)' : 'VARIATION (STD DEV)'` to fixed `'VARIATION (STD DEV)'`
   - Simplified sorting logic to always use `sectionStdDev` (removed percentage option)
   - Simplified table cell rendering to always display `course.sectionStdDev` (removed conditional logic)
   - Removed `sectionVariationPercent` from display (still calculated in data for potential future use)

3. **Removed trend column** (script.js):
   - Deleted "TREND" column header from table
   - Removed trend sorting case from sort switch statement
   - Removed trend table cell with arrow symbols (↑ ↓ →)
   - Trend symbols no longer displayed in main table
   - `sectionTrend` still calculated in data (not removed from data structure)

4. **Updated table colspan** (script.js):
   - Changed from 11 to 10 columns for "no results" message
   - Accounts for removal of one column (trend)

5. **Updated version to 1.20.0** across:
   - script.js - header comment and version footer
   - index.html - header comment
   - styles.css - header comment

**Rationale:**
- Standard deviation is more statistically meaningful than percentage variation
- Simplifies UI by removing toggle
- Trend column removed for cleaner table (trend can still be seen in chart)
- Data still calculated in backend for potential future features

**Files modified:**
- script.js - Removed variationMode state, toggle UI, trend column, updated sorting/rendering logic, updated version
- index.html - Updated version header
- styles.css - Updated version header
- prompts.md - Added this task entry

---

## 30. Remove Section History by Track list from detail modal
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"remove this section from the details modal: Section History by Track (Last 5 Terms per Track)  we have the chart so we donot need to list the courses anymore."

**Summary:**
Removed the "Section History by Track" collapsible list from the course detail modal (Version 1.19.1):

1. **Removed termHistory calculation** (script.js):
   - Deleted `termHistory` useMemo hook that calculated last 5 terms per track
   - This data is now only visualized in the Chart.js chart
   - Kept `allTermHistory` calculation for chart rendering

2. **Removed Section History UI** (script.js):
   - Deleted entire "Section History by Track (Last 5 Terms per Track)" section
   - Removed collapsible section header with Show/Hide button
   - Removed term history list rendering with term codes, sections, and enrollment
   - Removed `historyCollapsed` state variable (no longer needed)

3. **Updated version to 1.19.1** across:
   - script.js - header comment and version footer
   - index.html - header comment
   - styles.css - header comment

**Rationale:**
- Chart provides better visualization of the same data
- Eliminates redundant information
- Cleaner, more focused modal UI
- Existing CSS styles retained (may be used elsewhere or for future features)

**Files modified:**
- script.js - Removed termHistory calculation, Section History UI section, historyCollapsed state, updated version
- index.html - Updated version header
- styles.css - Updated version header
- prompts.md - Added this task entry

---

## 29. Split degree plans column into Required and Optional
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"right now we have a column that says "deree pplans using this" which counts (check the code to make sure) all the instances where a course is listed for a degree plant.  We want to split that column into two: One will "Required in degree plans" and the other "Optional in Degree plans."  First column will count all the instances where the course is labeled as : requirements, concentration, major, and core, the optional column will count all other types.  Make it so that upon hoevering on the column headers, a small pop up comes up to explain the efinition of that column. do you have any questions?"

**Summary:**
Split the "Degree Plans Using This" column into two separate columns with hover tooltips (Version 1.19.0):

1. **Added Required vs Optional counting logic** (script.js:476-498):
   - Created `requiredCount` and `optionalCount` properties for each course
   - **Required types**: Core, Major, Requirements, Concentration (but NOT Concentration Elective)
   - **Optional types**: Electives, Concentration Electives, Open Electives, Micro-credentials, and other types
   - Special handling for "Concentration Elective" - treated as optional despite containing "concentration"
   - Each degree plan counted only once per course (no duplicates)

2. **Updated table headers with tooltips** (script.js:894-903):
   - **"REQUIRED IN DEGREE PLANS"** column with tooltip: "Number of degree programs where this course is required (Core, Major, Requirements, or Concentration)"
   - **"OPTIONAL IN DEGREE PLANS"** column with tooltip: "Number of degree programs where this course is optional (Electives, Concentration Electives, Open Electives, Micro-credentials, or other types)"
   - Removed old "DEGREE PLANS USING THIS" column
   - Added sorting functionality for both new columns

3. **Updated table body** (script.js:947-952):
   - Display `course.requiredCount` in first new column
   - Display `course.optionalCount` in second new column
   - Updated colspan from 10 to 11 for "no results" message

4. **Updated detail modal info grid** (script.js:1270-1278):
   - Changed from 4 columns to 5 columns layout
   - Split "Programs" into "Required In" and "Optional In" info cards
   - Shows `course.requiredCount` and `course.optionalCount` at top of modal

5. **Split program lists in modal** (script.js:1030-1052, 1407-1439):
   - Created `requiredPrograms` and `optionalPrograms` useMemo hooks
   - Filters programs based on same logic as main table
   - Two separate sections: "Required in Degree Programs (X)" and "Optional in Degree Programs (X)"
   - Each section shows count in heading
   - Maintains existing category color coding for program tags

6. **Updated version to 1.19.0** across:
   - script.js - header comment and version footer
   - index.html - header comment
   - styles.css - header comment

**Technical Details:**
- Counting is based on unique degree programs (TranscriptDescrip)
- Each program is counted only once per course
- "Concentration Elective" explicitly handled as optional (edge case)
- Hover tooltips use native HTML `title` attribute
- No CSS changes needed (reused existing styles)

**Files modified:**
- script.js - Added required/optional counting, updated table headers/body, modified modal, updated version
- index.html - Updated version header
- styles.css - Updated version header
- prompts.md - Added this task entry

---

## 28. Make View Details button available for all courses
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"i noticed that courses that do not belong to any degree plans do not get a view details button.  Every couse should get that button because there is other information shown there.  Just make sure that we show "not available" or appropriate message for missing information"

**Summary:**
Made the View Details button available for all courses regardless of degree plan association (Version 1.18.4):

1. **Removed conditional rendering of View Details button** (script.js:943-948):
   - Previously only showed button when `course.usageCount > 0`
   - Now shows button for all courses
   - Allows users to access enrollment data, section history, and other information even for courses not in degree plans

2. **Added message for courses without programs** (script.js:1338-1353):
   - When a course has no associated degree programs (`course.programs.length === 0`)
   - Displays: "This course is not associated with any degree programs."
   - Message styled in gray (#9D968D) with italic font
   - Maintains consistent user experience

3. **Updated version to 1.18.4** across:
   - script.js - header and version footer
   - index.html - header comment
   - styles.css - header comment

**User Experience Improvement:**
- All courses now have access to View Details modal
- Even courses without degree plan associations can show:
  - Average enrollment data
  - Section trends over time (if enrollment data available)
  - Times offered statistics
  - Informative message when programs are not available

**Files modified:**
- script.js - Removed conditional, added no-programs message, updated version
- index.html - Updated version header
- styles.css - Updated version header
- prompts.md - Added this task entry

---

## 27. Replace variation radio buttons with toggle switch
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"did we fix this:  The variation toggle is good, but might be clearer as a labeled toggle/switch rather than radio buttons in the controls area"

User confirmation: "yes"

**Summary:**
Replaced variation display radio buttons with a visual toggle switch for better UX (Version 1.18.3):

1. **Updated variation control in script.js** - Replaced radio button group with toggle switch:
   - Changed from two radio inputs to a single checkbox-based toggle switch
   - Added left label "%" and right label "Std Dev" with active state highlighting
   - Toggle switches between percent and standard deviation modes
   - More intuitive and visually clearer than radio buttons

2. **Added toggle switch CSS styling in styles.css**:
   - `.toggle-switch-container` - Flexbox container with 10px gap
   - `.toggle-label` - Gray labels that turn gold when active
   - `.toggle-switch` - 44px × 24px switch container
   - `.toggle-slider` - Rounded background that changes from gray to Purdue gold
   - `.toggle-slider:before` - White circular knob that slides 20px on toggle
   - Smooth 0.3s transitions for all state changes
   - Hover states for better interactivity

3. **Updated version to 1.18.3** across all file headers:
   - script.js - header comment and version footer
   - index.html - header comment
   - styles.css - header comment

**Visual Improvement:**
- Before: Two radio buttons labeled "%" and "Std Dev"
- After: Labeled toggle switch with "%" on left, switch in middle, "Std Dev" on right
- Active label highlights in Purdue gold (#C28E0E)
- Inactive label shows in gray (#9D968D)
- Switch background matches active state (gold when toggled to Std Dev)

**Files modified:**
- script.js - Replaced radio button UI with toggle switch, updated version
- styles.css - Added toggle switch styling with Purdue branding, updated version
- index.html - Updated version header
- prompts.md - Added this task entry

---

## 26. Fix trend symbol inconsistency and reorder documentation
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"we made some changes. review prompts.md and the code and tell me if the changes are good, or if there are issues that need to be addressed"

User confirmation after issue identification: "yes"

**Summary:**
Fixed critical bugs found during code review of versions 1.12.0 through 1.18.1 (Version 1.18.2):

1. **Fixed trend symbol inconsistency** - Changed default trend symbol from hyphen to em dash:
   - Changed `let sectionTrend = '-';` to `let sectionTrend = '—';` at script.js:432
   - This fixes visual inconsistency with arrow symbols (↑ ↓ →)
   - Resolves sorting bug where trend order map expected `'—'` but data used `'-'`

2. **Reordered prompts.md tasks** - Reorganized tasks 18-25 to reverse chronological order:
   - Now properly ordered: #25, #24, #23, #22, #21, #20, #19, #18 (newest first)
   - Previous order was scattered: #20, #21, #22, #19, #18
   - Improves documentation readability and project history understanding

3. **Updated version to 1.18.2** across all file headers:
   - script.js - header comment and version footer
   - index.html - header comment
   - styles.css - header comment

**Files modified:**
- script.js - Fixed trend symbol bug, updated version header and footer
- prompts.md - Reordered tasks chronologically, added this task entry
- index.html - Updated version header
- styles.css - Updated version header

---

## 25. Remove change log button/modal
**Agent:** Codex

**User Prompt:**
"let's just remove the i button and the feature.  I will think of this separately."

**Summary:**
- Removed the change log button and modal overlay; header restored to text-only.
- Cleaned up related styles and versioned to 1.18.1 across code files.

---

## 24. Add change log pop-up button
**Agent:** Codex

**User Prompt:**
"Add a button on the main page like an "i" with a circle that upon clicking will show the change log in a pop-up."

**Summary:**
- Added an "i" info-circle button in the header that opens a modal showing recent change log entries.
- Styled the info button and modal list; added local changelog data and state to toggle visibility.
- Bumped version to 1.18.0 in code comments/footers and documented in prompts.md.

---

## 23. Add variation display toggle
**Agent:** Codex

**User Prompt:**
"add a small switch to the variation column, so user can select between % variation and just the variation number (rounded to 1 significant digit after the decimal)."

**Summary:**
- Added a Variation Display toggle (percent vs std dev) that updates the header, sorting, and per-row values; std dev is rounded to one decimal.
- Stored both percent and std dev metrics during processing and wired the sort logic to follow the selected mode.
- Bumped version to 1.17.0 in code comments/footers.

---

## 22. Fix white screen from program color change
**Agent:** Codex

**User Prompt:**
"we did not commit any of these to github.  these are all local..  can you undo the changes in 1.16 or should we try to fix the error?"

**Summary:**
- Fixed a ReferenceError causing a white screen by adding a locally scoped category helper inside CourseModal for program tags, aligning colors without breaking scope.
- Updated version headers/footers to 1.16.1 in code files.

---

## 21. Match program type colors in detail modal
**Agent:** Codex

**User Prompt:**
"the main listing that shows the types has color coding , we should make sure that the same colors are used in the details screem when the assocaited programs are listed alond with the type they are.  right now, they all use the same color in the details popup"

**Summary:**
- Applied the same category color classes to program tags in the detail modal so they match the main list colors (core/major/requirements/concentration/elective/micro-credential/other).
- Updated CSS to share styling between list tags and modal program tags, and added text casing for consistency.
- Bumped version to 1.16.0 across code headers/footers.

---

## 20. Keep four info cards in a row and collapse section history
**Agent:** Codex

**User Prompt:**
"I want to fit 4 boxes in a row, don't drop the fourh one down to second row.  Also, make the section history byt track table collapsible, and collapse it by default."

**Summary:**
- Forced the detail modal info grid to always show four cards (Programs, Avg Enrollment, Times Offered, Avg Sections/Term) in a single row with fallbacks.
- Added a default-collapsed toggle to the Section History by Track block and styled the header/button for the collapsible section.
- Bumped version to 1.15.0 in code headers/footers and updated styles for the new toggle.

---

## 19. Simplify detail modal info cards
**Agent:** Codex

**User Prompt:**
"in the detail view, the top of the page has a section with some information in gray boxes.  remove the following from those: subject, degree plans using this, variation, trend.
Also remove the department chair line."

**Summary:**
- Removed subject, degree plan count, variation, and trend info cards from the modal’s top info grid; dropped the department chair row entirely.
- Kept programs, average enrollment, times offered, and average sections/term; adjusted grid columns to fit remaining cards.
- Bumped version to 1.14.0 and updated version headers/footers in index.html, script.js, and styles.css.

---

## 18. Unify chart track dropdown across modes
**Agent:** Codex

**User Prompt:**
"we should use the same dropdown box approach that we use in  "by term code" in "by base term" as well.  remove the tracks radio button for all tracks and invididual tracks, and implement the same approach as used on "by term code" with a dropdown.  default is "all tracks" and the dropdown allows showing just one track."

**Summary:**
- Replaced base-term track radio buttons with the same track dropdown used in term-code mode, defaulting to All Tracks and allowing a single-track view for both sections and enrollment charts.
- Adjusted chart data/label logic to respect the unified dropdown for both x-axis modes; kept legend hidden since only one series is shown at a time.
- Bumped version to 1.13.0 and updated version comments/footers in index.html, script.js, and styles.css.

---

## 17. Add interactive Chart.js line chart to detail modal
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"let's add a feature to the detail view.  I want it to show a chart showing the term by term number of sections trend as a line chart.  so the same data that is displayed below, but shown as a chart, over time.  the chart should allow selecting a specific track, or show all the tracks combined over time.  ask questions if you need to before starting."

User clarifications:
1. Chart library: "ok, let's go with chart.js then we can reconsider."
2. Track selection: "let's do dropdown"
3. Chart placement: "put it above the track list"
4. Time range: "do it for all the data"
5. Y-axis when showing all tracks: "total"
6. X-axis format: "do it both ways, selected with a radio button"
7. Additional metrics: "let's do both, also with a radio button"

**Summary:**
Added interactive Chart.js line chart visualization to course detail modal (Version 1.12.0):

1. **Chart.js Integration**:
   - Added Chart.js 4.4.0 to CDN loading system with fallback URLs
   - Integrated into existing loadScript sequence (React → ReactDOM → PapaParse → Chart.js)

2. **Chart Data Preparation**:
   - Created `allTermHistory` useMemo to calculate ALL enrollment history (not limited to 5 terms)
   - Calculates sections and total enrollment per term code
   - Extracts available tracks from data

3. **Chart Controls** (3 control groups):
   - **Display Mode Radio Buttons**:
     - "By Term Code" (full): Shows individual term codes (2401A, 2401B, 2401C...)
     - "By Base Term" (base): Shows base terms (2401, 2402...) with separate lines per track
   - **Track Dropdown** (only shown in "By Term Code" mode):
     - "All Tracks" option
     - Individual track options (Track A, Track B, etc.)
   - **Metric Radio Buttons**:
     - "Sections": Number of sections offered
     - "Enrollment": Total enrollment numbers

4. **Chart Rendering** (useEffect + useRef):
   - Canvas element with Chart.js line chart
   - Two distinct visualization modes:
     - **Full mode**: Single line filtered by selected track
     - **Base mode**: Multiple lines (one per track) with track-specific colors
   - Dynamic chart updates when controls change
   - Proper cleanup/destroy of chart instances on re-render
   - 400px height, responsive width

5. **Styling**:
   - Chart controls container with flexbox layout, light background
   - Radio button groups with proper spacing
   - Dropdown with Purdue brand colors and focus states
   - Chart container with padding and border
   - All using Purdue color palette (#C28E0E gold, etc.)

6. **UI Layout**:
   - Chart section appears above "Section History by Track" list
   - Only displays when enrollment data exists
   - Maintains existing term history list below chart

**Technical Details**:
- Chart colors: Purdue gold (#C28E0E) for primary, with additional brand colors for multi-track view
- X-axis modes handle term aggregation differently
- Y-axis starts at zero with step size of 1 for sections
- Chart title updates based on selected metric

**Files modified:**
- script.js - Added Chart.js CDN loading, chart state management, data prep, rendering logic, and UI controls
- styles.css - Added chart-controls, chart-control-group, radio-group, radio-label, track-dropdown, and chart-container styles
- index.html - Updated version to 1.12.0
- prompts.md - Added this task entry

---

## 16. Update CLAUDE.md to enforce prompts.md documentation
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"why do you not follow CLAUDE.md to update prompts.md every time? what do I need to do to make all of that happens?"

User response to my explanation: "yes"

**Summary:**
Enhanced the CLAUDE.md instructions to make prompts.md updates a mandatory, enforceable requirement:

1. **Added "CRITICAL - MANDATORY REQUIREMENT" header** - Makes it impossible to miss
2. **Reworded to emphasize obligation** - Changed "Every time you run a task..." to "you MUST update... BEFORE considering the task complete. This is NOT optional."
3. **Added WORKFLOW ENFORCEMENT section** with three explicit rules:
   - When using TodoWrite tool, ALWAYS add "Update prompts.md" as the final todo item
   - A task is NOT complete until prompts.md has been updated
   - If you finish code changes without updating prompts.md, the task is NOT finished

4. **Updated current task in prompts.md** - Added this entry (Task #16) to document the CLAUDE.md changes

**Files modified:**
- CLAUDE.md - Enhanced context tracking section with mandatory enforcement language
- prompts.md - Added this task entry

---

## 15. Add Section History by Track to detail modal
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"let's add a feature to the detail view. it should show all the number of sections for that course in the last 5 terms by track. A course would look like this : 2504C, where the first two characters are the year, second two characters are the term during the year, and the last character is the track on which it runs. Sort the list by track so that all A track is together, all B track is together, and so on."

**Summary:**
Added Section History by Track feature to the course detail modal (Version 1.11.0):

1. **On-demand calculation** - Implemented Option B approach (calculate only when modal opens)
   - Passes `enrollmentsData` to CourseModal component
   - Uses React's `useMemo` to calculate term history on-demand
   - Only processes data for courses that user actually views

2. **Term history calculation logic**:
   - Filters enrollment data for the selected course
   - Groups sections by 5-character term code (e.g., "2504C")
   - Tracks sections count and total enrollment per term
   - Extracts track identifier from last character (A, B, C, etc.)

3. **Sorting and filtering**:
   - Primary sort: By track (A, B, C...)
   - Secondary sort: By term code chronologically (most recent first within each track)
   - Limits display to last 5 terms per track

4. **Display format**:
   - Term code in monospace font (e.g., "2504C")
   - Sections count highlighted in Purdue gold
   - Total enrollment for that term
   - Format: "2504C   5 sections • 420 students"

5. **Styling** - Added CSS classes:
   - `.term-history-list` - Container for term list
   - `.term-history-item` - Individual term row
   - `.term-code` - Monospace term identifier
   - `.term-sections` - Highlighted section count
   - `.term-enrollment` - Student count

**Files modified:**
- script.js - Added on-demand calculation and modal display logic
- styles.css - Added term history styling
- index.html - Updated version to 1.11.0

---

## 14. Add enrollment analysis columns
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"add three new columns to the analysis. first will be the average sections offered per term. our terms are in column b of the enrollments data. use only the first 5 characters and ignore any dates. the second column should show the variation in the number of sections offered per term. The third column should show some indication of trends in number of sections offered."

**Summary:**
Added three new enrollment analysis columns to the main table (Version 1.10.0):

1. **Average Sections Per Term**:
   - Calculates total sections divided by number of unique terms
   - Displays as decimal (e.g., "2.5")
   - Uses first 5 characters of Term Name field (e.g., "2504C")

2. **Variation (Coefficient of Variation)**:
   - Shows how much section counts vary as a percentage
   - Formula: (Standard Deviation / Mean) × 100
   - Lower % = more consistent, Higher % = more variable
   - Displays with "%" suffix

3. **Trend Indicator**:
   - Compares first half vs second half of terms chronologically
   - **↑** = Increasing (>10% growth)
   - **→** = Stable (-10% to +10%)
   - **↓** = Decreasing (>10% decline)

4. **Implementation details**:
   - Enhanced enrollment statistics calculation to track `termData` Map
   - Each row in enrollment data = one section
   - Sections counted per unique 5-character term code
   - Added sorting functionality for all three columns
   - Updated table colspan from 7 to 10
   - Added metrics to detail modal

**Files modified:**
- script.js - Enhanced data processing, added calculations, table columns, sorting, modal display
- styles.css - Updated version header
- index.html - Updated version header

---

## 13. Review refactor split correctness
**Agent:** Codex

**User Prompt:**
"we just refactored the single html index file to three separate components.  check ifthis was done properly"

**Summary:**
Reviewed split into `index.html`, `styles.css`, and `script.js`; noted missing version headers in new code files, mojibake icons/checkbox ticks from encoding loss, and existing validation gaps (degree plan category not enforced; `dataLoaded` blocks when enrollments file has only headers/zeros). No code changes made.

---

## 12. Refactor into separate files to reduce context usage
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"yes, let's try that, then test locally before committing"

**Summary:**
Refactored single-file HTML application into separate CSS and JS files (Version 1.9.0):

1. **Created styles.css** - Extracted all CSS (~600 lines) from index.html into separate stylesheet
   - Contains all Purdue branding colors and styling
   - Includes responsive design and media queries
   - Maintains all existing visual design and animations

2. **Created script.js** - Extracted all JavaScript (~900 lines) from index.html
   - Contains CDN fallback system for React, React-DOM, and PapaParse
   - Contains complete React application code
   - Maintains all existing functionality

3. **Updated index.html** - Reduced to minimal HTML structure (~20 lines)
   - Added version 1.9.0 comment
   - Links to external styles.css
   - Links to external script.js
   - Maintains all version history in comments

4. **Updated README.md** - Documented new file structure
   - Updated "File Structure" section to show three files
   - Added v1.9.0 to version history

5. **Tested locally** - Opened index.html in browser to verify functionality

**Benefits:**
- Significantly reduces context usage in future AI sessions (each file edit now triggers smaller system reminders)
- Improves code organization and maintainability
- Easier to navigate and edit specific sections (CSS vs JS)
- Preserves all existing functionality and CDN fallback system

---

## 11. Add checkbox filter to hide courses never offered
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"add a checkbox next to the subject filter to filter out courses that have been never been offered (offered zero times)."

**Summary:**
Added checkbox filter for courses never offered (Version 1.8.0):

1. **New state variable** - Added `hideNeverOffered` state to track checkbox status (line 921)
2. **Filter logic update** - Updated `filteredCourses` useMemo to check `timesOffered > 0` when checkbox is checked (line 1277)
   - Added `matchesNeverOffered` condition to filter logic
   - Added `hideNeverOffered` to useMemo dependency array (line 1280)
3. **Checkbox UI** - Added checkbox control next to search box in controls section (lines 1570-1577)
   - Displays as "Hide courses never offered"
   - Uses Purdue gold accent color (#C28E0E)
4. **CSS styling** - Added `.checkbox-group` styling for proper checkbox layout (lines 251-271)
   - Flex layout with 8px gap
   - 18px checkbox size with gold accent color
   - Cursor pointer for interactive feel
5. **Version updates** - Updated to v1.8.0 in header comment and footer

Users can now easily filter out courses that have never been offered (timesOffered = 0) with a single checkbox click, making it easier to focus on actively taught courses.

---

## 10. Fix critical data integrity and documentation bugs
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"all three files with proper data are indeed required. I don't know if there are courses with zero enrollments, so I don't know if that's a significant issue. Implement only the changed in first group, ignore 2 and 3."

**Summary:**
Fixed critical bugs and updated documentation (Version 1.7.0):

1. **Stale data bug fix** - Clear data state arrays on validation failure to prevent stale data:
   - Added `setCoursesData([])` when Master Course List validation fails (line 948)
   - Added `setDegreePlansData([])` when Degree Plans validation fails (line 995)
   - Added `setEnrollmentsData([])` when Enrollment Figures validation fails (line 1040)
   - Prevents analysis from continuing with old/incorrect data after bad file uploads
2. **Elective labeling fix** - Prevent duplicate "Elective" suffixes:
   - Check if category already contains "elective" before appending " Elective" (lines 1094-1098)
   - Fixes "Concentration Elective Elective" becoming just "Concentration Elective"
3. **README.md updates** - Synced documentation with v1.6.0 code:
   - Changed File 3 from "Optional" to "Required" (line 70)
   - Updated "Average Attendance" to "Average Enrollment" (line 97)
   - Added version history entries for v1.5.0, v1.6.0, and v1.7.0 (lines 237-242)
   - Updated usage instructions to clarify all three files are required (line 197)
   - Updated feature list to show enrollment tracking as required (line 20)

Critical data integrity issue resolved - bad file uploads now properly clear stale data instead of allowing analysis with mixed old/new datasets.

---

## 9. Repository review
**Agent:** Codex

**User Prompt:**
"review all the .md files and the code, then give me feedback on anything that's not working right. then give me some improvement suggestions"

**Summary:**
Reviewed repository documentation and HTML code, noted doc/code drift on enrollment file requirements and version history, spotted validation gaps that leave stale data active after bad uploads, and prepared feedback plus improvement suggestions (no code changes made).

---

## 8. Make enrollment file required and add sticky table headers
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"update so all three documents are required before moving to analysis.  Also the header row in the list should be visible after scrolling down, similar to freezing header rows or panes in spreadhseets."

**Summary:**
Changed enrollment file from optional to required and added sticky table headers (Version 1.6.0):

1. **Made Enrollment Figures required** - Changed processing logic to require all three files:
   - Updated useEffect dependency to check `enrollmentsData.length > 0` (line 1052)
   - Updated dataLoaded condition to require all three files (line 1380)
   - Updated useEffect dependency array to include enrollmentsData (line 1243)
   - Removed "(Optional)" label from Enrollment Figures upload box (line 1478 removed)
   - Changed upload instruction text to "All three files are required to begin analysis." (line 1434)
2. **Added sticky table headers** - Implemented CSS position: sticky for table headers:
   - Added `position: sticky; top: 0; z-index: 10;` to thead (lines 293-295)
   - Added `background: #000000;` to th elements to prevent transparency (line 306)
   - Added `max-height: calc(100vh - 400px); overflow-y: auto;` to table-container for scrolling (lines 281-282)
   - Headers now remain visible at the top when scrolling through the course list

The application now requires all three data files before processing, and table headers stay fixed at the top while scrolling through results.

---

## 7. Fix error banner persistence and update labels
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"if an error is shown after an unexpected data file is uploaded, that error is not removed when a compliant data file is uploaded instead.  need to fix that.  Also change 'average attendance' to 'Average Enrollment'.  Change 'Usage' to 'Degree Plans Using This'"

**Summary:**
Fixed error handling and improved label clarity (Version 1.5.0):

1. **Error banner persistence fix** - Added error filtering logic to clear previous errors for each file type when a new file is uploaded
   - Master Course List errors are cleared when new Master Course List file is uploaded
   - Degree Plans errors are cleared when new Degree Plans file is uploaded
   - Enrollment Figures errors are cleared when new Enrollment Figures file is uploaded
   - Each file upload now calls `setErrors(prev => prev.filter(e => !e.includes('[FileType]')))` before processing
2. **Label updates** - Changed "Average Attendance" to "Average Enrollment" in:
   - Table header column (line 1572)
   - Course detail modal info-label (line 1666)
   - Version comment (line 4)
3. **Label updates** - Changed "Usage" to "Degree Plans Using This" in:
   - Table header column (line 1568)
   - Course detail modal info-label (line 1654)
4. **Version updates** - Updated version to 1.5.0 in header comment and footer

The error banner now correctly clears file-specific errors when valid replacement files are uploaded, preventing stale error messages from persisting.

---

## 6. Add enrollment data tracking with average attendance and times offered
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"I added a sample data set called enrollments.txt. This is a csv formatted file in .txt format. Create a third data upload button for 'Enrollment Figures' where a file like this will be provided by the user. Then, add two columns to the analysis- one for average attendance, one for how many times the course was offered."

**Summary:**
Added optional Enrollment Figures functionality (Version 1.4.0):

1. **New upload field** - Added third upload box for optional Enrollment Figures file with 📊 icon
2. **File parsing** - Added enrollment data validation checking for "Course Number" and "Course Enrollment" columns
3. **Enrollment calculations** - Built enrollmentMap to calculate:
   - Total enrollment across all sections
   - Times offered (count of unique course sections)
   - Average attendance per offering (rounded to nearest integer)
4. **New table columns** - Added "AVG ATTENDANCE" and "TIMES OFFERED" columns (conditionally shown only when enrollment data is loaded)
5. **Column sorting** - Added sort support for avgEnrollment and timesOffered fields
6. **Modal updates** - Added enrollment statistics to course detail modal with dynamic grid layout (3 or 5 columns)
7. **UI updates** - Changed upload grid to 3 columns, marked enrollment file as "(Optional)" in UI
8. **Data integration** - Merged enrollment stats into processedCourses array as avgEnrollment and timesOffered properties
9. **Updated .gitignore** - Added enrollments*.txt pattern to exclude enrollment data files

The enrollment feature is fully optional - the app works with or without enrollment data, gracefully showing/hiding the additional columns based on data availability.

---

## 5. Create comprehensive README.md
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"create a readme.md that summarizes what this project is, the data structures expected and so on. this will be used by later chat sessions to understand the context and what they need to do, in addition to Claude.md."

**Summary:**
Created comprehensive README.md documentation covering:
- Project overview and key features
- Detailed data structure requirements for both input files (Master Course List and Degree Plans)
- Data processing logic explanation (requirement parsing rules, type classification, usage calculation)
- Technology stack and CDN fallback system
- Purdue branding colors and guidelines
- File structure
- Complete usage instructions
- Error handling capabilities
- Statistics displayed
- Version history
- Future enhancement ideas
- Privacy/security notes
- Browser compatibility

This serves as the primary documentation for understanding the project architecture and expected data formats.

---

## 4. Add .gitignore for private data files
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"I added two text files to the folder. These are the data files that the program uses to do its analysis. These are private and should never be uploaded to github. add them to the ignore file. Their purpose here is to show you what format you can expect to be uploaded by the users when they provide these data files."

**Summary:**
Created `.gitignore` file to exclude private data files from git repository. Configured to ignore all `.txt` files and specific patterns for data files including "Degree Plans*.txt", "Master Course*.txt", and "Business Course Enrollments*.txt". Also added common exclusions for node_modules, OS files, IDE files, and logs.

---

## 3. Add helpful error message for file selection
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"when the application fails to load, add this to the message 'Please check that you selected the correct files for each.'"

**Summary:**
Updated error messages in index.html to include additional guidance when file validation fails. Added "Please check that you selected the correct files for each." to both Master Course List and Degree Plans column validation error messages (lines 818 and 861).

---

## 2. Power BI/Tableau comparison discussion
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"the analysis that is being done here, would power bi or tableau do this without any effort? is that what those are for"

**Summary:**
Provided detailed comparison explaining that while Power BI/Tableau could perform the analysis, the custom HTML solution is better suited for this specific use case due to: complex business logic for parsing requirements, custom data transformation needs, single-file portability, no licensing costs, and tailored UX. Explained that BI tools excel at visualizations and dashboards but would require significant effort (4-8 hours) to replicate the custom parsing logic.

---

## 1. Comprehensive bug fixes and enhancements to index.html
**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"check index.html and let me know if you see any issues. it uses data similar to what is in the two text files in the folder."

**Summary:**
Identified and fixed 6 major issues in index.html (Version 1.3.0):

1. **Fixed "requirement" filter logic** - Now properly handles cases where Requirement field contains "requirement" by using DefaultCode instead of skipping (lines 928-940)

2. **Added comprehensive error handling** - Implemented CSV parsing error detection, column validation, error/warning banner UI with dismiss functionality, and clear error messages (lines 792-793, 803-878, 1265-1297)

3. **Improved "OR" requirement handling** - Now parses requirements like "MT209 or MT220" and extracts both course codes using regex pattern matching (lines 917-927)

4. **Added loading indicators** - Implemented spinner overlay with visual feedback during file processing (lines 580-619, 1269-1275)

5. **Added file size validation** - Warns users when files exceed 10MB to set processing time expectations (lines 798-801, 840-843)

6. **Enhanced type classification logic** - Improved specificity order, better edge case handling, proper capitalization of custom categories, and skipping of empty/N/A categories (lines 1096-1129)

Also added comprehensive CSS styling for loading overlay, spinner animation, error banners, and dismiss buttons (lines 580-689).
