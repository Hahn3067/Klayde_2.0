
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LabInfo } from '@/api/entities';
import { Loader2 } from 'lucide-react';

export default function EditLabInfoModal({ isOpen, setIsOpen, labInfo, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (labInfo && isOpen) {
      setName(labInfo.lab_name);
      setDescription(labInfo.lab_description);
      setError(null);
    }
  }, [labInfo, isOpen]);

  const handleSave = async () => {
    if (!name) {
      setError("Lab Name cannot be empty.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const updatedInfo = await LabInfo.update(labInfo.id, {
        lab_name: name,
        lab_description: description,
      });
      onSave(updatedInfo);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update lab info:', error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Edit Lab Information</DialogTitle>
          <DialogDescription>
            Update the name and description for your lab. This will be visible to all members.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lab-name" className="text-right text-gray-700">
              Lab Name
            </Label>
            <Input
              id="lab-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lab-description" className="text-right pt-2 text-gray-700">
              Description
            </Label>
            <Textarea
              id="lab-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
          {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="text-base">
            Cancel
          </Button>
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-md transition-colors text-base flex items-center"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
