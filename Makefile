test:
	# Deploy to test environment
	firebase deploy --only hosting:test

dev:
	# Deploy to dev environment
	firebase deploy --only hosting:dev

prod:
	# Deploy to production environment
	firebase deploy --only hosting:prod

orig:
	# Deploy to original environment
	firebase deploy --only hosting:orig


repomix:
	repomix --ignore "node_modules/*,.firebase/*"