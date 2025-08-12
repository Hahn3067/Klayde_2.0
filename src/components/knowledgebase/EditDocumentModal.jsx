
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document } from '@/api/entities';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea component

export default function EditDocumentModal({ isOpen, setIsOpen, document, projects, categories, user, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    project_id: null,
    category: '',
    tags: [],
    manual_text: '', // Add manual_text state
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        project_id: document.project_id || null,
        category: document.category || '',
        tags: document.tags || [],
        manual_text: document.manual_text || '', // Populate manual_text
      });
      setError(null);
    }
  }, [document, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTagsChange = (e) => {
    const items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    handleInputChange('tags', items);
  }
  
  const removeTag = (index) => {
    handleInputChange('tags', formData.tags.filter((_, i) => i !== index));
  }

  const handleSave = async () => {
    if (!formData.title) {
      setError("Title cannot be empty.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await Document.update(document.id, {
          title: formData.title,
          project_id: formData.project_id,
          category: formData.category,
          tags: formData.tags,
          manual_text: formData.manual_text, // Save manual_text
      });
      onUpdateSuccess();
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to update document:', err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const visibleProjects = user?.role === 'admin' 
    ? projects 
    : projects.filter(p => p.member_emails?.includes(user?.email));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Edit Document Details</DialogTitle>
          <DialogDescription>
            Make changes to the document's metadata. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="border-gray-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Project</Label>
            <Select
              value={formData.project_id || 'none'}
              onValueChange={(value) => handleInputChange('project_id', value === 'none' ? null : value)}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Assign to a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Public to Lab)</SelectItem>
                {visibleProjects.map(proj => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="e.g., genetics, sequencing"
              className="border-gray-300"
            />
            {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                        {tag}
                        <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 hover:text-red-500"
                        >
                        <X className="w-3 h-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
            )}
          </div>
          
          {/* NEW: Manual Text Input */}
          <div className="space-y-2">
            <Label htmlFor="manual_text">Manual Text Content (Override)</Label>
            <Textarea
              id="manual_text"
              value={formData.manual_text}
              onChange={(e) => handleInputChange('manual_text', e.target.value)}
              placeholder="Paste the document's full text here to ensure accurate search results."
              className="h-40 border-gray-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
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
