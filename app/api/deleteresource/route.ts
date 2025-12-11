import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest) {
  try {
    const resource = await req.json();
    
    const fhirUrl = `${process.env.FHIR_BASE_URL}/${resource.resourceType}/${resource.id}`;
    
    const resp = await fetch(fhirUrl, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      }
    });

    const responseBody = await resp.text();

    if (!resp.ok) {
      console.error('FHIR server error:', {
        status: resp.status,
        statusText: resp.statusText,
        body: responseBody,
        url: fhirUrl
      });

      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to delete resource (${resp.status})`,
          details: responseBody,
          fhirUrl: fhirUrl
        },
        { status: resp.status }
      );
    }

    const created = JSON.parse(responseBody);
    return NextResponse.json(
      { success: true, resource: created },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting resource:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
