export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters')
  }
  
  // Optional: Uncomment these for stricter password requirements
  // if (!/(?=.*[a-z])/.test(password)) {
  //   errors.push('Password must contain at least one lowercase letter')
  // }
  
  // if (!/(?=.*[A-Z])/.test(password)) {
  //   errors.push('Password must contain at least one uppercase letter')
  // }
  
  // if (!/(?=.*\d)/.test(password)) {
  //   errors.push('Password must contain at least one number')
  // }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

export const validateName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  
  if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
