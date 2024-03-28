function handleErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: "Oh no, something went wrong!",
    stack: err.stack,
  });
  next(err);
}

function notFound(req, res, next) {
  res.status(404).send("Sorry cant find that!");
}

module.exports = { handleErrors, errorHandler, notFound };
