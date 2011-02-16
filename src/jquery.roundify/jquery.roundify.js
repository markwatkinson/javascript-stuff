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
      var handler = function() {
        var h = $this.height();
        var $wrapper = $('<span>').css('border-color', options.color)
                              .css('border-width', options.width)
                              .css('border-style', 'solid')
                              .css('border-radius', options.radius)
                              .css('-moz-border-radius', options.radius)
                              .css('-webkit-border-radius', options.radius)
                              .css('overflow', 'hidden')
                              .css('display', 'inline-block')
                              .css('height', h + 'px');
        $this.replaceWith($wrapper);
        $wrapper.append($this);
      };
      $this.load(handler);
      $this.resize(handler);
    });
    return this;
  }
})(jQuery);
