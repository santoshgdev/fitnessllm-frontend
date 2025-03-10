dev:
	firebase deploy --only hosting:dev

prod:
#	npm run build
	firebase deploy --only hosting:prod

repomix:
	repomix --ignore "node_modules/*,.firebase/*"
