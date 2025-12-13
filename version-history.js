// Centralized version metadata for the app. Update current.version and append to history for each release.
window.CourseInventoryVersion = {
    current: {
        version: '1.24.3',
        description: 'Externalized version history, removed inline banners/JSDoc; UI pulls version data from version-history.js'
    },
    history: [
        { version: '1.24.3', description: 'Externalized version history, removed inline banners/JSDoc; UI pulls version data from version-history.js.' },
        { version: '1.24.2', description: 'Fixed filter controls UI regression: restored original button classes, color coding, and structure.' },
        { version: '1.24.1', description: 'Fixed UI regression in CourseTable: restored original headers, sort indicators, button styling, and spacing.' },
        { version: '1.24.0', description: 'Phase 2 Refactoring: Decomposed CourseInventoryApp into reusable UI components (UploadSection, StatsDashboard, FilterControls, CourseTable); reduced main component from ~600 to ~300 lines.' },
        { version: '1.23.0', description: 'Phase 1 Refactoring: Extracted business logic to utils.js, created useCSVParser custom hook, centralized constants; reduced main component from 885 lines to ~600 lines and eliminated 132 lines of duplicate CSV parsing code.' },
        { version: '1.22.3', description: 'Hide upload section after data is loaded; reload page to upload new files.' },
        { version: '1.22.2', description: 'Fixed ReferenceError by removing setUploadSectionExpanded call after data load.' },
        { version: '1.22.1', description: 'Fixed ReferenceError by removing leftover hideNeverOffered references from filter logic.' },
        { version: '1.22.0', description: 'Removed \'Hide courses never offered\' checkbox, added sorting instructions to header, removed upload toggle (always show upload section).' },
        { version: '1.21.0', description: 'Added dynamic change log modal accessible via info button in header; version history maintained in VERSION_HISTORY array.' },
        { version: '1.20.0', description: 'Removed variation display toggle (always use standard deviation) and removed trend column from main table.' },
        { version: '1.19.1', description: 'Removed \'Section History by Track\' list from detail modal (chart provides same information).' },
        { version: '1.19.0', description: 'Split \'Degree Plans Using This\' column into \'Required in Degree Plans\' and \'Optional in Degree Plans\' with hover tooltips explaining definitions; updated detail modal to show programs split by required/optional sections.' },
        { version: '1.18.4', description: 'Made View Details button available for all courses with appropriate messages for missing information.' },
        { version: '1.18.3', description: 'Replaced variation radio buttons with toggle switch for better UX.' },
        { version: '1.18.2', description: 'Fixed trend symbol inconsistency and reordered prompts.md tasks chronologically.' },
        { version: '1.18.1', description: 'Removed change log button/modal.' },
        { version: '1.17.0', description: 'Added variation display toggle (% vs std dev) in table.' },
        { version: '1.16.1', description: 'Fixed modal program tag coloring by scoping category helper locally.' },
        { version: '1.16.0', description: 'Matched program type colors in detail modal to main list category colors.' },
        { version: '1.15.0', description: 'Kept four info cards in a single row and made Section History collapsible by default.' },
        { version: '1.14.0', description: 'Simplified detail modal info cards (removed subject, degree plan count, variation, trend, and department chair row).' },
        { version: '1.13.0', description: 'Unified track selection via dropdown for both term code and base term charts (defaults to All Tracks).' },
        { version: '1.12.0', description: 'Added interactive Chart.js line chart to detail modal showing section trends over time with track filtering and dual metric display.' },
        { version: '1.11.0', description: 'Added Section History by Track in detail modal showing last 5 terms per track with sections and enrollment counts (calculated on-demand).' },
        { version: '1.10.0', description: 'Added three new enrollment analysis columns: Avg Sections/Term, Variation (coefficient of variation %), and Trend indicators (↑ ↓ →).' }
    ]
};
