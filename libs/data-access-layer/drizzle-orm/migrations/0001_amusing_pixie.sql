CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"accuracy" integer,
	"damage_class" text NOT NULL,
	"power" integer,
	"pp" integer NOT NULL,
	"type_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_moves" (
	"pokemon_id" uuid NOT NULL,
	"move_id" uuid NOT NULL,
	"level" integer NOT NULL,
	CONSTRAINT "pokemon_moves_pokemon_id_move_id_pk" PRIMARY KEY("pokemon_id","move_id")
);
--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_type_id_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_move_id_moves_id_fk" FOREIGN KEY ("move_id") REFERENCES "public"."moves"("id") ON DELETE no action ON UPDATE no action;