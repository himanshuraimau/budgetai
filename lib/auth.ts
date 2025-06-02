import { connectDB } from '@/db/config';
import { User, type IUser } from '@/db/models/User';
import { verifyPassword } from '@/utils/password';
import mongoose from 'mongoose';

/**
 * Get user from database by email and verify password
 * @param email - User's email address
 * @param password - Plain text password (will be verified against stored hash)
 * @returns User object if credentials are valid, null otherwise
 */
export async function getUserFromDb(email: string, password: string): Promise<any> {
  try {
    await connectDB();
    
    const user = await User.findOne({ email: email.toLowerCase() }).populate('companyId departmentId');
    
    if (!user) {
      return null;
    }

    // Verify password against stored hash
    const isValidPassword = verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return null;
    }

    // Return user data in the format expected by NextAuth
    return {
      id: (user as any)._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId?.toString() || '',
      departmentId: user.departmentId?.toString(),
    };
  } catch (error) {
    console.error('Error getting user from database:', error);
    return null;
  }
}

/**
 * Create a new user in the database
 * @param userData - User data to create
 * @returns Created user object
 */
export async function createUser(userData: {
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'employee';
  companyId?: string;
  departmentId?: string;
}): Promise<IUser> {
  try {
    await connectDB();
    
    const user = new User({
      email: userData.email.toLowerCase(),
      name: userData.name,
      password: userData.password, // Should be hashed before calling this function
      role: userData.role,
      companyId: userData.companyId ? new mongoose.Types.ObjectId(userData.companyId) : undefined,
      departmentId: userData.departmentId ? new mongoose.Types.ObjectId(userData.departmentId) : undefined,
      inviteCode: userData.inviteCode,
      onboardingCompleted: false,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update user in database
 * @param userId - User ID to update
 * @param updateData - Data to update
 * @returns Updated user object
 */
export async function updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
  try {
    await connectDB();
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).populate('companyId departmentId');

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Find user by email
 * @param email - User's email address
 * @returns User object if found, null otherwise
 */
export async function findUserByEmail(email: string): Promise<IUser | null> {
  try {
    await connectDB();
    
    const user = await User.findOne({ email: email.toLowerCase() }).populate('companyId departmentId');
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}
