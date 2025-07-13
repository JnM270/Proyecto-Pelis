import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const createApp = () => {
  const newApp = express();
  newApp.use(cors());
  newApp.use(bodyParser.json());
  return newApp;
}

let app = createApp();

while (!app) {
  app = createApp();
}

export default app;