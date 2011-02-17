/**
 * Tabify script for jQuery
 * 
 * CSS classes:
 * 'tab_title'  - A title element
 * 'tab_hover' - a hovered (mouseover) title element
 * 'tab_selected' - the title element corresponding to the currently displayed 
 *                  tab.
 * 
 * 
 * Usage: Build your content, and wrap your tabs in a an element and your menu
 * in another element. Your menu may contain either <a> elements, or, if not, 
 * then the child elements of your menu wrapper are used as the 'clickers'.
 * The elements in the menu (direct children or <a>) should correspond 1-1 
 * with the first level children in the tab wrapper element. Call tabify on 
 * your tabs wrapper and give the first argument as the menu wrapper. e.g.:
 * 
 * 
 * <div id='menu'> <span>go to tab 1</span> <span>go to tab 2</span> 
 *      <span>go to tab 3</span> </div>
 * 
 * <div id='tabs'>
 *      <div> tab 1 </div>
 *      <div> tab 2 </div>
 *      <div> tab 3 </div>
 * </div>
 * 
 * 
 * <script>
 * $('#tabs').tabify($('#menu'), true);
 * </script>
 * 
 * The last argument controls whether or not to try to emulate back/forward 
 * buttons. This must be false if you have multiple tabified elements per 
 * page.
 * 
 * 
 * You may apply your own CSS theming to #tabs and #menu to arrange it as you 
 * like
 */


(function($){
  $.fn.tabify = function(menu, hashwatch){
    var element = this,
        tabs = this.children(),        
        clickers = $('a', menu),
        titles = menu.children(),
        active_str = 'active',
        selected_class = 'tab_selected',
        hover_class = 'tab_hover',
        title_class = 'tab_title',
        trigger = true;
        
    if (!clickers.length) clickers = titles;
    element.data(active_str, -1);    
    tabs.hide();

    clickers.each(function(i) {
      $(this).click(function(e) {
        $(tabs.get(i)).fadeIn(250);
        var active = element.data(active_str),
            $el,
            $t = $(this);
            
        if (active > -1 && active != i && active < tabs.length)
          $(element.children().get(element.data(active_str))).hide();

        $('.' + selected_class, menu).removeClass(selected_class); 
        element.data(active_str, i);
        if (hashwatch)
          parent.location.hash = i;
        $el = ($t.parent().first() == $(menu).first())? $t : $(titles.get(i));
        $el.addClass(selected_class);
        
        e.preventDefault();
      });
    }).addClass(title_class)
      .hover(function() { $(this).toggleClass(hover_class); });
      
    tabs.addClass('tab');
    
    if (hashwatch) {
      var getHash = function() {
            var h = parent.location.hash.replace(/^#|\s*$/g, '');
            return (h.match(/^\d+$/))? parseInt(h) : false;
          },
          watcher = function() {
            var hash = hash = getHash();
            if (hash !== false)
              $(clickers.get(hash)).trigger('click');
          };
      trigger = (getHash() === false);    
      setInterval(watcher, 200);
    }
    if (trigger)
      clickers.first().trigger('click');
    
    return this;
  };
})(jQuery);