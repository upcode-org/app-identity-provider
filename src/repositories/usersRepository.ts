// import { Database } from "src/data/database";

// export class UsersRepository {
    
//     private db:Database;
//     private collections: Array<any>

//     constructor(opts){
//         this.db = opts.db
//         console.log('new instance of userRepository')
//     }

//     public getUser(id) {
//         return new Promise((resolve,reject) => {
//             const userCollection = this.db.conn.collection('users');
//             userCollection.findOne({ id:id })
//                 .then((res) => resolve(res))
//                 .catch(err => reject(err));
//         });
//     }
// }