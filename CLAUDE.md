# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Splitr Mobile is a fully implemented React Native TypeScript application for expense splitting and group financial management. The project uses custom API-based authentication, React Navigation, TanStack Query for data fetching, and React Native Paper for UI components.

## Architecture

The project follows a typical mobile app structure:

- `src/` - Main source code directory
  - `components/` - Reusable UI components organized by type
    - `forms/` - Form-related components
    - `navigation/` - Navigation-specific components
    - `ui/` - General UI components
  - `screens/` - Screen/page components
  - `services/` - API calls, external integrations, and business logic
  - `store/` - State management (likely Redux, Zustand, or similar)
  - `navigation/` - App navigation configuration
  - `utils/` - Utility functions and helpers
- `android/` - Android-specific native code and configurations
- `ios/` - iOS-specific native code and configurations

## Development Commands

**React Native TypeScript Project**

Development commands available:

```bash
# Development
npm run start          # Start Metro bundler
npm run dev           # Start with cache reset
npm run android       # Run on Android
npm run ios           # Run on iOS

# Code Quality
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript checks
npm test             # Run Jest tests

# Build
npm run build:android # Build Android release
npm run build:ios     # Build iOS release
npm run pod-install   # Install iOS CocoaPods
npm run clean         # Clean React Native cache
```

## Mobile Platform

**React Native 0.76.1 with TypeScript**

Key technologies:
- React Native 0.76.1
- TypeScript 5.0.4
- React Navigation 6.x for navigation
- TanStack Query for data fetching
- React Native Paper for UI components
- Custom API-based authentication (not Clerk)
- Axios for HTTP requests
- Socket.IO for real-time features

## State Management

**Current Implementation:**
- **Authentication State**: React Context in `AuthProvider.tsx`
- **Server State**: TanStack Query for API data caching
- **Local State**: React hooks for component state
- **Real-time State**: Socket.IO for live updates

The project currently uses React Context for authentication and TanStack Query for server state management, which is sufficient for most use cases.

## Navigation

**React Navigation Implementation:**
- `AppNavigator.tsx`: Main navigation container with auth switching
- `AuthNavigator.tsx`: Authentication flow navigation
- `MainTabNavigator.tsx`: Main app tab navigation
- Stack navigation for screen transitions
- Conditional rendering based on authentication state

Navigation uses TypeScript path aliases:
- `@navigation/*` for navigation components
- `@screens/*` for screen components

## Code Organization

- Components are organized by functional type (forms, navigation, ui)
- Business logic separated into services
- Utilities kept in dedicated utils directory
- Platform-specific code isolated to android/ios directories

## Authentication System

**Custom API Authentication** (not Clerk):
- `AuthProvider.tsx`: React Context for auth state management
- `ApiService.ts`: HTTP client with token management
- `UserService.ts`: User-related API calls
- Token stored in AsyncStorage with automatic refresh

## Key Services

- `ApiService.ts`: Main HTTP client with interceptors and error handling
- `UserService.ts`: User management and profile operations
- `ConfigService.ts`: Environment and database configuration
- `ExpenseService.ts`: Expense management operations
- `GroupService.ts`: Group management operations

## TypeScript Configuration

Path aliases configured in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@services/*` → `src/services/*`
- `@navigation/*` → `src/navigation/*`
- `@types/*` → `src/types/*`
- `@constants/*` → `src/constants/*`

When adding new features:
1. Create reusable components in appropriate `components/` subdirectories
2. Add screen-level components to `screens/`
3. Place API calls and business logic in `services/`
4. Add navigation routes in `navigation/`
5. Create utility functions in `utils/`
6. Use TypeScript path aliases for cleaner imports