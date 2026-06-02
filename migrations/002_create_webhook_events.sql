CREATE TABLE IF NOT EXISTS webhook_events (
  id              VARCHAR(36)  PRIMARY KEY,
  source          VARCHAR(100) NOT NULL,
  idempotency_key VARCHAR(255) UNIQUE,
  payload         JSON         NOT NULL,
  processed       TINYINT(1)   DEFAULT 0,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
);