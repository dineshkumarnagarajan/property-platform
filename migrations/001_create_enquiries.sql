CREATE TABLE IF NOT EXISTS enquiries (
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