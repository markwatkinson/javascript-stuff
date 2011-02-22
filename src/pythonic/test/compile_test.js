/** Adpated from the test file */

var test;

test = [1,2,3].pyget(1);
test = [1,2,3].pyget(3, null);

test = pyall([1, 2, 3]);
test = pyall(1, 2, 3);
test = pyall([]);
test = pyall();
test = pyall([1, 2, 0]);
test = pyall(1, 2, 0);
test = pyall([0]);
test = pyall(true, false);

test = pyany([1, 2, 3]);
test = pyany(1, 2, 3);
test = pyany([1, 0, 0]);
test = pyany([0, 1, 0]);
test = pyany([0, 0, 1]);
test = pyany(1, 0, 0);
test = pyany(0, 1, 0);
test = pyany(0, 0, 1);
test = pyany([0, 0, 0]);
test = pyany(0, 0, 0);
test = pyany();
test = pyany([]);

test = pymax([1, 2, 3]);
test = pymax([3, 2, 1]);
test = pymax(1, 2, 3);
test = pymax(3, 2, 1);

test = pymin([1, 2, 3]);
test = pymin([3, 2, 1]);
test = pymin(1, 2, 3);
test = pymin(3, 2, 1);
try{
  test = pymin([])  
}catch(e){}
try{test = pymin()}catch(e){}
try{test = pymax([])}catch(e){}
try{test = pymax()}catch(e){}

test = pymax({age:27}, {age:33}, {age:21}, function(x,y){return x.age-y.age;}).age;
test = pymax([{age:27}, {age:33}, {age:21}], function(x,y){return x.age-y.age;}).age;
test = pymax({age:27}, {age:33}, {age:47}, function(x,y){return x.age-y.age;}).age;
test = pymax([{age:51}, {age:33}, {age:21}], function(x,y){return x.age-y.age;}).age;

test = pymin({age:27}, {age:33}, {age:21}, function(x,y){return x.age-y.age;}).age;
test = pymin([{age:27}, {age:33}, {age:21}], function(x,y){return x.age-y.age;}).age;
test = pymin({age:27}, {age:33}, {age:47}, function(x,y){return x.age-y.age;}).age;
test = pymin([{age:51}, {age:19}, {age:21}], function(x,y){return x.age-y.age;}).age;



test = pyrange(10),
test = pyrange(0, 10);
test = pyrange(1, 10);
test = pyrange(-3, 3);
test = pyrange(0, 1);
test = pyrange(0, 0);
test = pyrange(1, 0);
test = pyrange(10, 0, -1);
test = pyrange(10, 0, -2);
test = pyrange(0, 10, 2);
test = pyrange(0, 10, 3);
test = pyrange(0, 10, 5);
test = pyrange(0, 10, 7);
test = pyrange(0, 10, 7);

test = pylist([1, 2, 3]);
test = pylist('hello');
test = pylist();


test = pyenumerate(['h', 'e', 'l', 'l', 'o']);
test = pyenumerate(['h', 'e', 'l', 'l', 'o'], 5);


test = pyzip([1, 5], [2, 6], [3, 7], [4, 8]);
test = pyzip([1, 5]);
test = pyzip( [1, 2, 3], [4, 5], [6]);
test = pyzip([6], [4, 5], [1, 2, 3]);

test = pymap(function(x){return x;}, [1, 2, 3]);
test = pymap(function(x){return x+1;}, [1, 2, 3]);
test = pymap(function(x){return x.toUpperCase();}, 'hello');
test = pymap(function(x){return x.toUpperCase();}, '');
test = pymap(function(x){return x.toUpperCase();}, []);
test = pymap(function(x,y,z){return Number(x)*Number(y)*Number(z);}, [1, 5, 9], [2, 4, 8], [3, 6, 9]);
test = pymap(function(x,y,z){return (x+y)*((z == null)?1 : z);}, [20, 1, 9], [1, 4, 8], [6, 9]);



test = pyfilter(null, [1, 2, 3]);
test = pyfilter(null, [0, 1, 2, 3]);
test = pyfilter(function(x){return x == 'h'}, 'hello');
test = pyfilter(function(x){return !!(Number(x) % 2);}, pyrange(10));

test = pyreduce(function(x,y){return Number(x)+Number(y);}, pyrange(10));
test = pyreduce(function(x,y){return Number(x)+Number(y);}, pyrange(10), 10);
test = pyreduce(function(x,y){return Number(x)*Number(y);}, pyrange(10));
test = pyreduce(function(x,y){return Number(x)*Number(y);}, pyrange(1, 10));
test = pyreduce(function(x,y){return Number(x)*Number(y);}, pyrange(1, 10), 10);


test = 'hello'.pyslice();
test = 'hello'.pyslice(1);
test = 'hello'.pyslice(1, 5);
test = 'hello'.pyslice(1, 4);
test = 'hello'.pyslice(1, -1);
test = 'hello'.pyslice(0, 0);
test = 'hello'.pyslice(1, 0);
test = 'hello'.pyslice(0, 5, -1);
test = 'hello'.pyslice(null, null, -1);
test = 'hello'.pyslice(undefined, undefined, -1);
test = 'hello'.pyslice(5, 0, -1);
test = 'hello'.pyslice(6, 3, -1);



test = 'hello'.pycapitalize();
test = 'Hello'.pycapitalize();
test = '_llo'.pycapitalize();
test = '3llo'.pycapitalize();
test = 'HeLlO'.pycapitalize();
test = 'HELLO'.pycapitalize();

test = 'x'.pycenter(10);
test = 'x'.pycenter(10, '_');
test = 'xx'.pycenter(10, '_');
test = 'xx'.pycenter(1, '_');
test = 'xx'.pycenter(2, '_');

test = '\tx\t'.pyexpandtabs();
test = '\tx'.pyexpandtabs();
test = '\tx'.pyexpandtabs(1);
test = '\tx'.pyexpandtabs(4);

test = 'x'.pyljust(10);
test = 'x'.pyljust(10, '_');
test = 'xx'.pyljust(10);
test = 'xx'.pyljust(10, '_');
test = 'x'.pyrjust(10);
test = 'x'.pyrjust(10, '_');
test = 'xx'.pyrjust(10);
test = 'xx'.pyrjust(10, '_');

test = '123'.pyzfill(4);
test = '+123'.pyzfill(4);
test = '-123'.pyzfill(4);
test = '+-123'.pyzfill(4);
test = ''.pyzfill(4);


test = '01234567890'.pycount('1');
test = '01234567890'.pycount('-1');
test = '01234567890'.pycount('0');
test = '01234567890'.pycount(/\\d/);
test = '01234567890'.pycount(/\\d+/);
test = '01234567890'.pycount('');
test = '01234567890'.pyfind('1');
test = '01234567890'.pyfind('-1');
test = '01234567890'.pyfind('0');
test = '01234567890'.pyfind(/\d/);
test = '01234567890'.pyfind(/\d+/);
test = '01234567890'.pyfind('');
test = '01234567890'.pyrfind('1');
test = '01234567890'.pyrfind('-1');
test = '01234567890'.pyrfind('0');

test = '0123456789'.pyrfind('0');
test = '0123456789'.pyrfind('0', 0, null, false);

test = '01234567890'.pyrfind(/\d/g);
test = '01234567890'.pyrfind(/\d{3}/g);
test = '01234567890'.pyrfind(/\d{3}/g, null, null, false);
test = 'aaaaa'.pyrfind('aa');
test = 'aaaaa'.pyrfind('aa', null, null, false);
test = '01234567890'.pyrfind('');

test = 'xyz'.pyisalnum();
test = 'xyz90'.pyisalnum();
test = 'xyz90_'.pyisalnum();
test = '_'.pyisalnum();
test = ''.pyisalnum();

test = 'xyz'.pyisalpha();
test = 'xyz90'.pyisalpha();
test = 'xyz_'.pyisalnum();
test = ''.pyisalnum();

test = '123456789'.pyisdigit();
test = '123a'.pyisdigit();
test = ''.pyisdigit();

test = 'hello'.pyislower();
test = 'hello  12'.pyislower();
test = 'Hello'.pyislower();
test = ''.pyislower();
test = '43245'.pyislower();

test = 'hello'.pyisspace();
test = '   hello      '.pyisspace();
test = '\\n'.pyisspace();
test = '\\f'.pyisspace();
test = '\\r\\n'.pyisspace();
test = '  '.pyisspace();
test = ' \\t '.pyisspace();
test = ''.pyisspace();

test = 'Title String'.pyistitle();
test = 'Title_String'.pyistitle();
test = 'Title101String'.pyistitle();
test = 'Title STring'.pyistitle();
test = 'TitLe_String'.pyistitle();
test = 'TitlE101String'.pyistitle();
test = 'title string'.pyistitle();
test = 'T string'.pyistitle();
test = 'T S'.pyistitle();
test = ''.pyistitle();

test = 'HELLO'.pyisupper();
test = 'H3LL0  12'.pyisupper();
test = 'HI THERE!'.pyisupper();
test = 'hello'.pyisupper();
test = 'hello  12'.pyisupper();
test = 'Hello'.pyisupper();
test = ''.pyisupper();
test = '43245'.pyisupper();



test = ','.pyjoin([1, 2, 3]);
test = ''.pyjoin([1, 2, 3]);
test = ''.pyjoin(['h', 'e', 'l', 'l', 'o']);


test = 'hello'.pylower();
test = 'HELLO'.pylower();
test = 'Hello'.pylower();
test = 'Hello1234'.pylower();
test = 'hello'.pyupper();
test = 'HELLO'.pyupper();
test = 'Hello'.pyupper();
test = 'Hello1234'.pyupper();


test = 'one two three'.pypartition('two');
test = 'one | three'.pypartition('|');
test = 'one | | three'.pypartition('|');

test = 'one two three'.pyrpartition('two');
test = 'one | three'.pyrpartition('|');
test = 'one | | three'.pyrpartition('|');

test = 'one two three'.pysplit('two');
test = 'one two three'.pyrsplit('two');
test = ' 1  2   3  '.pysplit();
test = '1,2,3,4,5,6,'.pysplit(',');
test = '1,2,3,4,5,6,'.pyrsplit(',');
test = '1,2,3,4,5,6,'.pysplit(',', 3);
test = '1,2,3,4,5,6,'.pyrsplit(',', 3);
test = 'hello'.pysplit('');
test = 'hello'.pyrsplit('');
test = 'hello'.pysplit('', 1);
test = 'hello'.pyrsplit('', 1);
test = 'hello'.pyrsplit('', 2);
test = 'hello'.pyrsplit('', 3);
test = 'hello'.pyrsplit('', 4);
test = 'hello'.pyrsplit('', 5);

test = ' 1  2   3  '.pyrsplit();


test = 'line1\\nline2\\r\\nline3\\r'.pysplitlines();
test = 'line1\\nline2\\r\\nline3\\r'.pysplitlines(true);
test = 'line1\\nline2\\r\\nline3'.pysplitlines();
test = 'line1\\nline2\\r\\nline3'.pysplitlines(true);
test = 'line1\\nline2\\r\\nline3\\n\\n'.pysplitlines();
test = 'line1\\nline2\\r\\nline3\\n\\n'.pysplitlines(true);




test = 'hello'.pystrip();
test = 'hello  '.pystrip();
test = '  hello'.pystrip();
test = 'hello_'.pystrip('_');
test = 'hello'.pystrip('eh');



test = '0123456789'.pyendswith('9');
test = '0123456789'.pyendswith('89');
test = '0123456789'.pyendswith('8');
test = '0123456789'.pyendswith('79');
test = '0123456789'.pystartswith('0');
test = '0123456789'.pystartswith('01');
test = '0123456789'.pystartswith('1');
test = '0123456789'.pystartswith('02');

test = '0123456789'.pystartswith(['0', '1', '2']);
test = '0123456789'.pystartswith(['3', '1', '2']);
test = '0123456789'.pyendswith(['9', '1', '2']);
test = '0123456789'.pyendswith(['3', '1', '2']);

test = '00000'.pyreplace('0', '1');
test = '00000'.pyreplace('0', '1', 1);
test = '00000'.pyreplace(/0{2}/g, '1', 1);
test = '00000'.pyreplace(/0{2}/g, '1');

test = 'hello'.pyswapcase();
test = 'HELLO'.pyswapcase();
test = 'hElLo'.pyswapcase();
test = 'h3Llo'.pyswapcase();
test = ''.pyswapcase();
test = '12345 '.pyswapcase();

test = 'this is a title'.pytitle();
test = 'HELLO'.pytitle();
test = 'hElLo'.pytitle();
test = 'h3Llo'.pytitle();
test = ''.pytitle();
test = '12345 '.pytitle();


test = pysum([1, 2, 3]);
test = pysum([1, 2, 4]);
test = pysum([1, 2, 4], 3);
test = pyproduct([1, 2, 3]);
test = pyproduct([1, 2, 4]);
test = pyproduct([1, 2, 4], 3);

test = '{{}}'.pyformat(23);
test = '{} {}'.pyformat('hi', 'there');
test = '{name}'.pyformat({x:'1',name:'barry'});
test = '{0.name}'.pyformat({x:'1',name:'barry'});
test = '{1.name}'.pyformat({x:'1',name:'barry'},{x:'2',name:'brian'});

var f=function(x){return x+1;}; 
var g=function(x){return x*2;}; 
var h=function(x){return x-3;};  
pycompose([f,g,h])(10);
f=function(x){return x+1;}; g=function(x){return x*2;}; h=function(x){return x-3;};  pycompose(f,g,h)(10);

