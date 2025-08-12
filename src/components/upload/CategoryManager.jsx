
import React, { useState, useEffect } from 'react';
import { Category } from '@/api/entities';
import { User } from '@/api/entities'; // Import the User entity
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // Keep this import, as it might be used elsewhere or potentially in the future.
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

export default function CategoryManager({ isOpen, setIsOpen, onUpdate }) {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // New state for current user

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUserAndCategories(); // Call new fetch function
    }
  }, [isOpen]);

  // New function to fetch current user and then user-specific categories
  const fetchCurrentUserAndCategories = async () => {
    setIsLoading(true);
    try {
      const user = await User.me(); // Fetch current user details
      setCurrentUser(user); // Store user in state
      
      // Only fetch categories created by the current user's email
      const fetchedCategories = await Category.filter({ created_by: user.email });
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to load user categories:", error);
      // Optionally handle error visually or set categories to empty
      setCategories([]); 
    }
    setIsLoading(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !currentUser) { // Ensure user is loaded
      // Optionally provide user feedback if currentUser is null
      return; 
    }
    setIsAdding(true);
    try {
      await Category.create({ 
        name: newCategoryName.trim(),
        created_by: currentUser.email // Assign category to the current user
      });
      setNewCategoryName('');
      await fetchCurrentUserAndCategories(); // Re-fetch categories after adding
      onUpdate(); // Notify parent to refetch
    } catch (error) {
      console.error("Failed to create category:", error);
    }
    setIsAdding(false);
  };

  const handleDeleteCategory = async (id) => {
    // Optimistic UI update
    const originalCategories = categories;
    setCategories(prev => prev.filter(cat => cat.id !== id));
    
    try {
      await Category.delete(id);
      onUpdate(); // Notify parent to refetch
    } catch (error) {
      console.error("Failed to delete category", error);
      // Revert if error
      setCategories(originalCategories);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Manage Categories</DialogTitle>
          <DialogDescription>
            Add or remove categories for organizing your documents.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="new-category" className="text-gray-700">Add New Category</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="new-category"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., 'Genomics Data'"
              />
              <button 
                onClick={handleAddCategory} 
                disabled={isAdding || !currentUser} // Disable if adding or user not loaded
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium px-3 py-2 rounded-md transition-colors flex items-center"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Existing Categories</Label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {isLoading ? (
                <div className="text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-orange-600" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-gray-500 text-center">No categories found for this user.</div>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-gray-800">{cat.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      style={{ fontFamily: 'system-ui, sans-serif' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
