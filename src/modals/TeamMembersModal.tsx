import type { User } from '../types';
import { Role } from '../types';
import Modal from '../components/Modal';

/**
 * TeamMembersModal Component
 * 
 * Modal for viewing team members.
 * Shows list of users with their roles.
 * 
 * React concepts:
 * - Rendering lists with .map()
 * - Conditional rendering based on role
 */
interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  currentUserRole?: Role;
}

function TeamMembersModal({
  isOpen,
  onClose,
  members,
  currentUserRole,
}: TeamMembersModalProps) {
  // Get role badge color
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-100 text-red-800';
      case Role.LEADER:
        return 'bg-blue-100 text-blue-800';
      case Role.MEMBER:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Members" size="md">
      <div className="space-y-4">
        {/* Info Message */}
        {currentUserRole === Role.ADMIN && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Admin View:</strong> You can manage users from the admin panel.
            </p>
          </div>
        )}

        {/* Members List */}
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No team members found.</p>
            <p className="text-sm mt-2">Add members to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default TeamMembersModal;
