const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', auth, getAllTasks);

router.get('/:id', auth, getTaskById);

router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
], createTask);

router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
], updateTask);

router.delete('/:id', auth, deleteTask);

router.post('/:id/comments', auth, [
  body('text').notEmpty().withMessage('Comment text is required')
], addComment);

module.exports = router; 