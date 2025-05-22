import { databaseProviders } from '@/core/database/database.providers';
import { Global, Module } from '@nestjs/common';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
@Global()
export class DatabaseModule {}
