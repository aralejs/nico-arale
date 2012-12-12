THEME = $(HOME)/.spm/themes/arale

build-doc:
	nico build -v -C $(THEME)/nico.js

debug:
	nico server -v -C $(THEME)/nico.js --watch debug

server:
	nico server -v -C $(THEME)/nico.js

.PHONY: build-doc debug server
