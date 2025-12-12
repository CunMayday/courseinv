/*
Version 1.23.0 - Created constants file to centralize shared constants (type order, required types).
*/

// Create a global namespace for constants
window.CourseInventoryConstants = {
    // Type order for sorting course types
    TYPE_ORDER: [
        'Core',
        'Major',
        'Requirements',
        'Concentration',
        'Concentration Elective',
        'Elective',
        'Open Elective',
        'Micro-credential'
    ],

    // Types that are considered "required" (not elective/optional)
    REQUIRED_TYPES: ['core', 'major', 'requirements', 'concentration'],

    // Chart color schemes
    CHART_COLORS: {
        sections: 'rgb(206, 184, 136)', // Athletic Gold
        enrollment: 'rgb(194, 142, 14)' // Campus Gold
    }
};
