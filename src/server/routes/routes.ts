import { Router } from 'express';
import { login } from './route-handlers/login';
import { signup } from './route-handlers/signup';

export const router = Router();

router.route('/login').post(login);

router.route('/signup').post(signup);