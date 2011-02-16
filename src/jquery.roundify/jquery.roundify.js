/* Adds rounded corners to images, but only really works in FF4 and Chrome */
(function($){
  $.fn.roundify = function(options) {
    options = $.extend({
      radius: '1em',
      color: 'black',
      width: '1px'
    }, options);
    
    this.each(function(i, e) {
      var $this = $(this);      
      $this.css( {
        'border-color': options.color,
        'border-width': options.width,
        'border-style': 'solid',
        '-moz-border-radius' : options.radius,
        '-webkit-border-radius' : options.radius,
        'border-radius' : options.radius,
        'overflow' : 'hidden'
      });
    });
    return this;
  }
})(jQuery);
