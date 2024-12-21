const { saveUrl, getUrl, deleteUrl, updateShortId, incrementClicks } = require('../models/shorten.model.js');
const { getUrlsByUserId } = require('../models/user.model.js');
const { v4: uuidv4 } = require('uuid');
const boom = require('@hapi/boom');

async function privateUrlGenerator(req, res, next) {
  const { originalUrl } = req.body;
  const userId = req.user.id;
  const shortId = uuidv4().slice(0, 5);

  try {
    await saveUrl(originalUrl, shortId, userId);
    const newLink = await getUrl(shortId);

    if (!newLink) {
      throw boom.notFound('Link not found after creation');
    }

    res.status(201).json(newLink);
    console.log(`URL shortened with id ${shortId} and stored in the database`);
  } catch (error) {
    next(boom.badImplementation('Error in generating the short URL', { error }));
  }
}

async function publicUrlGenerator(req, res, next) {
  const { originalUrl } = req.body;
  const shortId = uuidv4().slice(0, 5);

  try {
    await saveUrl(originalUrl, shortId, null);

    res.status(201).json({
      message: 'URL shortened successfully',
      shortUrl: `http://localhost:4000/${shortId}`
    });

    console.log(`URL shortened with id ${shortId} and stored in the database`);
  } catch (error) {
    next(boom.badImplementation('Error in generating the short URL', { error }));
  }
}

async function redirectUrl(req, res, next) {
  const { shortId } = req.params;

  console.log(`Redirecting the URL with id ${shortId}`);

  try {
    const result = await getUrl(shortId);

    if (!result) {
      throw boom.notFound('URL not found');
    }

    await incrementClicks(shortId);
    const originalURL = result.originalUrl;

    console.log(`This is the Original URL in the Database ${result.originalUrl}`);
    console.log(`Redirecting to: ${originalURL}`);

    res.redirect(originalURL);
  } catch (error) {
    next(boom.isBoom(error) ? error : boom.badImplementation('Error in redirecting the URL', { error }));
  }
}

async function updateUrlId(req, res, next) {
  const { shortId } = req.params;
  const { newShortId } = req.body;

  try {
    const result = await updateShortId(shortId, newShortId);

    if (!result) {
      throw boom.notFound('URL not found or no changes were made');
    }

    const updatedLink = await getUrl(newShortId);
    if (!updatedLink) {
      throw boom.notFound('Updated link not found');
    }

    res.status(200).json(updatedLink);
  } catch (error) {
    next(boom.isBoom(error) ? error : boom.badImplementation('Error in updating the shortId', { error }));
  }
}

async function deleteShortenedUrl(req, res, next) {
  const { shortId } = req.params;

  console.log(`Deleting the URL with id: ${shortId}`);

  try {
    const result = await deleteUrl(shortId);

    if (!result) {
      throw boom.notFound('URL not found');
    }

    res.status(200).json({ message: 'URL deleted successfully from the Database' });
  } catch (error) {
    next(boom.isBoom(error) ? error : boom.badImplementation('Error in deleting the URL', { error }));
  }
}

async function getUserLinks(req, res, next) {
  const userId = req.user.id;

  console.log('User ID:', userId);

  try {
    const links = await getUrlsByUserId(userId);
    res.status(200).json(links);
  } catch (error) {
    next(boom.badImplementation('Error in fetching user links', { error }));
  }
}

module.exports = {
  privateUrlGenerator,
  publicUrlGenerator,
  redirectUrl,
  deleteShortenedUrl,
  updateUrlId,
  getUserLinks
};
