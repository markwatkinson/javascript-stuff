(function($){
  var __included = false;
  
  $.fn.luminousify = function(options) {
    var $t = this,
        i = 0;
    
    options = $.extend(
      {
        style: 'luminous_light.css',
        language: false,
        defaultLanguage: false,
        delay: 0,
        customStyle: '',
        inline: false,
        path: '/luminous',
        line_numbers: false
      }, options);
    
    if (!__included) {
      __included = true;
      var incs = [options.path + '/style/luminous.css',
                  options.path + '/style/' + options.style 
                 ]
      $.each(incs, function(i, val) {
        // Old school because the jQuery way doesn't work with IE.
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type='text/css';
        link.href = val;
        document.getElementsByTagName('head')[0].appendChild(link);        
      });
      if (options.customStyle.length) {
        var css = $('<style>').attr('type', 'text/css').get(0);
        if (css.styleSheet) 
          css.styleSheet.cssText = options.customStyle;
        else 
          $(css).text(options.customStyle);
        $('head').append(css);
      }
    

    }
    
    var exec = function() {      
      if (i >= $t.length)
        return;
      var t = $($t.get(i));
      var code = t.html();
      var language = options.language;
      if (!language)
        language = t.attr('lang');
      if (!language) 
        language = options.defaultLanguage;
      if (!language)
        language = '';
      
      $.post(options.url,
        {
          code: code, 
          language: language,
          line_numbers: options.line_numbers, 
          inline: options.inline,
          escaped: true
        }, 
        function(data) {
          var $r = $(data)
          if (!options.inline)
            $r.addClass('luminousified');
          t.replaceWith($r);
          i++;
          setTimeout(exec, options.delay);
        });
    };
    exec();    
    return this;
  }
})(jQuery);