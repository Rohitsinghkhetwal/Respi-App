class ApiError extends Error {
    constructor(statusCode, errors = [], message='404 not found', stack=''){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.message = message;
        this.success = false;

        if(stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
    
}
export {ApiError}