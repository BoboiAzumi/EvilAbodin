-- CreateTable
CREATE TABLE "public"."TextRecord" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "TextRecord_pkey" PRIMARY KEY ("id")
);
