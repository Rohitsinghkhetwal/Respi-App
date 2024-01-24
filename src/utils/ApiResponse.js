class ApiResponse {
    constructor(StatusCode, data, message = 'success',){
        this.StatusCode = StatusCode;
        this.message = message;
        this.data = data;
        this.success = StatusCode < 400;

    }
}

export {ApiResponse}