import { type RequestHandler, Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';

interface GoogleUser {
  id: string;
  email: string;
  name?: string;
}

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  AuthController.register as RequestHandler,
);
router.get('/verify/:token', AuthController.verifyEmail);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get(
  '/me',
  authMiddleware as unknown as RequestHandler,
  AuthController.getMe as unknown as RequestHandler,
);

router.get(
  '/api-key',
  authMiddleware as unknown as RequestHandler,
  AuthController.getApiKey as unknown as RequestHandler,
);
router.post(
  '/api-key/regenerate',
  authMiddleware as unknown as RequestHandler,
  AuthController.regenerateApiKey as unknown as RequestHandler,
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  async (req, res) => {
    const user = req.user as GoogleUser;
    const token = await AuthService.tokenGeneration({
      id: parseInt(user.id, 10) || 0,
      email: user.email,
      name: user.name,
    });

    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

export default router;
