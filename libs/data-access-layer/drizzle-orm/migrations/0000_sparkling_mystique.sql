CREATE TABLE "abilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "pokemon_abilities" (
	"pokemon_id" uuid NOT NULL,
	"ability_id" uuid NOT NULL,
	CONSTRAINT "pokemon_abilities_ability_id_pokemon_id_pk" PRIMARY KEY("ability_id","pokemon_id")
);
--> statement-breakpoint
CREATE TABLE "pokemon_types" (
	"pokemon_id" uuid NOT NULL,
	"type_id" uuid NOT NULL,
	CONSTRAINT "pokemon_types_type_id_pokemon_id_pk" PRIMARY KEY("type_id","pokemon_id")
);
--> statement-breakpoint
CREATE TABLE "pokemons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"pokedex_number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poke_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"<PASSWORD>" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_ability_id_abilities_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."abilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_type_id_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."types"("id") ON DELETE no action ON UPDATE no action;