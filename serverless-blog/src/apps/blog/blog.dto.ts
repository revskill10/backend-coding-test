import { IsNotEmpty } from 'class-validator';

export class CreateArticleDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
