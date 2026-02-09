import mongoose from 'mongoose';

/**
 * Task Model
 * 
 * Represents a task in the Kanban board
 * Based on your class diagram: Task with title, description, assignedTo, deadline, effort, status
 */
const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    epicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Epic',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    effort: {
      type: Number,
      min: 0,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: 'TODO',
      // Status can be custom columns, so we don't restrict to enum
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ projectId: 1, status: 1 }); // Compound index for board queries

const Task = mongoose.model('Task', taskSchema);

export default Task;
