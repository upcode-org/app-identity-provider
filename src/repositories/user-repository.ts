import { MongoDriver } from "src/data/database";
import { Collection } from "mongodb";

export class UserRepository {
    
    public userCollection: Collection;

    constructor(opts){
        this.userCollection = opts.mongoDriver.identityProviderDb.collection('generic-users');
    }

    public getUserByUsername(username: string): Promise<any> {
        return this.userCollection.findOne({ "username": username });
    }
}