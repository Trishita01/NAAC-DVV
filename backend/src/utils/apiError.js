class apiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // Capture stack trace, excluding constructor call from it
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

        // Log the error to console for debugging
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${new Date().toISOString()}] Error:`, {
                statusCode: this.statusCode,
                message: this.message,
                stack: this.stack,
                errors: this.errors.length ? this.errors : undefined
            });
        }
    }

    // Override toString() to include all error details
    toString() {
        return `API Error: ${this.message} (Status: ${this.statusCode})`;
    }

    // Method to get full error details as an object
    toJSON() {
        return {
            success: this.success,
            message: this.message,
            statusCode: this.statusCode,
            errors: this.errors.length ? this.errors : undefined,
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
        };
    }
}

export default apiError