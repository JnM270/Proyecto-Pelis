import mongoose from 'mongoose';
import { config } from '../config/config.js';

const { DB_URL, PORT } = config;

export const dbConnection = (app) => {
  mongoose.connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connectado en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error al conectar con MongoDB ', error);
  });
}