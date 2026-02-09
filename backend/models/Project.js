import mongoose from 'mongoose';

/**
 * Project Model
 * 
 * Represents a project/board in the system
 * Based on your class diagram: Project with name, description, leaderId
 */
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Leader is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    columns: {
      type: [String],
      default: ['TODO', 'DOING', 'DONE'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster leader lookups
projectSchema.index({ leaderId: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
