/*
 * Adds rounding to image borders by way of wrapping them in a span and 
 * setting the span's background to the image. The original image is then 
 * set to transparent.
 * 
 * Copyright (c) 2011 Mark Watkinson
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
  $.fn.roundify = function(options) {
    options = $.extend({
      radius: '1em',
      color: 'black',
      width: '1px'
    }, options);
    
    this.each(function(i, e) {      
      var $this = $(this),              
          $wrap = $('<span>').css({
            'background-image': 'url(' + $this.attr('src') + ')',
            'border-color': options.color,
            'border-width': options.width,
            'border-style': 'solid',
            '-moz-border-radius' : options.radius,
            '-webkit-border-radius' : options.radius,
            'border-radius' : options.radius,
            'overflow' : 'hidden',
            'display' : 'inline-block',
            'background-repeat': 'no-repeat'
          });
      if ($this.is('img')) {            
        var handler = function() {
          $wrap.css('height', $this.height() + 'px');
        };
        
        $this.wrap($wrap);
        // somehow $wrap now does not refer to anything useful.
        $wrap = $this.parent();
        // sometimes IE won't fire this for some reason, it may be that 
        // it won't refire load if it's already occurred, I don't know, 
        // but we need to fire it at least once to get the box the right 
        // size.
        handler();
        $this.load(handler);
        $this.resize(handler);
        $this.css('opacity', '0');
      }
    
    });
    return this;
  }
})(jQuery);
