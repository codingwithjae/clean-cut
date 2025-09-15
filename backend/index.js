require('dotenv').config();
const express = require('express');
const routerApi = require('./routes/index.js');
const { rateLimiter } = require('./middlewares/rateLimiter.handler.js');
const { requestLogger } = require('./middlewares/request.logger.js');
const { notFound, errorHandler } = require('./middlewares/errors.handler.js');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000; 

// Temporarily allow all origins for debugging CORS
// app.use(cors({
//   origin: [process.env.BASE_URL, 'http://localhost:5173'],
//   credentials: true
// }));
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(rateLimiter);
app.use(requestLogger);


routerApi(app);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  // Log the actual port the server is listening on
  console.log(`App listening on port ${port}`);
});

