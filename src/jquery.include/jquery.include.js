/* 
 * $.includify(url1 [,url2 [,url3, [....]]], [callback])
 * 
Copyright (c) 2011, Mark Watkinson <markwatkinson@gmail.com>
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
DISCLAIMED. IN NO EVENT SHALL Mark Watkinson BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
*/

(function(jQuery){
  var included = [];
  var lock = false; // semaphore lock to prevent race conditions
  // remember to release this before we return from anywhere.
  $.extend({
    includify: function() {
      // we keep a copy of this so we can recurse with it later      
      var original_args = Array.prototype.slice.call(arguments);      
      if (lock) {
        setTimeout(function() {$.includify.apply(null, original_args);},
                   100);
        return;
      } else {
        lock = true;
      }
      // we're gong to manipulate this
      var args_ = Array.prototype.slice.call(arguments);
      var cb = null;
      if (args_.length && typeof args_[args_.length-1] == 'function') {
        cb = args_[args_.length-1];
        args_ = args_.slice(0, -1);        
      }
      var args = [];
      var url;      
      $.each(args_, function(i, val) {
        if ($.inArray(val, included) == -1)
          args.push(val);
      });
      
      if (!args.length) {
        lock = false;
        if (cb != null) 
          cb();
        return;
      }
            
      url = args[0];        
      $.getScript(url, function() {
        included.push(url);
        lock = false;
        if (args.length > 1) 
          $.includify.apply(null, original_args);
        else if (cb != null)
          cb.apply(arguments);
      });      
    }
  })
})(jQuery);
