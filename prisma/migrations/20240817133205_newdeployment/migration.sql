/*
  Warnings:

  - A unique constraint covering the columns `[productName]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stock_productName_key" ON "Stock"("productName");
