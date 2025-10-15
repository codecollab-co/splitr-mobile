# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Splitr Mobile is a mobile application project with a standard cross-platform mobile app architecture. The project appears to be in early setup/template phase with directory structure in place but implementation pending.

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

**Note**: Project configuration files (package.json, pubspec.yaml, etc.) are not yet present. Once the mobile framework is chosen and configured, update this section with the appropriate commands.

Common mobile development commands to look for:
- Framework installation and dependency management
- Development server/hot reload
- Building for different platforms (iOS/Android)
- Testing commands
- Linting and code formatting
- Platform-specific builds and deployments

## Mobile Platform

The platform/framework (React Native, Flutter, Ionic, etc.) has not yet been determined. Check for:
- `package.json` (React Native/JavaScript)
- `pubspec.yaml` (Flutter/Dart)
- `ionic.config.json` (Ionic)
- Native iOS/Android project files

## State Management

The `store/` directory suggests centralized state management will be implemented. Common patterns for mobile apps include:
- Redux/Redux Toolkit (React Native)
- Provider/Riverpod (Flutter)
- MobX, Zustand, or Context API

## Navigation

Mobile navigation will be handled through the `navigation/` directory and components. Look for:
- Stack navigation for screen transitions
- Tab navigation for main app sections
- Modal/overlay presentations
- Deep linking configuration

## Code Organization

- Components are organized by functional type (forms, navigation, ui)
- Business logic separated into services
- Utilities kept in dedicated utils directory
- Platform-specific code isolated to android/ios directories

When adding new features:
1. Create reusable components in appropriate `components/` subdirectories
2. Add screen-level components to `screens/`
3. Place API calls and business logic in `services/`
4. Add navigation routes in `navigation/`
5. Create utility functions in `utils/`