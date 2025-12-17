
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

export function Stack() {
  return (
    <div className="overflow-x-auto py-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Supplement</TableHeadCell>
            <TableHeadCell>Dose</TableHeadCell>
            <TableHeadCell>Frequency</TableHeadCell>
            <TableHeadCell>Start Date</TableHeadCell>
            
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Creatine Monohydrate
            </TableCell>
            <TableCell>5,000mg</TableCell>
            <TableCell>Daily</TableCell>
            <TableCell>2021/07/15</TableCell>
            <TableCell>
              <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Vitamin D3
            </TableCell>
            <TableCell>5,000 IU</TableCell>
            <TableCell>Daily</TableCell>
            <TableCell>2024/09/20</TableCell>
            <TableCell>
              <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">Omega-3 Fish Oil</TableCell>
            <TableCell>6,000mg</TableCell>
            <TableCell>Daily</TableCell>
            <TableCell>2025/05/12</TableCell>
            <TableCell>
              <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
