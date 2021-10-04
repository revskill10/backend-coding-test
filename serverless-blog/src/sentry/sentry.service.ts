import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config';
import { SensitiveDataScrubber, StandardError } from '../domain/errors';
import { captureException, init } from '@sentry/node';

@Injectable()
export class SentryService {
  private scrubber: SensitiveDataScrubber;
  private readonly environment;
  private readonly serviceName;
  constructor(@Inject(ConfigService) private config) {
    const dsn = this.config.get('SENTRY_DSN');
    const release = this.config.get('API_VERSION');
    this.environment = this.config.get('NODE_ENV');
    init({ dsn, release, environment: this.environment });
    this.serviceName = this.config.get('APP_NAME');
    this.scrubber = new SensitiveDataScrubber([]);
  }

  captureExceptionTransaction(error: StandardError, transactionName: string, context): void {
    if (!(error instanceof StandardError)) {
      const errorContext = this.scrubber.scrub(context);
      error = new StandardError('UNKNOWN_ERROR', 'An unknown error occurred', error, errorContext);
    }
    error['name'] = `[${this.serviceName}] [${this.environment}] ${error.errorCode}`;
    captureException(error, (scope) => {
      scope.setTransactionName(transactionName);
      scope.setTag('error_code', error.errorCode || `${error['name']} ${error.message}`);
      scope.setExtra('context', error.context);
      scope.setExtra('last_error', error.lastError || {});
      return scope;
    });
  }

  captureException(error: StandardError, context: ExecutionContext): void {
    if (this.config.getEnvironment() === 'test') {
    }
    this.captureExceptionTransaction(error, context.getHandler().name, context);
  }
}
