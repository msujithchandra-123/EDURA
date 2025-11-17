
import React, { useState } from 'react';
import { api } from '../services/api';
import { Assignment, AssignmentType } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentCreated: (newAssignment: Assignment) => void;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ isOpen, onClose, onAssignmentCreated }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssignmentType>(AssignmentType.HOMEWORK);
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructions || !dueDate) {
      setError('Please fill all required fields.');
      return;
    }
    if (type === AssignmentType.WORKSHEET && !pdfFile) {
        setError('Please upload a PDF for the worksheet.');
        return;
    }

    setError('');
    setIsCreating(true);

    try {
      const newAssignmentData = {
        title,
        type,
        instructions,
        dueDate: new Date(dueDate).toISOString(),
        class: '5', // Mocked
        section: 'A', // Mocked
        pdfFile: type === AssignmentType.WORKSHEET ? pdfFile! : undefined,
      };
      
      const createdAssignment = await api.createAssignment(newAssignmentData);
      onAssignmentCreated(createdAssignment);
      onClose();
      // Reset form
      setTitle('');
      setType(AssignmentType.HOMEWORK);
      setInstructions('');
      setDueDate('');
      setPdfFile(null);
    } catch (err) {
      console.error('Failed to create assignment', err);
      setError('Could not create assignment. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Assignment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <Select label="Type" value={type} onChange={e => setType(e.target.value as AssignmentType)}>
          <option value={AssignmentType.HOMEWORK}>Homework (Video)</option>
          <option value={AssignmentType.WORKSHEET}>Worksheet (from PDF)</option>
        </Select>
        <Textarea label="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} required />
        <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        
        {type === AssignmentType.WORKSHEET && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Worksheet PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            {pdfFile && <p className="mt-2 text-xs text-gray-500">Selected: {pdfFile.name}</p>}
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">The AI will convert this PDF into an interactive web form for students.</p>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <div className="flex justify-end pt-4 space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isCreating}>
            {isCreating ? 'Creating...' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAssignmentModal;
