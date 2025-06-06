# Modernize-Angular-pro

Modernize Angular Admin Dashboard

## Contract Management APIs

### Create Contract

- **Endpoint:** `POST /api/v1/contracts`
- **Description:** Create a new contract with items
- **Request Body:** Contract object with items array
- **Example Request:**
  ```json
  {
    "contractId": "HD001",
    "name": "Office Equipment Supply Contract",
    "signDate": "2024-01-10T09:00:00Z",
    "status": "UNLIQUIDATED",
    "items": [
      {
        "itemId": "VT001",
        "name": "A4 Paper",
        "unit": "Ream",
        "quantity": 100,
        "unitPrice": 50.0,
        "total": 5000.0
      }
    ]
  }
  ```
- **Response:** Created contract object
- **Status Code:** 201 (Created)

### Update Contract

- **Endpoint:** `PUT /api/v1/contracts/{id}`
- **Description:** Update contract status
- **Path Parameters:**
  - `id`: Contract ID
- **Request Body:** Contract object with updated status
- **Example Request:**
  ```json
  {
    "id": 1,
    "contractId": "HD001",
    "status": "LIQUIDATED"
  }
  ```
- **Response:** Updated contract object
- **Status Code:** 200 (OK)

### Get All Contracts

- **Endpoint:** `GET /api/v1/contracts`
- **Description:** Get paginated list of contracts
- **Query Parameters:**
  - Supports filtering via @Filter specification
  - Supports pagination parameters
  - `page`: Page number (default: 1)
  - `size`: Items per page (default: 10)
- **Response:**
  ```json
  {
    "meta": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "pages": 10
    },
    "result": [Contract objects]
  }
  ```
- **Status Code:** 200 (OK)

### Get Contract by ID

- **Endpoint:** `GET /api/v1/contracts/{contractId}`
- **Description:** Get contract by contract ID
- **Path Parameters:**
  - `contractId`: Contract ID
- **Response:** Contract object
- **Status Code:** 200 (OK)

### Contract Status

The system supports the following contract statuses:

- UNLIQUIDATED
- LIQUIDATED

// ...existing code...

## Item Management APIs

### Create Item

- **Endpoint:** `POST /api/v1/items`
- **Description:** Create a new item in a contract
- **Request Body:** Item object with contract reference
- **Example Request:**
  ```json
  {
    "itemId": "VT001",
    "name": "A4 Paper",
    "unit": "Ream",
    "quantity": 100,
    "unitPrice": 50.0,
    "total": 5000.0,
    "contract": {
      "contractId": "HD001"
    }
  }
  ```
- **Response:** Created item object
- **Status Code:** 201 (Created)

### Update Item

- **Endpoint:** `PUT /api/v1/items/{id}`
- **Description:** Update an existing item
- **Path Parameters:**
  - `id`: Item ID
- **Request Body:** Item object with updated fields
- **Example Request:**
  ```json
  {
    "id": 1,
    "itemId": "VT001",
    "quantity": 150,
    "unitPrice": 45.0,
    "total": 6750.0
  }
  ```
- **Response:** Updated item object
- **Status Code:** 200 (OK)

### Delete Item

- **Endpoint:** `DELETE /api/v1/items/{id}`
- **Description:** Delete an item by ID
- **Path Parameters:**
  - `id`: Item ID
- **Response:** No content
- **Status Code:** 200 (OK)

### Get All Items

- **Endpoint:** `GET /api/v1/items`
- **Description:** Get paginated list of items
- **Query Parameters:**
  - Supports filtering via @Filter specification
  - Supports pagination parameters
  - `page`: Page number (default: 1)
  - `size`: Items per page (default: 10)
- **Response:**
  ```json
  {
    "meta": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "pages": 10
    },
    "result": [Item objects]
  }
  ```
- **Status Code:** 200 (OK)

### Get Item by ID

- **Endpoint:** `GET /api/v1/items/{itemId}`
- **Description:** Get item by item ID
- **Path Parameters:**
  - `itemId`: Item ID
- **Response:** Item object
- **Status Code:** 200 (OK)
