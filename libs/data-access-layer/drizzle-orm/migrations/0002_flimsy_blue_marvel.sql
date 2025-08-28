ALTER TABLE "poke_users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "poke_users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "poke_users" DROP COLUMN "<PASSWORD>";