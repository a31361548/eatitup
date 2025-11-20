import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars')
    
    // Check if directory exists
    if (!fs.existsSync(avatarsDir)) {
      return NextResponse.json({ avatars: [] })
    }

    // Read all files in the avatars directory
    const files = fs.readdirSync(avatarsDir)
    
    // Filter for image files only
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']
    const avatars = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })
      .map(file => `/avatars/${file}`)

    return NextResponse.json({ avatars })
  } catch (error) {
    console.error('Error reading avatars:', error)
    return NextResponse.json({ avatars: [] }, { status: 500 })
  }
}
