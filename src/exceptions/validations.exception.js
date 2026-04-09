const AppError = require("./base.exception.js");

class ValidationException extends AppError {
    constructor(message){
        super(message, 400)
    }
}

class NotFoundException extends AppError{
    constructor(collection, key, value){
        super(`${collection} con ${key} "${value}" no encontrado`, 404)
    }
}

class DuplicateEntryException extends AppError{
    constructor(collection, field, value){
        super(`${collection} con ${field} "${value}" ya existe`, 409)
    }
}

module.exports = {
    ValidationException,
    NotFoundException,
    DuplicateEntryException
}