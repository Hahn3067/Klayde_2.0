import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown } from "lucide-react";

export default function MultiSelectFilter({
  options = [],
  selectedValues = [],
  onSelectionChange,
  placeholder = "Select...",
  label,
  icon: Icon
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(val => val !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const filteredOptions = search
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Button
        variant="outline"
        className="w-full justify-between h-10 border-gray-300 bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2 text-gray-600">
            {Icon && <Icon className="w-4 h-4" />}
            {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div className="absolute top-full w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <div className="p-2 border-b">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="py-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-800">{option.label}</span>
                </div>
              ))
            ) : (
                <div className="px-3 py-2 text-sm text-gray-500">No options found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}