import { Client } from 'pg';

export async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DABATASE_HOST!,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: 'postgres', // conecta no banco padrão
  });

  await client.connect();

  const dbName = process.env.DATABASE_NAME!;
  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );

  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Banco "${dbName}" criado.`);
  } else {
    console.log(`ℹ️ Banco "${dbName}" já existe.`);
  }

  await client.end();
}
