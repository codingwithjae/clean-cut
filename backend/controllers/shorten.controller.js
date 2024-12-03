const { saveUrl, getUrl, deleteUrl, updateShortId, incrementClicks } = require('../models/shorten.model.js');
const { getUrlsByUserId } = require('../models/user.model.js');
const { v4: uuidv4 } = require('uuid');

async function privateUrlGenerator(req, res) {
  const { originalUrl } = req.body;
  const userId = req.user.id;
  const shortId = uuidv4().slice(0, 5);

  try {
    await saveUrl(originalUrl, shortId, userId);
    // Obtener el objeto completo del link recién creado
    const newLink = await getUrl(shortId);

    res.status(201).json(newLink);

    console.log(`URL shortened with id ${shortId} and stored in the database`);
  } catch (error) {
    console.error('Error in generating the short URL', error);
    res.status(500).json({
      message: 'Internal server error, error in generating the short URL'
    });
  }
}

async function publicUrlGenerator(req, res) {
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
    console.error('Error in generating the short URL', error);

    res.status(500).json({
      message: 'Internal server error, error in generating the short URL'
    });
  }
}

async function redirectUrl(req, res) {
  const { shortId } = req.params;

  console.log(`Redirecting the URL with id ${shortId}`);

  try {
    const result = await getUrl(shortId);

    if (result) {
      await incrementClicks(shortId);

      const originalURL = result.originalUrl;

      console.log(`This is the Original URL in the Database ${result.originalUrl}`);

      console.log(`Redirecting to: ${originalURL}`);

      res.redirect(originalURL);
    } else {
      res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    console.error('Error in redirecting the URL', error);
    res.status(500).json({ message: 'Internal server error, error in redirecting the URL' });
  }
}
async function updateUrlId(req, res) {
  const { shortId } = req.params;
  const { newShortId } = req.body;

  try {
    const result = await updateShortId(shortId, newShortId);

    if (result) {
      // Obtener el link actualizado de la base de datos
      const updatedLink = await getUrl(newShortId); // Asegúrate que getUrl retorne todos los campos
      res.status(200).json(updatedLink);
    } else {
      res.status(404).json({ message: 'URL not found or no changes were made' });
    }
  } catch (error) {
    console.error('Error in updating the shortId', error);
    res.status(500).json({
      message: 'Internal server error, error in updating the shortId'
    });
  }
}

async function deleteShortenedUrl(req, res) {
  const { shortId } = req.params;

  console.log(`Deleting the URL with id: ${shortId}`);

  try {
    const result = await deleteUrl(shortId);

    if (result) {
      res.status(200).json({ message: 'URL deleted successfully from the Database' });
    } else {
      res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    console.error('Error in deleting the URL', error);
    res.status(500).json({ message: 'Internal server error, error in deleting the URL' });
  }
}

async function getUserLinks(req, res) {
  const userId = req.user.id;

  console.log('User ID:', userId);

  try {
    const links = await getUrlsByUserId(userId);

    res.status(200).json(links);
  } catch (error) {
    console.error('Error in fetching user links', error);

    res.status(500).json({
      message: 'Internal server error, error in fetching user links'
    });
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
