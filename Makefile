flutter:
	flutterflow export-code --project ${FLUTTER_PROJECT_ID} --token ${FLUTTER_API_TOKEN} --include-assets

dev:
	make flutter
	cd fitness_l_l_m && flutter pub add collection:^1.19.1 && flutter clean && flutter build web --debug
	cd fitness_l_l_m && firebase deploy --only hosting:dev,functions

prod:
#	npm run build
	firebase deploy --only hosting:prod,functions

repomix:
	repomix --ignore "node_modules/*,.firebase/*"
