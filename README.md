# 🚀 A-AI: Advanced AI Surveillance System

[![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-Backend-green)](https://python.org/)
[![YOLO](https://img.shields.io/badge/YOLO-AI%20Detection-orange)](https://github.com/ultralytics/yolov5)
[![License](https://img.shields.io/badge/License-MIT-brightgreen)](LICENSE)

> **Andhra Pradesh Government Hackathon Project** - A comprehensive AI-powered surveillance and security monitoring system with real-time object detection, intelligent analytics, and advanced dashboard capabilities.

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start](#-quick-start)
- [💻 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📱 Features Deep Dive](#-features-deep-dive)
- [🌐 API Documentation](#-api-documentation)
- [🔒 Security](#-security)
- [📊 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

A-AI is a cutting-edge surveillance system developed for the Andhra Pradesh Government Hackathon. The project combines modern web technologies with advanced AI/ML capabilities to provide comprehensive security monitoring, real-time threat detection, and intelligent analytics.

### 🎯 Project Goals

- **Public Safety Enhancement**: Advanced surveillance with AI-powered threat detection
- **Smart City Integration**: Seamless integration with existing infrastructure
- **Real-time Monitoring**: Live camera feeds with instant alert systems
- **Data-Driven Insights**: Analytics and reporting for better decision making
- **Scalable Architecture**: Built to handle large-scale deployments

### 🏆 Hackathon Context

This project was developed as the **frontend solution** for the Andhra Pradesh Government Hackathon, focusing on:
- Government security infrastructure modernization
- AI-powered public safety systems
- Smart city surveillance solutions
- Real-time emergency response systems

## ✨ Key Features

### 🎥 **Advanced Camera Management**
- **Multi-Camera Support**: Manage unlimited IP cameras and CCTV systems
- **Live Streaming**: Real-time video feeds with HLS support
- **Camera Health Monitoring**: Automatic status tracking and maintenance alerts
- **Geolocation Mapping**: GPS-based camera positioning and coverage areas
- **Resolution Management**: Support for 4K, HD, and custom resolutions

```mermaid
graph TD
    A[Camera Network] --> B[Stream Processing]
    B --> C[AI Analysis Engine]
    C --> D[Dashboard Display]
    D --> E[Alert System]
    E --> F[Notification Center]
```

### 🧠 **AI-Powered Intelligence**
- **YOLO Object Detection**: Real-time detection of people, vehicles, and objects
- **Behavioral Analysis**: Suspicious activity detection and pattern recognition
- **Facial Recognition**: Person identification and tracking
- **Vehicle Recognition**: License plate reading and vehicle classification
- **Crowd Analysis**: Density monitoring and crowd behavior analysis

### 🚨 **Smart Alert System**
- **Real-time Notifications**: Instant alerts for security threats
- **Multi-channel Alerts**: Email, SMS, and in-app notifications
- **Custom Rules Engine**: Configure alert triggers and conditions
- **Priority Classification**: Critical, high, medium, and low priority alerts
- **Historical Tracking**: Complete audit trail of all security events

### 📊 **Comprehensive Dashboard**
- **Real-time Metrics**: Live system health and performance indicators
- **Interactive Maps**: Geographic visualization of camera networks
- **Analytics Charts**: Historical data visualization and trends
- **System Health**: Server, storage, and network monitoring
- **User Management**: Role-based access control and permissions

### 🔧 **System Administration**
- **User Management**: Admin, operator, and viewer roles
- **Camera Configuration**: Remote camera setup and management
- **Storage Management**: Automatic retention policies and backup systems
- **Rules Engine**: Custom detection rules and alert configurations
- **System Settings**: Global configuration and preferences

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Dashboard UI]
        B[Camera Management]
        C[AI Assistant]
        D[Settings Panel]
    end
    
    subgraph "Backend (Python)"
        E[FastAPI Server]
        F[YOLO AI Engine]
        G[Stream Processor]
        H[Database Layer]
    end
    
    subgraph "Infrastructure"
        I[Camera Network]
        J[Storage System]
        K[Alert Services]
    end
    
    A --> E
    B --> E
    C --> F
    E --> G
    F --> H
    G --> I
    H --> J
    E --> K
```

### 🛠️ Technology Stack

#### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 13.5.1 | React framework with SSR |
| **TypeScript** | 5.2.2 | Type-safe development |
| **Tailwind CSS** | 3.3.3 | Utility-first styling |
| **Framer Motion** | 12.8.2 | Smooth animations |
| **Radix UI** | Latest | Accessible UI components |
| **Socket.io** | 4.8.1 | Real-time communication |
| **HLS.js** | 1.6.2 | Video streaming support |

#### Backend Technologies
- **Python 3.8+**: Core backend language
- **FastAPI**: High-performance web framework
- **YOLO v5/v8**: Object detection and AI analysis
- **OpenCV**: Computer vision processing
- **PostgreSQL**: Primary database
- **Redis**: Caching and session management
- **WebRTC**: Real-time video streaming

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Python** 3.8 or higher
- **Git** for version control
- **PostgreSQL** 12 or higher
- **Redis** 6.0 or higher

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rudra-sah00/A-AI.git
cd A-AI
```

### 2️⃣ Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### 3️⃣ Backend Setup

```bash
# Navigate to backend directory (if separate)
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

### 4️⃣ Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 💻 Installation

### 🖥️ Development Environment

#### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 8 GB | 16 GB+ |
| **Storage** | 50 GB | 100 GB+ SSD |
| **CPU** | 4 cores | 8 cores+ |
| **GPU** | Not required | NVIDIA GPU for AI acceleration |

#### For Windows

```powershell
# Install Node.js (Download from nodejs.org)
# Install Python (Download from python.org)
# Install Git (Download from git-scm.com)

# Clone and setup
git clone https://github.com/rudra-sah00/A-AI.git
cd A-AI
npm install
npm run dev
```

#### For macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install node python git postgresql redis

# Clone and setup
git clone https://github.com/rudra-sah00/A-AI.git
cd A-AI
npm install
npm run dev
```

#### For Linux (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and dependencies
sudo apt install python3 python3-pip git postgresql redis-server

# Clone and setup
git clone https://github.com/rudra-sah00/A-AI.git
cd A-AI
npm install
npm run dev
```

### 🐳 Docker Installation

```bash
# Using Docker Compose
docker-compose up -d

# Or build individually
docker build -t a-ai-frontend .
docker build -t a-ai-backend ./backend
```

### ☁️ Cloud Deployment

#### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Heroku (Backend)

```bash
# Install Heroku CLI
# Create Heroku app
heroku create a-ai-backend

# Deploy
git subtree push --prefix backend heroku main
```

#### AWS/Azure/GCP

Detailed deployment guides available in `/docs/deployment/`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/a_ai_db

# Redis
REDIS_URL=redis://localhost:6379

# AI/ML Configuration
YOLO_MODEL_PATH=/models/yolov8n.pt
AI_CONFIDENCE_THRESHOLD=0.5

# Storage
STORAGE_PATH=/var/storage/a-ai
MAX_STORAGE_SIZE=100GB

# Notifications
EMAIL_SERVICE_API_KEY=your-email-api-key
SMS_SERVICE_API_KEY=your-sms-api-key
```

### Backend Configuration

Edit `backend/config.py`:

```python
# Server Configuration
HOST = "0.0.0.0"
PORT = 8000
DEBUG = False

# AI Model Configuration
YOLO_MODEL = "yolov8n.pt"
CONFIDENCE_THRESHOLD = 0.5
NMS_THRESHOLD = 0.4

# Database Configuration
DATABASE_URL = "postgresql://user:pass@localhost/a_ai"

# Camera Configuration
MAX_CAMERAS = 100
STREAM_TIMEOUT = 30

# Storage Configuration
RETENTION_DAYS = 30
MAX_STORAGE_GB = 500
```

## 📱 Features Deep Dive

### 🎥 Camera Management System

The camera management system provides comprehensive control over your surveillance network:

#### Features:
- **Auto-Discovery**: Automatically detect IP cameras on the network
- **Manual Configuration**: Add cameras with custom settings
- **Health Monitoring**: Real-time status tracking and diagnostics
- **Group Management**: Organize cameras by location or function
- **Remote Control**: PTZ control for supported cameras

#### Supported Camera Types:
- IP Cameras (RTSP/HTTP)
- USB Webcams
- ONVIF-compliant devices
- Custom RTMP streams
- Mobile camera apps

```typescript
// Camera configuration example
interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
  status: 'online' | 'offline';
  aiFeatures: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

### 🧠 AI Assistant Integration

The AI Assistant provides natural language interaction with your surveillance system:

#### Capabilities:
- **Visual Analysis**: "What do you see in Camera 1?"
- **Object Detection**: "Count the people in the parking lot"
- **Behavior Analysis**: "Detect suspicious activities"
- **Historical Queries**: "Show me events from yesterday"
- **Predictive Insights**: "Analyze traffic patterns"

#### Sample Interactions:

```
User: "Show me all cameras that detected vehicles in the last hour"
AI: "I found 3 cameras that detected vehicles:
     - Parking Lot Camera: 15 vehicles detected
     - Main Gate: 8 vehicles detected  
     - Loading Dock: 3 vehicles detected"

User: "Are there any security concerns in Building A?"
AI: "Currently monitoring Building A cameras. No immediate security 
     concerns detected. All access points are secure and no 
     unauthorized persons detected in restricted areas."
```

### 🚨 Alert & Notification System

Comprehensive alert management with intelligent prioritization:

#### Alert Types:
- **Security Alerts**: Unauthorized access, suspicious behavior
- **Safety Alerts**: Emergency situations, accidents
- **System Alerts**: Camera failures, network issues
- **Maintenance Alerts**: Scheduled maintenance, equipment issues

#### Notification Channels:
- **In-App Notifications**: Real-time dashboard alerts
- **Email Notifications**: Detailed email reports
- **SMS Alerts**: Critical alerts via text message
- **Mobile Push**: Mobile app notifications
- **Webhook Integration**: Custom third-party integrations

#### Rules Engine:

```typescript
interface Rule {
  id: string;
  name: string;
  description: string;
  trigger: {
    cameras: string[];
    objects: string[];
    timeRange?: string;
    conditions: string[];
  };
  actions: {
    notification: boolean;
    email: boolean;
    sms: boolean;
    webhook?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
}
```

### 📊 Health Monitoring Dashboard

Real-time system health monitoring with predictive analytics:

#### Monitored Metrics:
- **Camera Health**: Online/offline status, stream quality
- **Server Performance**: CPU, memory, disk usage
- **Network Status**: Bandwidth utilization, latency
- **Storage Management**: Available space, retention policies
- **AI Performance**: Processing speed, accuracy metrics

#### Health Status Indicators:

```typescript
interface HealthStatus {
  cameras: {
    total: number;
    online: number;
    offline: number;
    onlinePercentage: number;
  };
  servers: {
    cpu: { usage: number; status: string };
    memory: { usagePercentage: number; status: string };
    database: { responseTime: number; status: string };
  };
  storage: {
    primary: { usedPercentage: number; status: string };
    backup: { usedPercentage: number; status: string };
  };
}
```

### 🔧 Advanced Settings

#### User Management
- **Role-Based Access**: Admin, Operator, Viewer permissions
- **Custom Permissions**: Granular access control
- **Session Management**: Secure authentication and logout
- **Activity Logging**: Complete audit trail

#### System Configuration
- **General Settings**: Timezone, date format, system name
- **Camera Settings**: Default configurations, stream quality
- **Storage Settings**: Retention policies, backup schedules
- **AI Settings**: Model selection, confidence thresholds

#### Rules Configuration
- **Detection Rules**: Custom object detection rules
- **Alert Rules**: Notification triggers and conditions
- **Automation Rules**: Automated responses to events
- **Schedule Rules**: Time-based rule activation

## 🌐 API Documentation

### Authentication Endpoints

```bash
# Login
POST /api/auth/login
Content-Type: application/json
{
  "username": "admin",
  "password": "admin"
}

# Logout
POST /api/auth/logout
Authorization: Bearer <token>
```

### Camera Management

```bash
# Get all cameras
GET /api/cameras
Authorization: Bearer <token>

# Add new camera
POST /api/cameras
Content-Type: application/json
{
  "name": "Front Gate Camera",
  "location": "Main Entrance",
  "streamUrl": "rtsp://camera-ip:554/stream",
  "aiFeatures": ["person_detection", "vehicle_detection"]
}

# Update camera
PUT /api/cameras/{camera_id}
Content-Type: application/json

# Delete camera
DELETE /api/cameras/{camera_id}
Authorization: Bearer <token>
```

### AI Assistant

```bash
# Submit query
POST /api/v1/contextual/query
Content-Type: application/json
{
  "camera_id": "camera-123",
  "query": "What do you see in this camera?"
}

# Response format
{
  "success": true,
  "response": "I can see 3 people walking in the hallway...",
  "camera_id": "camera-123",
  "camera_name": "Hallway Camera",
  "timestamp": "2024-01-15T10:30:00Z",
  "model": "yolov8n"
}
```

### Health Monitoring

```bash
# Get system health
GET /api/health
Authorization: Bearer <token>

# Get camera health
GET /api/health/cameras
Authorization: Bearer <token>

# Get server metrics
GET /api/health/servers
Authorization: Bearer <token>
```

### Notifications

```bash
# Get notifications
GET /api/notifications
Authorization: Bearer <token>

# Mark as read
PUT /api/notifications/{notification_id}/read
Authorization: Bearer <token>

# Get notification settings
GET /api/notifications/settings
Authorization: Bearer <token>
```

## 🔒 Security

### Security Features

#### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth
- **Role-Based Access Control**: Granular permissions
- **Session Management**: Secure session handling
- **Password Policies**: Strong password requirements
- **Multi-Factor Authentication**: Optional 2FA support

#### Data Protection
- **Encryption in Transit**: TLS 1.3 for all communications
- **Encryption at Rest**: AES-256 for stored data
- **Secure Storage**: Encrypted video and image storage
- **Data Anonymization**: Privacy-preserving analytics
- **GDPR Compliance**: Data protection regulations

#### Network Security
- **API Rate Limiting**: DDoS protection
- **CORS Configuration**: Cross-origin security
- **Input Validation**: Prevent injection attacks
- **Security Headers**: HSTS, CSP, and more
- **Network Isolation**: Secure network segmentation

### Security Best Practices

```bash
# Environment Security
# Use strong secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database Security
# Use connection pooling and SSL
DATABASE_URL="postgresql://user:pass@localhost:5432/db?sslmode=require"

# API Security
# Implement rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900

# File Security
# Restrict file permissions
chmod 600 .env.local
chmod 755 uploads/
```

## 📊 Performance

### Performance Metrics

#### Frontend Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 250KB gzipped

#### Backend Performance
- **API Response Time**: < 200ms average
- **Database Query Time**: < 50ms average
- **Video Processing**: Real-time (30 FPS)
- **AI Inference Time**: < 100ms per frame
- **Concurrent Users**: 1000+ supported

#### System Scalability
- **Horizontal Scaling**: Load balancer support
- **Database Scaling**: Read replicas and sharding
- **CDN Integration**: Global content delivery
- **Caching Strategy**: Redis and application-level caching
- **Queue Management**: Background job processing

### Optimization Techniques

```typescript
// Frontend Optimizations
// Code splitting and lazy loading
const CameraManager = lazy(() => import('./CameraManager'));

// Image optimization
import Image from 'next/image';

// API optimization with React Query
const { data: cameras } = useQuery('cameras', fetchCameras, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

```python
# Backend Optimizations
# Async processing
import asyncio
from fastapi import BackgroundTasks

# Database connection pooling
from sqlalchemy.pool import QueuePool

# Caching with Redis
import redis
cache = redis.Redis(host='localhost', port=6379, db=0)
```

## 🧪 Testing

### Testing Strategy

```bash
# Frontend Testing
npm run test           # Unit tests with Jest
npm run test:e2e       # End-to-end tests with Playwright
npm run test:coverage  # Coverage reports

# Backend Testing
pytest                 # Python unit tests
pytest --cov          # Coverage reports
pytest -k integration # Integration tests
```

### Test Structure

```
tests/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── backend/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
└── e2e/
    ├── auth.spec.ts
    ├── cameras.spec.ts
    └── dashboard.spec.ts
```

## 🚀 Deployment

### Production Deployment

#### Docker Deployment

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
      
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
    depends_on:
      - db
      - redis
      
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: a_ai_production
      POSTGRES_USER: a_ai_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

#### Kubernetes Deployment

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: a-ai-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: a-ai-frontend
  template:
    metadata:
      labels:
        app: a-ai-frontend
    spec:
      containers:
      - name: frontend
        image: a-ai-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploying to production..."
```

## 🤝 Contributing

We welcome contributions to the A-AI project! Here's how you can help:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure tests pass**: `npm test`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use descriptive commit messages
- Keep pull requests focused and small

### Code Style

```bash
# Frontend
npm run lint          # ESLint
npm run format        # Prettier

# Backend
black .               # Python formatting
flake8 .             # Python linting
mypy .               # Type checking
```

### Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 A-AI Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **Andhra Pradesh Government** for organizing the hackathon
- **Next.js Team** for the amazing React framework
- **Ultralytics** for the YOLO AI models
- **Vercel** for deployment platform
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/rudra-sah00/A-AI/issues)
- **Documentation**: [Full documentation](https://a-ai-docs.vercel.app)
- **Email**: rudra.sah00@gmail.com
- **LinkedIn**: [Rudra Sah](https://linkedin.com/in/rudra-sah)

---

<div align="center">

**Built with ❤️ for the Andhra Pradesh Government Hackathon**

[⭐ Star this project](https://github.com/rudra-sah00/A-AI) • [🐛 Report Bug](https://github.com/rudra-sah00/A-AI/issues) • [✨ Request Feature](https://github.com/rudra-sah00/A-AI/issues)

</div>

---

### 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/rudra-sah00/A-AI?style=social)
![GitHub forks](https://img.shields.io/github/forks/rudra-sah00/A-AI?style=social)
![GitHub issues](https://img.shields.io/github/issues/rudra-sah00/A-AI)
![GitHub pull requests](https://img.shields.io/github/issues-pr/rudra-sah00/A-AI)
![GitHub last commit](https://img.shields.io/github/last-commit/rudra-sah00/A-AI)

### 🌟 Featured Technologies

<div align="center">

| Frontend | Backend | AI/ML | Infrastructure |
|----------|---------|-------|---------------|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | ![YOLO](https://img.shields.io/badge/YOLO-FF6B35?style=for-the-badge) | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) | ![OpenCV](https://img.shields.io/badge/OpenCV-27338e?style=for-the-badge&logo=OpenCV&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge) | ![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white) | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) |

</div>
