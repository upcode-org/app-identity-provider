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
            .then( doc => doc)
            .catch( err => { throw err });
    }

    createUser(newUser): Promise<any> {
        return this.userCollection.insertOne(newUser)
            .then( (result: InsertOneWriteOpResult) => {
                const insertedDocument = result.ops[0];
                return insertedDocument
            })
            .catch( err => { throw err });
    }
}