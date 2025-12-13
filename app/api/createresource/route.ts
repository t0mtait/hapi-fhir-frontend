import { NextRequest, NextResponse } from "next/server";

export interface Resource {
    res_id: string;
    partition_id: string | null;
    res_deleted_at: string | null;
    res_version: number;
    has_tags: boolean;
    res_published: boolean;
    res_updated: string;
    fhir_id: string;
    sp_has_links: boolean;
    hash_sha256: string;
    sp_index_status: number;
    res_language: string | null;
    sp_cmpstr_uniq_present: boolean;
    sp_cmptoks_present: boolean;
    sp_coords_present: boolean;
    sp_date_present: boolean;
    sp_number_present: boolean;
    sp_quantity_nrml_present: boolean;
    sp_quantity_present: boolean;
    sp_string_present: boolean;
    sp_token_present: boolean;
    sp_uri_present: boolean;
    partition_date: string | null;
    res_type: string;
    res_type_id : number;
    search_url_present: boolean;
    res_ver: number;
}

export async function POST(req: NextRequest) {
  try {
    const resource = await req.json();
    
  
    // Validate that resource has required FHIR fields
    if (!resource.resourceType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid FHIR resource', 
          details: 'Missing required field: resourceType' 
        },
        { status: 400 }
      );
    }

    console.log('Creating resource:', {
      resourceType: resource.resourceType,
      baseUrl: process.env.FHIR_BASE_URL,
      resource: JSON.stringify(resource)
    });

    const fhirUrl = `${process.env.FHIR_BASE_URL}/${resource.resourceType}`;
    
    const resp = await fetch(fhirUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      },
      body: JSON.stringify(resource),
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
          error: `Failed to create resource (${resp.status})`,
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
    console.error('Error creating resource:', errorMessage);
    
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
