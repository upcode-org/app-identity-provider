import { Collection, Db, InsertOneWriteOpResult, FindAndModifyWriteOpResultObject, ObjectId } from 'mongodb';
import { AlreadyRegisteredError, FieldValidationError } from '../services/identity-provider/error-definitions';

export class UserRepository {
    
    public userCollection: Collection;

    constructor(identityProviderDb: Db) {
        this.userCollection = identityProviderDb.collection('app-users');
    }

    getUserByEmail(email: string): Promise<any> {
        return this.userCollection.findOne({ "email": email })
            .then( doc => doc);
    }

    createUser(newUser: any): Promise<any> {
        return this.userCollection.insertOne(newUser)
            .then( (result: InsertOneWriteOpResult) => {
                const insertedDocument = result.ops[0];
                return insertedDocument;
            })
            .catch( err => {
                if(err.code === 11000) throw new AlreadyRegisteredError('User with this email is already registered');
                if(err.code === 121) throw new FieldValidationError('Document failed validation');
                throw err;
            });
    }

    updateUserVerification(userId: string): Promise<FindAndModifyWriteOpResultObject> {
        return this.userCollection.findOneAndUpdate (
            {
                "_id": new ObjectId(userId)
            }, 
            { 
                $set: { verified: true, active: true } 
            },
            {
                returnOriginal: false
            }
        );
    }
}