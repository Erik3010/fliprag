ALTER TABLE "documents" ADD COLUMN "status" text DEFAULT 'processing' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "process_error" text;