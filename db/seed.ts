import { VercelClient, VercelPoolClient } from '@vercel/postgres'
import { nanoid } from 'nanoid'

export async function seed(client: VercelClient) {
  const id = nanoid(16);
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255)
    );
  `;
  console.log(`Created "users" table`, createTable);

  // const name = 'Shyam';
  // const email = 'shyam@test.dev';
  // const image = 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg';

  // const users = await Promise.all([
  //   client.sql`
  //         INSERT INTO users (id, name, email, image)
  //         VALUES (${id}, ${name}, ${email}, ${image})
  //         ON CONFLICT (email) DO NOTHING;
  //     `,
  // ])
  // console.log(`Seeded ${users.length} users`)

  return {
    createTable
  }
}