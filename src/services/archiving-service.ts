// import { Db, Collection } from 'mongodb';

// export class ArchivingService {
    
//     eventsCollection: Collection;

//     constructor(identityProviderDb: Db){
//         this.eventsCollection = identityProviderDb.collection('identity-provider-events');
//     }

//     archiveEvent(event) {
//         const now = new Date();
//         event.event_date = now;
//         event.event_date_tzo = now.getTimezoneOffset();

//         this.eventsCollection.insertOne(event);
//     }
    
// }