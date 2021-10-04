import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as models from '../../domain/models'
import * as dto from './blog.dto';
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(models.User)
    private usersRepository: Repository<models.User>,
    private articlesRepository: Repository<models.Article>,
  ) {}

  async createArticle(articleDTO: dto.CreateArticleDTO, firebaseUserId: string) {
      const user = await this.usersRepository.findOne({
          firebaseUserId,
          isAdmin: true,
      });
      if (!user) throw new Error('User not found');
      return await this.articlesRepository.insert({
          title: articleDTO.title,
          content: articleDTO.content,
          author: user
      })
  }
}