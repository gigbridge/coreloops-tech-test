ALTER TABLE "pokemon_abilities" DROP CONSTRAINT "pokemon_abilities_pokemon_id_pokemons_id_fk";
--> statement-breakpoint
ALTER TABLE "pokemon_moves" DROP CONSTRAINT "pokemon_moves_pokemon_id_pokemons_id_fk";
--> statement-breakpoint
ALTER TABLE "pokemon_types" DROP CONSTRAINT "pokemon_types_pokemon_id_pokemons_id_fk";
--> statement-breakpoint
ALTER TABLE "pokemon_abilities" ADD CONSTRAINT "pokemon_abilities_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_moves" ADD CONSTRAINT "pokemon_moves_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_pokemon_id_pokemons_id_fk" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE cascade ON UPDATE no action;