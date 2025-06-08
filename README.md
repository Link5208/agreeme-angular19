# Modernize-Angular-pro

Modernize Angular Admin Dashboard

## Contract Management APIs

### Create Contract

#### Endpoint

- **URL:** `/api/v1/contracts`
- **Method:** `POST`
- **Description:** Create a new contract with items and optional file attachments

#### Request

- **Content-Type:** `multipart/form-data`

##### Request Body

```json
{
  "contractId": "HD001",
  "name": "Contract Name",
  "signDate": "2024-01-10 09:00:00",
  "items": [
    {
      "itemId": "IT001",
      "name": "Item Name",
      "unit": "Piece",
      "quantity": 100,
      "unitPrice": 50.0
    }
  ]
}
```

##### Files Upload

- **Parameter Name:** `files`
- **Required:** No
- **Type:** `List<MultipartFile>`
- **Allowed Extensions:** pdf, jpg, jpeg, png, doc, docx

#### Response

- **Status Code:** 201 (Created)
- **Content-Type:** `application/json`
- **Body:** Created Contract object

#### Error Responses

- `400 Bad Request`: Invalid contract data
- `409 Conflict`: Contract ID already exists
- `415 Unsupported Media Type`: Invalid file type
- `500 Internal Server Error`: Server processing error

#### Example Using Postman

```http
POST /api/v1/contracts
Content-Type: multipart/form-data

// Form Data
contract: { ... contract JSON ... }
files: [file1.pdf, file2.jpg]
```

#### Notes

- Contract ID must be unique
- Files will be stored and linked to the contract
- All operations are transactional
- Contract status will be set to UNLIQUIDATED by default
- Each file will be assigned a unique ID based on contract ID and timestamp

### Update Contract

- **Endpoint:** `PUT /api/v1/contracts`
- **Description:** Update contract status
- **Request Body:** Contract object with updated status
- **Example Request:**
  ```json
  {
    "id": 1,
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

### Delete Contract

- **Endpoint:** `DELETE /api/v1/contracts/{id}`
- **Description:** Delete a contract by ID
- **Path Parameters:**
  - `id`: Contract ID (long)
- **Response:** No content
- **Status Code:** 200 (OK)
- **Error Responses:**
  - `404 Not Found`: If contract with given ID doesn't exist
  - `400 Bad Request`: If ID is invalid
- **Example Request:**
  ```bash
  DELETE /api/v1/contracts/1
  ```

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
    "price": 50.0,
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
    "price": 45.0,
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

## Authentication APIs

### Register User

- **Endpoint:** `POST /api/v1/auth/register`
- **Description:** Register a new user
- **Request Body:** User object
- **Example Request:**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "123456"
  }
  ```
- **Response:** Created user object
- **Status Code:** 201 (Created)

### Login

- **Endpoint:** `POST /api/v1/auth/login`
- **Description:** Authenticate user and get tokens
- **Request Body:** Login credentials
- **Example Request:**
  ```json
  {
    "username": "admin@gmail.com",
    "password": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "admin@gmail.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Cookie Set:** HTTP-only secure cookie with refresh token
- **Status Code:** 200 (OK)

### Get Account

- **Endpoint:** `GET /api/v1/auth/account`
- **Description:** Get current user account details
- **Headers Required:** Bearer token
- **Response:** User account details
- **Status Code:** 200 (OK)

### Refresh Token

- **Endpoint:** `GET /api/v1/auth/refresh`
- **Description:** Get new access token using refresh token
- **Cookie Required:** refresh_token
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "email": "admin@gmail.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
  ```
- **Cookie Set:** New HTTP-only secure cookie with refresh token
- **Status Code:** 200 (OK)

### Logout

- **Endpoint:** `POST /api/v1/auth/logout`
- **Description:** Logout user and invalidate tokens
- **Headers Required:** Bearer token
- **Response:** No content
- **Cookie Set:** Clears refresh_token cookie
- **Status Code:** 200 (OK)
