/*
Version 1.24.0 - Phase 2 Refactoring: Decomposed CourseInventoryApp into reusable UI components (UploadSection, StatsDashboard, FilterControls, CourseTable); reduced main component from ~600 to ~300 lines.
Version 1.23.0 - Phase 1 Refactoring: Extracted business logic to utils.js, created useCSVParser custom hook, centralized constants; reduced main component from 885 lines to ~600 lines and eliminated 132 lines of duplicate CSV parsing code.
Version 1.22.3 - Hide upload section after data is loaded; reload page to upload new files.
Version 1.22.2 - Fixed ReferenceError by removing setUploadSectionExpanded call after data load.
Version 1.22.1 - Fixed ReferenceError by removing leftover hideNeverOffered references from filter logic.
Version 1.22.0 - Removed 'Hide courses never offered' checkbox, added sorting instructions to header, removed upload toggle (always show upload section).
Version 1.21.0 - Added dynamic change log modal accessible via info button in header; version history maintained in VERSION_HISTORY array.
Version 1.20.0 - Removed variation display toggle (always use standard deviation) and removed trend column from main table.
Version 1.19.1 - Removed 'Section History by Track' list from detail modal (chart provides same information).
Version 1.19.0 - Split 'Degree Plans Using This' column into 'Required in Degree Plans' and 'Optional in Degree Plans' with hover tooltips explaining definitions; updated detail modal to show programs split by required/optional sections.
Version 1.18.4 - Made View Details button available for all courses with appropriate messages for missing information.
Version 1.18.3 - Replaced variation radio buttons with toggle switch for better UX.
Version 1.18.2 - Fixed trend symbol inconsistency and reordered prompts.md tasks chronologically.
Version 1.18.1 - Removed change log button/modal.
Version 1.17.0 - Added variation display toggle (% vs std dev) in table.
Version 1.16.1 - Fixed modal program tag coloring by scoping category helper locally.
Version 1.16.0 - Matched program type colors in detail modal to main list category colors.
Version 1.15.0 - Kept four info cards in a single row and made Section History collapsible by default.
Version 1.14.0 - Simplified detail modal: removed subject, degree plan count, variation/trend cards, and department chair row.
Version 1.13.0 - Unified track selection via dropdown for both term code and base term charts (defaults to All Tracks).
Version 1.12.0 - Added interactive Chart.js line chart to detail modal showing section trends over time with track filtering and dual metric display.
Version 1.11.0 - Added Section History by Track in detail modal showing last 5 terms per track with sections and enrollment counts (calculated on-demand).
Version 1.10.0 - Added three new enrollment analysis columns: Avg Sections/Term, Variation (coefficient of variation %), and Trend indicators (↑ ↓ →).
Version 1.9.0 - Refactored into separate CSS and JS files to reduce context usage.
Version 1.8.0 - Added checkbox filter to hide courses that have never been offered.
Version 1.7.0 - Fixed stale data bug on validation failure, fixed duplicate elective labels, updated documentation.
Version 1.6.0 - Made Enrollment Figures file required, added sticky table headers that remain visible while scrolling.
Version 1.5.0 - Fixed error banner persistence when replacing files, changed labels to "Average Enrollment" and "Degree Plans Using This".
Version 1.4.0 - Added optional Enrollment Figures upload with Average Enrollment and Times Offered columns.
Version 1.3.0 - Enhanced with error handling, loading indicators, file validation, improved OR requirement handling, and better type classification.
Version 1.2.0 - Added type filter and ordered tags: Core, Major, Requirements, Concentration, Elective, Micro-credential.
*/

// CDN fallback system
function loadScript(urls, callback) {
    var index = 0;
    function tryNext() {
        if (index >= urls.length) {
            document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;"><h2 style="color:#C28E0E;">Failed to Load Required Libraries</h2><p style="color:#373A36;">Please check your internet connection and refresh the page.</p><button onclick="location.reload()" style="background:#C28E0E;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;margin-top:20px;">Refresh Page</button></div>';
            return;
        }
        var script = document.createElement('script');
        script.src = urls[index];
        script.onload = callback;
        script.onerror = function() {
            index++;
            tryNext();
        };
        document.head.appendChild(script);
    }
    tryNext();
}

var reactUrls = [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
    'https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js'
];
var reactDomUrls = [
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
    'https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js'
];
var papaparseUrls = [
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
    'https://unpkg.com/papaparse@5.4.1/papaparse.min.js',
    'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js'
];
var chartjsUrls = [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
    'https://unpkg.com/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Load libraries in sequence with fallbacks, then start app
loadScript(reactUrls, function() {
    loadScript(reactDomUrls, function() {
        loadScript(papaparseUrls, function() {
            loadScript(chartjsUrls, function() {
                startApp();
            });
        });
    });
});

function startApp() {
const { useState, useEffect, useMemo } = React;
const { createElement: h } = React;

// Initialize components now that React is loaded
window.initializeComponents();

// Import utilities and components from global namespaces
const { processCourseData } = window.CourseInventoryUtils;
const { useCSVParser } = window.CourseInventoryHooks;
const { TYPE_ORDER } = window.CourseInventoryConstants;
const { UploadSection, StatsDashboard, FilterControls, CourseTable } = window.CourseInventoryComponents;

// Version history - keep this in sync with comment block at top of file
const VERSION_HISTORY = [
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
];

function CourseInventoryApp() {
    const [coursesFile, setCoursesFile] = useState(null);
    const [degreePlansFile, setDegreePlansFile] = useState(null);
    const [enrollmentsFile, setEnrollmentsFile] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const [degreePlansData, setDegreePlansData] = useState([]);
    const [enrollmentsData, setEnrollmentsData] = useState([]);
    const [processedCourses, setProcessedCourses] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sortField, setSortField] = useState('code');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState([]);
    const [showChangeLog, setShowChangeLog] = useState(false);

    // Parse uploaded CSV files using custom hook
    useCSVParser(
        coursesFile,
        ['Course Number', 'Course Title'],
        'Master Course List',
        setErrors,
        setIsProcessing,
        setCoursesData,
        (row) => {
            const courseCode = row['Course Number'] || row['CourseCode'];
            return courseCode && courseCode.trim();
        }
    );

    useCSVParser(
        degreePlansFile,
        ['TranscriptDescrip', 'Requirement'],
        'Degree Plans',
        setErrors,
        setIsProcessing,
        setDegreePlansData,
        (row) => row.TranscriptDescrip && row.TranscriptDescrip.trim()
    );

    useCSVParser(
        enrollmentsFile,
        ['Course Number', 'Course Enrollment'],
        'Enrollment Figures',
        setErrors,
        setIsProcessing,
        setEnrollmentsData,
        (row) => row['Course Number'] && row['Course Number'].trim() && row['Course Enrollment']
    );

    // Process courses with degree plan counts using utility function
    useEffect(() => {
        if (coursesData.length > 0 && degreePlansData.length > 0 && enrollmentsData.length > 0) {
            setIsProcessing(true);
            setErrors([]); // Clear previous errors related to processing

            const processed = processCourseData(coursesData, degreePlansData, enrollmentsData);

            setProcessedCourses(processed);
            setIsProcessing(false);
        }
    }, [coursesData, degreePlansData, enrollmentsData]);

    // Get unique subjects
    const subjects = useMemo(() => {
        const uniqueSubjects = [...new Set(processedCourses.map(c => c.subject))].sort();
        return ['All Subjects', ...uniqueSubjects];
    }, [processedCourses]);

    // Filter courses
    const filteredCourses = useMemo(() => {
        return processedCourses.filter(course => {
            const matchesSubject = selectedSubject === 'All Subjects' || course.subject === selectedSubject;
            const matchesSearch = !searchTerm ||
                course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTypes = selectedTypes.length === 0 ||
                selectedTypes.some(type => course.types.includes(type));
            return matchesSubject && matchesSearch && matchesTypes;
        });
    }, [processedCourses, selectedSubject, searchTerm, selectedTypes]);

    // Sort courses
    const sortedCourses = useMemo(() => {
        const sorted = [...filteredCourses];
        sorted.sort((a, b) => {
            let aVal, bVal;

            switch(sortField) {
                case 'code':
                    aVal = a.code;
                    bVal = b.code;
                    break;
                case 'title':
                    aVal = a.title;
                    bVal = b.title;
                    break;
                case 'requiredCount':
                    aVal = a.requiredCount;
                    bVal = b.requiredCount;
                    break;
                case 'optionalCount':
                    aVal = a.optionalCount;
                    bVal = b.optionalCount;
                    break;
                case 'avgEnrollment':
                    aVal = a.avgEnrollment;
                    bVal = b.avgEnrollment;
                    break;
                case 'timesOffered':
                    aVal = a.timesOffered;
                    bVal = b.timesOffered;
                    break;
                case 'avgSectionsPerTerm':
                    aVal = parseFloat(a.avgSectionsPerTerm) || 0;
                    bVal = parseFloat(b.avgSectionsPerTerm) || 0;
                    break;
                case 'sectionVariation':
                    aVal = parseFloat(a.sectionStdDev) || 0;
                    bVal = parseFloat(b.sectionStdDev) || 0;
                    break;
                default:
                    aVal = a.code;
                    bVal = b.code;
            }

            if (typeof aVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            } else {
                const comparison = String(aVal).localeCompare(String(bVal));
                return sortDirection === 'asc' ? comparison : -comparison;
            }
        });
        return sorted;
    }, [filteredCourses, sortField, sortDirection]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalCourses = filteredCourses.length;
        const usedCourses = filteredCourses.filter(c => c.usageCount > 0).length;
        const unusedCourses = totalCourses - usedCourses;
        const neverOffered = filteredCourses.filter(c => c.timesOffered === 0).length;

        return { totalCourses, usedCourses, unusedCourses, neverOffered };
    }, [filteredCourses]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortClass = (field) => {
        if (sortField !== field) return 'sortable';
        return sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc';
    };

    const getCategoryClass = (type) => {
        const t = type.toLowerCase();
        if (t.includes('core')) return 'core';
        if (t.includes('major')) return 'major';
        if (t.includes('requirements')) return 'requirements';
        if (t.includes('concentration') && t.includes('elective')) return 'elective';
        if (t.includes('concentration')) return 'concentration';
        if (t.includes('micro')) return 'micro-credential';
        if (t.includes('elective')) return 'elective';
        return 'other';
    };

    // sortTypes function using imported TYPE_ORDER constant
    const sortTypes = (types) => {
        return types.sort((a, b) => {
            const aIndex = TYPE_ORDER.findIndex(t => a.toLowerCase().includes(t.toLowerCase()));
            const bIndex = TYPE_ORDER.findIndex(t => b.toLowerCase().includes(t.toLowerCase()));
            const aOrder = aIndex === -1 ? 999 : aIndex;
            const bOrder = bIndex === -1 ? 999 : bIndex;
            return aOrder - bOrder;
        });
    };

    // Get all unique types across all courses
    const allTypes = useMemo(() => {
        const typesSet = new Set();
        processedCourses.forEach(course => {
            course.types.forEach(t => typesSet.add(t));
        });
        return sortTypes(Array.from(typesSet));
    }, [processedCourses]);

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    const clearTypeFilters = () => {
        setSelectedTypes([]);
    };

    const dataLoaded = coursesData.length > 0 && degreePlansData.length > 0 && enrollmentsData.length > 0;
    const hasErrors = errors.length > 0;
    const isError = hasErrors && errors.some(e => e.toLowerCase().includes('failed') || e.toLowerCase().includes('missing'));

    return h('div', { className: 'container' },
        // Loading overlay
        isProcessing && h('div', { className: 'loading-overlay' },
            h('div', { className: 'loading-spinner' },
                h('div', { className: 'spinner' }),
                h('div', { className: 'loading-text' }, 'Processing data...')
            )
        ),

        h('div', { className: 'header' },
            h('div', { className: 'header-content' },
                h('div', { className: 'header-text' },
                    h('h1', null, 'Course Inventory Analysis'),
                    h('p', null, 'Purdue University Global - Course Usage and Program Requirements'),
                    h('p', { className: 'header-instruction' }, 'Click column headers to sort • Click again to reverse order')
                ),
                h('button', {
                    className: 'info-circle-btn',
                    onClick: () => setShowChangeLog(true),
                    title: 'View Change Log'
                }, 'ℹ')
            )
        ),

        // Error/Warning banner
        hasErrors && h('div', { className: 'error-banner' + (isError ? ' error' : '') },
            h('div', { className: 'error-title' },
                h('span', null, isError ? 'Errors' : 'Warnings'),
                h('button', {
                    className: 'dismiss-btn',
                    onClick: () => setErrors([]),
                    title: 'Dismiss'
                }, '×')
            ),
            h('ul', { className: 'error-list' },
                errors.map((error, idx) =>
                    h('li', { key: idx, className: 'error-item' }, error)
                )
            )
        ),

        !dataLoaded && h(UploadSection, {
            coursesFile,
            degreePlansFile,
            enrollmentsFile,
            onCoursesFileChange: setCoursesFile,
            onDegreePlansFileChange: setDegreePlansFile,
            onEnrollmentsFileChange: setEnrollmentsFile,
            dataLoaded
        }),

        dataLoaded && h('div', null,
            h(StatsDashboard, { stats }),

            h(FilterControls, {
                selectedSubject,
                subjects,
                onSubjectChange: setSelectedSubject,
                searchTerm,
                onSearchChange: setSearchTerm,
                allTypes,
                selectedTypes,
                onTypeToggle: handleTypeToggle,
                onClearTypes: clearTypeFilters,
                getCategoryClass
            }),

            h(CourseTable, {
                courses: sortedCourses,
                sortField,
                sortDirection,
                onSort: handleSort,
                onCourseClick: setSelectedCourse,
                getCategoryClass,
                enrollmentsData
            })
        ),

        selectedCourse && h(CourseModal, {
            course: selectedCourse,
            enrollmentsData: enrollmentsData,
            onClose: () => setSelectedCourse(null)
        }),

        showChangeLog && h('div', { className: 'modal-overlay', onClick: () => setShowChangeLog(false) },
            h('div', { className: 'modal changelog-modal', onClick: (e) => e.stopPropagation() },
                h('div', { className: 'modal-header' },
                    h('div', { className: 'modal-title' },
                        h('h2', null, 'Change Log')
                    ),
                    h('button', { className: 'close-button', onClick: () => setShowChangeLog(false) }, '×')
                ),
                h('div', { className: 'modal-body' },
                    h('div', { className: 'changelog-list' },
                        VERSION_HISTORY.map((entry, index) =>
                            h('div', { key: index, className: 'changelog-entry' },
                                h('div', { className: 'changelog-version' }, 'Version ' + entry.version),
                                h('div', { className: 'changelog-description' }, entry.description)
                            )
                        )
                    )
                )
            )
        ),

        h('div', { className: 'version-footer' },
            h('span', { className: 'version-number' }, 'Version 1.24.0'),
            ' — Phase 2 Refactoring: Component decomposition for better code organization'
        )
    );
}

function CourseModal({ course, enrollmentsData, onClose }) {
    const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' or specific track
    const [xAxisMode, setXAxisMode] = useState('full'); // 'full' = term codes, 'base' = base terms
    const [metricMode, setMetricMode] = useState('sections'); // 'sections' or 'enrollment'
    const chartRef = React.useRef(null);
    const chartInstanceRef = React.useRef(null);

    const getCategoryClassModal = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('core')) return 'core';
        if (t.includes('major')) return 'major';
        if (t.includes('requirements')) return 'requirements';
        if (t.includes('concentration') && t.includes('elective')) return 'elective';
        if (t.includes('concentration')) return 'concentration';
        if (t.includes('micro')) return 'micro-credential';
        if (t.includes('elective')) return 'elective';
        return 'other';
    };

    // Separate programs into required and optional
    const requiredPrograms = useMemo(() => {
        const requiredTypes = ['core', 'major', 'requirements', 'concentration'];
        return course.programs.filter(program => {
            const categoryLower = (program.category || '').toLowerCase();
            // Concentration Elective is NOT required
            if (categoryLower.includes('concentration') && categoryLower.includes('elective')) {
                return false;
            }
            return requiredTypes.some(type => categoryLower.includes(type));
        });
    }, [course.programs]);

    const optionalPrograms = useMemo(() => {
        const requiredTypes = ['core', 'major', 'requirements', 'concentration'];
        return course.programs.filter(program => {
            const categoryLower = (program.category || '').toLowerCase();
            // Concentration Elective is optional
            if (categoryLower.includes('concentration') && categoryLower.includes('elective')) {
                return true;
            }
            return !requiredTypes.some(type => categoryLower.includes(type));
        });
    }, [course.programs]);

    // Calculate ALL term history (not limited to 5) for chart
    const allTermHistory = useMemo(() => {
        if (!enrollmentsData || enrollmentsData.length === 0) return [];

        const termMap = new Map();

        enrollmentsData.forEach(enrollment => {
            const courseCode = (enrollment['Course Number'] || '').trim();
            if (courseCode !== course.code) return;

            const termName = (enrollment['Term Name'] || '').trim();
            const termCode = termName.substring(0, 5);
            const enrollmentCount = parseInt(enrollment['Course Enrollment']) || 0;

            if (!termCode) return;

            if (!termMap.has(termCode)) {
                termMap.set(termCode, {
                    termCode: termCode,
                    sections: 0,
                    totalEnrollment: 0,
                    track: termCode.charAt(4) || ''
                });
            }

            const stats = termMap.get(termCode);
            stats.sections += 1;
            stats.totalEnrollment += enrollmentCount;
        });

        return Array.from(termMap.values()).sort((a, b) => a.termCode.localeCompare(b.termCode));
    }, [course.code, enrollmentsData]);

    // Get available tracks
    const availableTracks = useMemo(() => {
        const tracks = new Set();
        allTermHistory.forEach(term => tracks.add(term.track));
        return Array.from(tracks).sort();
    }, [allTermHistory]);


    // Render chart with Chart.js
    useEffect(() => {
        if (!chartRef.current || allTermHistory.length === 0) return;

        // Destroy previous chart instance
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Prepare data based on settings
        let chartData;

        if (xAxisMode === 'full') {
            // Show full term codes (2401A, 2401B, etc.) with dropdown track filter
            const sortedTerms = [...allTermHistory].sort((a, b) => a.termCode.localeCompare(b.termCode));
            const filteredTerms = selectedTrack === 'all'
                ? sortedTerms
                : sortedTerms.filter(t => t.track === selectedTrack);

            chartData = {
                labels: filteredTerms.map(t => t.termCode),
                datasets: [{
                    label: metricMode === 'sections'
                        ? (selectedTrack === 'all' ? 'Number of Sections (All Tracks)' : 'Number of Sections (Track ' + selectedTrack + ')')
                        : (selectedTrack === 'all' ? 'Total Enrollment (All Tracks)' : 'Total Enrollment (Track ' + selectedTrack + ')'),
                    data: filteredTerms.map(t => metricMode === 'sections' ? t.sections : t.totalEnrollment),
                    borderColor: '#C28E0E',
                    backgroundColor: 'rgba(194, 142, 14, 0.1)',
                    tension: 0.1
                }]
            };
        } else {
            // Show base terms (2401, 2402, etc.) with dropdown track filter
            const baseTermMap = new Map();

            allTermHistory.forEach(term => {
                const baseTerm = term.termCode.substring(0, 4);
                if (!baseTermMap.has(baseTerm)) {
                    baseTermMap.set(baseTerm, {});
                }
                const baseData = baseTermMap.get(baseTerm);
                if (!baseData[term.track]) {
                    baseData[term.track] = { sections: 0, totalEnrollment: 0 };
                }
                baseData[term.track].sections += term.sections;
                baseData[term.track].totalEnrollment += term.totalEnrollment;
            });

            const sortedBaseTerms = Array.from(baseTermMap.keys()).sort();
            const colors = {
                'A': '#C28E0E',
                'B': '#CEB888',
                'C': '#373A36',
                'D': '#9D968D',
                'E': '#000000'
            };

            if (selectedTrack === 'all') {
                // Single line with all tracks combined
                const combinedData = sortedBaseTerms.map(baseTerm => {
                    const trackEntries = Object.values(baseTermMap.get(baseTerm) || {});
                    const sectionsSum = trackEntries.reduce((sum, t) => sum + (t.sections || 0), 0);
                    const enrollmentSum = trackEntries.reduce((sum, t) => sum + (t.totalEnrollment || 0), 0);
                    return metricMode === 'sections' ? sectionsSum : enrollmentSum;
                });

                chartData = {
                    labels: sortedBaseTerms,
                    datasets: [{
                        label: metricMode === 'sections' ? 'Sections (All Tracks)' : 'Enrollment (All Tracks)',
                        data: combinedData,
                        borderColor: '#C28E0E',
                        backgroundColor: 'rgba(194, 142, 14, 0.1)',
                        tension: 0.1
                    }]
                };
            } else {
                const singleData = sortedBaseTerms.map(baseTerm => {
                    const trackData = (baseTermMap.get(baseTerm) || {})[selectedTrack];
                    if (!trackData) return 0;
                    return metricMode === 'sections' ? trackData.sections : trackData.totalEnrollment;
                });

                chartData = {
                    labels: sortedBaseTerms,
                    datasets: [{
                        label: metricMode === 'sections' ? ('Sections (Track ' + selectedTrack + ')') : ('Enrollment (Track ' + selectedTrack + ')'),
                        data: singleData,
                        borderColor: colors[selectedTrack] || '#C28E0E',
                        backgroundColor: 'transparent',
                        tension: 0.1
                    }]
                };
            }
        }

        // Create chart
        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: metricMode === 'sections' ? 'Sections Offered Over Time' : 'Total Enrollment Over Time',
                        font: { size: 16, weight: 'bold' },
                        color: '#000000'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [allTermHistory, selectedTrack, xAxisMode, metricMode, availableTracks]);

    return h('div', { className: 'modal-overlay', onClick: onClose },
        h('div', { className: 'modal', onClick: (e) => e.stopPropagation() },
            h('div', { className: 'modal-header' },
                h('div', { className: 'modal-title' },
                    h('h2', null, course.code + ': ' + course.title),
                    h('div', { className: 'modal-subtitle' }, course.subject)
                ),
                h('button', { className: 'close-button', onClick: onClose }, '×')
            ),

            h('div', { className: 'modal-body' },
                h('div', { className: 'info-grid', style: { gridTemplateColumns: 'repeat(5, 1fr)' } },
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Required In'),
                        h('div', { className: 'info-value' }, course.requiredCount || '—')
                    ),
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Optional In'),
                        h('div', { className: 'info-value' }, course.optionalCount || '—')
                    ),
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Avg Enrollment'),
                        h('div', { className: 'info-value' }, course.avgEnrollment > 0 ? course.avgEnrollment : '—')
                    ),
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Times Offered'),
                        h('div', { className: 'info-value' }, course.timesOffered > 0 ? course.timesOffered : '—')
                    ),
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Avg Sections/Term'),
                        h('div', { className: 'info-value' }, course.avgSectionsPerTerm > 0 ? course.avgSectionsPerTerm : '—')
                    )
                ),

                allTermHistory.length > 0 && h('div', { className: 'modal-section' },
                    h('h3', null, 'Section Trends Over Time'),

                    h('div', { className: 'chart-controls' },
                        h('div', { className: 'chart-control-group' },
                            h('label', null, 'Display Mode:'),
                            h('div', { className: 'radio-group' },
                                h('label', { className: 'radio-label' },
                                    h('input', {
                                        type: 'radio',
                                        name: 'xAxisMode',
                                        value: 'full',
                                        checked: xAxisMode === 'full',
                                        onChange: (e) => setXAxisMode(e.target.value)
                                    }),
                                    ' By Term Code (2401A, 2401B...)'
                                ),
                                h('label', { className: 'radio-label' },
                                    h('input', {
                                        type: 'radio',
                                        name: 'xAxisMode',
                                        value: 'base',
                                        checked: xAxisMode === 'base',
                                        onChange: (e) => setXAxisMode(e.target.value)
                                    }),
                                    ' By Base Term (2401, 2402...)'
                                )
                            )
                        ),

                        xAxisMode === 'full' && h('div', { className: 'chart-control-group' },
                            h('label', { htmlFor: 'track-select' }, 'Track:'),
                            h('select', {
                                id: 'track-select',
                                value: selectedTrack,
                                onChange: (e) => setSelectedTrack(e.target.value),
                                className: 'track-dropdown'
                            },
                                h('option', { value: 'all' }, 'All Tracks'),
                                availableTracks.map(track =>
                                    h('option', { key: track, value: track }, 'Track ' + track)
                                )
                            )
                        ),

                        xAxisMode === 'base' && h('div', { className: 'chart-control-group' },
                            h('label', { htmlFor: 'track-select-base' }, 'Track:'),
                            h('select', {
                                id: 'track-select-base',
                                value: selectedTrack,
                                onChange: (e) => setSelectedTrack(e.target.value),
                                className: 'track-dropdown'
                            },
                                h('option', { value: 'all' }, 'All Tracks'),
                                availableTracks.map(track =>
                                    h('option', { key: track, value: track }, 'Track ' + track)
                                )
                            )
                        ),

                        h('div', { className: 'chart-control-group' },
                            h('label', null, 'Metric:'),
                            h('div', { className: 'radio-group' },
                                h('label', { className: 'radio-label' },
                                    h('input', {
                                        type: 'radio',
                                        name: 'metricMode',
                                        value: 'sections',
                                        checked: metricMode === 'sections',
                                        onChange: (e) => setMetricMode(e.target.value)
                                    }),
                                    ' Sections'
                                ),
                                h('label', { className: 'radio-label' },
                                    h('input', {
                                        type: 'radio',
                                        name: 'metricMode',
                                        value: 'enrollment',
                                        checked: metricMode === 'enrollment',
                                        onChange: (e) => setMetricMode(e.target.value)
                                    }),
                                    ' Enrollment'
                                )
                            )
                        )
                    ),

                    h('div', { className: 'chart-container' },
                        h('canvas', { ref: chartRef })
                    )
                ),

                requiredPrograms.length > 0 && h('div', { className: 'modal-section' },
                    h('h3', null, 'Required in Degree Programs (' + requiredPrograms.length + ')'),
                    h('div', { className: 'program-list' },
                        requiredPrograms.map((program, index) =>
                            h('div', { key: index, className: 'program-item' },
                                h('div', { className: 'program-name' }, program.name),
                                h('span', {
                                    className: 'program-category ' + getCategoryClassModal(program.category)
                                }, program.category)
                            )
                        )
                    )
                ),

                optionalPrograms.length > 0 && h('div', { className: 'modal-section' },
                    h('h3', null, 'Optional in Degree Programs (' + optionalPrograms.length + ')'),
                    h('div', { className: 'program-list' },
                        optionalPrograms.map((program, index) =>
                            h('div', { key: index, className: 'program-item' },
                                h('div', { className: 'program-name' }, program.name),
                                h('span', {
                                    className: 'program-category ' + getCategoryClassModal(program.category)
                                }, program.category)
                            )
                        )
                    )
                ),

                course.programs.length === 0 && h('div', { className: 'modal-section' },
                    h('h3', null, 'Associated Programs'),
                    h('div', { style: { color: '#9D968D', fontStyle: 'italic', padding: '10px 0' } },
                        'This course is not associated with any degree programs.')
                )
            )
        )
    );
}

ReactDOM.render(React.createElement(CourseInventoryApp), document.getElementById('root'));
}
