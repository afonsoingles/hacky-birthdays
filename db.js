import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prismaGlobal = globalThis

export const prisma = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    prismaGlobal.prisma = prisma;
}