

(function($){
  $.fn.sortify = function(options){
    var $t = this,
        index = -1, // col index to sort
        lastIndex = index,
        direction = 0, // direction to sort
        lastDirection = direction,
        head = $('tr:first', this),
        rows = $('tr', this).slice(1),
        coerce = function(a) { // coerces a string to a number
          var m;
          a = a.replace(/^\s+|\s+$/g, '');
          if ( (m = a.match(/^(?:[^\w]\s*)?([+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?)/)) )            
            return Number(m[1]);
          return a;
        },
        sortrows = function(rowa, rowb, index) {
          var c_index = index+1,
              a = $(':nth-child(' + c_index + ')', rowa).text(),
              b = $(':nth-child(' + c_index + ')', rowb).text(),
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
            if (lastIndex !== index)
              return lastDirection * sortrows(rowa, rowb, lastIndex);
          }
          return direction * c;
        }
        
        
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
    
    
    
    head.children().each(function(i, e) {
      var clicker;
      if (options.clickerSelector === false) clicker = $(this);
      else clicker = $(options.clickerSelector, this);
      clicker.click(function() {
        lastDirection = direction;
        lastIndex = index;
        direction = (i === index)? direction * -1 : 1;        
        index = i;
        $('.sorted', $t).removeClass('sorted');
        $('.sorted_up', $t).removeClass('sorted_up');
        $('.sorted_down', $t).removeClass('sorted_down');
        rows.detach();        
        rows.sort(function(a, b) {
          return sortrows(a, b, index);
        });
        $(head.children().get(index)).addClass('sorted')
          .addClass('sorted_' + ((direction == 1)? 'up' : 'down'));
        rows.each(function() {
          // this is 1-indexed for some reason          
          $(':nth-child(' + (index+1) + ')', this).addClass('sorted')
            .addClass('sorted_' + ((direction == 1)? 'up' : 'down'));
          $t.append(this);
          if (options.cb !== null)
            options.cb.call($t, options.cb_data);
        });        
      });
      if (i == options.defaultSort) 
        clicker.trigger('click');
    });
  }
})(jQuery);