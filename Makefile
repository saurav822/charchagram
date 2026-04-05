# ============================================================
# CharchaGram Monorepo — Developer Commands
# ============================================================
# Usage: make <target>
# Requires: node >=18, npm >=9

.PHONY: help install dev build test lint typecheck clean logs

# Default target: print help
help:
	@echo ""
	@echo "CharchaGram Monorepo — available commands:"
	@echo ""
	@echo "  make install     Install all workspace dependencies"
	@echo "  make dev         Start frontend + backend in watch mode (concurrent)"
	@echo "  make build       Production build (frontend)"
	@echo "  make test        Run all unit tests"
	@echo "  make lint        Lint frontend code (ESLint)"
	@echo "  make lint-fix    Auto-fix lint issues"
	@echo "  make typecheck   Run TypeScript type checking (shared + frontend)"
	@echo "  make clean       Remove node_modules and build artefacts"
	@echo "  make seed        Seed the database with sample data"
	@echo ""

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

lint-fix:
	npm run lint:fix

typecheck:
	npm run typecheck

# Seed the backend database (requires MONGO_URI in apps/backend/.env)
seed:
	npm run seed --workspace=apps/backend

# Remove all generated artefacts for a clean slate
clean:
	rm -rf node_modules apps/frontend/node_modules apps/backend/node_modules packages/shared/node_modules
	rm -rf apps/frontend/.next apps/frontend/out
	rm -rf packages/shared/dist
	@echo "Cleaned all node_modules and build artefacts."
