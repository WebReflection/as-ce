self.ce=function(e){"use strict";function t(e){e.call(this)}return e.default=function(e,r){var n=new WeakMap,a=new WeakMap,u=function(e,t){for(var r=0,n=e.length;r<n;r++){var u=e[r],c=u.target,l=u.attributeName,o=u.oldValue,i=c.getAttribute(l);a.get(t).call(c,l,o,i)}},c=function(e){return"querySelectorAll"in e},l=function(e){for(var t=0,r=e.length;t<r;t++){var n=e[t],a=n.addedNodes,u=n.removedNodes;o(a.filter(c),"c",new Set),o(u.filter(c),"d",new Set)}},o=function e(a,u,c){for(var l=0,o=a.length;l<o;l++){var i=a[l];c.has(i)||(c.add(i),n.has(i)?n.get(i)[u].forEach(t,i):"c"===u&&r(i),e(i.querySelectorAll("*"),u,c))}},i=new MutationObserver(l);return i.observe(e,{childList:!0,subtree:!0}),function(e,t){var r=t.connectedCallback,c=t.disconnectedCallback,o=t.observedAttributes,d=t.attributeChangedCallback;l(i.takeRecords());var s=n.get(e)||function(e){var t={c:new Set,d:new Set};return n.set(e,t),t}(e),f=s.c,b=s.d;if(o){var v=new MutationObserver(u);v.observe(e,{attributes:!0,attributeOldValue:!0,attributeFilter:o.map((function(t){return e.hasAttribute(t)&&d.call(e,t,null,e.getAttribute(t)),t}))}),a.set(v,d)}return c&&b.add(c),r&&(f.add(r),e.ownerDocument.compareDocumentPosition(e)&e.DOCUMENT_POSITION_DISCONNECTED||r.call(e)),e}},e}({}).default;