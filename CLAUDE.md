# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pet Service Platform (宠物服务平台)** - A full-stack service booking platform for pet owners, providing grooming, washing, boarding, and feeding services.

## Tech Stack

### Frontend
- **React 19** with TypeScript 5
- **Vite 8** as build tool
- **Ant Design 6** UI component library
- **Redux Toolkit** for state management
- **React Router 7** for routing
- **Axios** for HTTP requests (with interceptors)
- **ECharts** for data visualization

### Backend
- **Node.js + Express** server
- **JWT** authentication
- **In-memory database** (simulated, replaceable with MySQL)
- **CORS** enabled

## Development Commands

```bash
# Install dependencies (root for frontend, server/ for backend)
npm install
cd server && npm install && cd ..

# Start development servers
./start.sh          # Linux/Mac (or start.bat on Windows)
# OR manually:
cd server && npm start    # Terminal 1: Backend at port 3000
npm run dev               # Terminal 2: Frontend at port 5173

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

**Test Account**: 13800138000 / 123456

## Architecture

### Frontend Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── business/        # Business-specific components (ServiceCard, OrderItem, StatCard)
│   └── layout/          # Layout components (Header, Footer, MainLayout)
├── pages/               # Route-level page components
│   ├── Auth/            # Login, Register
│   ├── Home/            # Landing page
│   ├── Services/        # ServiceList, ServiceDetail
│   ├── Orders/          # OrderList, OrderDetail, OrderReview
│   ├── Pets/            # Pet profiles
│   ├── Profile/         # User profile
│   ├── Reviews/         # Reviews listing
│   ├── AfterSales/      # After-sales service
│   ├── Feeding/         # Feeding service
│   └── Statistics/      # Data statistics with ECharts
├── store/
│   └── slices/          # Redux Toolkit slices (auth, pets, services, orders, reviews, afterSales, statistics)
├── services/
│   ├── api/             # API abstraction layer (exports)
│   ├── real/            # Real API implementations (axios calls)
│   ├── mock/            # Mock data (legacy)
│   └── request.ts       # Axios instance with interceptors (auth token, error handling)
├── hooks/               # Custom React hooks (useAuth, usePets, useServices, etc.)
├── types/               # TypeScript type definitions
└── styles/              # Theme configuration and global CSS
```

### Backend Structure
```
server/
├── index.js             # Express server with all routes and in-memory data
└── package.json         # Server dependencies
```

### State Management Pattern
- Redux Toolkit slices with `createAsyncThunk` for async operations
- Custom hooks (`useAuth`, `usePets`, `useServices`, `useOrders`, etc.) wrap Redux selectors
- API calls centralized in `services/real/` with consistent error handling

### API Layer
- **Request Interceptor**: Automatically attaches JWT token from localStorage
- **Response Interceptor**: Handles errors (401 redirects to login, displays Ant Design messages)
- **Base URL**: `http://localhost:3000` (configured in `services/request.ts`)
- All responses follow `{ code: 0, message: string, data: T, timestamp: number }` format

## Key Patterns

### Authentication
- JWT token stored in localStorage
- Protected routes use `<ProtectedRoute>` component in App.tsx
- Token expiry handled by interceptor (redirects to /login)

### Data Flow
1. Components dispatch Redux actions (async thunks)
2. Thunks call API functions from `services/real/`
3. Responses update Redux state via reducers
4. Custom hooks expose state to components

### Styling
- Ant Design ConfigProvider with custom theme (`styles/theme.ts`)
- Warm orange primary color (#FF6B35)
- Rounded corners, playful design aesthetic
- CSS modules for component-specific styles

## Implementation Notes

- **Chinese UI**: All user-facing text is in Chinese
- **Mobile-first**: Responsive design with Ant Design breakpoints
- **Form validation**: Ant Design Form with validation rules
- **Date handling**: dayjs library for date operations
- **Charts**: ECharts via echarts-for-react for statistics page

## Future Roadmap (from README)
- V1.0: Java Spring Boot backend, MySQL, Redis
- V2.0: Merchant dashboard, message queue
- V3.0: WeChat Mini Program, OSS file storage
- V4.0: Admin dashboard, permissions system
