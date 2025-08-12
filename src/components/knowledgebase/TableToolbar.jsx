import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TableToolbar({ 
  filter, 
  onFilterChange, 
  totalCount, 
  filteredCount,
  selectedIds,
  onDelete
}) {
  const numSelected = selectedIds.length;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4 min-h-[40px]">
        {numSelected > 0 ? (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({numSelected})
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">All Documents</h3>
            <span className="text-sm text-gray-500">
              Showing {filteredCount || 0} of {totalCount || 0}
            </span>
          </div>
        )}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Filter documents..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-9 w-64 border-gray-300 focus:border-orange-500"
        />
      </div>
    </div>
  );
}