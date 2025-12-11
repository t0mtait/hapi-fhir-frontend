'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Spinner, Alert } from 'flowbite-react';
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
    code: {
        text:  string;
    };

}

export default function Resources() {
    const { user, isAuthenticated, isLoading, logout} = useAuth0();
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchResources();
        }
    }, [isAuthenticated]);


    const fetchResources = async () => {
        try { 
            setLoading(true);
            setError(null);
            const response = await fetch('/api/resources');
            const data = await response.json();
            if (response.ok) {
                setResources(data.resources);
            } else {
                setError(data.error || 'Failed to fetch resources');
            }
        } catch (error) {
            setError('Failed to fetch resources');
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                                Resources
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

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <Alert color="failure" className="mb-6">
                        <span className="font-medium">Error!</span> {error}
                        <Button size="xs" color="gray" onClick={fetchResources} className="ml-4">
                            Retry
                        </Button>
                    </Alert>
                )}

                <div className="bg-white shadow dark:bg-gray-800 rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading resources...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            resource id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            fhir id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            resource type
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            published
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            updated
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {resources.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                No resources found in the database
                                            </td>
                                        </tr>
                                    ) : (
                                        resources.map((resourceData) => (
                                            <tr key={resourceData.res_id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.res_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.fhir_id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {resourceData.res_type}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(resourceData.res_published)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(resourceData.res_updated)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}