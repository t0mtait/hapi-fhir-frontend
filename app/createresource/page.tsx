'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, TextInput, Label, Checkbox, Dropdown, DropdownItem, Spinner} from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Resource {
    res_id: string;
    partition_id: string | null;
    res_deleted_at: string | null;
    res_version: number;
    has_tags: boolean;
    res_published: string;
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

export default function CreateResource() {
    const { user, isAuthenticated, isLoading, logout} = useAuth0();
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            }
        })
    };

    if (isLoading) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <Spinner size="xl" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
                    </div>
                </div>
            );
        }
        if (!isAuthenticated) {
            return null; // Will redirect via useEffect
        }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
            <header className="bg-white shadow dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Create FHIR Resource
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                {user?.picture && (
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={user.picture}
                                        alt={user.name || 'User'}
                                    />
                                )}
                                <span className="text-gray-900 dark:text-white">
                                    {user?.name || user?.email}
                                </span>
                            </div>
                            <Button 
                                color="blue" 
                                onClick={() => router.push('/')}
                                className="mr-2"
                            >
                                Dashboard
                            </Button>
                            <Button color="gray" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                <form className="flex max-w-md flex-col gap-4">
                <div>
                    <Dropdown label="Resource Type">
                    <DropdownItem>Patient</DropdownItem>
                    <DropdownItem>Observation</DropdownItem>
                    <DropdownItem>Encounter</DropdownItem>
                    <DropdownItem>Practitioner</DropdownItem>
                    <DropdownItem>Medication</DropdownItem>
                    <DropdownItem>AllergyIntolerance</DropdownItem>
                    <DropdownItem>Condition</DropdownItem>
                    <DropdownItem>Procedure</DropdownItem>
                    <DropdownItem>Immunization</DropdownItem>
                    <DropdownItem>DiagnosticReport</DropdownItem>
                    </Dropdown>
                </div>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="email1">Your email</Label>
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
                </div>
                <div>
                    <div className="mb-2 block">
                    <Label htmlFor="password1">Your password</Label>
                    </div>
                    <TextInput id="password1" type="password" required />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button type="submit">Submit</Button>
                </form>
            </main>
    </div>
  );
}