const { checkingId, getUserIdByShortId, getUrlByShortId } = require('../models/shorten.model.js');

function urlValidator(req, res, next) {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  try {
    new URL(originalUrl);
    console.log(`${originalUrl} is a valid URL`);
    next();
  } catch (error) {
    res.status(400).json({ message: 'URL is invalid' });
  }
}

async function shortIdValidator(req, res, next) {
  const { shortId } = req.params;

  if (!shortId) {
    return res.status(400).json({ message: 'shortId is required in the URL parameters' });
  }

  const idExists = await checkingId(shortId);

  if (!idExists) {
    return res.status(404).json({ message: 'URL not found' });
  }

  console.log(`${shortId} is a valid shortId and exists in the database`);
  next();
}

async function validateShortIdUpdate(req, res, next) {
  const { shortId } = req.params;
  const { newShortId } = req.body;

  if (!newShortId || newShortId.length > 8) {
    return res.status(400).json({
      message: 'The new shortId must be provided and cannot exceed 8 characters'
    });
  }

  if (shortId === newShortId) {
    return res.status(400).json({
      message: 'The shortId is already set to the provided value'
    });
  }

  next();
}

async function userIdValidator(req, res, next) {
  const { shortId } = req.params;
  const userId = req.user.id;

  const urlOwner = await getUserIdByShortId(shortId);

  if (!urlOwner || urlOwner.userId !== userId) {
    return res.status(403).json({ message: 'You are not authorized to make any changes to this URL' });
  }

  next();
}

module.exports = { urlValidator, shortIdValidator, userIdValidator, validateShortIdUpdate };
