/*
Version 1.23.0 - Created utility functions file to extract business logic from React components.
*/

// Create a global namespace for utility functions
window.CourseInventoryUtils = (function() {
    const { TYPE_ORDER, REQUIRED_TYPES } = window.CourseInventoryConstants;

    /**
     * Parse a requirement string and extract course codes
     * @param {string} requirement - The requirement text (e.g., "MT209 or MT220", "Mathematics Requirement")
     * @param {string} defaultCode - Default course code to use for generic requirements
     * @param {string} category - Category of the requirement
     * @returns {Object} - { courseCodes: string[], categoryLabel: string }
     */
    function parseRequirement(requirement, defaultCode, category) {
        let courseCodes = [];
        let categoryLabel = '';

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

        return { courseCodes, categoryLabel };
    }

    /**
     * Calculate enrollment statistics from enrollment data
     * @param {Array} enrollmentsData - Raw enrollment data
     * @returns {Map} - Map of course code to enrollment stats
     */
    function calculateEnrollmentMetrics(enrollmentsData) {
        const enrollmentMap = new Map();

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

        return enrollmentMap;
    }

    /**
     * Categorize types from program usages
     * @param {Array} programsArray - Array of programs with categories
     * @returns {Array} - Sorted array of unique category types
     */
    function categorizeTypes(programsArray) {
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
        const sortedTypes = Array.from(categoryTypes).sort((a, b) => {
            const aIndex = TYPE_ORDER.findIndex(t => a.toLowerCase().includes(t.toLowerCase()));
            const bIndex = TYPE_ORDER.findIndex(t => b.toLowerCase().includes(t.toLowerCase()));
            const aOrder = aIndex === -1 ? 999 : aIndex;
            const bOrder = bIndex === -1 ? 999 : bIndex;
            return aOrder - bOrder;
        });

        return sortedTypes;
    }

    /**
     * Calculate metrics for section data (avg sections per term, variation, trend)
     * @param {Map} termData - Map of term code to section count
     * @returns {Object} - { avgSectionsPerTerm, sectionVariationPercent, sectionStdDev, sectionTrend }
     */
    function calculateSectionMetrics(termData) {
        let avgSectionsPerTerm = 0;
        let sectionVariationPercent = 0;
        let sectionStdDev = 0;
        let sectionTrend = '—';

        if (!termData || termData.size === 0) {
            return { avgSectionsPerTerm, sectionVariationPercent, sectionStdDev, sectionTrend };
        }

        const sectionsPerTerm = Array.from(termData.values());
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
            const sortedTerms = Array.from(termData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
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

        return { avgSectionsPerTerm, sectionVariationPercent, sectionStdDev, sectionTrend };
    }

    /**
     * Process courses with degree plan counts and enrollment statistics
     * @param {Array} coursesData - Raw courses data
     * @param {Array} degreePlansData - Raw degree plans data
     * @param {Array} enrollmentsData - Raw enrollments data
     * @returns {Array} - Processed courses with all calculated fields
     */
    function processCourseData(coursesData, degreePlansData, enrollmentsData) {
        const courseUsageMap = new Map();

        // Build usage map from degree plans
        degreePlansData.forEach(plan => {
            const requirement = plan.Requirement || '';
            const category = plan.Category || '';
            const defaultCode = plan.DefaultCode || '';
            const programName = (plan.TranscriptDescrip || '').trim();

            const { courseCodes, categoryLabel } = parseRequirement(requirement, defaultCode, category);

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
        const enrollmentMap = calculateEnrollmentMetrics(enrollmentsData);

        // Merge with course master list
        const processed = coursesData.map(course => {
            const courseCode = (course['Course Number'] || course['CourseCode'] || '').trim();
            const courseTitle = course['Course Title'] || course['CourseName'] || course['CourseTitle'] || '';
            const deptChair = course['Department Chair'] || '';
            const usage = courseUsageMap.get(courseCode) || { count: 0, programs: new Map() };
            const enrollmentStats = enrollmentMap.get(courseCode) || { totalEnrollment: 0, timesOffered: 0, termData: new Map() };

            const programsArray = Array.from(usage.programs.entries()).map(([name, info]) => ({
                name: name,
                category: info.category
            })).sort((a, b) => a.name.localeCompare(b.name));

            // Extract unique category types for this course
            const sortedTypes = categorizeTypes(programsArray);

            const avgEnrollment = enrollmentStats.timesOffered > 0
                ? Math.round(enrollmentStats.totalEnrollment / enrollmentStats.timesOffered)
                : 0;

            // Calculate section metrics
            const {
                avgSectionsPerTerm,
                sectionVariationPercent,
                sectionStdDev,
                sectionTrend
            } = calculateSectionMetrics(enrollmentStats.termData);

            // Count required vs optional degree plans
            let requiredCount = 0;
            let optionalCount = 0;

            programsArray.forEach(program => {
                const categoryLower = (program.category || '').toLowerCase();
                let isRequired = false;

                // Check if this program uses the course as a required type
                // Note: "Concentration Elective" contains "concentration" but is NOT required
                if (categoryLower.includes('concentration') && categoryLower.includes('elective')) {
                    isRequired = false; // Concentration Elective is optional
                } else if (REQUIRED_TYPES.some(type => categoryLower.includes(type))) {
                    isRequired = true;
                }

                if (isRequired) {
                    requiredCount++;
                } else {
                    optionalCount++;
                }
            });

            return {
                code: courseCode,
                title: courseTitle,
                deptChair: deptChair,
                subject: courseCode.match(/^[A-Z]+/)?.[0] || '',
                usageCount: usage.count,
                requiredCount: requiredCount,
                optionalCount: optionalCount,
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

        return processed;
    }

    // Public API
    return {
        parseRequirement,
        calculateEnrollmentMetrics,
        categorizeTypes,
        calculateSectionMetrics,
        processCourseData
    };
})();
