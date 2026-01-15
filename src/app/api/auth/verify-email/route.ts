import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Verification token is required.',
        },
        { status: 400 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const fullUrl = `${apiUrl}/api/auth/verify-email?token=${token}`
    
    console.log('Verifying email with token at:', fullUrl)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { 
      status: response.status,
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Email verification failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
