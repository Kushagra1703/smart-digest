import 'dotenv/config'; // Loads your .env file explicitly
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Using process.env is safer and prevents the P1012/EnvError
    url: process.env.DATABASE_URL!, 
  },
});