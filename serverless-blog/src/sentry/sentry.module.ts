import { Module } from '@nestjs/common';
import { SentryService } from './sentry.service';
import { ConfigModule } from '../config';

@Module({ imports: [ConfigModule], providers: [SentryService], exports: [SentryService] })
export class SentryModule {}
