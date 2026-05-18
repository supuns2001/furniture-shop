import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let prisma: PrismaClient;

if (typeof window === "undefined") {
  const dbUrl = process.env.DATABASE_URL || "mysql://root:MYSQLsupun@2001@localhost:3306/furniture_shop_db";
  
  let adapter;
  try {
    const url = new URL(dbUrl);
    adapter = new PrismaMariaDb({
      host: url.hostname || "localhost",
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: url.username || "root",
      password: decodeURIComponent(url.password || "MYSQLsupun@2001"),
      database: url.pathname.replace(/^\//, "") || "furniture_shop_db",
      connectionLimit: 5,
    });
  } catch (error) {
    // Fallback static config
    adapter = new PrismaMariaDb({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "MYSQLsupun@2001",
      database: "furniture_shop_db",
      connectionLimit: 5,
    });
  }

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: ["query"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} else {
  prisma = {} as PrismaClient;
}

export { prisma };
export default prisma;
