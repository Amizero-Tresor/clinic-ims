import { User } from "@prisma/client"; // Import the User type from Prisma

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Add the user property to the Request interface
  }
}
