import { format } from "path";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";


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
    res_ver: string;
}

export async function GET(request: NextRequest) {
    try {
        const result = await query(`
            SELECT * from hfj_resource`);
        const resources: Resource[] = result.rows;

        return NextResponse.json({
            success: true,
            resources,
            count: resources.length
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown database error';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch resources',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
