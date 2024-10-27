import bcrypt from 'bcryptjs';
import { db } from '@/lib/db'; // Main database connection

// Register new admin
export async function registerAdmin(email: string, password: string) {
  try {
    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const admin = await db
      .insertInto('AdminUser')
      .values({
        email,
        password: hashedPassword, // Store the hashed password
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'admin', // Specify the role when registering
      })
      .execute();

    return admin; // Return the admin details after successful registration
  } catch (error: unknown) {
    // Type narrowing to check if the error has a message
    if (error instanceof Error) {
      throw new Error(`Error registering admin: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while registering admin');
    }
  }
}

// Login existing admin
export async function loginAdmin(email: string, password: string) {
  try {
    // Fetch the admin user by email, including role
    const admin = await db
      .selectFrom('AdminUser')
      .select(['id', 'email', 'password', 'role']) // Fetch the hashed password and role
      .where('email', '=', email)
      .executeTakeFirst();

    // If no admin is found with the provided email, throw an error
    if (!admin) {
      throw new Error('No user found with the provided email');
    }

    // Compare the provided password with the stored hashed password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return { id: admin.id, email: admin.email, role: admin.role }; // Return the admin details with role if authentication is successful
  } catch (error: unknown) {
    // Type narrowing to check if the error has a message
    if (error instanceof Error) {
      throw new Error(`Error logging in admin: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while logging in admin');
    }
  }
}

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10); // Use bcrypt to hash the password
}
