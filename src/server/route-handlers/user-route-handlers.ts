// import { UserService } from '../services/userService';
// import { Request } from 'express';

// export const get = (req: Request, res) => {
//     const userService:UserService​​ = req['scopedContainer'].resolve('userService');
    
//     const requestedBy = userService.getRequestor();
    
//     userService.getUser(req.params.id)
//         .then((servRes)=>res.status(200).send({requestedBy:requestedBy }))
//         .catch(err=>console.log(err))
// }