/*
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
    const [uploadSectionExpanded, setUploadSectionExpanded] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errors, setErrors] = useState([]);
    const [hideNeverOffered, setHideNeverOffered] = useState(false);
    const [variationMode, setVariationMode] = useState('stddev'); // 'percent' or 'stddev'

    // Parse uploaded CSV files
    useEffect(() => {
        if (coursesFile) {
            // Clear previous errors for this file type
            setErrors(prev => prev.filter(e => !e.includes('Master Course List')));

            // Check file size (warn if > 10MB)
            if (coursesFile.size > 10 * 1024 * 1024) {
                setErrors(prev => [...prev, 'Warning: Master Course List file is large (' + (coursesFile.size / (1024 * 1024)).toFixed(1) + 'MB). Processing may take a moment.']);
            }

            setIsProcessing(true);
            Papa.parse(coursesFile, {
                header: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV parsing errors:', results.errors);
                        setErrors(prev => [...prev, 'Some rows in Master Course List had parsing errors. Check console for details.']);
                    }

                    // Validate required columns
                    const firstRow = results.data[0] || {};
                    const hasCourseNumber = 'Course Number' in firstRow || 'CourseCode' in firstRow;
                    const hasCourseTitle = 'Course Title' in firstRow || 'CourseName' in firstRow || 'CourseTitle' in firstRow;

                    if (!hasCourseNumber || !hasCourseTitle) {
                        setErrors(prev => [...prev, 'Master Course List is missing required columns. Expected "Course Number" and "Course Title". Please check that you selected the correct files for each.']);
                        setCoursesData([]);
                        setIsProcessing(false);
                        return;
                    }

                    const filtered = results.data.filter(row => {
                        const courseCode = row['Course Number'] || row['CourseCode'];
                        return courseCode && courseCode.trim();
                    });
                    setCoursesData(filtered);
                    setIsProcessing(false);
                },
                error: (error) => {
                    setErrors(prev => [...prev, 'Failed to parse Master Course List: ' + error.message]);
                    setIsProcessing(false);
                }
            });
        }
    }, [coursesFile]);

    useEffect(() => {
        if (degreePlansFile) {
            // Clear previous errors for this file type
            setErrors(prev => prev.filter(e => !e.includes('Degree Plans')));

            // Check file size (warn if > 10MB)
            if (degreePlansFile.size > 10 * 1024 * 1024) {
                setErrors(prev => [...prev, 'Warning: Degree Plans file is large (' + (degreePlansFile.size / (1024 * 1024)).toFixed(1) + 'MB). Processing may take a moment.']);
            }

            setIsProcessing(true);
            Papa.parse(degreePlansFile, {
                header: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV parsing errors:', results.errors);
                        setErrors(prev => [...prev, 'Some rows in Degree Plans had parsing errors. Check console for details.']);
                    }

                    // Validate required columns
                    const firstRow = results.data[0] || {};
                    const hasTranscriptDescrip = 'TranscriptDescrip' in firstRow;
                    const hasRequirement = 'Requirement' in firstRow;
                    const hasCategory = 'Category' in firstRow;

                    if (!hasTranscriptDescrip || !hasRequirement) {
                        setErrors(prev => [...prev, 'Degree Plans is missing required columns. Expected "TranscriptDescrip" and "Requirement". Please check that you selected the correct files for each.']);
                        setDegreePlansData([]);
                        setIsProcessing(false);
                        return;
                    }

                    const filtered = results.data.filter(row =>
                        row.TranscriptDescrip && row.TranscriptDescrip.trim()
                    );
                    setDegreePlansData(filtered);
                    setIsProcessing(false);
                },
                error: (error) => {
                    setErrors(prev => [...prev, 'Failed to parse Degree Plans: ' + error.message]);
                    setIsProcessing(false);
                }
            });
        }
    }, [degreePlansFile]);

    useEffect(() => {
        if (enrollmentsFile) {
            // Clear previous errors for this file type
            setErrors(prev => prev.filter(e => !e.includes('Enrollment Figures')));

            // Check file size (warn if > 10MB)
            if (enrollmentsFile.size > 10 * 1024 * 1024) {
                setErrors(prev => [...prev, 'Warning: Enrollment Figures file is large (' + (enrollmentsFile.size / (1024 * 1024)).toFixed(1) + 'MB). Processing may take a moment.']);
            }

            setIsProcessing(true);
            Papa.parse(enrollmentsFile, {
                header: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV parsing errors:', results.errors);
                        setErrors(prev => [...prev, 'Some rows in Enrollment Figures had parsing errors. Check console for details.']);
                    }

                    // Validate required columns
                    const firstRow = results.data[0] || {};
                    const hasCourseNumber = 'Course Number' in firstRow;
                    const hasEnrollment = 'Course Enrollment' in firstRow;

                    if (!hasCourseNumber || !hasEnrollment) {
                        setErrors(prev => [...prev, 'Enrollment Figures is missing required columns. Expected "Course Number" and "Course Enrollment". Please check that you selected the correct files for each.']);
                        setEnrollmentsData([]);
                        setIsProcessing(false);
                        return;
                    }

                    const filtered = results.data.filter(row =>
                        row['Course Number'] && row['Course Number'].trim() &&
                        row['Course Enrollment']
                    );
                    setEnrollmentsData(filtered);
                    setIsProcessing(false);
                },
                error: (error) => {
                    setErrors(prev => [...prev, 'Failed to parse Enrollment Figures: ' + error.message]);
                    setIsProcessing(false);
                }
            });
        }
    }, [enrollmentsFile]);

    // Process courses with degree plan counts
    useEffect(() => {
        if (coursesData.length > 0 && degreePlansData.length > 0 && enrollmentsData.length > 0) {
            // Auto-hide upload section once data is loaded
            setUploadSectionExpanded(false);
            setIsProcessing(true);

            // Clear previous errors related to processing
            setErrors([]);

            const courseUsageMap = new Map();

            // Build usage map from degree plans
            degreePlansData.forEach(plan => {
                let courseCodes = [];
                let categoryLabel = '';
                const requirement = plan.Requirement || '';
                const category = plan.Category || '';
                const defaultCode = plan.DefaultCode || '';

                // Check if requirement contains "elective" (any type of elective)
                if (requirement.toLowerCase().includes('elective')) {
                    // Use DefaultCode for electives
                    if (defaultCode && defaultCode.trim()) {
                        courseCodes.push(defaultCode.trim());
                    }

                    // Determine category label
                    if (requirement.toLowerCase().includes('open elective')) {
                        categoryLabel = 'Open Elective';
                    } else if (category.toLowerCase() === 'concentration') {
                        categoryLabel = 'Concentration Elective';
                    } else if (category) {
                        // Check if category already contains "elective" to avoid duplication
                        if (category.toLowerCase().includes('elective')) {
                            categoryLabel = category;
                        } else {
                            categoryLabel = category + ' Elective';
                        }
                    } else {
                        categoryLabel = 'Elective';
                    }
                } else if (requirement.toLowerCase().includes(' or ')) {
                    // Handle "OR" requirements - split and use all course codes
                    const parts = requirement.split(/\s+or\s+/i);
                    parts.forEach(part => {
                        // Extract course code (e.g., "MT209 Small Business Management" -> "MT209")
                        const match = part.trim().match(/^([A-Z]{2}\d{3})/);
                        if (match) {
                            courseCodes.push(match[1]);
                        }
                    });
                    categoryLabel = category || 'N/A';
                } else if (requirement.toLowerCase().includes('requirement')) {
                    // For generic requirements like "Mathematics Requirement", use DefaultCode
                    if (defaultCode && defaultCode.trim()) {
                        courseCodes.push(defaultCode.trim());
                    }
                    categoryLabel = category || 'N/A';
                } else {
                    // Use requirement as-is (it should be a course code)
                    if (requirement && requirement.trim()) {
                        courseCodes.push(requirement.trim());
                    }
                    categoryLabel = category || 'N/A';
                }

                const programName = plan.TranscriptDescrip.trim();

                // Process each course code
                courseCodes.forEach(courseCode => {
                    // Skip if no valid course code or if it's still a generic requirement
                    if (!courseCode ||
                        courseCode.toLowerCase().includes('requirement') ||
                        courseCode.toLowerCase().includes('elective')) {
                        return;
                    }

                    if (!courseUsageMap.has(courseCode)) {
                        courseUsageMap.set(courseCode, {
                            count: 0,
                            programs: new Map()
                        });
                    }

                    const usage = courseUsageMap.get(courseCode);

                    // Store program with category
                    if (!usage.programs.has(programName)) {
                        usage.programs.set(programName, {
                            category: categoryLabel
                        });
                    }

                    usage.count = usage.programs.size;
                });
            });

            // Calculate enrollment statistics
            const enrollmentMap = new Map();
            if (enrollmentsData.length > 0) {
                enrollmentsData.forEach(enrollment => {
                    const courseCode = (enrollment['Course Number'] || '').trim();
                    const enrollmentCount = parseInt(enrollment['Course Enrollment']) || 0;
                    const termName = (enrollment['Term Name'] || '').trim();
                    const termCode = termName.substring(0, 5); // First 5 characters (e.g., "2401A")

                    if (!courseCode || !termCode) return;

                    if (!enrollmentMap.has(courseCode)) {
                        enrollmentMap.set(courseCode, {
                            totalEnrollment: 0,
                            timesOffered: 0,
                            termData: new Map() // Track sections per term
                        });
                    }

                    const stats = enrollmentMap.get(courseCode);
                    stats.totalEnrollment += enrollmentCount;
                    stats.timesOffered += 1;

                    // Track sections per term (each row is a section)
                    if (!stats.termData.has(termCode)) {
                        stats.termData.set(termCode, 0);
                    }
                    stats.termData.set(termCode, stats.termData.get(termCode) + 1);
                });
            }

            // Merge with course master list
            const processed = coursesData.map(course => {
                const courseCode = (course['Course Number'] || course['CourseCode'] || '').trim();
                const courseTitle = course['Course Title'] || course['CourseName'] || course['CourseTitle'] || '';
                const deptChair = course['Department Chair'] || '';
                const usage = courseUsageMap.get(courseCode) || { count: 0, programs: new Map() };
                const enrollmentStats = enrollmentMap.get(courseCode) || { totalEnrollment: 0, timesOffered: 0 };

                const programsArray = Array.from(usage.programs.entries()).map(([name, info]) => ({
                    name: name,
                    category: info.category
                })).sort((a, b) => a.name.localeCompare(b.name));

                // Extract unique category types for this course
                const categoryTypes = new Set();
                programsArray.forEach(p => {
                    const cat = p.category.toLowerCase().trim();

                    // Skip empty or N/A categories
                    if (!cat || cat === 'n/a') {
                        return;
                    }

                    // Check in order of specificity (most specific first)
                    if (cat.includes('open') && cat.includes('elective')) {
                        categoryTypes.add('Open Elective');
                    } else if (cat.includes('concentration') && cat.includes('elective')) {
                        categoryTypes.add('Concentration Elective');
                    } else if (cat.includes('micro-credential') || cat.includes('micro credential')) {
                        categoryTypes.add('Micro-credential');
                    } else if (cat.includes('core')) {
                        categoryTypes.add('Core');
                    } else if (cat.includes('major')) {
                        categoryTypes.add('Major');
                    } else if (cat.includes('requirements')) {
                        categoryTypes.add('Requirements');
                    } else if (cat.includes('concentration')) {
                        categoryTypes.add('Concentration');
                    } else if (cat.includes('elective')) {
                        categoryTypes.add('Elective');
                    } else if (cat.includes('open')) {
                        categoryTypes.add('Open');
                    } else {
                        // Capitalize first letter of unknown categories
                        categoryTypes.add(p.category.charAt(0).toUpperCase() + p.category.slice(1));
                    }
                });

                // Sort types according to defined order
                const typeOrderLocal = ['Core', 'Major', 'Requirements', 'Concentration', 'Concentration Elective', 'Elective', 'Open Elective', 'Micro-credential'];
                const sortedTypes = Array.from(categoryTypes).sort((a, b) => {
                    const aIndex = typeOrderLocal.findIndex(t => a.toLowerCase().includes(t.toLowerCase()));
                    const bIndex = typeOrderLocal.findIndex(t => b.toLowerCase().includes(t.toLowerCase()));
                    const aOrder = aIndex === -1 ? 999 : aIndex;
                    const bOrder = bIndex === -1 ? 999 : bIndex;
                    return aOrder - bOrder;
                });

                const avgEnrollment = enrollmentStats.timesOffered > 0
                    ? Math.round(enrollmentStats.totalEnrollment / enrollmentStats.timesOffered)
                    : 0;

                // Calculate new metrics: avgSectionsPerTerm, sectionVariation, sectionTrend
                let avgSectionsPerTerm = 0;
                let sectionVariationPercent = 0;
                let sectionStdDev = 0;
                let sectionTrend = '—';

                if (enrollmentStats.termData && enrollmentStats.termData.size > 0) {
                    const sectionsPerTerm = Array.from(enrollmentStats.termData.values());
                    const numTerms = sectionsPerTerm.length;

                    // Average sections per term
                    const totalSections = sectionsPerTerm.reduce((sum, count) => sum + count, 0);
                    avgSectionsPerTerm = numTerms > 0 ? (totalSections / numTerms).toFixed(1) : 0;

                    // Coefficient of variation (std dev / mean * 100)
                    if (numTerms > 1 && avgSectionsPerTerm > 0) {
                        const mean = totalSections / numTerms;
                        const variance = sectionsPerTerm.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / numTerms;
                        const stdDev = Math.sqrt(variance);
                        sectionStdDev = parseFloat(stdDev.toFixed(1));
                        sectionVariationPercent = parseFloat(((stdDev / mean) * 100).toFixed(1));
                    }

                    // Trend: compare first half vs second half of terms
                    if (numTerms >= 2) {
                        const sortedTerms = Array.from(enrollmentStats.termData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
                        const midpoint = Math.floor(sortedTerms.length / 2);
                        const firstHalf = sortedTerms.slice(0, midpoint);
                        const secondHalf = sortedTerms.slice(midpoint);

                        const firstHalfAvg = firstHalf.reduce((sum, [_, count]) => sum + count, 0) / firstHalf.length;
                        const secondHalfAvg = secondHalf.reduce((sum, [_, count]) => sum + count, 0) / secondHalf.length;

                        const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

                        if (change > 10) {
                            sectionTrend = '↑';
                        } else if (change < -10) {
                            sectionTrend = '↓';
                        } else {
                            sectionTrend = '→';
                        }
                    }
                }

                return {
                    code: courseCode,
                    title: courseTitle,
                    deptChair: deptChair,
                    subject: courseCode.match(/^[A-Z]+/)?.[0] || '',
                    usageCount: usage.count,
                    programs: programsArray,
                    types: sortedTypes,
                    avgEnrollment: avgEnrollment,
                    timesOffered: enrollmentStats.timesOffered,
                    avgSectionsPerTerm: avgSectionsPerTerm,
                    sectionVariationPercent: sectionVariationPercent,
                    sectionStdDev: sectionStdDev,
                    sectionTrend: sectionTrend
                };
            });

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
            const matchesNeverOffered = !hideNeverOffered || course.timesOffered > 0;
            return matchesSubject && matchesSearch && matchesTypes && matchesNeverOffered;
        });
    }, [processedCourses, selectedSubject, searchTerm, selectedTypes, hideNeverOffered]);

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
                case 'usage':
                    aVal = a.usageCount;
                    bVal = b.usageCount;
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
                aVal = variationMode === 'percent'
                    ? (parseFloat(a.sectionVariationPercent) || 0)
                    : (parseFloat(a.sectionStdDev) || 0);
                bVal = variationMode === 'percent'
                    ? (parseFloat(b.sectionVariationPercent) || 0)
                    : (parseFloat(b.sectionStdDev) || 0);
                break;
                case 'sectionTrend':
                    // Sort by trend: ↑ = 2, → = 1, ↓ = 0
                    const trendOrder = { '↑': 2, '→': 1, '↓': 0, '—': -1 };
                    aVal = trendOrder[a.sectionTrend] || -1;
                    bVal = trendOrder[b.sectionTrend] || -1;
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

    // Define type order priority
    const typeOrder = ['Core', 'Major', 'Requirements', 'Concentration', 'Concentration Elective', 'Elective', 'Open Elective', 'Micro-credential'];

    const sortTypes = (types) => {
        return types.sort((a, b) => {
            const aIndex = typeOrder.findIndex(t => a.toLowerCase().includes(t.toLowerCase()));
            const bIndex = typeOrder.findIndex(t => b.toLowerCase().includes(t.toLowerCase()));
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
            h('h1', null, 'Course Inventory Analysis'),
            h('p', null, 'Purdue University Global - Course Usage and Program Requirements')
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

        // Only show toggle after data is loaded
        dataLoaded && h('div', {
            className: 'upload-toggle',
            onClick: () => setUploadSectionExpanded(!uploadSectionExpanded)
        },
            h('div', { className: 'upload-toggle-text' },
                uploadSectionExpanded ? 'Hide Upload Section' : 'Upload New Data Files'
            ),
            h('div', {
                className: 'upload-toggle-icon' + (uploadSectionExpanded ? ' expanded' : '')
            }, '▼')
        ),

        // Show upload section when: no data loaded OR toggle is expanded
        (!dataLoaded || uploadSectionExpanded) && h('div', {
            className: 'upload-section' + ((!dataLoaded || uploadSectionExpanded) ? ' expanded' : ' collapsed')
        },
            h('h2', { style: { marginBottom: '10px', color: '#000000' } }, 'Upload Data Files'),
            h('p', { style: { color: '#9D968D', marginBottom: '20px', fontSize: '14px' } },
                dataLoaded ? 'Upload new files to replace the current data.' : 'All three files are required to begin analysis.'
            ),
            h('div', { className: 'upload-grid' },
                h('div', { className: 'upload-box' + (coursesFile ? ' uploaded' : '') },
                    h('label', null,
                        h('input', {
                            type: 'file',
                            accept: '.csv,.txt',
                            onChange: (e) => setCoursesFile(e.target.files[0])
                        }),
                        h('div', { className: 'upload-icon' }, '📚'),
                        h('div', { className: 'upload-text' }, 'Master Course List'),
                        coursesFile && h('div', { className: 'upload-status' }, '✓ ' + coursesFile.name),
                        !coursesFile && h('div', { style: { fontSize: '12px', color: '#9D968D', marginTop: '8px' } },
                            'Click to upload CSV/TXT'
                        )
                    )
                ),

                h('div', { className: 'upload-box' + (degreePlansFile ? ' uploaded' : '') },
                    h('label', null,
                        h('input', {
                            type: 'file',
                            accept: '.csv,.txt',
                            onChange: (e) => setDegreePlansFile(e.target.files[0])
                        }),
                        h('div', { className: 'upload-icon' }, '🎓'),
                        h('div', { className: 'upload-text' }, 'Degree Plans'),
                        degreePlansFile && h('div', { className: 'upload-status' }, '✓ ' + degreePlansFile.name),
                        !degreePlansFile && h('div', { style: { fontSize: '12px', color: '#9D968D', marginTop: '8px' } },
                            'Click to upload CSV/TXT'
                        )
                    )
                ),

                h('div', { className: 'upload-box' + (enrollmentsFile ? ' uploaded' : '') },
                    h('label', null,
                        h('input', {
                            type: 'file',
                            accept: '.csv,.txt',
                            onChange: (e) => setEnrollmentsFile(e.target.files[0])
                        }),
                        h('div', { className: 'upload-icon' }, '📊'),
                        h('div', { className: 'upload-text' }, 'Enrollment Figures'),
                        enrollmentsFile && h('div', { className: 'upload-status' }, '✓ ' + enrollmentsFile.name),
                        !enrollmentsFile && h('div', { style: { fontSize: '12px', color: '#9D968D', marginTop: '8px' } },
                            'Click to upload CSV/TXT'
                        )
                    )
                )
            )
        ),

        dataLoaded && h('div', null,
            h('div', { className: 'stats' },
                h('div', { className: 'stat-card' },
                    h('div', { className: 'stat-value' }, stats.totalCourses),
                    h('div', { className: 'stat-label' }, 'Total Courses')
                ),
                h('div', { className: 'stat-card' },
                    h('div', { className: 'stat-value' }, stats.usedCourses),
                    h('div', { className: 'stat-label' }, 'Used in Programs')
                ),
                h('div', { className: 'stat-card' },
                    h('div', { className: 'stat-value' }, stats.unusedCourses),
                    h('div', { className: 'stat-label' }, 'Not used in any programs')
                ),
                h('div', { className: 'stat-card' },
                    h('div', { className: 'stat-value' }, stats.neverOffered),
                    h('div', { className: 'stat-label' }, 'Never offered')
                )
            ),

            h('div', { className: 'controls' },
                h('div', { className: 'control-group' },
                    h('label', null, 'Subject Filter'),
                    h('select', {
                        value: selectedSubject,
                        onChange: (e) => setSelectedSubject(e.target.value)
                    },
                        subjects.map(subject =>
                            h('option', { key: subject, value: subject }, subject)
                        )
                    )
                ),

                    h('div', { className: 'control-group' },
                        h('label', null, 'Search Courses'),
                        h('input', {
                            type: 'text',
                            placeholder: 'Search by code or title...',
                            value: searchTerm,
                            onChange: (e) => setSearchTerm(e.target.value)
                        })
                    ),

                    enrollmentsData.length > 0 && h('div', { className: 'control-group' },
                        h('label', null, 'Variation Display'),
                        h('div', { className: 'toggle-switch-container' },
                            h('span', {
                                className: 'toggle-label' + (variationMode === 'percent' ? ' active' : '')
                            }, '%'),
                            h('label', { className: 'toggle-switch' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: variationMode === 'stddev',
                                    onChange: () => setVariationMode(variationMode === 'percent' ? 'stddev' : 'percent')
                                }),
                                h('span', { className: 'toggle-slider' })
                            ),
                            h('span', {
                                className: 'toggle-label' + (variationMode === 'stddev' ? ' active' : '')
                            }, 'Std Dev')
                        )
                    ),

                    h('div', { className: 'checkbox-group', onClick: () => setHideNeverOffered(!hideNeverOffered) },
                        h('input', {
                            type: 'checkbox',
                            checked: hideNeverOffered,
                            onChange: () => setHideNeverOffered(!hideNeverOffered)
                    }),
                    h('label', null, 'Hide courses never offered')
                )
            ),

            allTypes.length > 0 && h('div', { className: 'controls' },
                h('div', { style: { width: '100%' } },
                    h('div', { className: 'type-filter-label' },
                        h('span', null, 'Filter by Type'),
                        selectedTypes.length > 0 && h('button', {
                            className: 'clear-filters-btn',
                            onClick: clearTypeFilters
                        }, 'Clear filters')
                    ),
                    h('div', { className: 'type-filter-buttons' },
                        allTypes.map(type =>
                            h('button', {
                                key: type,
                                className: 'type-filter-btn ' + getCategoryClass(type) + (selectedTypes.includes(type) ? ' active' : ''),
                                onClick: () => handleTypeToggle(type)
                            }, type)
                        )
                    )
                )
            ),

            h('div', { className: 'table-container' },
                h('table', null,
                    h('thead', null,
                        h('tr', null,
                            h('th', {
                                className: getSortClass('code'),
                                onClick: () => handleSort('code')
                            }, 'CODE'),
                            h('th', {
                                className: getSortClass('title'),
                                onClick: () => handleSort('title')
                            }, 'TITLE'),
                            h('th', null, 'TYPES'),
                            h('th', {
                                className: 'center ' + getSortClass('usage'),
                                onClick: () => handleSort('usage')
                            }, 'DEGREE PLANS USING THIS'),
                            enrollmentsData.length > 0 && h('th', {
                                className: 'center ' + getSortClass('avgEnrollment'),
                                onClick: () => handleSort('avgEnrollment')
                            }, 'AVG ENROLLMENT'),
                            enrollmentsData.length > 0 && h('th', {
                                className: 'center ' + getSortClass('timesOffered'),
                                onClick: () => handleSort('timesOffered')
                            }, 'TIMES OFFERED'),
                            enrollmentsData.length > 0 && h('th', {
                                className: 'center ' + getSortClass('avgSectionsPerTerm'),
                                onClick: () => handleSort('avgSectionsPerTerm')
                            }, 'AVG SECTIONS/TERM'),
                            enrollmentsData.length > 0 && h('th', {
                                className: 'center ' + getSortClass('sectionVariation'),
                                onClick: () => handleSort('sectionVariation')
                            }, variationMode === 'percent' ? 'VARIATION (%)' : 'VARIATION (STD DEV)'),
                            enrollmentsData.length > 0 && h('th', {
                                className: 'center ' + getSortClass('sectionTrend'),
                                onClick: () => handleSort('sectionTrend')
                            }, 'TREND'),
                            h('th', { className: 'center' }, 'PROGRAMS')
                        )
                    ),
                    h('tbody', null,
                        sortedCourses.length === 0 && h('tr', null,
                            h('td', { colSpan: enrollmentsData.length > 0 ? 10 : 5, className: 'no-results' },
                                'No courses found matching your criteria'
                            )
                        ),
                        sortedCourses.map(course =>
                            h('tr', { key: course.code },
                                h('td', { className: 'course-code' }, course.code),
                                h('td', { className: 'course-title' }, course.title),
                                h('td', null,
                                    h('div', { className: 'category-tags' },
                                        course.types.map((type, idx) =>
                                            h('span', {
                                                key: idx,
                                                className: 'category-tag ' + getCategoryClass(type)
                                            }, type)
                                        )
                                    )
                                ),
                                h('td', { className: 'center' },
                                    h('span', { className: 'usage-count' }, course.usageCount)
                                ),
                                enrollmentsData.length > 0 && h('td', { className: 'center' },
                                    course.avgEnrollment > 0
                                        ? h('span', { className: 'usage-count' }, course.avgEnrollment)
                                        : h('span', { style: { color: '#9D968D' } }, '—')
                                ),
                                enrollmentsData.length > 0 && h('td', { className: 'center' },
                                    course.timesOffered > 0
                                        ? h('span', { className: 'usage-count' }, course.timesOffered)
                                        : h('span', { style: { color: '#9D968D' } }, '—')
                                ),
                                enrollmentsData.length > 0 && h('td', { className: 'center' },
                                    course.avgSectionsPerTerm > 0
                                        ? h('span', { className: 'usage-count' }, course.avgSectionsPerTerm)
                                        : h('span', { style: { color: '#9D968D' } }, '—')
                                ),
                                enrollmentsData.length > 0 && h('td', { className: 'center' },
                                    variationMode === 'percent'
                                        ? (course.sectionVariationPercent > 0
                                            ? h('span', { className: 'usage-count' }, course.sectionVariationPercent + '%')
                                            : h('span', { style: { color: '#9D968D' } }, '—'))
                                        : (course.sectionStdDev > 0
                                            ? h('span', { className: 'usage-count' }, course.sectionStdDev)
                                            : h('span', { style: { color: '#9D968D' } }, '—'))
                                ),
                                enrollmentsData.length > 0 && h('td', { className: 'center' },
                                    h('span', {
                                        className: 'usage-count',
                                        style: { fontSize: '16px' }
                                    }, course.sectionTrend)
                                ),
                                h('td', { className: 'center' },
                                    h('button', {
                                        className: 'info-button',
                                        onClick: () => setSelectedCourse(course)
                                    }, 'View Details')
                                )
                            )
                        )
                    )
                )
            )
        ),

        selectedCourse && h(CourseModal, {
            course: selectedCourse,
            enrollmentsData: enrollmentsData,
            onClose: () => setSelectedCourse(null)
        }),

        h('div', { className: 'version-footer' },
            h('span', { className: 'version-number' }, 'Version 1.18.4'),
            ' — View Details button now available for all courses'
        )
    );
}

function CourseModal({ course, enrollmentsData, onClose }) {
    const [selectedTrack, setSelectedTrack] = useState('all'); // 'all' or specific track
    const [xAxisMode, setXAxisMode] = useState('full'); // 'full' = term codes, 'base' = base terms
    const [metricMode, setMetricMode] = useState('sections'); // 'sections' or 'enrollment'
    const [historyCollapsed, setHistoryCollapsed] = useState(true);
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

    // Calculate term history for display list (limited to last 5 per track)
    const termHistory = useMemo(() => {
        if (allTermHistory.length === 0) return [];

        const termsArray = [...allTermHistory];
        termsArray.sort((a, b) => {
            if (a.track !== b.track) {
                return a.track.localeCompare(b.track);
            }
            return b.termCode.localeCompare(a.termCode);
        });

        const trackMap = new Map();
        termsArray.forEach(term => {
            if (!trackMap.has(term.track)) {
                trackMap.set(term.track, []);
            }
            const trackTerms = trackMap.get(term.track);
            if (trackTerms.length < 5) {
                trackTerms.push(term);
            }
        });

        const result = [];
        Array.from(trackMap.keys()).sort().forEach(track => {
            result.push(...trackMap.get(track));
        });

        return result;
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
                h('div', { className: 'info-grid', style: { gridTemplateColumns: 'repeat(4, 1fr)' } },
                    h('div', { className: 'info-item' },
                        h('div', { className: 'info-label' }, 'Programs'),
                        h('div', { className: 'info-value' }, course.programs.length || '—')
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

                termHistory.length > 0 && h('div', { className: 'modal-section' },
                    h('div', { className: 'section-header' },
                        h('h3', null, 'Section History by Track (Last 5 Terms per Track)'),
                        h('button', {
                            className: 'collapse-toggle',
                            onClick: () => setHistoryCollapsed(!historyCollapsed)
                        }, historyCollapsed ? 'Show' : 'Hide')
                    ),
                    !historyCollapsed && h('div', { className: 'term-history-list' },
                        termHistory.map((term, index) =>
                            h('div', { key: index, className: 'term-history-item' },
                                h('div', { className: 'term-code' }, term.termCode),
                                h('div', { className: 'term-stats' },
                                    h('span', { className: 'term-sections' }, term.sections + ' section' + (term.sections !== 1 ? 's' : '')),
                                    h('span', { className: 'term-separator' }, ' • '),
                                    h('span', { className: 'term-enrollment' }, term.totalEnrollment + ' students')
                                )
                            )
                        )
                    )
                ),

                h('div', { className: 'modal-section' },
                    h('h3', null, 'Associated Programs'),
                    h('div', { className: 'program-list' },
                        course.programs.length > 0
                            ? course.programs.map((program, index) =>
                                h('div', { key: index, className: 'program-item' },
                                    h('div', { className: 'program-name' }, program.name),
                                    h('span', {
                                        className: 'program-category ' + getCategoryClassModal(program.category)
                                    }, program.category)
                                )
                            )
                            : h('div', { style: { color: '#9D968D', fontStyle: 'italic', padding: '10px 0' } },
                                'This course is not associated with any degree programs.')
                    )
                )
            )
        )
    );
}

ReactDOM.render(React.createElement(CourseInventoryApp), document.getElementById('root'));
}
