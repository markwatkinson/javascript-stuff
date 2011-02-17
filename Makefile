# Rubbish makefile
SRC_DIR = src
OUT_DIR = dist/src
MIN_DIR = dist/min

all:
	cd $(SRC_DIR) && make all
% : 
	cd $(SRC_DIR) && make $@

dist: all
	mkdir -p $(MIN_DIR)
	mkdir -p $(OUT_DIR)
	for j in $(shell ls $(SRC_DIR)/*/ -d); do \
		cp $$j/bin/*.js $(OUT_DIR)/ ; \
	done
	mv $(OUT_DIR)/*.min.js $(MIN_DIR)
	

