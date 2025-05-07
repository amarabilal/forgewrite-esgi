# Makefile - Gestion Docker ForgeWrite

PROJECT_NAME=forgewrite

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

restart: down up

ps:
	docker compose ps

bash-api:
	docker compose exec php bash

bash-db:
	docker compose exec db bash

bash-client:
	docker compose exec client bash

reset:
	docker compose down -v
	docker compose build
	docker compose up -d

migrate:
	docker compose exec php php bin/console doctrine:migrations:migrate

fixtures:
	docker compose exec php php bin/console doctrine:fixtures:load --no-interaction

# Affiche l'aide
help:
	@echo "Commandes disponibles :"
	@echo "  make build      → Build des conteneurs"
	@echo "  make up         → Lancement des services en arrière-plan"
	@echo "  make down       → Stop tous les services"
	@echo "  make restart    → Redémarrage complet"
	@echo "  make logs       → Logs en live"
	@echo "  make ps         → Statut des conteneurs"
	@echo "  make bash-api   → Accès terminal container PHP"
	@echo "  make bash-db    → Accès terminal container PostgreSQL"
	@echo "  make reset      → Reset complet (volumes inclus)"
	@echo "  make migrate    → Exécute les migrations Symfony"
	@echo "  make fixtures   → Charge les fixtures Symfony"
