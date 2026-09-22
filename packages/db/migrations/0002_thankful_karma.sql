ALTER TABLE "documents" ALTER COLUMN "original_filename" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "size_bytes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "page_count" DROP NOT NULL;