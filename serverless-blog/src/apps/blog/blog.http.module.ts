import { Module } from '@nestjs/common';
import { BlogModule } from './blog.module';
import { BlogService } from './blog.service';
import { FirebaseAuthStrategy } from '../../firebase/firebase-auth.strategy';
import { SentryModule } from '../../sentry';
@Module({
  imports: [SentryModule, BlogModule],
  providers: [BlogService, FirebaseAuthStrategy],
})
export class BlogHttpModule {}
