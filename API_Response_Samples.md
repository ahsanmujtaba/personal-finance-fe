# API Response Samples

This document provides sample responses for all API endpoints after implementing the standardized ApiResponse helper class. All responses now follow a consistent structure with proper HTTP status codes.

## Response Structure

All API responses follow this standardized format:

```json
{
  "success": boolean,
  "message": "string",
  "data": object|array|null,
  "errors": object|null
}
```

## Authentication Endpoints

### POST /api/register
**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    },
    "token": "1|abc123def456..."
  },
  "errors": null
}
```

**Validation Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### POST /api/login
**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "2|xyz789abc123..."
  },
  "errors": null
}
```

**Invalid Credentials Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null,
  "errors": null
}
```

### POST /api/logout
**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "errors": null
}
```

## Profile Endpoints

### GET /api/profile
**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  },
  "errors": null
}
```

### PUT /api/profile
**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "updated_at": "2024-01-15T11:45:00.000000Z"
  },
  "errors": null
}
```

## Budget Endpoints

### GET /api/budgets
**Success Response (200):**
```json
{
  "success": true,
  "message": "Budgets retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Monthly Budget",
      "total_amount": "2500.00",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "errors": null
}
```

### POST /api/budgets
**Success Response (201):**
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": 2,
    "name": "Vacation Budget",
    "total_amount": "1500.00",
    "start_date": "2024-06-01",
    "end_date": "2024-06-30",
    "user_id": 1,
    "created_at": "2024-01-15T12:00:00.000000Z",
    "updated_at": "2024-01-15T12:00:00.000000Z"
  },
  "errors": null
}
```

### GET /api/budgets/{id}
**Success Response (200):**
```json
{
  "success": true,
  "message": "Budget retrieved successfully",
  "data": {
    "id": 1,
    "name": "Monthly Budget",
    "total_amount": "2500.00",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "user_id": 1,
    "budget_items": [
      {
        "id": 1,
        "category_id": 1,
        "allocated_amount": "500.00",
        "category": {
          "id": 1,
          "name": "Groceries"
        }
      }
    ]
  },
  "errors": null
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "message": "Budget not found",
  "data": null,
  "errors": null
}
```

**Unauthorized Response (403):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "errors": null
}
```

## Category Endpoints

### GET /api/categories
**Success Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Groceries",
      "type": "expense",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "name": "Salary",
      "type": "income",
      "user_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "errors": null
}
```

### POST /api/categories
**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Transportation",
    "type": "expense",
    "user_id": 1,
    "created_at": "2024-01-15T12:30:00.000000Z",
    "updated_at": "2024-01-15T12:30:00.000000Z"
  },
  "errors": null
}
```

**Conflict Response (409):**
```json
{
  "success": false,
  "message": "Category already exists",
  "data": null,
  "errors": null
}
```

## Expense Endpoints

### GET /api/expenses
**Success Response (200):**
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "data": [
    {
      "id": 1,
      "amount": "45.50",
      "description": "Weekly groceries",
      "date": "2024-01-15",
      "category_id": 1,
      "budget_id": 1,
      "user_id": 1,
      "category": {
        "id": 1,
        "name": "Groceries",
        "type": "expense"
      },
      "budget": {
        "id": 1,
        "name": "Monthly Budget"
      }
    }
  ],
  "errors": null
}
```

### POST /api/expenses
**Success Response (201):**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": 2,
    "amount": "25.00",
    "description": "Gas station",
    "date": "2024-01-15",
    "category_id": 3,
    "budget_id": 1,
    "user_id": 1,
    "created_at": "2024-01-15T13:00:00.000000Z",
    "updated_at": "2024-01-15T13:00:00.000000Z"
  },
  "errors": null
}
```

## Income Endpoints

### GET /api/incomes
**Success Response (200):**
```json
{
  "success": true,
  "message": "Incomes retrieved successfully",
  "data": [
    {
      "id": 1,
      "amount": "3000.00",
      "description": "Monthly salary",
      "date": "2024-01-01",
      "category_id": 2,
      "user_id": 1,
      "category": {
        "id": 2,
        "name": "Salary",
        "type": "income"
      }
    }
  ],
  "errors": null
}
```

### POST /api/incomes
**Success Response (201):**
```json
{
  "success": true,
  "message": "Income created successfully",
  "data": {
    "id": 2,
    "amount": "500.00",
    "description": "Freelance work",
    "date": "2024-01-15",
    "category_id": 3,
    "user_id": 1,
    "created_at": "2024-01-15T14:00:00.000000Z",
    "updated_at": "2024-01-15T14:00:00.000000Z"
  },
  "errors": null
}
```

## Report Endpoints

### GET /api/reports/monthly-summary
**Success Response (200):**
```json
{
  "success": true,
  "message": "Monthly summary retrieved successfully",
  "data": {
    "year": 2024,
    "month": 1,
    "total_income": "3500.00",
    "total_expenses": "1250.75",
    "net_income": "2249.25"
  },
  "errors": null
}
```

### GET /api/reports/budget-vs-actual
**Success Response (200):**
```json
{
  "success": true,
  "message": "Budget vs actual report retrieved successfully",
  "data": {
    "budget": {
      "id": 1,
      "name": "Monthly Budget",
      "total_amount": "2500.00"
    },
    "total_spent": "1250.75",
    "remaining": "1249.25",
    "percentage_used": 50.03,
    "categories": [
      {
        "category": "Groceries",
        "allocated": "500.00",
        "spent": "245.50",
        "remaining": "254.50",
        "percentage_used": 49.1
      }
    ]
  },
  "errors": null
}
```

**Budget Not Found Response (404):**
```json
{
  "success": false,
  "message": "Budget not found",
  "data": null,
  "errors": null
}
```

### GET /api/reports/spending-trends
**Success Response (200):**
```json
{
  "success": true,
  "message": "Spending trends retrieved successfully",
  "data": {
    "period": "6months",
    "category": "Groceries",
    "trends": [
      {
        "month": "2023-08",
        "total": "450.25"
      },
      {
        "month": "2023-09",
        "total": "523.75"
      },
      {
        "month": "2023-10",
        "total": "398.50"
      }
    ]
  },
  "errors": null
}
```

### GET /api/reports/dashboard
**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "current_month": {
      "total_income": "3500.00",
      "total_expenses": "1250.75",
      "net_income": "2249.25"
    },
    "recent_transactions": [
      {
        "id": 15,
        "type": "expense",
        "amount": "45.50",
        "description": "Weekly groceries",
        "date": "2024-01-15",
        "category": "Groceries"
      },
      {
        "id": 8,
        "type": "income",
        "amount": "500.00",
        "description": "Freelance work",
        "date": "2024-01-14",
        "category": "Freelance"
      }
    ],
    "active_budgets": [
      {
        "id": 1,
        "name": "Monthly Budget",
        "total_amount": "2500.00",
        "spent": "1250.75",
        "remaining": "1249.25",
        "percentage_used": 50.03
      }
    ]
  },
  "errors": null
}
```

## Common Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "date": ["The date must be a valid date."]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthenticated",
  "data": null,
  "errors": null
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "errors": null
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found",
  "data": null,
  "errors": null
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "An error occurred while processing your request",
  "data": null,
  "errors": null
}
```

## Key Changes for Frontend

1. **Consistent Structure**: All responses now follow the same format with `success`, `message`, `data`, and `errors` fields.

2. **Proper HTTP Status Codes**: 
   - 200: Success (GET, PUT, DELETE)
   - 201: Created (POST)
   - 401: Unauthenticated
   - 403: Forbidden/Unauthorized
   - 404: Not Found
   - 409: Conflict
   - 422: Validation Error
   - 500: Server Error

3. **Success Field**: Always check the `success` boolean field to determine if the request was successful.

4. **Error Handling**: 
   - Validation errors are in the `errors` object with field-specific messages
   - General errors have descriptive messages in the `message` field
   - The `data` field is `null` for error responses

5. **Data Field**: Contains the actual response data for successful requests, can be an object, array, or null.

This standardized format makes it easier to handle responses consistently across the frontend application.