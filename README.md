# Splitr Mobile 📱

*Cross-platform mobile application for expense splitting and group financial management*

[![React Native](https://img.shields.io/badge/React%20Native-0.76+-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![iOS](https://img.shields.io/badge/iOS-13.0+-000000?style=flat-square&logo=ios&logoColor=white)](https://developer.apple.com/ios/)
[![Android](https://img.shields.io/badge/Android-API%2021+-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com/)

## 🎯 Project Overview

Splitr Mobile is a native cross-platform mobile application designed to seamlessly integrate with the Splitr ecosystem. Built for iOS and Android, it provides an intuitive interface for managing shared expenses, tracking group finances, and settling debts on the go.

### 🌟 Key Features
- **Cross-Platform Native Experience**: Single codebase for iOS and Android
- **Real-time Synchronization**: Live updates across all connected devices
- **Offline-First Architecture**: Work without internet, sync when connected
- **Intuitive Expense Splitting**: Smart algorithms for fair cost distribution
- **Group Management**: Create, join, and manage expense-sharing groups
- **Settlement Tracking**: Monitor debts and payments between group members
- **Receipt Scanning**: OCR-powered receipt capture and expense creation
- **Multi-currency Support**: Handle expenses in different currencies
- **Push Notifications**: Real-time alerts for new expenses and payments

## 🏗️ Architecture Overview

### Current Status: **Setup Phase**
This project is currently in the initial setup phase. The directory structure has been established following mobile development best practices, but the specific framework and dependencies are yet to be configured.

### Recommended Tech Stack
- **Framework**: React Native 0.76+ with TypeScript
- **Navigation**: React Navigation 6.x
- **State Management**: Zustand + TanStack Query
- **Authentication**: Clerk React Native
- **Real-time**: Socket.IO Client
- **UI Framework**: React Native Elements or NativeBase
- **Forms**: React Hook Form + Zod validation
- **Storage**: AsyncStorage + react-native-keychain
- **Networking**: Axios with request/response interceptors
- **Animations**: React Native Reanimated 3
- **Camera**: react-native-vision-camera

## 📁 Project Structure

```
splitr-mobile/
├── android/                    # Android-specific native code
├── ios/                       # iOS-specific native code
├── src/                       # Main application source code
│   ├── components/            # Reusable UI components
│   │   ├── forms/            # Form-specific components
│   │   ├── navigation/       # Navigation components
│   │   └── ui/              # Base UI components
│   ├── screens/              # Screen/page components
│   │   ├── auth/            # Authentication screens
│   │   ├── dashboard/       # Dashboard and overview
│   │   ├── expenses/        # Expense management screens
│   │   ├── groups/          # Group management screens
│   │   ├── profile/         # User profile screens
│   │   └── settlements/     # Settlement tracking screens
│   ├── services/             # API calls and business logic
│   │   ├── api.ts           # HTTP client configuration
│   │   ├── auth.ts          # Authentication service
│   │   ├── expenses.ts      # Expense management API
│   │   ├── groups.ts        # Group management API
│   │   └── notifications.ts # Push notification handling
│   ├── store/               # Global state management
│   │   ├── auth.ts          # Authentication state
│   │   ├── expenses.ts      # Expense data state
│   │   ├── groups.ts        # Group data state
│   │   └── settings.ts      # App settings and preferences
│   ├── navigation/           # App navigation configuration
│   │   ├── AppNavigator.tsx  # Main app navigation
│   │   ├── AuthNavigator.tsx # Authentication flow
│   │   └── TabNavigator.tsx  # Bottom tab navigation
│   ├── utils/               # Utility functions and helpers
│   │   ├── currency.ts      # Currency formatting and conversion
│   │   ├── date.ts          # Date formatting utilities
│   │   ├── permissions.ts   # Device permission handling
│   │   ├── storage.ts       # Local storage utilities
│   │   └── validation.ts    # Form validation schemas
│   └── types/               # TypeScript type definitions
│       ├── api.ts           # API response types
│       ├── entities.ts      # Core business entity types
│       └── navigation.ts    # Navigation parameter types
├── CLAUDE.md                 # Development guidance document
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Xcode**: Latest version (for iOS development on macOS)
- **Android Studio**: Latest version with Android SDK
- **CocoaPods**: `gem install cocoapods` (for iOS dependencies)

### Initial Setup

#### 1. Framework Installation
First, initialize the React Native project:

```bash
# Navigate to project directory
cd /Users/safayavatsal/github/splitr-mobile

# Initialize React Native project with TypeScript template
npx react-native@latest init SplitrMobile --template react-native-template-typescript

# Or if using Expo (alternative approach)
npx create-expo-app@latest SplitrMobile --template tabs

# Move generated files to current directory structure
# (Preserve existing src/ structure and integrate generated files)
```

#### 2. Core Dependencies Installation
```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# State Management
npm install zustand @tanstack/react-query @tanstack/react-query-persist-client-core

# Authentication
npm install @clerk/clerk-react-native

# Networking & Real-time
npm install axios socket.io-client

# UI & Styling
npm install react-native-elements react-native-vector-icons
npm install react-native-paper react-native-ui-lib

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Storage & Security
npm install @react-native-async-storage/async-storage react-native-keychain

# Camera & Media
npm install react-native-vision-camera react-native-image-picker

# Utilities
npm install react-native-device-info react-native-permissions
npm install date-fns react-native-toast-message

# Development Dependencies
npm install --save-dev @types/react @types/react-native
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-plugin-react-native
```

#### 3. Platform-Specific Setup

**iOS Setup:**
```bash
cd ios && pod install && cd ..
```

**Android Setup:**
- Ensure Android SDK is properly installed
- Configure Android emulator or connect physical device
- Set up proper signing configurations

#### 4. Development Configuration

Create essential configuration files:

**tsconfig.json:**
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "clean": "react-native clean-project",
    "pod-install": "cd ios && pod install && cd ..",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "react-native run-ios --configuration Release"
  }
}
```

#### 5. Environment Configuration

Create `.env` file:
```env
# API Configuration
API_BASE_URL=http://localhost:3001/api/v1
SOCKET_URL=http://localhost:3001

# Authentication (Clerk)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Feature Flags
ENABLE_DEV_MENU=true
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false

# App Configuration
APP_NAME=Splitr
APP_VERSION=1.0.0
```

## 📱 Development Workflow

### Running the Application

**Start Metro bundler:**
```bash
npm start
# or
npx react-native start
```

**Run on Android:**
```bash
npm run android
# or
npx react-native run-android
```

**Run on iOS:**
```bash
npm run ios
# or
npx react-native run-ios
```

### Development Commands
```bash
# Code Quality
npm run lint              # Run ESLint
npm run lint:fix          # Auto-fix lint issues
npm run typecheck         # TypeScript type checking

# Testing
npm test                  # Run Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report

# Utilities
npm run clean             # Clean React Native cache
npm run pod-install       # Install iOS dependencies
```

### Build & Release

**Android Release Build:**
```bash
npm run build:android
# Output: android/app/build/outputs/apk/release/app-release.apk
```

**iOS Release Build:**
```bash
npm run build:ios
# Build through Xcode for App Store submission
```

## 🛠️ Core Features Implementation

### 1. Authentication Flow
```typescript
// src/services/auth.ts
import { ClerkProvider, useAuth } from '@clerk/clerk-react-native';

export const AuthService = {
  login: async (email: string, password: string) => {
    // Implement Clerk authentication
  },

  logout: async () => {
    // Handle logout and cleanup
  },

  getCurrentUser: () => {
    // Return current user data
  }
};
```

### 2. API Integration
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Real-time Updates
```typescript
// src/services/socket.ts
import { io } from 'socket.io-client';

export const SocketService = {
  connect: () => {
    return io(process.env.SOCKET_URL, {
      auth: { token: getAuthToken() }
    });
  },

  subscribeToExpenseUpdates: (callback: (expense: Expense) => void) => {
    socket.on('expense:created', callback);
    socket.on('expense:updated', callback);
  }
};
```

### 4. State Management
```typescript
// src/store/expenses.ts
import { create } from 'zustand';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  loading: false,
  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense]
    })),
  updateExpense: (id, updates) =>
    set((state) => ({
      expenses: state.expenses.map(e =>
        e.id === id ? { ...e, ...updates } : e
      )
    }))
}));
```

## 🎨 UI/UX Design System

### Color Palette
```typescript
// src/utils/colors.ts
export const colors = {
  primary: '#007AFF',
  secondary: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6D6D80',
  border: '#C7C7CC'
};
```

### Typography
```typescript
// src/utils/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '600' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' }
};
```

### Component Examples
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', disabled
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles[variant], disabled && styles.disabled]}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## 📊 Key Screens & Navigation

### Navigation Structure
```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />
        <Tab.Screen name="Expenses" component={ExpensesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

### Core Screens
1. **Dashboard**: Overview of balances and recent activity
2. **Groups**: Manage expense-sharing groups
3. **Expenses**: Add and track individual expenses
4. **Settlements**: Handle debt payments and transfers
5. **Profile**: User settings and preferences

## 🧪 Testing Strategy

### Unit Testing
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Testing Examples
```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/ui/Button';

describe('Button Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('handles press events', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockPress} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Testing with Detox
```bash
# Install Detox
npm install --save-dev detox @types/detox

# Configure Detox for iOS and Android
npx detox init
```

## 📦 Build & Distribution

### Android Release Process
1. **Generate signed APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Upload to Google Play Console**
3. **Configure app store listing**

### iOS Release Process
1. **Build for release through Xcode**
2. **Archive and validate**
3. **Upload to App Store Connect**
4. **Submit for review**

### App Store Optimization
- **Screenshots**: High-quality app store screenshots
- **Description**: Compelling app description with keywords
- **Metadata**: Proper categorization and tags
- **Reviews**: Monitor and respond to user reviews

## 🔒 Security & Privacy

### Security Measures
- **Token Security**: Secure storage of authentication tokens
- **API Security**: Certificate pinning for API calls
- **Data Encryption**: Sensitive data encryption at rest
- **Biometric Auth**: Optional fingerprint/face unlock
- **Session Management**: Proper session timeout and cleanup

### Privacy Compliance
- **Data Minimization**: Collect only necessary data
- **Transparency**: Clear privacy policy and data usage
- **User Control**: Allow data deletion and export
- **Consent Management**: Proper permission requests
- **Analytics**: Optional analytics with user consent

## 🚀 Performance Optimization

### Key Strategies
- **Bundle Splitting**: Code splitting for faster load times
- **Image Optimization**: Proper image compression and caching
- **Memory Management**: Efficient component lifecycle management
- **Network Optimization**: Request batching and caching
- **Rendering Optimization**: FlatList for large datasets

### Monitoring
- **Performance Metrics**: Track app startup time, memory usage
- **Crash Reporting**: Implement crash analytics
- **User Behavior**: Track user flow and engagement
- **API Performance**: Monitor API response times

## 🐛 Troubleshooting

### Common Issues

**Metro bundler won't start:**
```bash
npx react-native start --reset-cache
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

**iOS build fails:**
```bash
cd ios && rm -rf Pods && pod install && cd ..
npx react-native run-ios
```

**Dependencies not found:**
```bash
npm install
cd ios && pod install && cd ..  # iOS only
```

### Debug Tools
- **React Native Debugger**: Enhanced debugging experience
- **Flipper**: Facebook's debugging platform
- **Reactotron**: Real-time debugging and monitoring
- **Chrome DevTools**: JavaScript debugging

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **TypeScript**: Use strict typing for all code
3. **Testing**: Write tests for all new features
4. **Documentation**: Update documentation for significant changes
5. **Performance**: Consider performance impact of changes

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/expense-splitting

# Make changes and commit
git add .
git commit -m "feat: add expense splitting functionality"

# Push and create PR
git push origin feature/expense-splitting
```

### Pull Request Process
1. **Code Review**: All PRs require review
2. **Testing**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Performance**: Check for performance regressions

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🔗 Related Projects

- **[Splitr Web](../splitr-web)**: Next.js web application
- **[Splitr Backend](../splitr-backend)**: Express.js REST API
- **[Splitr Documentation](../SPLITR_TRANSFORMATION_GUIDE.md)**: Project overview and architecture

## 📞 Support & Resources

### Documentation
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- [React Native Community Discord](https://www.reactnative.dev/help)
- [Stack Overflow - React Native](https://stackoverflow.com/questions/tagged/react-native)
- [GitHub Discussions](https://github.com/facebook/react-native/discussions)

---

**🚀 Ready to build the future of expense splitting on mobile!**

*This README will be updated as the project evolves and new features are implemented.*