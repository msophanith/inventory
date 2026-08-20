import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { Product } from '../../../services/product';
import { useProductStore } from '../store/use-product-store';

export function useProductTable(products: Product[]) {
  const sorting = useProductStore((state) => state.sorting);
  const setSorting = useProductStore((state) => state.setSorting);
  
  const pagination = useProductStore((state) => state.pagination);
  const setPagination = useProductStore((state) => state.setPagination);

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