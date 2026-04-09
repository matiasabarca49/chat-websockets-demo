//Validations
const AppError = require("./base.exception.js");
const { ValidationException, NotFoundException, DuplicateEntryException } = require( "./validations.exception.js");
//Auth
const {CredentialsException, NotForbidden} = require("./auth.exception.js");

module.exports = {
    AppError,
    ValidationException,
    NotFoundException,
    DuplicateEntryException,
    CredentialsException,
    NotForbidden
}