import { type RequestHandler, Router } from 'express';
import { ShortenController } from '../controllers/shorten.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware.js';
import { linkOwnershipValidator } from '../middlewares/url.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { shortenSchema, updateShortIdSchema } from '../schemas/url.schema.js';

const router = Router();

router.post(
  '/public',
  optionalAuthMiddleware as RequestHandler,
  validateRequest(shortenSchema),
  ShortenController.publicShorten as RequestHandler,
);
router.get('/redirect/:shortId', ShortenController.redirect as RequestHandler);

router.use(authMiddleware as RequestHandler);
router.post(
  '/',
  validateRequest(shortenSchema),
  ShortenController.privateShorten as RequestHandler,
);
router.get('/my-links', ShortenController.getUserLinks as RequestHandler);

router.delete(
  '/:shortId',
  linkOwnershipValidator as RequestHandler,
  ShortenController.delete as RequestHandler,
);

router.patch(
  '/:shortId',
  linkOwnershipValidator as RequestHandler,
  validateRequest(updateShortIdSchema),
  ShortenController.update as RequestHandler,
);

export default router;
