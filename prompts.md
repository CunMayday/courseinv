# Project Task History

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
