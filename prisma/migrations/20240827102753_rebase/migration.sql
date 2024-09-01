-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usertype') THEN
    CREATE TYPE "UserType" AS ENUM ('ADMIN', 'MANAGER');
  END IF;
END $$;

-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'department') THEN
    CREATE TYPE "Department" AS ENUM ('DENTISTRY', 'LABORATORY', 'PHYSIOTHERAPY', 'NURSING', 'DOCTOR');
  END IF;
END $$;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeName" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingTransaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutgoingTransaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeePhone" TEXT NOT NULL,

    CONSTRAINT "OutgoingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeName_phoneNumber_key" ON "Employee"("employeeName", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productName_key" ON "Product"("productName");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productName_key" ON "Stock"("productName");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productName_fkey" FOREIGN KEY ("productName") REFERENCES "Product"("productName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingTransaction" ADD CONSTRAINT "IncomingTransaction_productName_fkey" FOREIGN KEY ("productName") REFERENCES "Product"("productName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutgoingTransaction" ADD CONSTRAINT "OutgoingTransaction_productName_fkey" FOREIGN KEY ("productName") REFERENCES "Product"("productName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutgoingTransaction" ADD CONSTRAINT "OutgoingTransaction_employeeName_employeePhone_fkey" FOREIGN KEY ("employeeName", "employeePhone") REFERENCES "Employee"("employeeName", "phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
