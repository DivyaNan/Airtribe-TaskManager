class Validator {
    static validateTaskInfo(taskInfo) {
        if(taskInfo.hasOwnProperty('title') && taskInfo.hasOwnProperty('description') && taskInfo.hasOwnProperty('completed')) {
            if(taskInfo.title.trim() === '') {
                return {
                    "status": false,
                    "message": "Title cannot be empty"
                }
            }
            if(taskInfo.description.trim() === '') {
                return {
                    "status": false,
                    "message": "Description cannot be empty"
                }
            } 
            if(taskInfo.hasOwnProperty('priority') && taskInfo.priority.trim() === '') {
                return {
                    "status": false,
                    "message": "Priority cannot be empty"
                }
            } 
            if(typeof taskInfo.completed !== "boolean") {
                return {
                    "status": false,
                    "message": "Completed status must be a boolean value"
                }
            }
            return {
                "status": true,
                "message": "validated successfully"
            }
        } else {
            return {
                "status": false,
                "message": "Invalid task Information"
            }
        }
    }

    // Function to match response body against expected pattern
    static matchesPattern(object, pattern) {
        if (!Array.isArray(object)) {
            return false; // If response body is not an array, it doesn't match the pattern
        }
    
        const task = object[0]; // Extract the task object from the array
    
        for (const key in pattern) {
            if (pattern.hasOwnProperty(key)) {
                if (typeof task[key] !== typeof pattern[key]()) {
                    return false;
                }
            }
        }
        return true;
    }
}

module.exports = Validator;