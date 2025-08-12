import React, { useState, useEffect } from 'react';
import { Project } from '@/api/entities';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ManageMembersModal({ isOpen, setIsOpen, project, allUsers, onMembersUpdated }) {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setSelectedEmails(project.member_emails || []);
    }
  }, [project]);

  const handleCheckboxChange = (email, checked) => {
    setSelectedEmails(prev =>
      checked ? [...prev, email] : prev.filter(e => e !== email)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Project.update(project.id, { member_emails: selectedEmails });
      onMembersUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update members:', error);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Manage Members for "{project.name}"</DialogTitle>
          <DialogDescription>
            Select which lab members should have access to this project.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Label>Lab Members</Label>
            <ScrollArea className="h-64 mt-2 border rounded-md p-4">
                <div className="space-y-4">
                    {allUsers.map(user => (
                        <div key={user.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={`user-${user.id}`}
                                checked={selectedEmails.includes(user.email)}
                                onCheckedChange={(checked) => handleCheckboxChange(user.email, checked)}
                            />
                            <label htmlFor={`user-${user.id}`} className="text-sm font-medium leading-none text-gray-800">
                                {user.full_name}
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}