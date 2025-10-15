import Config from 'react-native-config';

export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  socketUrl: string;
  databaseMode: 'postgres' | 'convex';
  authProvider: 'custom' | 'clerk';
  enableDebug: boolean;
  enableOfflineMode: boolean;
  enablePushNotifications: boolean;
  enableAnalytics: boolean;
  appName: string;
  appVersion: string;
}

class ConfigServiceClass {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    const nodeEnv = Config.NODE_ENV || 'development';
    const environment = this.normalizeEnvironment(nodeEnv);

    return {
      environment,
      apiBaseUrl: Config.API_BASE_URL || this.getDefaultApiUrl(environment),
      socketUrl: Config.SOCKET_URL || this.getDefaultSocketUrl(environment),
      databaseMode: (Config.DATABASE_MODE as 'postgres' | 'convex') || this.getDefaultDatabaseMode(environment),
      authProvider: (Config.AUTH_PROVIDER as 'custom' | 'clerk') || 'custom',
      enableDebug: Config.DEBUG === 'true' || environment === 'development',
      enableOfflineMode: Config.ENABLE_OFFLINE_MODE !== 'false',
      enablePushNotifications: Config.ENABLE_PUSH_NOTIFICATIONS === 'true',
      enableAnalytics: Config.ENABLE_ANALYTICS === 'true' && environment !== 'development',
      appName: Config.APP_NAME || 'Splitr',
      appVersion: Config.APP_VERSION || '1.0.0',
    };
  }

  private normalizeEnvironment(env: string): 'development' | 'staging' | 'production' {
    switch (env.toLowerCase()) {
      case 'dev':
      case 'development':
        return 'development';
      case 'stage':
      case 'staging':
        return 'staging';
      case 'prod':
      case 'production':
        return 'production';
      default:
        return 'development';
    }
  }

  private getDefaultApiUrl(environment: string): string {
    switch (environment) {
      case 'development':
        return 'http://localhost:3001/api';
      case 'staging':
        return 'https://splitr-backend-staging.vercel.app/api';
      case 'production':
        return 'https://api.splitr.app/api';
      default:
        return 'http://localhost:3001/api';
    }
  }

  private getDefaultSocketUrl(environment: string): string {
    switch (environment) {
      case 'development':
        return 'http://localhost:3001';
      case 'staging':
        return 'https://splitr-backend-staging.vercel.app';
      case 'production':
        return 'https://api.splitr.app';
      default:
        return 'http://localhost:3001';
    }
  }

  private getDefaultDatabaseMode(environment: string): 'postgres' | 'convex' {
    switch (environment) {
      case 'development':
        return 'postgres';
      case 'staging':
      case 'production':
        return 'convex';
      default:
        return 'postgres';
    }
  }

  // Public getters
  get environment(): 'development' | 'staging' | 'production' {
    return this.config.environment;
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get socketUrl(): string {
    return this.config.socketUrl;
  }

  get databaseMode(): 'postgres' | 'convex' {
    return this.config.databaseMode;
  }

  get authProvider(): 'custom' | 'clerk' {
    return this.config.authProvider;
  }

  get enableDebug(): boolean {
    return this.config.enableDebug;
  }

  get enableOfflineMode(): boolean {
    return this.config.enableOfflineMode;
  }

  get enablePushNotifications(): boolean {
    return this.config.enablePushNotifications;
  }

  get enableAnalytics(): boolean {
    return this.config.enableAnalytics;
  }

  get appName(): string {
    return this.config.appName;
  }

  get appVersion(): string {
    return this.config.appVersion;
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isStaging(): boolean {
    return this.environment === 'staging';
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }

  get isLocalDatabase(): boolean {
    return this.databaseMode === 'postgres';
  }

  get isCloudDatabase(): boolean {
    return this.databaseMode === 'convex';
  }

  // Environment-specific API paths
  getApiPath(path: string): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (this.isLocalDatabase) {
      // PostgreSQL backend uses standard REST API paths
      return normalizedPath;
    } else {
      // Convex backend might use different API structure
      return this.adaptPathForConvex(normalizedPath);
    }
  }

  private adaptPathForConvex(path: string): string {
    // Transform REST API paths to Convex-compatible paths if needed
    // This is where you would adapt the API paths based on your Convex setup

    // For now, assume the backend API abstracts the database differences
    return path;
  }

  // Database-specific configuration
  getDatabaseConfig(): any {
    if (this.isLocalDatabase) {
      return {
        type: 'postgres',
        features: {
          complexQueries: true,
          transactions: true,
          relations: true,
          migrations: true,
        },
      };
    } else {
      return {
        type: 'convex',
        features: {
          realtime: true,
          optimisticUpdates: true,
          offline: true,
          scalability: true,
        },
      };
    }
  }

  // Logging with environment awareness
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, extra?: any): void {
    if (!this.enableDebug && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.environment}]`;

    switch (level) {
      case 'debug':
        console.debug(`${prefix} ${message}`, extra || '');
        break;
      case 'info':
        console.info(`${prefix} ${message}`, extra || '');
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, extra || '');
        break;
      case 'error':
        console.error(`${prefix} ${message}`, extra || '');
        break;
    }
  }

  // Get all configuration for debugging
  getAllConfig(): AppConfig {
    return { ...this.config };
  }
}

export const configService = new ConfigServiceClass();