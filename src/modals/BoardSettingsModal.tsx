import { useState } from 'react';
import type { Project } from '../types';
import Modal from '../components/Modal';

/**
 * BoardSettingsModal Component
 * 
 * Modal for editing board/project settings.
 * Allows Team Leader to update project name and description.
 * 
 * React concepts:
 * - Form state management
 * - Updating parent state via callback
 */
interface BoardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
}

function BoardSettingsModal({
  isOpen,
  onClose,
  project,
  onUpdateProject,
}: BoardSettingsModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Initialize form when modal opens
  if (isOpen && project && (!name || name !== project.name)) {
    setName(project.name);
    setDescription(project.description);
  }

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    if (!name.trim()) {
      alert('Project name is required');
      return;
    }

    onUpdateProject(project.projectId, {
      name: name.trim(),
      description: description.trim(),
    });

    handleClose();
  };

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Board Settings" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project name"
            required
            autoFocus
          />
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Enter project description"
          />
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Only Team Leaders can modify board settings.
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default BoardSettingsModal;
