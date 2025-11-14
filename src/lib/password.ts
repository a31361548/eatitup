import bcrypt from 'bcryptjs'

export function hashPassword(plain: string): string {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(plain, salt)
}

export function verifyPassword(plain: string, hashed: string): boolean {
  return bcrypt.compareSync(plain, hashed)
}
