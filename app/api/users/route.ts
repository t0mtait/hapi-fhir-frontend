import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface User {
  id: number;
  username: string;
  email: string;
  auth0_user_id: string;
  roles: any; // JSON field
  profile_info: any; // JSON field
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  // param for email filtering
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (email) {
    try {
      const result = await query(`
        SELECT 
          id,
          username,
          email,
          auth0_user_id,
          roles,
          profile_info,
          created_at,
          updated_at
        FROM app_user
        WHERE email = $1
        ORDER BY id
      `, [email]);
      
      const users: User[] = result.rows;
      return NextResponse.json({
        success: true,
        users,
        count: users.length
      });

    } catch (error) {
      console.error('Error fetching user by email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch user by email',
          details: errorMessage
        },
        { status: 500 }
      );
    }
  }
  try {
    // Query to fetch all users from the database
    // Adjust the table name and column names according to your database schema
    const result = await query(`
      SELECT 
        id,
        username,
        email,
        auth0_user_id,
        roles,
        profile_info,
        created_at,
        updated_at
      FROM app_user
      ORDER BY id
    `);

    const users: User[] = result.rows;

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, auth0_id, roles, profile_info } = body;

    // Validate required fields
    if (!username || !email || !auth0_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: username, email, and auth0_id are required' 
        },
        { status: 400 }
      );
    }

    // Insert new user into the database
    const result = await query(`
      INSERT INTO app_user (username, email, auth0_user_id, roles, profile_info, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [
      username, 
      email, 
      auth0_id, 
      JSON.stringify(roles || ['user']), // Convert to JSON string, default to ['user'] array
      JSON.stringify(profile_info || {}) // Convert to JSON string, default to empty object
    ]);

    const newUser: User = result.rows[0];

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}