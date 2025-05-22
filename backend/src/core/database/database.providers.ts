import { createDatabaseIfNotExists } from '@/core/utils/db';
import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      await createDatabaseIfNotExists();

      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DABATASE_HOST!,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
