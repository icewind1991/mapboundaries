all: build

.PHONY: clean
clean:
	rm -rf dist
	rm -rf node_modules

node_modules: package.json
	npm install

sources=$(wildcard js/*) $(wildcard js/*/*) $(wildcard css/*/*)  $(wildcard css/*)

.PHONY: build
build: node_modules $(sources)
	node node_modules/.bin/webpack --colors --display-error-details --config webpack.prod.config.js

build/js/main.js: build

.PHONY: watch
watch: node_modules
	node node_modules/.bin/webpack-dev-server --hot --inline --config webpack.dev.config.js
