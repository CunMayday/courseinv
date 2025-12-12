/*
Version 1.24.1 - Fixed UI regression in CourseTable: restored original headers, sort indicators, button styling, and spacing.
Version 1.24.0 - Phase 2 Refactoring: Decomposed CourseInventoryApp into reusable UI components (UploadSection, StatsDashboard, FilterControls, CourseTable).
*/

// Initialize components namespace (will be populated after React loads)
window.CourseInventoryComponents = null;

// Function to initialize components once React is available
window.initializeComponents = function() {
    const { createElement: h } = React;

    /**
     * UploadSection Component
     * Handles the three file upload inputs (Master Course List, Degree Plans, Enrollment Figures)
     *
     * @param {Object} props
     * @param {File|null} props.coursesFile - Currently selected courses file
     * @param {File|null} props.degreePlansFile - Currently selected degree plans file
     * @param {File|null} props.enrollmentsFile - Currently selected enrollments file
     * @param {Function} props.onCoursesFileChange - Callback when courses file changes
     * @param {Function} props.onDegreePlansFileChange - Callback when degree plans file changes
     * @param {Function} props.onEnrollmentsFileChange - Callback when enrollments file changes
     * @param {boolean} props.dataLoaded - Whether all data has been loaded
     */
    function UploadSection({
        coursesFile,
        degreePlansFile,
        enrollmentsFile,
        onCoursesFileChange,
        onDegreePlansFileChange,
        onEnrollmentsFileChange,
        dataLoaded
    }) {
        return h('div', {
            className: 'upload-section expanded'
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
                            onChange: (e) => onCoursesFileChange(e.target.files[0])
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
                            onChange: (e) => onDegreePlansFileChange(e.target.files[0])
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
                            onChange: (e) => onEnrollmentsFileChange(e.target.files[0])
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
        );
    }

    /**
     * StatsDashboard Component
     * Displays four statistics cards showing course metrics
     *
     * @param {Object} props
     * @param {Object} props.stats - Statistics object
     * @param {number} props.stats.totalCourses - Total number of courses
     * @param {number} props.stats.usedCourses - Courses used in programs
     * @param {number} props.stats.unusedCourses - Courses not used in any programs
     * @param {number} props.stats.neverOffered - Courses never offered
     */
    function StatsDashboard({ stats }) {
        return h('div', { className: 'stats' },
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
        );
    }

    /**
     * FilterControls Component
     * Renders subject dropdown, search input, and type filter buttons
     *
     * @param {Object} props
     * @param {string} props.selectedSubject - Currently selected subject filter
     * @param {Array<string>} props.subjects - Array of available subjects
     * @param {Function} props.onSubjectChange - Callback when subject filter changes
     * @param {string} props.searchTerm - Current search term
     * @param {Function} props.onSearchChange - Callback when search term changes
     * @param {Array<string>} props.allTypes - All available course types
     * @param {Array<string>} props.selectedTypes - Currently selected type filters
     * @param {Function} props.onTypeToggle - Callback when type filter is toggled
     * @param {Function} props.onClearTypes - Callback to clear all type filters
     */
    function FilterControls({
        selectedSubject,
        subjects,
        onSubjectChange,
        searchTerm,
        onSearchChange,
        allTypes,
        selectedTypes,
        onTypeToggle,
        onClearTypes
    }) {
        return h('div', { className: 'controls' },
            h('div', { className: 'control-group' },
                h('label', null, 'Subject Filter'),
                h('select', {
                    value: selectedSubject,
                    onChange: (e) => onSubjectChange(e.target.value)
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
                    onChange: (e) => onSearchChange(e.target.value)
                })
            ),

            h('div', { className: 'control-group type-filters' },
                h('label', null, 'Filter by Type'),
                h('div', { className: 'type-buttons' },
                    allTypes.map(type =>
                        h('button', {
                            key: type,
                            className: 'type-button ' + (selectedTypes.includes(type) ? 'active' : ''),
                            onClick: () => onTypeToggle(type)
                        }, type)
                    ),
                    selectedTypes.length > 0 && h('button', {
                        className: 'type-button clear-button',
                        onClick: onClearTypes
                    }, '✕ Clear All')
                )
            )
        );
    }

    /**
     * CourseTable Component
     * Renders the main course data table with sortable columns
     *
     * @param {Object} props
     * @param {Array<Object>} props.courses - Array of course objects to display
     * @param {string} props.sortField - Current sort field
     * @param {string} props.sortDirection - Current sort direction ('asc' or 'desc')
     * @param {Function} props.onSort - Callback when column header is clicked
     * @param {Function} props.onCourseClick - Callback when "View Details" is clicked
     * @param {Function} props.getCategoryClass - Function to get CSS class for course type
     * @param {Array} props.enrollmentsData - Enrollment data to conditionally show columns
     */
    function CourseTable({
        courses,
        sortField,
        sortDirection,
        onSort,
        onCourseClick,
        getCategoryClass,
        enrollmentsData
    }) {
        const getSortClass = (field) => {
            if (sortField !== field) return '';
            return sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
        };

        return h('div', { className: 'table-container' },
            h('table', null,
                h('thead', null,
                    h('tr', null,
                        h('th', {
                            className: getSortClass('code'),
                            onClick: () => onSort('code')
                        }, 'CODE'),
                        h('th', {
                            className: getSortClass('title'),
                            onClick: () => onSort('title')
                        }, 'TITLE'),
                        h('th', null, 'TYPES'),
                        h('th', {
                            className: 'center ' + getSortClass('requiredCount'),
                            onClick: () => onSort('requiredCount'),
                            title: 'Number of degree programs where this course is required (Core, Major, Requirements, or Concentration)'
                        }, 'REQUIRED IN DEGREE PLANS'),
                        h('th', {
                            className: 'center ' + getSortClass('optionalCount'),
                            onClick: () => onSort('optionalCount'),
                            title: 'Number of degree programs where this course is optional (Electives, Concentration Electives, Open Electives, Micro-credentials, or other types)'
                        }, 'OPTIONAL IN DEGREE PLANS'),
                        enrollmentsData.length > 0 && h('th', {
                            className: 'center ' + getSortClass('avgEnrollment'),
                            onClick: () => onSort('avgEnrollment')
                        }, 'AVG ENROLLMENT'),
                        enrollmentsData.length > 0 && h('th', {
                            className: 'center ' + getSortClass('timesOffered'),
                            onClick: () => onSort('timesOffered')
                        }, 'TIMES OFFERED'),
                        enrollmentsData.length > 0 && h('th', {
                            className: 'center ' + getSortClass('avgSectionsPerTerm'),
                            onClick: () => onSort('avgSectionsPerTerm')
                        }, 'AVG SECTIONS/TERM'),
                        enrollmentsData.length > 0 && h('th', {
                            className: 'center ' + getSortClass('sectionVariation'),
                            onClick: () => onSort('sectionVariation')
                        }, 'VARIATION (STD DEV)'),
                        h('th', { className: 'center' }, 'PROGRAMS')
                    )
                ),
                h('tbody', null,
                    courses.length === 0 && h('tr', null,
                        h('td', { colSpan: enrollmentsData.length > 0 ? 10 : 6, className: 'no-results' },
                            'No courses found matching your criteria'
                        )
                    ),
                    courses.map(course =>
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
                                h('span', { className: 'usage-count' }, course.requiredCount)
                            ),
                            h('td', { className: 'center' },
                                h('span', { className: 'usage-count' }, course.optionalCount)
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
                                course.sectionStdDev > 0
                                    ? h('span', { className: 'usage-count' }, course.sectionStdDev)
                                    : h('span', { style: { color: '#9D968D' } }, '—')
                            ),
                            h('td', { className: 'center' },
                                h('button', {
                                    className: 'info-button',
                                    onClick: () => onCourseClick(course)
                                }, 'View Details')
                            )
                        )
                    )
                )
            )
        );
    }

    // Public API - store in global namespace
    window.CourseInventoryComponents = {
        UploadSection,
        StatsDashboard,
        FilterControls,
        CourseTable
    };
};
