import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MeiliSearch} from 'meilisearch'
import {ArticleSearchService} from './article-search.service'

@Module({
  providers: [
    {
      provide: MeiliSearch,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new MeiliSearch({
          host: configService.getOrThrow('database.meilisearch.host'),
          apiKey: configService.get('database.meilisearch.apiKey'),
        })
      },
    },
    ArticleSearchService,
  ],
  exports: [
    ArticleSearchService,
  ],
})
export class MeilisearchModule {}
