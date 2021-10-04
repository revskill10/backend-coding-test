import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { BlogModule } from 'src/apps/blog/blog.module';
@Module({
  imports: [BlogModule],
  providers: [CronsService],
})
export class CronsModule {}