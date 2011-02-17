/* Adds rounded corners to images, but only really works in FF4 and Chrome */
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
