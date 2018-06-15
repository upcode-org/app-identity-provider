import { Collection, Db, InsertOneWriteOpResult } from 'mongodb';
import { SignupUserRequest } from '../services/service-contracts/identity-provider-contracts';


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
                if(err.code === 11000) {
                    let customError = new Error('User with this email is already registered');
                    customError['code'] = 1;
                    throw customError;
                }
                console.log(err);
                throw err;
            });
    }
}