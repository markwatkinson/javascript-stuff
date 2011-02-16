/*
 * jquery.passhash.js
 * Displays visual feedback to the user of what they've just written in a
 * password box.
 */


/*
  Copyright (c) 2011, Mark Watkinson
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
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
* 
* minified, obviously.
*
**/
function SHA1(msg){function rotate_left(n,s){var t4=(n<<s)|(n>>>(32-s));
return t4;};function lsb_hex(val){var str="";var i;var vh;var vl;for(i=0;i<=6;
i+=2){vh=(val>>>(i*4+4))&0x0f;vl=(val>>>(i*4))&0x0f;str+=vh.toString(16)+
vl.toString(16);}return str;};function cvt_hex(val){var str="";var i;var v;
for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;str+=v.toString(16);}return str;};
function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";
for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext
+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=
String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);
}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(
((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;};
var blockstart;var i,j;var W=new Array(80);var H0=0x67452301;var H1=0xEFCDAB89;
var H2=0x98BADCFE;var H3=0x10325476;var H4=0xC3D2E1F0;var A,B,C,D,E;var temp;
msg=Utf8Encode(msg);var msg_len=msg.length;var word_array=new Array();for(i=0;
i<msg_len-3;i+=4){j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|
msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);word_array.push(j);}
switch(msg_len%4){case 0:i=0x080000000;break;case 1:i=msg.charCodeAt(
msg_len-1)<<24|0x0800000;break;case 2:i=msg.charCodeAt(msg_len-2)<<24|
msg.charCodeAt(msg_len-1)<<16|0x08000;break;case 3:i=msg.charCodeAt(msg_len
-3)<<24|msg.charCodeAt(msg_len-2)<<16|msg.charCodeAt(msg_len-1)<<8|0x80;break;}
word_array.push(i);while((word_array.length%16)!=14)word_array.push(0);
word_array.push(msg_len>>>29);word_array.push((msg_len<<3)&0x0ffffffff);
for(blockstart=0;blockstart<word_array.length;blockstart+=16){for(i=0;i<16;i++)W[i]=word_array[blockstart+i];for(i=16;i<=79;i++)
W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);A=H0;B=H1;C=H2;D=H3;E=H4;
for(i=0;i<=19;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)
&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}for(i=20;i<=39;i++)
{temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=
rotate_left(B,30);B=A;A=temp;}for(i=40;i<=59;i++){temp=(rotate_left(A,5)+
((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,
30);B=A;A=temp;}for(i=60;i<=79;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]
+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}H0=(H0+A)
&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;
H4=(H4+E)&0x0ffffffff;}var temp=cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(
H3)+cvt_hex(H4);return temp.toLowerCase();}


/**
 * Options:
 *  {
 *      width:  Custom width (integer, in pixels)
 *      height:  Custom height (integer in pixels)
 *      minimum: Minimum password length before the feedback is displayed. 
 *              Default 5.
 *      element: The element to append the image to. Default to the parent.
 *      disableLegacy: Disables ugly rendering on IE<9, by just turning the 
 *              whole thing off.
 *      titleCaption: custom title caption, string
 * }
 */
(function($){
  $.fn.hashify = function(options) {
    if (typeof options === 'undefined')
      options = {};
    var defaultOptions = {
               width: false,
               height: false,
               minimum: 5,
               element: null,
               disableLegacy : false,
               titleCaption: 'This is a visual representation of your \
password, it is used so you may recognise whether or not you have tpyed your \
password correctly without letting anyone else who can see your screen tell \
what your password actually is.'
             };
             
    for (var key in defaultOptions) {
      if (typeof options[key]  === 'undefined')
        options[key] = defaultOptions[key];
    }
    
    var $t = $(this);
    var hashWidth = 40; // Hash output size, measured in hex digits
    var plottableWidth = hashWidth - 12; // we use 12 for colours.
    var height = options.height? options.height : $(this).height();
    var width = options.width? options.width :  $(this).width()/5 * 2;
    var $el = $('<canvas>')
              .attr('height', '' + height)
              .attr('width', '' + width)
              .addClass('passhash');
    var lastVal = null;              
    var canvasSupported;
    try {
      var c = $el.get(0);
      // some stupid IE thing.
      if (typeof G_vmlCanvasManager != 'undefined')  
        G_vmlCanvasManager.initElement(c); 
      c.getContext('2d');      
      canvasSupported = true;
    } catch (e) { 
      if (options.disableLegacy)
        return $t;
      canvasSupported = false;
      $el = $('<span>').css('display', 'inline-block')
                       .css('height', height + 'px')
                       .addClass('passhash');
      for (var i=0; i<plottableWidth; i++) {
        $el.append($('<span>').css('display', 'inline-block')
                              .css('width',  width/plottableWidth + 'px')
                              .css('font-size', '0px')
            );
      }
    }
    
    var position = function() {
      if (options.element === null) {
          $el.css('position', 'absolute')
            .css('top',  $t.offset().top + ($t.outerHeight() - height)/2)
            .css('left', $t.offset().left + $t.width() - $el.width());
      };
    };
      
    var $e = (options.element === null)? $('body') : $(options.element);
    $e.append($el);
    position();
    // positioning is a bit flakey
    setInterval(position, 200);
    
    $el.attr('title', options.titleCaption);
    
    // scales an XY coordinate pair to the visible area.
    var scale_xy = function(x, y) {
      y = 16-y;
      y = y/16 * (height);
      x = x/(plottableWidth-1) * (width);
      return [
        Math.min(width-1, Math.max(1, x)), 
        Math.min(height-1, Math.max(1, y))];
    };   
    
    var changeLegacy = function(plottableHash, col) {
      $el.hide();
      $el.fadeIn('fast');
      
      var spans = $('span', $el);
      var y;
      
      for (i=0; i<plottableWidth; i++) {        
        y = parseInt(plottableHash.charAt(i), 16);        
        $(spans[i]).css('max-height', y/16 * 100 + '%')
                   .css('min-height', y/16 * 100 + '%')
                   .css('height', y/16 * 100 + '%')
                   .css('line-height', 16 - scale_xy(i, y) + '%')
                   .css('background-color', col);
      }      
    };
    var changeCanvas = function(plottableHash, col, col2) {      
      var ctx = $el.get(0).getContext('2d'),
          grad = ctx.createLinearGradient(0, 0, width-1, height-1);

      $el.hide();
      ctx.clearRect(0, 0, width, height);

      $el.fadeIn('fast');
      grad.addColorStop(0, col);
      grad.addColorStop(1, col2);
      ctx.save();    
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#585858';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1, height-1);
      
      var x, y, xy;
      for (var i=0; i<plottableWidth; i++) {        
        xy = scale_xy(i, parseInt(plottableHash.charAt(i), 16));
        x = xy[0];
        y = xy[1];
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width-1, height-1);
      ctx.lineTo(0, height-1);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      
      ctx.restore();
    };
    
    
    var change = function() {
      var val = $t.val(),
          hash = SHA1(val),
          plottableHash = hash.substring(6, 34), 
          col = '#' + hash.substring(0, 6),
          col2 = '#' + hash.substring(34);
      if (val == lastVal)
        return;      
      lastVal = val;
      if (val.length < options.minimum) {
        $el.hide();
        return;
      }
      if (canvasSupported) {        
        changeCanvas(plottableHash, col, col2);
      } else {
        changeLegacy(plottableHash, col);
      }
      
    };
    
    // delayed observer.
    var timer = null;
    var observer = function(e) {
      clearTimeout(timer);
      timer = setTimeout(change, 500);
    }
    
    $(this).keyup(observer);
    $(this).trigger('keyup');
    return $(this);
  }
})(jQuery);
