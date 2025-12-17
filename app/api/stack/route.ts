import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    try {
        const user_email = request.headers.get('user_email');
        const medId = request.headers.get('id');
        const response = await fetch(`http://localhost:3000/api/users?email=${user_email}`);
        const data = await response.json();
        if (data.success && data.users.length > 0) {
            const fhir_patient_id = data.users[0].fhir_patient_id;
            const resource = {
            resourceType: 'MedicationStatement',
            id: medId || 'generated-id',
            subject: 'Reference/Patient/' + fhir_patient_id,
            status: 'active',
            medicationReference: { "reference": "Medication/" + medId },
            dosage: [
              {
                "text": "5 g once daily",
                "timing": { "repeat": { "frequency": 1, "period": 1, "periodUnit": "d" } },
                "doseAndRate": [
                  {
                    "doseQuantity": {
                      "value": 5,
                      "unit": "g",
                      "system": "http://unitsofmeasure.org",
                      "code": "g"
                    }
                  }
                ]
              }
            ]
        }
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
        else {
          console.log('FHIR server response:', {
            status: resp.status,
            body: responseBody,
            url: fhirUrl
          } );
        }
        const created = JSON.parse(responseBody);
        return NextResponse.json(
            { success: true, resource: created },
            { status: 201 }
        );
        }
        else {
            console.error('User not found for email:', user_email);
            console.log('Response data:', data);
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'User not found' 
                },
                { status: 404 }
            );
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                success: false,
                error: 'Error creating resource',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}