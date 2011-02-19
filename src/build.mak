# this is only good for files 1-level deep.
# I'll switch to a better build system if/when I need to.
ROOT = ../..


-include custom.mak

JSC = $(ROOT)/extern/closure-compiler
JSC_EXTERNS += $(shell ls $(ROOT)/extern/*.js)
JSC_FLAGS = --warning_level VERBOSE $(foreach e,$(JSC_EXTERNS), --externs $(e))


# we're assuming each project has exactly 1 JS file which is the same name as
# its directory
NAME = ${shell basename $(shell pwd)}

# input
SRC = $(shell ls *.js) 

# output dir
BIN_DIR = bin/

# output
MIN_ = $(BIN_DIR)/$(NAME).min.js  
SRC_ = $(BIN_DIR)/$(NAME).js

DATE=${shell date +"%d/%m/%y %H:%M:%S"}


all: $(BIN_DIR) $(MIN_) $(SRC_) $(SRC)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)
	
$(SRC_):  $(SRC)
	echo "/* Build date: $(DATE) */" > $(SRC_)
	cat $(SRC) >> $(SRC_)


# closure writes an empty file on failure. This seems to  confuse make
$(MIN_): $(SRC)
	$(JSC) $(JSC_FLAGS) --js $(SRC) --js_output_file $(MIN_) || {\
		rm $(MIN_); \
		false; \
		}

clean:
	rm -rf $(BIN_DIR)

.PHONY: clean all 
