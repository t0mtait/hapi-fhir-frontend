'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, Spinner, Alert, DarkThemeToggle, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MedicationStatement {
  id: number;
  supplement: string;
  
  dosage: { timing: { repeat: { frequency: string; periodUnit: string } } }[];
  medicationReference: { reference: string };
  meta: { lastUpdated: string };
  status: string;


}

export default function Stack() {
      const { user, isAuthenticated, isLoading, logout } = useAuth0();
      const router = useRouter();
      const [medicationStatements, setMedicationStatements] = useState<MedicationStatement[]>([]);
      const [error, setError] = useState<string | null>(null);

  useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMedicationStatements ();
        }
    }, [isAuthenticated]);

    const fetchMedicationStatements = async () => {
        try {
            const response = await fetch('/api/medicationstatement');
            const data = await response.json();
            
            if (data.success) {
                setMedicationStatements(data.resources);

                console.log("Fetched medication statements:", data.resources);
            } else {
                setError(data.error || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Network error: Unable to fetch users');
            console.error('Error fetching users:', err);
        } finally {
        }
    };

  return (
    <div className="overflow-x-auto py-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Statement ID</TableHeadCell>
            <TableHeadCell>Frequency</TableHeadCell>
            <TableHeadCell>Medication</TableHeadCell>
            <TableHeadCell>Last Updated</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {medicationStatements.map((medication) => (
            <TableRow key={medication.id}>
              <TableCell>{medication.id}</TableCell>
              <TableCell>{medication.dosage[0].timing.repeat.frequency} / {medication.dosage[0].timing.repeat.periodUnit.toUpperCase()}</TableCell>
              <TableCell>{medication.medicationReference.reference}</TableCell>
              <TableCell>{new Date(medication.meta.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell>{medication.status}</TableCell>
              <TableCell>
                <a href={`/medication/${medication.id}`}>
                  <Button color="blue" size="sm">View</Button>
                </a>
              </TableCell>
            </TableRow>
          ))}
          {error && (
            <TableRow>
              <TableCell colSpan={5}>
                <Alert color="failure">{error}</Alert>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


