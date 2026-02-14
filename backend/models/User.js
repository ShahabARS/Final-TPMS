import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Model
 * 
 * Represents a user in the system (Admin, Team Leader, or Team Member)
 * Based on your class diagram: User with role, email, passwordHash
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'LEADER', 'MEMBER'],
      required: true,
      default: 'MEMBER',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster email lookups (login)
// Email is already indexed via `unique: true` in the schema field definition.
// Avoid defining the same index twice to prevent Mongoose duplicate index warnings.

// Method to compare password (for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified (or new)
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
