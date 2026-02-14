# Project Documentation (cleaned)

This repository's documentation has been consolidated and old/duplicated files moved to `doc/archived-md/`.

Quick links and essentials:

- **Quick Start**: Run the frontend and backend

  ```bash
  # Frontend
  npm run dev

  # Backend (from `backend/`)
  cd backend
  npm run dev
  ```

- **Seed test data** (creates admin, leader, 3 members, a project, and tasks):

  ```bash
  cd backend
  npm run seed
  ```

- **Test credentials** (created by seed):
  - Admin: admin@example.com / password123
  - Leader: leader@example.com / password123
  - Members: member1@example.com, member2@example.com, member3@example.com (password123)

- **API base**: `http://localhost:5000/api`
- **Frontend**: `http://localhost:5173`

Where archived docs went:

- `doc/archived-md/` — contains the previous `.md` files (setup guides, design docs, and guides). Review them there if needed.

If you want a different subset kept at `md/`, tell me which files to restore; otherwise I can further trim or rewrite a selected doc into a focused `README.md`.
