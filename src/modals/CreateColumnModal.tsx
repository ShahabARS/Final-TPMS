import { useState } from 'react';
import Modal from '../components/Modal';

/**
 * CreateColumnModal Component
 * 
 * Modal for creating a new column in the Kanban board.
 * Allows users to add custom status columns.
 * 
 * React concepts:
 * - Form state management
 * - Adding to parent state array
 */
interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingColumns: string[];
  onCreateColumn: (columnName: string) => void;
}

function CreateColumnModal({
  isOpen,
  onClose,
  existingColumns,
  onCreateColumn,
}: CreateColumnModalProps) {
  const [columnName, setColumnName] = useState('');

  const handleClose = () => {
    setColumnName('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!columnName.trim()) {
      alert('Please enter a column name');
      return;
    }

    // Check if column already exists
    const upperName = columnName.trim().toUpperCase();
    if (existingColumns.includes(upperName)) {
      alert('A column with this name already exists');
      return;
    }

    onCreateColumn(upperName);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Column" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Column Name */}
        <div>
          <label htmlFor="column-name" className="block text-sm font-medium text-gray-700 mb-2">
            Column Name <span className="text-red-500">*</span>
          </label>
          <input
            id="column-name"
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Review, Testing, Blocked"
            required
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">
            Column name will be converted to uppercase (e.g., "review" → "REVIEW")
          </p>
        </div>

        {/* Existing Columns Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Existing Columns:</p>
          <div className="flex flex-wrap gap-2">
            {existingColumns.map((col) => (
              <span
                key={col}
                className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700"
              >
                {col}
              </span>
            ))}
          </div>
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
            className="px-5 py-2.5 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Create Column
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateColumnModal;
