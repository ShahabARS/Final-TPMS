curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shahab User",
    "email": "shahab@tpms.com",
    "password": "shahab123",
    "role": "ADMIN"
  }'

  