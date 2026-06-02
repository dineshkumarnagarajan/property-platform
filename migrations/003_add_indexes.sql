CREATE INDEX idx_enquiries_email      ON enquiries(email);
CREATE INDEX idx_enquiries_status     ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_enquiries_property   ON enquiries(property_id);
CREATE INDEX idx_webhook_idem         ON webhook_events(idempotency_key);