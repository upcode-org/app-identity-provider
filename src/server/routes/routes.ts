import { Router } from 'express';
import { login } from './route-handlers/login';
import { signup } from './route-handlers/signup';
import { verify } from './route-handlers/verify';

export const router = Router();

router.route('/').get((req, res) => {
    res.status(200).json('All good in the hood!');
});

router.route('/login').post(login);

router.route('/verify').get(verify);

router.route('/signup').post(signup);