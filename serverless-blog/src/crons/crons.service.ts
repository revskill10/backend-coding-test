import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlogService } from 'src/apps/blog/blog.service';

@Injectable()
export class CronsService {
    constructor(
        @Inject(BlogService) private blogService: BlogService,
    )
  private readonly logger = new Logger(CronsService.name);

  @Cron('0 18 * * *')
  async handleCron() {
    this.logger.debug('Called when the second is 45');
    await this.blogService.randomizeArticles()
  }
}