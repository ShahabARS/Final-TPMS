import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB({ retries: 3, delayMs: 1000 });

    // Define users
    const usersData = [
      { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'ADMIN' },
      { name: 'Leader User', email: 'leader@example.com', password: 'password123', role: 'LEADER' },
      { name: 'Member One', email: 'member1@example.com', password: 'password123', role: 'MEMBER' },
      { name: 'Member Two', email: 'member2@example.com', password: 'password123', role: 'MEMBER' },
      { name: 'Member Three', email: 'member3@example.com', password: 'password123', role: 'MEMBER' },
    ];

    // Remove existing test users if present
    for (const u of usersData) {
      // Delete any existing document with the same email to keep seed idempotent
      // eslint-disable-next-line no-await-in-loop
      await User.findOneAndDelete({ email: u.email.toLowerCase() });
    }

    // Create users
    const created = [];
    for (const u of usersData) {
      // eslint-disable-next-line no-await-in-loop
      const user = await User.create({
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash: u.password,
        role: u.role,
      });
      created.push(user);
    }

    const admin = created.find((c) => c.role === 'ADMIN');
    const leader = created.find((c) => c.role === 'LEADER');
    const members = created.filter((c) => c.role === 'MEMBER');

    // Create a sample project (delete existing with same name)
    const projectName = 'Seeded Project';
    await Project.findOneAndDelete({ name: projectName });

    const project = await Project.create({
      name: projectName,
      description: 'This project was created by the seed script for testing.',
      leaderId: leader._id,
      members: [admin._id, leader._id, ...members.map((m) => m._id)],
      columns: ['TODO', 'DOING', 'DONE'],
    });

    // Create some tasks
    // Delete any old tasks from this project to keep seed idempotent
    await Task.deleteMany({ projectId: project._id });

    const tasksData = [
      {
        projectId: project._id,
        title: 'Setup project board',
        description: 'Create columns and add initial tasks',
        assignedTo: leader._id,
        status: 'TODO',
      },
      {
        projectId: project._id,
        title: 'Implement auth endpoints',
        description: 'Finish login/register and protect routes',
        assignedTo: admin._id,
        status: 'DOING',
      },
      {
        projectId: project._id,
        title: 'Create sample tasks',
        description: 'Add example tasks for members to pick',
        assignedTo: members[0]._id,
        status: 'TODO',
      },
      {
        projectId: project._id,
        title: 'Review project board',
        description: 'Leader to review progress and priorities',
        assignedTo: members[1]._id,
        status: 'DONE',
      },
    ];

    for (const t of tasksData) {
      // eslint-disable-next-line no-await-in-loop
      await Task.create(t);
    }

    console.log('Seed completed. Users, project, and tasks created:');
    console.log('Admin:', admin.email);
    console.log('Leader:', leader.email);
    console.log('Members:', members.map((m) => m.email).join(', '));
    console.log('Project:', project.name);

    // Exit successfully
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
