SUBDIRS = $(shell ls -d */)

% : 
	for d in $(SUBDIRS); do \
		cd $$d && make $@ && cd ../ ;\
	done

build:
	for d in $(SUBDIRS); do \
		echo "include ../build.mak" > $$d/Makefile; \
	done;


.PHONY: %
