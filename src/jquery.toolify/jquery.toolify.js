/**
 * Tool-tip plugin for jQuery.
 * Usage:
 * $('#element').toolify('Some tooltip text'),
 * or
 * $('#element').toolify( function() { return 'some text'; } ) (`this' will be
 * set as usual).
 * 
 * An optional boolean second argument will allow you specify whether or not
 * you want the tooltip positioned automatically (default true). If false,
 * you'll need to position it somewhere sensible in CSS.
 * 
 * css class of resulting tooltip: `tooltip'
 */

/*
  Copyright (c) 2010, Mark Watkinson
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
(function($){
  $.fn.toolify = function(tooltip, output) {
    var $el = $(this),
        tip = $('<div></div>').addClass('tooltip'),
              position = !output,
              $out = position? $('body') : $(output);
              
        show = function(event) {
          $out.append(tip);
          if (tip.is(':animated'))
            tip.stop(true, true);
          tip.fadeIn('fast');          
          if (position) {
            var offset = {
              left: event.pageX + 5,
              top: event.pageY + 5
            };
            var dx = $(document).width() - (offset.left + tip.width()),
                dy = $(document).height() - (offset.top + tip.height());
            // don't stretch the screen, and keep a small margin
            if (dx < 0) offset.left += dx - 20;
            if (dy < 0) offset.top += dy - 20;
            offset.left = Math.max(offset.left, 0);
            offset.top = Math.max(offset.top, 0);
            tip.offset(offset);            
          }
        },
        hide = function() {
          tip.hide();
          tip.remove();
        };
        
    tip.hide();
    if (position) {
      tip.css('position','absolute')
         .css('z-index', '100')
    }
    tip.html(
      (typeof(tooltip) == 'function')? tooltip.call($el)
      : tooltip);
    $('body').append(tip);
    $el.mouseenter(show);
    $el.mouseleave(hide);
    return this;
  };
})(jQuery);