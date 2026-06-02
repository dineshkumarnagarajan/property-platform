# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `N/A`

## Authentication
Currently no auth required. JWT support ready for future.

## Endpoints

### POST /api/enquiry
Create a new property enquiry.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in this 2-bedroom apartment",
  "property_id": "prop_123"
}
```

**Response (201 Created):**
```json
{
  "id": "f38ef3bd-da8b-48db-9d74-6f56aa44afbb",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in this 2-bedroom apartment",
  "property_id": "prop_123",
  "status": "pending",
  "created_at": "2026-06-02T10:52:45.000Z"
}
```

**Errors:**
- `400` — Validation failed (invalid email, short message, etc.)
- `409` — Duplicate enquiry detected (same email + phone + message within 10 seconds)
- `429` — Rate limit exceeded (20 requests per 15 minutes per IP)

---

### GET /api/enquiry/:id
Fetch a single enquiry by ID.

**Response (200 OK):**
```json
{
  "id": "f38ef3bd-da8b-48db-9d74-6f56aa44afbb",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "pending",
  "created_at": "2026-06-02T10:52:45.000Z"
}
```

**Errors:**
- `404` — Enquiry not found

---

### GET /api/enquiry
List all enquiries (paginated).

**Query Parameters:**
- `page` — Page number (default: 1)
- `limit` — Results per page (default: 10, max: 50)
- `status` — Filter by status: `pending`, `contacted`, `closed`

**Response (200 OK):**
```json
{
  "rows": [...],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

### POST /api/webhook/crm
Receive webhook from CRM system.

**Headers:**
- `X-Hub-Signature` — HMAC-SHA256 signature of payload
- `X-Idempotency-Key` — Unique key for duplicate prevention

**Request:**
```json
{
  "event": "enquiry.contacted",
  "enquiry_id": "f38ef3bd-da8b-48db-9d74-6f56aa44afbb",
  "crm_id": "crm_123",
  "status": "contacted"
}
```

**Response (202 Accepted):**
```json
{
  "id": "d0450549-8cb7-40ea-aa96-37452b735c1e",
  "message": "Webhook received"
}
```

**Errors:**
- `401` — Invalid HMAC signature
- `409` — Duplicate webhook (already processed with same idempotency key)

---

### GET /api/properties
Fetch properties from WordPress headless CMS.

**Query Parameters:**
- `page` — Page number (default: 1)

**Response (200 OK):**
```json
{
  "posts": {
    "edges": [
      {
        "node": {
          "id": "cG9zdDoxMDMx",
          "title": "Tiled Gallery",
          "content": "<p>Property details...</p>"
        }
      }
    ],
    "pageInfo": {
      "hasNextPage": true,
      "endCursor": "cursor123"
    }
  }
}
```

**Caching:** Results cached for 5 minutes in Redis

---

## Error Handling

All errors return JSON:
```json
{
  "error": "Error message here",
  "details": [...] // Only in development
}
```

In production, stack traces are never exposed. Errors logged to `logs/error.log`.

## Rate Limits

- POST /api/enquiry: 20 requests per 15 minutes per IP
- Other endpoints: No limit (add as needed)

Hitting limit returns `429 Too Many Requests`.

## Caching

- GET /api/enquiry/:id — 60 seconds
- GET /api/enquiry — 30 seconds
- GET /api/properties — 300 seconds

Invalidation:
- Update enquiry → clear single key
- WordPress publish → clear all WP cache