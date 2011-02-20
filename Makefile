# Rubbish makefile
SRC_DIR = src
OUT_DIR = dist/src
MIN_DIR = dist/min
MAKEFLAGS += --no-print-directory
all:
	cd $(SRC_DIR) && make $(MAKEFLAGS) all
% : 
	cd $(SRC_DIR) && make $(MAKEFLAGS) $@

dist: all
	mkdir -p $(MIN_DIR)
	mkdir -p $(OUT_DIR)
	for j in $(shell ls $(SRC_DIR)/*/ -d); do \
		cp $$j/bin/*.js $(OUT_DIR)/ ; \
	done
	mv $(OUT_DIR)/*.min.js $(MIN_DIR)
	

