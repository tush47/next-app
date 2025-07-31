# Backend Integration Guide

This guide explains how to connect your SplitMate frontend to your backend running on localhost:5000.

## Overview

The frontend has been updated to use a real API instead of mock data. It will automatically connect to your backend at `http://localhost:5000` and fall back to mock data if the backend is unavailable.

## Backend Requirements

Your backend should provide the following REST API endpoints:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Groups
- `GET /groups` - Get all groups
- `GET /groups/:id` - Get group by ID
- `POST /groups` - Create new group
- `PUT /groups/:id` - Update group
- `DELETE /groups/:id` - Delete group
- `POST /groups/:id/members` - Add member to group
- `DELETE /groups/:id/members/:userId` - Remove member from group

### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get expense by ID
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /groups/:id/expenses` - Get expenses for a group

### Settlements
- `GET /settlements` - Get all settlements
- `GET /settlements/:id` - Get settlement by ID
- `POST /settlements` - Create new settlement
- `PUT /settlements/:id` - Update settlement
- `DELETE /settlements/:id` - Delete settlement
- `GET /groups/:id/settlements` - Get settlements for a group

### Balances
- `GET /groups/:id/balances` - Get balances for a group
- `GET /groups/:id/summary` - Get group summary

## Data Models

Your backend should return data in the following format:

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string (optional)"
}
```

### Group
```json
{
  "id": "string",
  "name": "string",
  "description": "string (optional)",
  "members": [User],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### Expense
```json
{
  "id": "string",
  "title": "string",
  "amount": "number",
  "paidBy": User,
  "splitBetween": [User],
  "category": "food|transport|accommodation|entertainment|shopping|utilities|other",
  "date": "ISO date string",
  "notes": "string (optional)",
  "groupId": "string"
}
```

### Settlement
```json
{
  "id": "string",
  "fromUser": User,
  "toUser": User,
  "amount": "number",
  "date": "ISO date string",
  "groupId": "string"
}
```

### Balance
```json
{
  "user": User,
  "amount": "number"
}
```

## Configuration

The frontend is configured to connect to `http://localhost:5000` by default. You can change this by:

1. Setting the `NEXT_PUBLIC_API_URL` environment variable
2. Modifying `src/config/api.ts`

## Testing the Connection

1. Start your backend on localhost:5000
2. Start the frontend: `npm run dev`
3. Navigate to `/api-status` to test the connection
4. Check if all endpoints are responding correctly

## Error Handling

The frontend includes comprehensive error handling:

- **Connection failures**: Falls back to mock data
- **API errors**: Shows user-friendly error messages
- **Loading states**: Shows spinners during API calls
- **Retry functionality**: Users can retry failed operations

## CORS Configuration

Make sure your backend has CORS properly configured to allow requests from `http://localhost:3000`:

```javascript
// Example CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Development Tips

1. **Check the API Status page** (`/api-status`) to verify your backend is working
2. **Use browser dev tools** to see network requests and responses
3. **Check the console** for any API errors
4. **Test with mock data first** to ensure the frontend works correctly

## Troubleshooting

### Backend not responding
- Check if your backend is running on port 5000
- Verify CORS is configured correctly
- Check backend logs for errors

### API endpoints not found
- Ensure all required endpoints are implemented
- Check endpoint URLs match exactly
- Verify HTTP methods are correct

### Data format issues
- Ensure your backend returns data in the expected format
- Check date formats (should be ISO strings)
- Verify all required fields are present

### Frontend not updating
- Check browser console for errors
- Verify API responses in Network tab
- Try refreshing the page

## Next Steps

Once your backend is connected:

1. Test creating groups and expenses
2. Verify balances are calculated correctly
3. Test settlements functionality
4. Add any missing features to your backend

The frontend will automatically adapt to your backend's data structure as long as it follows the expected format. 