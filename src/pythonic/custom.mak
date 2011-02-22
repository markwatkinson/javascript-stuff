
EXTERN = pythonic.js.extern
TEST_SRC = test/compile_test.js

compiletest: $(SRC) $(shell ls *.extern)
	$(JSC) $(JSC_FLAGS) --externs $(EXTERN) --js $(TEST_SRC) >> /dev/null
all::	compiletest




