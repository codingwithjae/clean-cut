const { checkingId, getUserIdByShortId } = require('../models/url.model.js');

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

function shortIdValidator(req, res, next) {
  const { shortId } = req.body;

  if (!shortId) {
    return res.status(400).json({ message: 'shortId is required' });
  }

  const idExists = checkingId(shortId);

  if (idExists) {
    next();
    console.log(`${shortId} is a valid shortId and exists in the database`);
  } else {
    res.status(404).json({ message: 'Id not found or already exist in the database' });
  }
}

async function userIdValidator(req, res, next) {
  // const { shortId } = req.params; // Ahora shortId viene de req.params
  const userId = req.user.id;

  // if (!shortId) {
  //   return res.status(400).json({ message: 'shortId is required in the URL parameters' });
  // }

  // Usa await para manejar la función asíncrona
  const urlOwner = await getUserIdByShortId(shortId);

  console.log('shortId:', shortId);
  console.log('userId:', userId);
  console.log('urlOwner:', urlOwner);

  // Verifica si el enlace existe y si el usuario autenticado es el propietario
  if (!urlOwner || urlOwner.userId !== userId) {
    return res.status(403).json({ message: 'You are not authorized to make any changes to this URL' });
  }

  next();
}

module.exports = { urlValidator, shortIdValidator, userIdValidator };
