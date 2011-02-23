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
        line_numbers: false,
        group: 10 // number of code snippets to group into one request.
                 // This reduces the HTTP overhead but also ties up the server 
                 // for longer at once. 5-10 is resaonable.
                 // server side maximum is 20.
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
      
      var j;
      var reqs = [];
      for (j=0; j < options.group; j++) {
        if (j+i >= $t.length)
          break;
        var t = $($t.get(i+j));
        var code = t.html();


        var language = options.language;
        if (!language)
          language = t.attr('lang');
        if (!language) 
          language = options.defaultLanguage;
        if (!language)
          language = '';        
        reqs.push( { code: code, language: language, line_numbers: options.line_numbers,
                   inline: options.inline, escaped: true} );
      }
      
      
      
      
      
      $.post(options.url,
             {
               requests: reqs
             },
        
        function(data) {
          // the return is JSON encoded, but we know it's just an array of 
          // strings. To avoid depending on a JSON parser we're going to 
          // regex extract them
          var strings = data.match(/"([^\\"]+|\\"|\\.)*"/g);
          for (var a = 0; a<strings.length; a++) {
            // we KNOW anything in here is not executable code because it's 
            // wrapped in quotes. It may contain escape sequences. The easiest
            // way to decode these therefore is to eval() it. This is safe.       
            var s = eval(strings[a]); 
            var $r = $(s);
            if (!options.inline)
              $r.addClass('luminousified');
            $($t.get(i)).replaceWith($r);
            i++;
          }
          setTimeout(exec, options.delay);
        });
    };
    exec();    
    return this;
  }
})(jQuery);