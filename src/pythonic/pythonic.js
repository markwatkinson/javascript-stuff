/*
Copyright (c) 2011, Mark Watkinson
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MARK WATKINSON BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/** 
 * 
 * This module implements a lot of the Python string methods for JavaScript,
 * really because JS is pretty lacking in terms of useful functionality and 
 * Python isn't. Slicing is supported via a method (also applies to arrays).
 * 
 * TODO:
 *      Missing functions: decode, encode and translate,
 *      More complete format() implementation,
 *      Maybe the 'private' stuff should be wrapped in a function
 * 
 * I got bored with the docs, but each function should do what it says it does
 * on the python docs
 * http://docs.python.org/library/stdtypes.html#string-methods
 * 
 * NOTE: This is implmented intended for compilation by Google Closure. 
 * Some parts of the source may have specific redundancies to shut the compiler
 * up.
 */


/** Global functions */
// for some reason if we use a single var statement the compiler complains 
// about multiple variables with shared type information. I have no idea what
// that means, nor does googling reveal anything, but declaring pyall 
// separately makes it be quiet
var pyall;
var pyany, 
    pyenumerate,
    pymap,
    pyfilter,
    pyreduce,
    pycompose,
    pymax,
    pymin,
    pyzip,
    pyrange,
    pylist,
    pysum,
    pyproduct;

(function() {
  /**
   * Shamelessly stolen from http://simonwillison.net/2006/Jan/20/escape/#p-6
   * @param {string} text 
   * @return {string}
   */
  RegExp.pyescape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');    
  }

  /**
   * @param {*} val
   * @return {boolean}
   */
  function __py_is_none(val) {
    return (typeof val === 'undefined' || val === null);
  }
  /**
   * @param {*} val
   * @return {boolean}
   */
  function __py_is_not_none(val) {
    return !__py_is_none(val);
  }

  /**
   * @param {number|string} val1
   * @param {number|string} val2
   * @return {number|string}
   */
  function __py_cmp(val1, val2) {
    // pymax/pymin depends on this, so using those would be infinitely recursive
    if (val1 < val2) return -1;
    else if (val1 > val2) return 1;
    else return 0;
  }

 /**
  * Call this from functions which accept variable length arg lists OR arrays.
  * It will return the 'real' argument list.
  * @param {Object|Array} args_
  * @param {boolean=} accept_array
  * @return {Array}
  */
  function __py_args_to_array(args_, accept_array) {
    var args;
    
    if (typeof args_ === 'undefined' || args_ === null) args = [];
    else args = Array.prototype.slice.call(args_);
    // XXX: Konqueror is borking on this and thinks that args.constructor is
    // '[function]', so we're adding the instanceof check    
    if (args.length == 1 && accept_array 
      &&  (args[0].constructor.toString().indexOf('Array') !== -1
        || args[0] instanceof Array) )
      {
      args = args[0].slice(0);
    }
    return args;
  }

  /**
  * Slice range finder, so it can be used by both arrays and strings.
  * call with `this' set.
  * @param {?number=} start
  * @param {?number=} end 
  * @param {?number=} stride
  * @return {Array}
  * @this {Array|string}
  */
  function __py_slice_range(start, end, stride) {
    var out = '',
        swap,
        i,
        sign,
        l, 
        start_default,
        end_default,
        start_max,
        end_max,
        start_min,
        end_min;
        
    stride = (__py_is_none(stride))? 1 : stride;
    if (stride == 0)
      throw 'Slice step cannot be zero';  
    sign = (stride < 0)? -1 : 1;
    start_default = (sign == -1)? this.length-1 : 0;
    end_default = (sign == -1)? -1 : this.length;
    
    start = (__py_is_none(start))? start_default : start;
    end = (__py_is_none(end))? end_default : end;

    l = this.length;
    start_max = (sign == -1)? l-1 : l;
    
    end_max = (sign == -1)? l : l; // ?
    start = Math.min(start, start_max);
    end = Math.min(end, end_max);
    start_min = 0;
    end_min = (sign == -1)? -1 : 0;
    while(start < start_min) start += l;
    while(end < end_min) end += l;
    

    return [start, end, stride, sign];
  }


  /* A few array/string independent accessor methods */
  
  /**
   * @param {number} i
   * @param {string=} def 
   * @return {string|undefined}
   */
  String.prototype.pyget = function(i, def) { 
    return (i < this.length) ? this.charAt(i) : def;
  }
  /**
   * @param {number} i
   * @param {*=} def 
   * @return {*}
   */
  Array.prototype.pyget = function(i, def) { 
    return (i < this.length) ? this[i] : def;
  }
  
  
  // firebug gives me invalid assignments when trying to do this = ... 
  // so i'm doing it with a function, not method
  
  /**
   * @param {!string|!Array} obj
   * @param {*} append 
   * @return {!string|!Array}
   */
  function __py_push(obj, append) {
    if (typeof obj === 'string')
      obj += append;
    else
      obj.push(append);
    return obj;
  }
  
  /**
   * @param {string|Array} obj
   * @param {*} prepend
   * @return {string|Array}
   */
  function __py_prepend(obj, prepend) {
    if (typeof obj === 'string')
      obj = prepend + obj;
    else
      obj.unshift(prepend);
    return obj;
  }

  /**
   * @param {*} obj
   * @return {*}
   */
  function __py_identity_func(obj) {
    return obj;
  }

 /**
  * returns true if all objects in obj evaluate to true, or if obj is empty
  * @param {...*} var_args
  * @return {boolean}
  */
  pyall = function(var_args) {
    var i, l, obj = __py_args_to_array(arguments, true);
    l = obj.length;
    for (i=0; i<l; ++i) {
      if (!obj.pyget(i))
        return false;
    }
    return true;
  }

 /**
  * returns true if any objects in obj evaluate to true.
  * Returns false if obj is empty
  * @param {...*} var_args
  * @return {boolean}
  */
  pyany = function(var_args) {
    var i, l, obj = __py_args_to_array(arguments, true);
    l = obj.length;
    for (i=0; i<l; ++i) {
      if (obj.pyget(i))
        return true;
    }
    return false;
  }
 /**
  * Enumerates a sequence. Returns a list of [n, e] where n is an integer 
  * and e is an element in the sequence, such that the index of e in seq is
  * n+start
  * @param {Array} seq
  * @param {number=} start
  * @return {Array.<Array.<number, *>>}
  */
  pyenumerate = function(seq, start) {
    var i=0, out=[], z;
        
    // the second check is superfluous, but the compiler seems to miss the 
    // first one. We are just suppressing the warning.
    if (__py_is_none(start) || typeof start === 'undefined')
      start = 0;    
    z = pyrange(start, seq.length + start);
    return pyzip(z, seq);
  }

  /**
   * standard array map function
   * @param {function(*,...):*} func 
   * @param {...Array|string} var_args
   * @return {Array|string}
   */
  pymap = function(func, var_args) {
    var i, j,
        args = __py_args_to_array(arguments).slice(1),
        max = 0,
        out = [],
        func_args;
    for (i=0; i<args.length; i++)
      max = pymax(max, args[i].length);
    if (__py_is_none(func))
      func = __py_identity_func;
      
    for(i=0; i<max; ++i) {
      func_args = [];
      for (j=0; j<args.length; j++) {      
        func_args.push(args.pyget(j).pyget(i, null));
      }
      out = __py_push(out, func.apply(null, func_args));
    }
    return out;
  }
  
  /**
   * standard array filter function
   * @param {?function(*,...):boolean} func 
   * @param {Array|string} obj
   * @return {Array|string}
   */
  pyfilter = function(func, obj) {
    var i, l=obj.length, 
        out = (typeof(obj) === 'string')? '' : [],
        t;
    if (__py_is_none(func))
      func = __py_identity_func;
    for(i=0; i<l; ++i) {
      if (func(obj.pyget(i)))
        out = __py_push(out, (obj.pyget(i)));
    }
    return out;    
  }
  /**
   * standard reduce function
   * @param {function(*, *):*} func 
   * @param {Array} obj 
   * @param {*=} initializer
   * @return {*}
   */
  pyreduce = function(func, obj, initializer) {
    var i, l, out;
    if (__py_is_not_none(initializer))
      obj = __py_prepend(obj, initializer);
    l = obj.length;
    if (!l)
      throw 'reduce() of empty sequence with no initial value';
    out = obj.pyget(0);
    for (i=1; i<l; ++i)
      out = func(out, obj.pyget(i));
    return out;
  }

  /**
   * Standard compose function
   * @param {...function(*):*|Array.<function(*):*>} funcs
   * @return {function(*):*}
   */
  pycompose = function(funcs) {  
    funcs = __py_args_to_array(arguments, true);
    // is this right? o.o
      var func = pyreduce( 
      function (f, g) {
        return function () {
          return f(g.apply(null, arguments));
        };
      }, funcs);
      // Wrapping this shuts up the compiler as it knows we're returning
      // a function now. It didn't believe us before.
      return function(x) { return func(x); };
  }

 /**
  * variable argument list / may be array.
  * Last argument may optionally be a cmp function.
  * @param {...*} var_args
  * @return {number}
  */  
  pymax = function(var_args) {
    var args = Array.prototype.slice.call(arguments),
        l, i, t, t_, cmp=__py_cmp;
    l = args.length;
    if (!l)
      throw 'max expected 1 arguments, got 0';
    if (l > 1 && typeof(args[l-1]) === 'function') {
      cmp = args[l-1];
      args = args.pyslice(0, -1);
    }
    args = __py_args_to_array(args, true);
    l = args.length;
    
    t = args[0];
    for (i=1; i<l; i++) {
      t_ = args[i];
      if (cmp(t_,t) > 0)
        t = t_;
    }
    return t;
  }
  /**
   * variable argument list / may be array.
   * Last argument may optionally be a cmp function.
   * @param {...*} var_args
   * @return {number}
   */  
  pymin = function(var_args) {
    var args = Array.prototype.slice.call(arguments),
        l, i, t, t_, cmp=__py_cmp;
    l = args.length;
    if (!l)
      throw 'min expected 1 arguments, got 0';
    if (l > 1 && typeof(args[l-1]) == 'function') {
      cmp = args[l-1];
      args = args.pyslice(0, -1);
    }
    args = __py_args_to_array(args, true);
    
    l = args.length;
    t = args[0];
    for (i=1; i<l; i++) {
      t_ = args[i];
      if (cmp(t_,t) < 0)
        t = t_;
    }
    return t;
  }

 /** 
  * Zips together multiple sequences.
  * Variable argument list
  * @param {...Array.<*>} var_args
  * @return {Array.<*>}
  */
  pyzip = function(var_args) {
    var args = Array.prototype.slice.call(arguments),
      limit,
      i,j, out, arg_len,
      lens;
    lens = pymap(function(e){return e.length;}, args);
    limit = pymin(lens);
    arg_len = args.length;
    out = [];
    for (i=0; i<limit; i++)
      out.push([]);
    for (i=0; i<limit; i++)
    {
      for (j=0; j<args.length; j++)
        out[i].push(args.pyget(j).pyget(i));
    }
    return out;
  }


  /**
    * Returns a range between start and end incrementing in intervals of stride
    * @param {number} start
    * @param {number=} end
    * @param {number=} stride
    * @return {Array.<number>}
    */
  pyrange = function(start, end, stride) {
    var range,
        out = [],
        sign;
    if (__py_is_none(end) && __py_is_none(stride)) {
      end = start;
      start = 0;
    }
    if (__py_is_none(stride) || stride == 0)
      stride = 1;

    sign = (stride>0)? 1 : -1;

    // not a legal range
    if (sign > 0 && start > end
      || sign < 0 && start < end    
      || !stride
    )
      return out;
      
    var lim = (end-start)/stride;
    
    for (var i=0; i<lim; i++) {    
      __py_push(out, start);
      start += stride;
    }
    return out;
  }

 /**
  * Converts an object to a list.
  * Current inputs may be either an object, string, or array
  * @param {Object|string|Array=} obj 
  * @return {Array}
  */
  pylist = function(obj) {
    var out = [];
    // check for string first to appease the compiler, otherwise it 
    // gets confused and things that the Array check block might be a string.
    if (typeof(obj) === 'string')
      return obj.split('');
    else if (typeof obj === 'undefined' || obj === null)
      return [];    
    else if (obj.constructor.toString().indexOf('Array') !== -1
      || obj instanceof Array // konqueror
    ) 
      return obj.slice(0);
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        out.push(key);
    }
    return out;
  }


  
   /** 
    * Returns the sum of a sequence 
    * @param {Array.<number>} obj
    * @param {number=} start
    * @return {number}
    */
  pysum = function(obj, start) {
    var sum = pyreduce(function(x,y){return x+y;}, obj, start);
    // suppress compiler warning
    return Number(sum);
  }
  /** Returns the product of a sequence
   * @param {Array.<number>} obj
   * @param {number=} start
   * @return {number}
   */
  pyproduct = function(obj, start) {
    var product = pyreduce(function(x,y){return x*y;}, obj, start);
    // suppress compiler warning    
    return Number(product);
  }


  /**
  * Adds some Python-style string formatting options to the string object. 
  * 
  * Usage: '{0} {1}'.pyformat('hello', 'world')
  * 
  * Formatting operations are specified in the string as {...}
  * Examples:
  * "{0}, {1}, {2}", etc - references the nth argument
  * "{}, {}, {}", etc - same as above (but don't mix this with the above!)
  * "{named}" - references the named index (of the first argument)
  * {1.named} - references the named index of the second argument
  * 
  * 
  * Use {{ and }} to escape curly braces.
  * This is not as powerful as Python's.
  * 
  * @param {...*} var_args
  * @return {string}
  *  
  */

  String.prototype.pyformat = function(var_args) { 
    var regex = /\{\{|\}\}|\{\s*(.*?)\s*\}/g,
        $i = 0,
        args = Array.prototype.slice.call(arguments),
        str,
        groups;
    str = this.replace(regex, function($1, $2) {
      var ret = undefined;
      // escape sequences
      if ($1 == ('{{'))
        return '{';
      else if ($1 == '}}')
        return '}';
      try {
        if (!$2.length)
          ret = args[$i++];
        else if ($2.match(/^\d+$/))
          ret = args[$2];
        else if ($2.match(/^(\w+)$/))  {
          ret = args[0][$2];
        }
        else if( (groups = /^(\w+|\d+)\.(.+)$/.exec($2))) 
          ret = args[groups[1]][groups[2]];
      } catch (err) {}
      return ret;
    });
    return str;
  }




 /**
  * This is equivalent to Python slice notation some_list[x:y:z]
  * Use undefined or null to make any argument take the default.
  * 
  * @param {?number=} start
  * @param {?number=} end
  * @param {?number=} stride
  * @return {string}
  */
  String.prototype.pyslice = function(start, end, stride) {
    var range = __py_slice_range.call(this, start, end, stride),
        out = '',
        sign;
    start = range[0];
    end = range[1];
    stride = range[2]; 
    sign = range[3];
  
    // not a legal range
    if (stride > 0 && start > end
      || stride < 0 && start < end
      || !stride
    )
      return out;
    
    for ( ; start != end && start >= 0 && start < this.length; start += stride)
      out += this.charAt(start);
    return out;
  }


 /**
  * This is equivalent to Python slice notation some_list[x:y:z]
  * Use undefined or null to make any argument take the default.
  * 
  * @param {number=} start
  * @param {number=} end
  * @param {number=} stride
  * @return {Array}
  */
  Array.prototype.pyslice = function(start, end, stride) {
    var range = __py_slice_range.call(this, start, end, stride),
        out = [],
        sign;
    start = range[0];
    end = range[1];
    stride = range[2]; 
    sign = range[3];
    // not a legal range
    if (sign > 0 && start > end
      || sign < 0 && start < end
      || !stride    
    )
      return out;
    
    for ( ; start != end && start >= 0 && start < this.length; start += stride)
      out.push(this[start]);
    return out;
  }

 /** 
  * Returns a copy where the first letter of the string is capitalized and
  * the remaining string is lower cased.
  * @return {string}
  */
  String.prototype.pycapitalize = function() {
    if (this.length)
      return this.charAt(0).toUpperCase() +
        ((this.length > 1)? this.slice(1).toLowerCase() : '');
    return '';
  }

 /**
  * returns the centered string surrounded by fillchar (default: space) which 
  * in total spans the given width. If this can't fit perfectly centered, the 
  * overflow will be appended.
  * @param {number} width
  * @param {string=} fillchar
  * @return {string}
  */
  String.prototype.pycenter = function(width, fillchar) {
    if (__py_is_none(fillchar) || fillchar.length == 0)
      fillchar = ' ';
    if (fillchar.length > 1)
      fillchar = fillchar.charAt(0);
    var strlen = this.length,
        surrounding_length = Math.floor((width - strlen)/2),
        i=0,
        s = '',
        output;
    
    for (i=0; i<surrounding_length; ++i)
      s += fillchar;
    output = s + this + s;
    while(output.length < width)
      output = output + fillchar;
    return output;
  }

  /**
  * Counts the number of non-overlapping substring occurrances between the 
  * given indices (slice notation).
  * @param {string|RegExp} sub
  * @param {number=} start
  * @param {number=} end
  * @return {number}
  */
  String.prototype.pycount = function(sub, start, end) {
    if (typeof sub === 'string') {
      // This is how python handles the empty string    
      if (!sub.length)
        return this.length + 1;
      sub = RegExp( RegExp.pyescape(sub), 'g');
    }
    // IE's split is broken.
    return this.pyslice(start, end).pysplit(sub).length-1;  
  }

 /**
  * Checks if a string ends with another string.
  * Start/end are slice notation and optional
  * @param {string|Array.<string>} suffix
  * @param {number=} start
  * @param {number=} end
  * @return {boolean}
  */
  String.prototype.pyendswith = function(suffix, start, end) {
    var suff_array = [], sliced = this.pyslice(start, end), i, s;
    if (typeof(suffix) === 'string') 
      suff_array = [suffix];
    else 
      suff_array = suffix;
    
    for(i=0; i<suff_array.length; i++) {
      s = suff_array[i];
      if (sliced.length < s.length)
        continue;
      if (sliced.substr(sliced.length-s.length) == s)
        return true;
    }
    return false;
  }

 /**
  * Expands tabs to the given number of spaces (default: 8)
  * The python docs are a bit cryptic for this one so I might be missing
  * a special case
  * 
  * @param {number=} tabsize
  * @return {string}
  */
  String.prototype.pyexpandtabs = function(tabsize) {
    var spaces = '';
    if (__py_is_none(tabsize) || tabsize < 0)
      tabsize = 8;
    for(var i=0; i<tabsize; i++)
      spaces += ' ';
    return this.replace(/\t/g, spaces);
  }

  /**
  * Returns the lowest index of a substring.
  * @param {string|RegExp} sub
  * @param {number=} start
  * @param {number=} end
  * @return {number}
  */
  String.prototype.pyfind = function(sub, start, end) {
    var sliced,
        slice_diff,
        index;
    if (typeof(sub) === 'string')
      sub = new RegExp( RegExp.pyescape(sub) );
    
    // ah, we need to know the index of the successful slice
    sliced = this.pyslice(start);
    slice_diff = this.length - sliced.length;
    // now this is the real slice
    sliced = this.pyslice(start, end)
    index = sliced.search(sub);
    return (index == -1)? index : slice_diff + index;
  }


  /**
  * Same as find, but throws exception if not found
  * @param {string} sub
  * @param {number=} start
  * @param {number=} end 
  * @return {number}
  */
  String.prototype.pyindex = function(sub, start, end) {
    var ret = this.pyfind(sub, start, end);
    if (ret === -1)
      throw 'substring not found';
    return ret;
  }


  /* 
  * I'm making the unfounded assumptions with these that \w, \d etc is locale 
  * aware 
  * 
  * These aren't fast.
  */
  
  /**
   * @return {boolean}
   */
  String.prototype.pyisalnum = function() {
    return this.search(/^\w+$/) > -1 && this.search(/_/) == -1;
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyisalpha = function() {
    // hmm
    return this.search(/^\w+$/) > -1 && this.search(/[\d_]/) == -1;
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyisdigit = function() {
    return this.search(/^\d+$/) > -1;
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyislower = function() {
    return this.toLowerCase() == this && this.toUpperCase() != this;
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyisspace = function() {
    return this.search(/^\s+$/) > -1;
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyistitle = function() {
    var s = this.pysplit(/[\W_\d]+/),
        i=0,
        l, checked=false; 

    for (i=0; i<s.length; i++) {
      if (!s[i].length)
        continue;
      checked = true;
      if (!s[i].charAt(0).pyisupper()) return false;    
      l = s[i].pyslice(1);
      if (l.length && !l.pyislower()) return false;
    }
    return checked;    
  }
  /**
   * @return {boolean}
   */
  String.prototype.pyisupper = function() {
    return this.toLowerCase() != this && this.toUpperCase() == this;
  }
  /**
   * @param {Array} array
   * @return {string}
   */
  String.prototype.pyjoin = function(array) {
    return array.join(this);
  }
  /**
   * @param {number} width
   * @param {string=} fillchar
   * @return {string}
   */
  String.prototype.pyljust = function(width, fillchar) {
    var cpy = this.pyslice(0);
    if (__py_is_none(fillchar))
      fillchar = ' ';
    while(cpy.length <  width)
      cpy += fillchar;
    return cpy;
  }
  
  /**
   * @return {string}
   */
  String.prototype.pylower = function() {
    return this.toLowerCase();
  }
  /**
   * @param {string=} chars
   * @return {string}
   */
  String.prototype.pylstrip = function(chars) {
    var cpy = this.pyslice(0);
    // second cond is redundant but suppresses compiler warning
    if (__py_is_none(chars) || typeof chars === 'undefined')
      chars = '\\s';
    else
      chars = RegExp.pyescape(chars);
    return cpy.replace(new RegExp('^[{0}]+'.pyformat(chars)), '');
  }
  /**
   * @param {string|RegExp} sep
   * @return {Array.<string>}
   */
  String.prototype.pypartition = function(sep) {
    var index,
        text;
    if (typeof(sep) === 'string')
      sep = RegExp.pyescape(sep);
    index = this.search(sep);
    if (index === -1)
      return [this.pyslice(0), '', ''];
    text = this.match(sep)[0];
    return [this.pyslice(0, index),
      text,
      this.pyslice(index + text.length)];
  }

  /**
   * @param {string|RegExp} sep
   * @return {Array.<string>}
   */
  String.prototype.pyrpartition = function(sep) {
    var index,
        text,
        matches;
    if (typeof(sep) === 'string')
      sep = new RegExp(RegExp.pyescape(sep), 'g');

    matches = this.match(sep);
    if (!matches.length)
      return ['', '', this];
    index = this.pyrfind(matches[matches.length-1]);
    if (index == -1) 
      return ['', '', this.pyslice(0)];
    return [ this.pyslice(0, index),
      this.pyslice(index, index + matches[matches.length-1].length),
      this.pyslice(index + matches[matches.length-1].length)];
  }
  
  /**
   * @param {string|RegExp} old
   * @param {string} new_
   * @param {number=} count
   * @return {string}
   */
  String.prototype.pyreplace = function(old, new_, count) {
    var count_ = 0;
    if (__py_is_none(count))
      count = -1;
    if (typeof(old) === 'string')
      old = new RegExp(RegExp.pyescape(old), 'g');
    
    return this.replace(old, function($1) {
      if (count_ == count)
        return $1;
      count_++;
      return new_;
    });
  }
  /**
   * @param {string|RegExp} sub 
   * @param {?number=} start
   * @param {?number=} end 
   * @param {?boolean=} rtl
   * @return {number}
   */
  String.prototype.pyrfind = function(sub, start, end, rtl) {
    var last = -1,
        next = -1,
        matches,
        sliced = this.pyslice(start),
        slice_offset = this.length-sliced.length;
    if (typeof(sub) === 'string')
      sub = RegExp(RegExp.pyescape(sub), 'g');
    if (!sub.global)
      throw 'pyrfind called with a non-global regular expression';
    sliced = this.pyslice(start, end);
    
    if (__py_is_none(rtl))
      rtl = true;
    // sub may be a reference to a regex object, which may be re-used so
    // we need to reset this. Strangely, not doing so only triggers problems in IE
    sub.lastIndex = 0;
    while ((matches = sub.exec(sliced)) != null) {
      last = matches.index;
      // infinite loop prevention on zero length matches
      if (rtl) 
        sub.lastIndex = matches.index+1;
        
      else if (matches.index == sub.lastIndex)
        sub.lastIndex++; 
      
    }  
    return (last == -1)? -1 : last + slice_offset;
  }
  
  /**
   * @param {string} sub 
   * @param {?number=} start
   * @param {?number=} end 
   * @return {number}
   */
  String.prototype.pyrindex = function(sub, start, end) {
    // Duck typing the regex check because nothing else works reliably    
    // http://stackoverflow.com/questions/4339288/typeof-for-regexp    
    if (!!(sub && sub.test && sub.exec && 
      (typeof sub.ignoreCase !== 'undefined' && (
        sub.ignoreCase || sub.ignoreCase === false)))) {
      if (typeof sub.global !== 'undefined' && !sub.global)
        throw 'pyrindex called with a non-global regular expression';
    }
    var index = this.pyrfind(sub, start, end);
    if (index == -1)
      throw 'substring not found';
    return index;
  }
  /** 
   * @param {number} width
   * @param {?string=} fillchar
   * @return {string}
   */
  String.prototype.pyrjust = function(width, fillchar) {
    var cpy = this.pyslice(0);
    if (__py_is_none(fillchar) || fillchar.length > 1)
      fillchar = ' ';
    while (cpy.length < width)
      cpy = fillchar + cpy;
    return cpy;
  }
  /**
   * @param {?string=} chars
   * @return {string}
   */
  String.prototype.pyrstrip = function(chars) {
    if (__py_is_none(chars) || typeof chars === 'undefined' || chars === null)
      chars = '\\s';
    else
      chars = RegExp.pyescape(chars);
    return this.replace(new RegExp('[{0}]+$'.pyformat(chars)), '');
  }
  /**
   * @param {string|RegExp=} sep 
   * @param {number=} maxsplit
   * @return {Array.<string>}
   */
  String.prototype.pysplit = function(sep, maxsplit) {  
    var cpy = this.substring(0),
        out = [],
        count = 0,
        i = 0,
        substr = this.slice(0);
        
    // special case
    if (sep === '') {
      // for some reason 'this' has morphed into an 'object' not a string :-\
      var t = pylist(substr);
      if (__py_is_not_none(maxsplit)) {
        if (t.length > maxsplit) {
          t[maxsplit] = t.pyslice(maxsplit).join('');
          t = t.pyslice(0, maxsplit+1);
        }
      }
      return t;
    }
    else if(__py_is_none(sep) || typeof sep === 'undefined') {
      sep = /\s+/g;
      // python compatability
      substr = substr.replace(/^\s+|\s+$/g, '');
    }
    else if (typeof(sep) === 'string')
      sep = new RegExp(RegExp.pyescape(sep), 'g');
    
    if (__py_is_none(maxsplit))
      maxsplit = -1;
    
    while (substr.length) {
      var index = substr.pyfind(sep);
      var sep_matches = substr.match(sep);
      if (index == -1 || !sep_matches.length)
        break;
      out.push(substr.pyslice(0, index));
      substr = substr.pyslice(index + Math.max(sep_matches[0].length, 1));
      if (++count == maxsplit)
        break;
    }
    out.push(substr);
    return out;
  }

  /**
  * @param {string|RegExp=} sep 
  * @param {number=} maxsplit
  * @return {Array.<string>}
  */
  String.prototype.pyrsplit = function(sep, maxsplit) {  
    var cpy = this.substring(0),
        out = [],
        count = 0,
        i = 0,
        substr = this.slice(0);
        
    // special case
    if (sep === '') {
      // for some reason 'this' has morphed into an 'object' not a string :-\
      var t = pylist(this.substring(0));
      if (__py_is_not_none(maxsplit)) {
        if (t.length > maxsplit) {
          t[t.length-maxsplit - 1] = t.pyslice(0, t.length-maxsplit).join('');
          t = t.pyslice(t.length-maxsplit - 1);
        }
      }
      return t;
    }
    else if (__py_is_none(sep)) {
      sep = /\s+/g;
      // python compatability
      substr = substr.pystrip();
    }
    else if (typeof(sep) === 'string')
      sep = new RegExp(RegExp.pyescape(sep), 'g');
    
    if (!sep.global)
      throw 'pyrsplit called with a non-global regular expression';

    while (substr.length) {    
      var index = substr.pyrfind(sep, null, null, false);
      if (index == -1)
        break;
      // this would break if JS supported lookbehind assertions
      // lucky for us it doesn't.
      var sep_matches = substr.substring(index).match(sep);
      if (sep_matches == null || !sep_matches.length)
        break;
      out.push(substr.pyslice(index 
        + Math.max(sep_matches[sep_matches.length-1].length, 1)
      ));
      substr = substr.pyslice(0, index);
      if (++count == maxsplit)
        break;
    }
    out.push(substr);
    out.reverse();
    return out;
  }
  /**
   * @param {boolean=} keepends
   * @return {Array.<string>}
   */
  String.prototype.pysplitlines = function(keepends) {
    var newlines, 
        out=[],
        cpy=this.substr(0),
        regex;  
    if (__py_is_none(keepends))
      keepends = false;
    newlines = (keepends)? this.match(/\r\n|\r|\n/g) : [];
    if (newlines == null) newlines = [];
    cpy = cpy.replace(/(\r\n|\r|\n)$/g, '');  
    out = cpy.pysplit(/\r\n|\r|\n/g);
    for(var i=0; i<newlines.length; i++) {
      if (typeof(out[i]) == 'undefined')
        out[i] = newlines[i];
      else
        out[i] += newlines[i];
    }
    return out;
  }

  /**
   * @param {Array.<string>|string} suffix
   * @param {number=} start
   * @param {number=} end 
   * @return {boolean}
   */
  String.prototype.pystartswith = function(suffix, start, end) {
    var suff_array = [], sliced = this.pyslice(start, end), i, s;
    if (typeof(suffix) == 'string') 
      suff_array = [suffix];
    else 
      suff_array = suffix;
    
    for(i=0; i<suff_array.length; i++) {
      s = suff_array[i];
      if (sliced.length < s.length)
        continue;
      if (sliced.substr(0, s.length) == s)
        return true;
    }
    return false;
  }

  /**
   * @param {string=} chars
   * @return {string}
   */
  String.prototype.pystrip = function(chars) {
    return this.pylstrip(chars).pyrstrip(chars);
  }

  /**
   * @return {string}
   */
  String.prototype.pyswapcase = function() {
    var out = '', i=0, c;
    for (i=0; i<this.length; i++) {
      c = this.charAt(i);
      if (c.pyislower())
        out += c.pyupper();
      else if(c.pyisupper())
        out += c.pylower();
      else out += c;
    }
    return out;  
  }
  /**
   * @return {string}
   */
  String.prototype.pytitle = function() {
    var s,
        i=0,
        out = '';
        
    s = this.match(/([^\W_\d]+)|([\W_\d]+)/g);
    if (s == null)
      s = [];
    for (i=0; i<s.length; i++)
    {
      if (!(s[i].length))
        continue;
      var c = s[i].charAt(0)
      if (!c.pyisalpha())
        continue;
      
      s[i] = c.pyupper() + s[i].pyslice(1).pylower();
    }
    return s.join('');
  }

  /**
   * @return {string}
   */
  String.prototype.pyupper = function() {
    return this.toUpperCase();
  }

  /**
   * @param {number} num 
   * @return {string}
   */
  String.prototype.pyzfill = function(num) {
    var sign = this.charAt(0),
        signed = (sign == '+' || sign == '-'),
        out = signed? this.pyslice(1) : this.pyslice();
    if (signed) num--;
    while (out.length < num)
      out = '0' + out;
    if (signed) out = sign + out;
    return out;
  }    
})();