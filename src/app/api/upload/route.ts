import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getAuthenticatedUser } from '@/lib/currentUser'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) {
    return new NextResponse('No file uploaded', { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = Date.now() + '_' + file.name.replace(/\s/g, '_')
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  
  try {
    // Ensure directory exists (Node 10+ supports recursive mkdir)
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(path.join(uploadDir, filename), buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Error saving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
