/*
Version 1.23.0 - Created custom hooks file to eliminate duplicate CSV parsing code and improve code reusability.
*/

// Create a global namespace for custom hooks
window.CourseInventoryHooks = (function() {
    /**
     * Custom hook to parse CSV files with Papa Parse
     * Handles file size validation, parsing, column validation, and error handling
     *
     * @param {File|null} file - The file to parse
     * @param {Array<string>} requiredColumns - Required column names to validate
     * @param {string} fileType - Name of file type for error messages (e.g., "Master Course List")
     * @param {Function} setErrors - State setter for errors array
     * @param {Function} setIsProcessing - State setter for isProcessing boolean
     * @param {Function} setData - State setter for parsed data
     * @param {Function} validateRow - Optional function to validate and filter rows
     */
    function useCSVParser(
        file,
        requiredColumns,
        fileType,
        setErrors,
        setIsProcessing,
        setData,
        validateRow = null
    ) {
        const { useEffect } = React;

        useEffect(() => {
            if (!file) return;

            // Clear previous errors for this file type
            setErrors(prev => prev.filter(e => !e.includes(fileType)));

            // Check file size (warn if > 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setErrors(prev => [
                    ...prev,
                    `Warning: ${fileType} file is large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Processing may take a moment.`
                ]);
            }

            setIsProcessing(true);

            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV parsing errors:', results.errors);
                        setErrors(prev => [
                            ...prev,
                            `Some rows in ${fileType} had parsing errors. Check console for details.`
                        ]);
                    }

                    // Validate required columns
                    const firstRow = results.data[0] || {};
                    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                    if (missingColumns.length > 0) {
                        setErrors(prev => [
                            ...prev,
                            `${fileType} is missing required columns: ${missingColumns.join(', ')}. Please check that you selected the correct files for each.`
                        ]);
                        setData([]);
                        setIsProcessing(false);
                        return;
                    }

                    // Filter rows using custom validator or default behavior
                    let filtered;
                    if (validateRow) {
                        filtered = results.data.filter(validateRow);
                    } else {
                        // Default: filter out rows where first required column is empty
                        filtered = results.data.filter(row => {
                            const firstColValue = row[requiredColumns[0]];
                            return firstColValue && firstColValue.trim();
                        });
                    }

                    setData(filtered);
                    setIsProcessing(false);
                },
                error: (error) => {
                    setErrors(prev => [
                        ...prev,
                        `Failed to parse ${fileType}: ${error.message}`
                    ]);
                    setIsProcessing(false);
                }
            });
        }, [file]);
    }

    // Public API
    return {
        useCSVParser
    };
})();
