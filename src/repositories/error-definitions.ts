export class AlreadyRegisteredError extends Error {
    
    code: number = 1;

    constructor(message){
        super(message)
    }
}

export class FieldValidationError extends Error {
    
    code: number = 2;

    constructor(message){
        super(message)
    }
}
