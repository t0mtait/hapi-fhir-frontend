import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export interface SyncUserRequest {
  auth0_id: string;
  email: string;
  username?: string;
  name?: string;
  picture?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncUserRequest = await request.json();
    const { auth0_id, email, username, name, picture } = body;

    // Validate required fields
    if (!auth0_id || !email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: auth0_id and email are required' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await query(`
      SELECT id, auth0_user_id, email, username FROM app_user 
      WHERE auth0_user_id = $1
    `, [auth0_id]);

    if (existingUser.rows.length > 0) {
      // User exists, update their information
      const updateResult = await query(`
        UPDATE app_user 
        SET email = $2, username = $3, updated_at = NOW()
        WHERE auth0_user_id = $1
        RETURNING *
      `, [auth0_id, email, username || name || email.split('@')[0]]);

      return NextResponse.json({
        success: true,
        user: updateResult.rows[0],
        message: 'User updated successfully',
        isNewUser: false
      });
    }

    // Create new user
    const profile_info = {
      name: name,
      picture: picture,
      email_verified: true
    };

    const roles = ['user']; // Array of roles for JSON column

    // make a new FHIR Patient for this user
    const fhirPatient = {
      resourceType: "Patient",
      name: [
        {
          use: "official",
          family: username,
          given: [username]
        }
      ],
      telecom: [
        {
          system: "email",
          value: email,
          use: "home"
        }
      ]
    };

    const fhirResp = await fetch(`${process.env.FHIR_BASE_URL}/Patient`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      },
      body: JSON.stringify(fhirPatient),
    });

    if (!fhirResp.ok) {
      const fhirBody = await fhirResp.text();
      console.error('Error creating FHIR Patient:', {
        status: fhirResp.status,
        body: fhirBody
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to create FHIR Patient (${fhirResp.status})`,
          details: fhirBody
        },
        { status: 500 }
      );
    }

    const fhirCreated = await fhirResp.json();
    const fhirPatientId = fhirCreated.id;
    console.log('Created FHIR Patient with ID:', fhirPatientId);

    const insertResult = await query(`
      INSERT INTO app_user (
        username,
        email, 
        auth0_user_id, 
        fhir_patient_id,
        roles, 
        profile_info, 
        created_at, 
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `, [
      username || name || email.split('@')[0], // Generate username from name or email if not provided
      email,
      auth0_id,
      fhirPatientId,
      JSON.stringify(roles), // Convert to JSON string for PostgreSQL
      JSON.stringify(profile_info) // Convert to JSON string for PostgreSQL
    ]);

    const newUser = insertResult.rows[0];

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully',
      isNewUser: true
    });

  } catch (error) {
    console.error('Error syncing user:', error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User with this email already exists',
          details: 'A user with this email is already registered'
        },
        { status: 409 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync user',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}