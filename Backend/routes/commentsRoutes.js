 // routes/commentsRoutes.js

import express from 'express';
import { getAllComments,getCommentsByMovieId,createComment,deleteComment} from '../controllers/commentsController.js';

const router = express.Router();

router.get('/', getAllComments);
router.get('/:movieId', getCommentsByMovieId);
router.post('/', createComment);
router.delete('/:id', deleteComment);

export default router;
