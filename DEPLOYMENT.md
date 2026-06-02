# Deployment Guide

## Local Development
All setup is in `docker-compose.yml`. Just run:
```bash
docker-compose up -d
pnpm migrate
pnpm dev
pnpm workers
```

## Production Deployment (VPS)

### Prerequisites
- Ubuntu 22.04 LTS VPS (DigitalOcean, Hetzner, etc.)
- Domain name with DNS pointing to VPS IP
- SSH access

### Step 1: VPS Setup
```bash
ssh root@<vps-ip>

# Create deploy user
adduser --disabled-password deploy
usermod -aG sudo deploy

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo bash get-docker.sh
sudo usermod -aG docker deploy

# Install Nginx, Certbot
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx

# Setup firewall
sudo ufw allow 22,80,443
sudo ufw enable
```

### Step 2: Deploy App
```bash
su - deploy
mkdir -p /srv/property-platform
cd /srv/property-platform

git clone <repo> .
cp .env.example .env
# Edit .env with production values

docker-compose -f docker-compose.prod.yml up -d
docker exec app npx knex migrate:latest
```

### Step 3: SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com
```

### Step 4: Verify
```bash
curl https://yourdomain.com/health
```

See `docker-compose.prod.yml` for production Compose config.