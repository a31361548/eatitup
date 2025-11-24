import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { NavbarClient } from './NavbarClient'

export async function Navbar(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return <NavbarClient user={user} />
}
