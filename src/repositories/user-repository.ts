import { Collection, Db, InsertOneWriteOpResult } from 'mongodb';
import { AlreadyRegisteredError, FieldValidationError } from './error-definitions';


// I NEED TO CATCH/HANDLE ERRS HERE, instead of handling in the IdentityProvider

export class UserRepository {
    
    public userCollection: Collection;

    constructor(identityProviderDb: Db){
        this.userCollection = identityProviderDb.collection('generic-users');
    }

    getUserByEmail(email: string): Promise<any> {
        return this.userCollection.findOne({ "email": email })
            .then( doc => doc);
    }

    createUser(newUser): Promise<any> {
        return this.userCollection.insertOne(newUser)
            .then( (result: InsertOneWriteOpResult) => {
                const insertedDocument = result.ops[0];
                return insertedDocument
            })
            .catch( err => {
                if(err.code === 11000) throw new AlreadyRegisteredError('User with this email is already registered');
                if(err.code === 121) throw new FieldValidationError('Document failed validation');
                throw err;
            });
    }
}