const AppError = require("./base.exception");

class CredentialsException extends AppError {
    constructor(message){
        super(message, 401);
    }
}

class NotForbidden extends AppError {
    constructor(message){
        super(message, 403);
    }
}

module.exports = {
    CredentialsException,
    NotForbidden
};