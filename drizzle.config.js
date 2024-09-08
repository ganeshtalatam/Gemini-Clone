/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://ghani_owner:dmJHWXC83YeZ@ep-icy-cloud-a14c5php.ap-southeast-1.aws.neon.tech/ghani?sslmode=require",
    }
  };