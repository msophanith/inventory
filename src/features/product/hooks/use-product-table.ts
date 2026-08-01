import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import type { Product } from '../../../services/product';

export function useProductTable(products: Product[]) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "barcode",
        header: "Barcode",
      },
      {
        accessorKey: "name",
        header: "Product",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "quantity",
        header: "Stock",
      },
      {
        accessorKey: "buyPrice",
        header: "Buy Price",
        cell: ({ row }) =>
          `$${row.original.buyPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
      },
      {
        accessorKey: "sellPrice",
        header: "Sell Price",
        cell: ({ row }) =>
          `$${row.original.sellPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`,
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return table;
}