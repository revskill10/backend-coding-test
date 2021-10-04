import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ISPaginateQuery } from 'src/domain/helpers/paginate';
import { Repository } from 'typeorm';
import * as models from '../../domain/models'
import * as dto from './blog.dto';
@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(models.User)
    private usersRepository: Repository<models.User>,
    @InjectRepository(models.Article)
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

  async getAllArticles({ query }: { query?: ISPaginateQuery}) {
      return await this.articlesRepository.createQueryBuilder().sPaginate(query).getMany();
  }

  async randomizeArticles() {
      const randomWord = (Math.random() + 1).toString(36).substring(7);
      return await this.articlesRepository.createQueryBuilder()
      .update(models.Article)
      .set({ content: () => `content || ${randomWord}` })
      .returning("id");
  }
}