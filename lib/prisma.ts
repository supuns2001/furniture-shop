import { PrismaClient } from "@prisma/client";
import { isDemoMode } from "./data-service";

let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (typeof window !== "undefined") {
    return {} as PrismaClient;
  }

  if (!_prisma) {
    // Dynamically require the adapter and client only when we actually need them at runtime.
    // This prevents Turbopack/Webpack from trying to bundle native adapters or checking
    // constructor validation during the static build/compile phase when DEMO_MODE is true.
    try {
      const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
      const { PrismaClient: Client } = require("@prisma/client");

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
          allowPublicKeyRetrieval: true,
        });
      } catch {
        adapter = new PrismaMariaDb({
          host: "localhost",
          port: 3306,
          user: "root",
          password: "MYSQLsupun@2001",
          database: "furniture_shop_db",
          connectionLimit: 5,
          allowPublicKeyRetrieval: true,
        });
      }

      const globalForPrisma = globalThis as unknown as {
        prisma: PrismaClient | undefined;
      };

      _prisma =
        globalForPrisma.prisma ??
        new Client({
          adapter,
          log: ["query"],
        });

      if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
    } catch (err) {
      console.error("Failed to initialize Prisma Client with MariaDB adapter:", err);
      throw err;
    }
  }

  return _prisma!;
}

// Export a Proxy that lazily forwards property access to the actual PrismaClient instance
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    // If it's a standard inspect/promise check, return it directly
    if (prop === "then" || prop === "toJSON") {
      return undefined;
    }
    const instance = getPrisma();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export default prisma;
