# Database Schema

## Tables

### enquiries
Main table for storing customer property enquiries.

```sql
CREATE TABLE enquiries (
  id            VARCHAR(36)  PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(30),
  message       TEXT         NOT NULL,
  property_id   VARCHAR(100),
  status        VARCHAR(50)  DEFAULT 'pending',
  dedup_hash    VARCHAR(64)  UNIQUE,
  source_ip     VARCHAR(45),
  crm_synced    TINYINT(1)   DEFAULT 0,
  crm_synced_at DATETIME,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_enquiries_email` — Fast lookup by email
- `idx_enquiries_status` — Filter by status
- `idx_enquiries_created_at` — Sort by date
- `idx_enquiries_property` — Filter by property

### webhook_events
Audit log for all incoming webhooks.

```sql
CREATE TABLE webhook_events (
  id              VARCHAR(36)  PRIMARY KEY,
  source          VARCHAR(100) NOT NULL,
  idempotency_key VARCHAR(255) UNIQUE,
  payload         JSON         NOT NULL,
  processed       TINYINT(1)   DEFAULT 0,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_webhook_idem` — Duplicate prevention via idempotency key

## Query Performance

### Slow Query Examples & Fixes

**Problem**: Fetch enquiry + count all enquiries for pagination
```sql
-- BAD (2 queries)
SELECT * FROM enquiries LIMIT 10 OFFSET 0;
SELECT COUNT(*) FROM enquiries;

-- GOOD (1 query with FOUND_ROWS() or separate optimised count)
SELECT * FROM enquiries LIMIT 10;
SELECT FOUND_ROWS() as total;
```

**Problem**: List enquiries without index
```sql
-- BAD (full table scan)
SELECT * FROM enquiries WHERE status = 'pending';

-- GOOD (uses index)
SELECT * FROM enquiries WHERE status = 'pending' AND created_at DESC LIMIT 10;
```

**Problem**: N+1 on fetching related data
```sql
-- BAD (loop in app, 101 queries)
for each enquiry:
  fetch property from wp_api;

-- GOOD (batch in single query or cached)
batch_fetch_properties([ids]);
```