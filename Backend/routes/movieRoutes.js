 // routes/movieRoutes.js
import express from 'express';
import {searchMovieController, getMovieDetailsController} from '../controllers/movieController.js';
import { verifyToken } from '../middlewareVerif.js';

const router = express.Router();

router.get('/search', verifyToken, searchMovieController);
router.get('/details/:id', verifyToken, getMovieDetailsController);

export default router;

