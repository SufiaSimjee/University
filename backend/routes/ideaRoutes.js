import express from 'express';
import { protect, roleAccess } from '../middleware/authMiddleware.js';
import upload from '../config/multerConfig.js';
import {
  createIdea,
  createComment,
  getCommentsByIdeaId,
  updateComment,
  deleteComment,
  deleteIdea,
  getAllIdeas,
  getIdeaById,
  upVoteIdea,
  downVoteIdea ,
  getPopularIdeas,
  getMostDownvotedIdeas,
} from '../controllers/ideaController.js';

const router = express.Router();

router.route('/').get(protect , getAllIdeas);

router.route('/:id').get(protect, getIdeaById).delete(protect ,deleteIdea);

router.route('/popular/idea').get(protect, getPopularIdeas);

router.route('/dislike/idea').get(protect, getMostDownvotedIdeas);

router .route('/create').post( protect ,upload.array('files'), createIdea);

router.route('/comments/create/:id').post(protect ,createComment);

router.route('/comments/:id').get(protect ,getCommentsByIdeaId);

router
  .route('/comments/:ideaId/:commentId')
  .put(protect ,updateComment)
  .delete(protect ,deleteComment);

router.route('/upVotes/:ideaId/:userId').post(protect ,upVoteIdea);
router.route('/downVotes/:ideaId/:userId').post(protect ,downVoteIdea);


export default router;