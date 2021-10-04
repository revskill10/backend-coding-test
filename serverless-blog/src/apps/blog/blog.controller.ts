import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogService } from './blog.service';
import { FirebaseAuthGuard } from '../../firebase/firebase-auth.guard';
import * as dto from './blog.dto';
import { Authorization, AuthUser } from './blog.decorator';
import { SentryInterceptor } from '../../sentry/sentry.interceptor';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BadRequestError } from '../../domain/errors';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(SentryInterceptor)
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Create new article',
  })
  @ApiBadRequestResponse({
    description: 'The request object doesn`t match the expected one',
    type: BadRequestError,
  })
  async createArticle(@Body() createArticleRequest: dto.CreateArticleDTO, @Authorization() authUser: AuthUser) {
    return await this.blogService.createArticle(createArticleRequest, authUser.user.id); 
  }
}
