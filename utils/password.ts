import bcrypt from 'bcryptjs';

/**
 * Salt and hash a password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export function saltAndHashPassword(password: string): string {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns True if the password matches the hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
