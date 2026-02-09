import express from 'express';
import Project from '../models/Project.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects (for current user)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    // Get projects where user is leader or member
    const projects = await Project.find({
      $or: [
        { leaderId: req.user._id },
        { members: req.user._id },
      ],
    })
      .populate('leaderId', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private (Only Leaders/Admins)
 */
router.post('/', protect, authorize('LEADER', 'ADMIN'), async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      leaderId: req.user._id,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('leaderId', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Only Leader or Admin)
 */
router.put('/:id', protect, authorize('LEADER', 'ADMIN'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the leader or admin
    if (
      project.leaderId.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('leaderId', 'name email')
      .populate('members', 'name email');

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/projects/:id/members
 * @desc    Get project members
 * @access  Private
 */
router.get('/:id/members', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('leaderId', 'name email role')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Combine leader and members
    const allMembers = [
      {
        userId: project.leaderId._id,
        name: project.leaderId.name,
        email: project.leaderId.email,
        role: project.leaderId.role,
      },
      ...project.members.map((member) => ({
        userId: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
      })),
    ];

    res.json({
      success: true,
      count: allMembers.length,
      data: allMembers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
