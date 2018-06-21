import { Router } from 'express';
import { login } from './route-handlers/login';
import { signup } from './route-handlers/signup';
import { verify } from './route-handlers/verify';

export const router = Router();

router.route('/login').post(login);

router.route('/signup').post(signup);

router.route('/verify').get(verify);