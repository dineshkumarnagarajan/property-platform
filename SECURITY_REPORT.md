# Security Assessment Report

## Vulnerabilities Identified

| # | Vulnerability | OWASP | Severity | File | PoC | Fix |
|---|---|---|---|---|---|---|
| 1 | SQL Injection via input fields | A03:2021 Injection | CRITICAL | enquiry.repository.ts | Inject `' OR 1=1 --` in email field | Use knex parameterised queries (already done) |
| 2 | Missing rate limiting on POST /api/enquiry | A05:2021 Security Misc | HIGH | enquiry.routes.ts | 100 rapid POST requests from same IP | express-rate-limit middleware (already done) |
| 3 | Webhook signature not verified | A07:2021 Auth Failures | HIGH | webhook.routes.ts | Send webhook without X-Hub-Signature | HMAC-SHA256 signature verification (already done) |
| 4 | Verbose error messages leak stack traces | A05:2021 Security Misc | HIGH | middleware/errorHandler.ts | Trigger 500 error, read response | Return generic message in production (already done) |
| 5 | No HTTPS in development | A02:2021 Cryptographic | MEDIUM | nginx.conf | Network traffic sniffing | Let's Encrypt in production, dev uses HTTP (acceptable) |
| 6 | Sensitive fields in API response | A01:2021 Broken Access | MEDIUM | enquiry.controller.ts | Fetch enquiry, see dedup_hash and source_ip | Never expose in API responses via DTO layer |
| 7 | JWT secret in .env not rotated | A02:2021 Cryptographic | MEDIUM | .env | Read .env from deployed server | Use secrets manager (AWS Secrets Manager, HashiCorp Vault) in production |
| 8 | Idempotency key not validated | A05:2021 Security Misc | LOW | webhook.routes.ts | Send empty idempotency key | Reject if not UUID format |

## Mitigations Implemented

✅ **Parameterised queries** — All DB queries use knex, no string concatenation  
✅ **Rate limiting** — Redis-backed sliding window on POST /api/enquiry  
✅ **HMAC signature verification** — timingSafeEqual prevents timing attacks  
✅ **Error sanitisation** — NODE_ENV=production suppresses stack traces  
✅ **Input validation** — Zod schema validation on all requests  
✅ **Helmet security headers** — CSP, X-Frame-Options, X-Content-Type-Options set  

## Testing Threat Scenarios

### Scenario 1: Flood with fake enquiries
**Attack**: Automated script sends 1000 POST requests in 1 minute  
**Defense**: Rate limiter blocks after 20 requests per 15 minutes per IP  
**Mitigation**: Implement CAPTCHA on frontend, IP blocklist via Nginx fail2ban  

### Scenario 2: Webhook injection
**Attack**: Send POST /api/webhook/crm with malicious JSON payload  
**Defense**: HMAC-SHA256 signature required, invalid signature rejected with 401  
**Mitigation**: Payload size limit (512KB), strict Zod parsing  

### Scenario 3: DDoS / API overload
**Attack**: Flood from botnet across multiple IPs  
**Defense**: Nginx rate limiting, PM2 cluster mode distributes load  
**Mitigation**: Cloudflare DDoS protection in production, horizontal scaling  

### Scenario 4: Info leak from errors
**Attack**: Trigger 500 error, read stack trace in response  
**Defense**: NODE_ENV=production returns `{error: 'Internal server error'}`  
**Mitigation**: Centralized error logging to ELK stack, no errors in response body  

### Scenario 5: SQL injection via message field
**Attack**: message = `"; DROP TABLE enquiries; --`  
**Defense**: Knex parameterised queries prevent SQL injection  
**Mitigation**: Never use raw() or concatenation, always use parameterised queries