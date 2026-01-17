import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma 7 singleton client with PostgreSQL adapter for Neon.
 * This ensures the client is reused across hot-reloads in development.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is missing! Make sure it is defined in your .env file.");
}

// 1. Initialize the Pool and Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Define the Singleton creation function
const prismaClientSingleton = () => {
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

// 3. Prevent multiple instances in development
// We use a broader global type to avoid 'Property prisma does not exist' errors
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// 4. Attach to global object only in non-production environments
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;