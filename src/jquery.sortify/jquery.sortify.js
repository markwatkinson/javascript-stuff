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
DISCLAIMED. IN NO EVENT SHALL Mark Watkinson BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* 
 * Sorts a table. 
 * see: http://asgaard.co.uk/misc/jquery/?show=sortify
 * for docs
 */

(function($){
  $.fn.sortify = function(options){
    var $t = this, 
        s_ = 'sorted',  // class names
        s_u = 'sorted_up', 
        s_d = 'sorted_down' ;
    options = $.extend({
      cb: null,
      cb_data: null,
      cmp:  function(a, b) {
        if (a > b) return 1;
                       else if (a < b) return -1;
                       else return 0;
      },
      typeCoercion : true,
      caseSensitive: true,
        clickerSelector: false,
        defaultSort: -1
    }, options);
    
    return this.each(function(i, e) {    
        var index = -1, // col index to sort
        lastIndex = index,
        direction = 0, // direction to sort
        lastDirection = direction,
        head = $('tr:first', this), // heading row
        rows = $('tr', this).slice(1), // sortable rows.
        coerce = function(a) { // coerces a string to a number if possible
          var m;
          a = a.replace(/^\s+|\s+$/g, '');
          if ( (m = a.match(/^(?:[^\w]\s*)?([+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?)/)) )            
            return Number(m[1]);
          return a;
        },
        sortrows = function(rowa, rowb, index) {
          var c_index = index+1,
              sel = ':nth-child(' + c_index + ')',
              a = $(sel, rowa).text(),
              b = $(sel, rowb).text(),
              c;
          if (!options.caseSensitive) {
            a = a.toLowerCase();
            b = b.toLowerCase();
          }
          if (options.typeCoercion) {
            a = coerce(a);
            b = coerce(b);
          }
          c = options.cmp.call(index, a, b);
          if (!c) {
            // XXX: does this definitely halt?
            if (lastIndex !== index)
              return lastDirection * sortrows(rowa, rowb, lastIndex);
          }
          return direction * c;
        };
    
      head.children().each(function(i, e) {
        var clicker;
        if (options.clickerSelector === false) clicker = $(this);
        else clicker = $(options.clickerSelector, this);
        clicker.click(function() {
          var class_;
          lastDirection = direction;
          lastIndex = index;
          direction = (i === index)? direction * -1 : 1;        
          index = i;
          $('.' + s_, $t).removeClass(s_);
          $('.' + s_u, $t).removeClass(s_u);
          $('.' + s_d, $t).removeClass(s_d);
          rows.detach();        
          rows.sort(function(a, b) {
            return sortrows(a, b, index);
          });
          class_ = (direction == 1)? s_u : s_d;
          $(head.children().get(index)).addClass(s_).addClass(class_);
          rows.each(function() {
            // this is 1-indexed for some reason          
            $(':nth-child(' + (index+1) + ')', this).addClass(s_).addClass(class_);
            $t.append(this);
            if (options.cb !== null)
              options.cb.call($t, options.cb_data);
          });        
        });
        if (i == options.defaultSort) 
          clicker.trigger('click');
      });
    });
  }
})(jQuery);