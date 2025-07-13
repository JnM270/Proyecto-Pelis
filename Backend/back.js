import app from './middleware.js';
import { dbConnection } from './db.js';
import userRoutes from './routes/userRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

//Conexión a la DB
dbConnection(app);

// Rutas
app.use('/user', userRoutes);
app.use('/comments', commentsRoutes);
app.use('/movies', movieRoutes);
