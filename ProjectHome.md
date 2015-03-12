Just somewhere remote to keep my Javascript. Also an excuse to learn Mercurial.

All scripts are separate but use the new BSD license unless explicitly stated otherwise.

I'll probably update the Wiki at some point but until then, an exhaustive list of what is contained here, along with explanations, usage instructions, demonstrations and examples, can be found on my website http://asgaard.co.uk/misc/jquery

Oh and by the way, if you are interested in using these with the Google closure compiler, then glob for src/`*`/`*`.extern for the extern files (and if you're not using the closure compiler, maybe you should be).

A brief summary of what's here:

## jQuery Plugins ##
  * **Delayed Action** - Fires a callback after waiting for user input to stop changing
  * **Include** - Wrapper around $.getScript to handle simple dependency chains and prevent duplicate inclusions
  * **jKnotify and jKnotifyUi**  - These are pretty cool, in my opinion! jKnotify is a smallish notification framework styled after KDE4's (although the CSS can easily make it look radically different). jKnotifyUi is a wrapper which makes it easy to build form elements into a notification. Preview:

![http://asgaard.co.uk/misc/jquery/.previews/jknotify.png](http://asgaard.co.uk/misc/jquery/.previews/jknotify.png)

![http://asgaard.co.uk/misc/jquery/.previews/jknotifyui.png](http://asgaard.co.uk/misc/jquery/.previews/jknotifyui.png)

  * **luminousify** - Syntax highlighting from [Luminous](http://code.google.com/p/luminous) via AJAX (a fairly specific use case)
  * **passhash** - Visual password hashing -- a graph is generated which represents the user's password as it is entered into a password box; the idea is the user should be able to tell whether what they've entered is correct or not without exposing the actual password.
  * **passstrength** - Entropy based password strength notification
  * **roundify** - Rounded image borders
  * **tabify** - yet another tab script (but pretty flexible)
  * **toolify** - yet another tooltip

## Other (non-jQuery) ##
  * **json** - Permissive and error tolerant JSON parser and encoder. This recognises and will happily decode simple JavaScript extensions, so it's a drop-in replacement for being eval() on JSON which looks like JavaScript but on which a strict parser might stamp its feet and demand you use double quoted strings (or something).
  * **pythonic.js** - An implementation of a WHOLE LOAD of Python functions for JavaScript, including most of the string methods and the more useful global functions (map, filter, reduce, min, max, any, all, enumerate, zip, sum, product, list, range). Written because Python's standard library is useful and JavaScript's isn't.