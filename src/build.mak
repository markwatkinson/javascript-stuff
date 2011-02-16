# command to invoke yui, this is how it is on Ubuntu
YUI = yui-compressor
YUI_FLAGS = 

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

$(MIN_): $(SRC)
	$(YUI) $(YUI_FLAGS) $(SRC) -o $(MIN_)

clean:
	rm -rf $(BIN_DIR)

.PHONY: clean all 
