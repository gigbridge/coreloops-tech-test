CREATE TABLE "poke_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"<PASSWORD>" text NOT NULL
);
