import mongoose from 'mongoose';

/**
 * Comment Model
 * 
 * Represents a comment on a task
 * Based on your class diagram: Comment with taskId, userId, text, createdAt
 */
const commentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Indexes for common queries
commentSchema.index({ taskId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 }); // For sorting comments by date

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
