/*
 * $.jKnotify - a KDE4-ish notification system for jQuery.
 * (C) 2011 Mark Watkinson <markwatkinson@gmail.com>
 * 
 * License: BSD
 */


/*Copyright (c) 2011 Mark Watkinson
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

/**
 * Usage: $.jKnotify(message, options)
 * see source for options list.
 */

(function($) {
  var defaultCss = {
      'position': 'fixed',
      // we set this using RGBA so the headers' background can be overridden.
      // this is not possible using opacity.
      'background-color-fallback': '#000000',
      'background-color': 'rgba(0, 0, 0, 0.7)',
      'color': 'white',
      'top' : '2px',
      'width' : '250px',
      'right' : '10px',
      'overflow' : 'auto'
      // note that we also set max-height in the resizeHandler
    },
    $area = $('<div>').addClass('notify_area').css('display', 'none'),  
    applyCss = function(css) {
      var bgfallback = (typeof css['background-color-fallback'] !== 'undefined') 
      if (bgfallback)
        $area.css('background-color', css['background-color-fallback'])
      $area.css(css);     
    };
  
  var resizeHandler = function() {
    $area.css('max-height', $(window).height() + 'px');
  };
    
  $(document).ready(function() {
    applyCss(defaultCss);
    resizeHandler();
    $(window).resize(resizeHandler);
    $('body').append($area);
  });
  
  
  // we use a queue with a lock for animations because of all the timers we 
  // can't be sure that we won't end up with some horrible race condition
  // So only one animation may execute at once.
  var _queue = [];
  var queue_lock = false;
  var queue = function(element, action) {
    var f = function() {
      if (!queue_lock) queue_lock = true;
      else {
        setTimeout(f, 50);
        return;
      }
      _queue.push([element, action]);
      queue_lock = false;      
      process_queue();
    }    
    if (action == 'show')
      element.animate({'height':'toggle'}, 0, 'swing', f);
    else
      f();
  }
  
  var process_queue = function() {
    if (!_queue.length) return;
    if (queue_lock) return;
    queue_lock = true;
    var e_ = _queue[0];
    var el = e_[0]
    var action = e_[1];
    _queue = _queue.slice(1);    
    if (action == 'show')
      show(el);
    else if (action == 'close')
      close(el);
    else if (action == 'collapse')
      collapse(el);
    else if (action == 'uncollapse')
      uncollapse(el);
    else { // shouldn't happen
      if (console) console.log('jKnotify: Unknown action "' + action + '"');
      release_lock();
    }
  }  
  
  var close = function(element) {
    var $this = element;
    if ($this.data('jKnotifyClosed'))
      return;
    if ($this.is(':animated'))
      $this.stop(true, true);
      // this is a race condition
    $this.data('jKnotifyClosed', true);
    $this.animate({'height': 'toggle'}, 'fast', 'swing', function() {
      $this.remove();
      if ($area.is(':empty'))
        $area.hide();
      release_lock();
    });
  }
  var release_lock = function() {
    queue_lock = false;
    process_queue();
  };
  var anim = function(element) {
    element.animate({'height':'toggle'}, 'fast', 'swing', function() {
      release_lock();
    });
  }
  
  var show = function(element) {
    anim(element);
  }  
  var collapse = function(element) {
    var e = $('.knotify_message', element);
    if (e.data('jkcollapsed')) {
      release_lock();
      return;
    }
    e.data('jkcollapsed', true);
    anim(e);
  };
  var uncollapse = function(element) {
    var e = $('.knotify_message', element);
    if (!e.data('jkcollapsed')) {
      release_lock();
      return;
    }
    e.data('jkcollapsed', false);
    anim(e);
  };
  
  // You generally shouldn't need this, but it will close an element returned by
  // $.jKnotify
  $.fn.jKnotifyClose = function() {    
    this.each(function() {
      queue($(this), 'close');
    });   
    return this;
  }
  $.jKnotify = function(message, options) {
    options = $.extend(true, {
      timeout: false,     // disappear timer
      titleBar: true,
      collapse: false,   // collapse timer
      title: false,
      icon: false,
      passive: true,
      css: {
        border: '2px solid gray',
        'border-bottom': '1px solid gray',
        'border-top' : '1px solid gray'
      },
      containerCss : defaultCss,
      closeOnButtonClick: true,
      closable: true
    }, options);
    
    var $e = $('<div>').css('vertical-align', 'middle')
                       .css(options.css);
    var collapse_timer = null;
    // So! we used to apply a negative margin on the bottom to prevent borders
    // from stacking, but that now creates scrollbars. Instead, we're doing
    // this. We assume the border-bottom and border-top are 50% of border-left
    // and border-right and apply it to the top and bottom of the area 
    // container. Note that the area CSS may be overriden if the user so wishes.
//     $e.css('margin-bottom', '-' + $e.css('border-width'));
    $area.css({ 
      'border-bottom': options.css['border-bottom'],
      'border-top': options.css['border-top']
    });
    applyCss(options.containerCss);
    
    if (message === null)
      return;
    
    if (options.titleBar) {
      var titleBar = $('<div>').css({
        'background-color': $area.css('background-color'),
        'opacity': '1.0',
        'margin': '0.5em',
        'position': 'relative'
      });
      var title = $('<div>').css('width', '90%');
                                                     
      if (options.icon) {
        title.append(
          $('<img class="notification_icon">').attr('src', options.icon)
            .css({'vertical-align': 'middle', 'margin-left': '0.5em'})
        );
      }
      title.append(
        $('<span>').html(options.title? options.title : '&nbsp')
                  .css('margin-left', '0.5em').addClass('title')
      );
      titleBar.append(title);
      if (options.closable) {
        var closer = $('<span>x</span>').css({
          'position': 'absolute',          
          'top': '1px', 
          'right': '-2px', 
          'cursor': 'default', 
          'margin-right': '0.5em', 
          'font-weight': 'bold'
        });
        closer.click(function() {$e.jKnotifyClose(); return false;});
        
        // prevent selection, if a user repeatedly clicks at the area where 
        // they expect a closer to be, it'll end up selecting it and not 
        // actually firing the close event
        // http://stackoverflow.com/questions/1319126/prevent-highlight-of-text        
        closer.get(0).onselectstart = function () { return false; };
        closer.get(0).unselectable = 'on';
        closer.css('-moz-user-select', 'none'); 
        
        titleBar.append(closer);        
        
      }
      $e.append(titleBar);
    }
    $e.append($('<div>').html(message).css({
      'margin-left': '1em',
      'margin-right': '1em',
      'margin-bottom': '1em'      
    }).addClass('knotify_message'));
    

    
    if (options.passive) 
      $e.click(function() { $e.jKnotifyClose()} );
    if (options.closeOnButtonClick) 
      $('input[type=button]', $e).click(function() { $e.jKnotifyClose(); });
    
    if ($area.is(':empty'))
      $area.show();
    $area.prepend($e);
        
    queue($e, 'show');
    if (options.timeout) {
      setTimeout(function() { $e.jKnotifyClose(); }, options.timeout);
    }
    if (options.collapse) {
      collapse_timer = setTimeout(function() { queue($e, 'collapse');}, options.collapse);
      $e.mouseleave(function() {
        clearTimeout(collapse_timer);
        collapse_timer = setTimeout(function() { queue($e, 'collapse');}, options.collapse);
      });
      $e.mouseenter(function() {
        clearTimeout(collapse_timer);
        queue($e, 'uncollapse');
      });
    };
    return $e;
    
  };  
})(jQuery);
