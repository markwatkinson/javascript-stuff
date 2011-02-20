SUBDIRS = $(shell ls -d */)
% : 
	for d in $(SUBDIRS); do \
		echo "Building $$d"; \
		cd $$d && make -s $@ && cd ../ ;\
	done

build:
	for d in $(SUBDIRS); do \
		echo "include ../build.mak" > $$d/Makefile; \
	done;


.PHONY: %
