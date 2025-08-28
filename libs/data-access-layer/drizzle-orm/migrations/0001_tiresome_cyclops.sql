CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"accuracy" integer,
	"damage_class" text,
	"power" integer,
	"pp" integer,
	"type_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_moves" (
	"pokemon_id" uuid NOT NULL,
	"move_id" uuid NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "pokemon_moves_pokemon_id_move_id_pk" PRIMARY KEY("pokemon_id","move_id")
);
--> statement-breakpoint
ALTER TABLE "poke_users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "poke_users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "poke_users" DROP COLUMN "<PASSWORD>";