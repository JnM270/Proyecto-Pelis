require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movieRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); 

//Rutas de la app
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`El servidor está usando el puerto http://localhost:${PORT}`);

  app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
});