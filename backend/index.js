require('dotenv').config();
const express = require('express');
const routerApi = require('./routes/index.js');
const { rateLimiter } = require('./middlewares/rateLimiter.handler.js');
const { requestLogger } = require('./middlewares/request.logger.js');
const { notFound, errorHandler } = require('./middlewares/errors.handler.js');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({
  origin: [process.env.BASE_URL, 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);


routerApi(app);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

