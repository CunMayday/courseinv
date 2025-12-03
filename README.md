# Course Inventory Analysis Tool

A single-page web application for analyzing course usage across degree programs at Purdue University Global. This tool helps identify which courses are used in which programs, how frequently they're used, and categorizes them by their role in each program.

## Project Overview

This is a standalone HTML application that performs complex data analysis entirely in the browser. It parses two data files (course master list and degree plans) to create a comprehensive view of course utilization across all academic programs.

### Key Features

- **Upload & Parse CSV/TXT Files** - Processes two data files with built-in validation and error handling
- **Course Usage Analysis** - Counts how many programs use each course
- **Smart Requirement Parsing** - Handles complex scenarios:
  - "OR" requirements (e.g., "MT209 or MT220")
  - Generic requirements that use default codes (e.g., "Mathematics Requirement" → MM150)
  - Elective mappings using DefaultCode field
- **Type Classification** - Categorizes courses as Core, Major, Requirements, Concentration, Elective, Open Elective, or Micro-credential
- **Filtering & Search** - Filter by subject area, search by code/title, filter by type
- **Detailed Course View** - Modal showing all programs using a course with category information
- **Enrollment Tracking** (Optional) - Upload enrollment data to see average attendance and times offered
- **Error Handling** - Comprehensive validation with user-friendly error messages
- **Loading Indicators** - Visual feedback during file processing

## Data Structure Requirements

### File 1: Master Course List
**Purpose:** Complete catalog of all courses with metadata

**Required Columns:**
- `Course Number` (or `CourseCode`) - Course code like "AC114", "MM150"
- `Course Title` (or `CourseName` or `CourseTitle`) - Full course name

**Optional Columns:**
- `Department Chair` - Name of department chair
- `Course Lead` - Name of course lead
- Any other metadata fields

**Example:**
```
School,Course Number,Course Title,Course Lead,Department Chair
Business,AC114,ACCOUNTING I,Broderick Martinez,Caroline Hartmann
Business,AC116,ACCOUNTING II,Broderick Martinez,Caroline Hartmann
Business,MM150,Survey of Mathematics,John Doe,Jane Smith
```

### File 2: Degree Plans
**Purpose:** Maps courses to programs with category information

**Required Columns:**
- `TranscriptDescrip` - Program name (e.g., "Associate of Applied Science in Accounting")
- `Requirement` - Course code, requirement name, or "OR" statement
- `Category` - Type like "Core", "Major", "Concentration", "Open"

**Optional Columns:**
- `DefaultCode` - Course code to use when Requirement is generic or an elective
- `School` - School name
- `Sequence` - Order in program
- `Title` - Requirement title
- Any other fields

**Example:**
```
School,Sequence,Category,Requirement,Title,DefaultCode,TranscriptDescrip
Business,1,Major,CS113,Academic Strategies,,,Associate of Applied Science in Accounting
Business,2,Core,Mathematics Requirement,Math Requirement,MM150,,Associate of Applied Science in Accounting
Business,3,Open,Open Electives,Open Electives,MT106,,Associate of Applied Science in Accounting
Business,4,Concentration,MT209 Small Business Management or MT220 Global Business,Business Elective,MT220,,Associate of Applied Science in Business
```

### File 3: Enrollment Figures (Optional)
**Purpose:** Historical enrollment data for calculating average attendance and offering frequency

**Required Columns:**
- `Course Number` - Course code matching the Master Course List
- `Course Enrollment` - Number of students enrolled in this section

**Optional Columns:**
- `Course Year` - Academic year
- `Term Name` - Term code
- `Course Name` - Course title
- `Course Section` - Section number
- `Course UniqueID` - Unique section identifier
- `Start Date` - Section start date
- `End Date` - Section end date
- `School` - School name
- Any other fields

**Example:**
```
Course Year,Term Name,Course Name,Course Number,Course Section,Course UniqueID,Course Enrollment,Start Date,End Date,School
2023/2024,2401A,Academic Strategies for the Business Professional,CS113,11BEST,2557921,26,01/03/2024,03/12/2024,Business
2023/2024,2401C,Academic Strategies for the Business Professional,CS113,11BEST,2575197,27,01/31/2024,04/09/2024,Business
2024/2025,2502A,Accounting I,AC114,1,2606762,28,04/16/2025,06/24/2025,Business
```

**Note:** This file is completely optional. If provided, the application will display two additional columns:
- **Average Attendance** - Average enrollment across all sections of this course
- **Times Offered** - Total number of times this course was offered (number of sections)

## Data Processing Logic

### Requirement Parsing Rules

The application processes the `Requirement` field with the following priority:

1. **Electives** - If Requirement contains "elective":
   - Use `DefaultCode` as the course code
   - Category becomes "[Type] Elective" (e.g., "Open Elective", "Concentration Elective")

2. **OR Requirements** - If Requirement contains " or ":
   - Split by " or " (case insensitive)
   - Extract course codes from each part using regex pattern `^([A-Z]{2}\d{3})`
   - Example: "MT209 or MT220" → ["MT209", "MT220"]

3. **Generic Requirements** - If Requirement contains "requirement":
   - Use `DefaultCode` as the course code
   - Example: "Mathematics Requirement" with DefaultCode "MM150" → "MM150"

4. **Direct Course Code** - Otherwise:
   - Use the Requirement field as-is (should be a course code like "AC114")

### Type Classification

Courses are classified based on their `Category` field in degree plans:

**Priority Order (most specific first):**
- **Open Elective** - Category contains both "open" and "elective"
- **Concentration Elective** - Category contains both "concentration" and "elective"
- **Micro-credential** - Category contains "micro-credential" or "micro credential"
- **Core** - Category contains "core"
- **Major** - Category contains "major"
- **Requirements** - Category contains "requirements"
- **Concentration** - Category contains "concentration"
- **Elective** - Category contains "elective"
- **Open** - Category contains "open"
- **Custom** - Any other non-empty category

### Course Usage Calculation

For each course:
1. Find all degree plan entries referencing that course code
2. Group by unique program name (`TranscriptDescrip`)
3. Store category for each program
4. Count = number of unique programs

## Technology Stack

- **React 18** - UI framework (loaded via CDN)
- **PapaParse 5.4.1** - CSV parsing library (loaded via CDN)
- **Pure CSS** - Purdue-branded styling (no framework)
- **Vanilla JavaScript** - No build process required

### CDN Fallback System

The application includes a robust CDN fallback system that tries multiple sources for each library:
- React: unpkg.com → cdnjs → jsdelivr
- React-DOM: unpkg.com → cdnjs → jsdelivr
- PapaParse: cdnjs → unpkg → jsdelivr

If all CDNs fail, displays error message with refresh button.

## Purdue Branding

The application follows Purdue University Global's official color scheme:

- **Campus Gold (#C28E0E)** - Primary highlights, buttons, accents
- **Athletic Gold (#CEB888)** - Secondary elements, tags
- **Black (#000000)** - Primary text, headers, strong accents
- **Dark Gray (#373A36)** - Secondary text
- **Gray (#9D968D)** - Supporting text, borders
- **White** - Clean backgrounds

## File Structure

```
courseinv/
├── index.html              # Main application (single-file web app)
├── README.md              # This file
├── CLAUDE.md              # Development guidelines for AI assistants
├── prompts.md             # Task history and changelog
├── .gitignore             # Excludes private data files
└── [data files]           # Private - not committed to git
    ├── *.txt              # Any text/CSV data files
    └── Business Course Enrollments*.txt
```

## Usage Instructions

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - No installation or build process required

2. **Upload Data Files**
   - Click "Upload Data Files" section
   - Upload **Master Course List** (first box)
   - Upload **Degree Plans** (second box)
   - Files must be CSV or TXT format with tab/comma delimiters

3. **View Results**
   - Once both files are uploaded, analysis begins automatically
   - Loading spinner appears during processing
   - Results show course inventory with usage statistics

4. **Filter & Search**
   - Use **Subject Filter** dropdown to filter by course prefix
   - Use **Search** box to find specific courses by code or title
   - Use **Type Filter** buttons to show only certain categories
   - Click column headers to sort

5. **View Course Details**
   - Click **View Details** button for any course with usage > 0
   - Modal shows all programs using that course
   - Each program displays with its category

## Error Handling

The application includes comprehensive error handling:

- **File Size Warnings** - Alerts if files exceed 10MB
- **Column Validation** - Checks for required columns before processing
- **Parsing Errors** - Logs CSV parsing issues to console
- **User Feedback** - Error/warning banner with dismiss button
- **File Selection Guidance** - Prompts user to verify correct files if validation fails

## Statistics Displayed

- **Total Courses** - Number of courses in master list (filtered by current selection)
- **Used in Programs** - Courses with usage count > 0
- **Not Used** - Courses with usage count = 0
- **Avg. Programs per Course** - Average usage across all courses

## Development Notes

### Version History

- **v1.4.0** - Added optional Enrollment Figures upload with Average Attendance and Times Offered columns
- **v1.3.0** - Enhanced with error handling, loading indicators, file validation, improved OR requirement handling, and better type classification
- **v1.2.0** - Added type filter and ordered tags: Core, Major, Requirements, Concentration, Elective, Micro-credential

### Future Enhancement Ideas

- Export results to CSV/Excel
- Data persistence (save processed results to localStorage)
- Comparison mode (compare two different data sets)
- Course recommendation engine (suggest courses for underutilized departments)
- Historical trend analysis (if multiple snapshots available)
- Visual charts/graphs (usage distribution, subject breakdown)

## Privacy & Security

- All data processing happens **entirely in the browser**
- No data is uploaded to any server
- Data files are in `.gitignore` and not committed to repository
- Safe to use with confidential institutional data

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with ES6+ support

## License

Proprietary - Purdue University Global internal tool

## Support

For issues or questions, refer to:
- This README for usage instructions
- `CLAUDE.md` for development guidelines
- `prompts.md` for change history
