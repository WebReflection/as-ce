self.ce=function(e){"use strict";function t(e){e.call(this)}return e.default=function(e,r){var a=new WeakMap,n=function(e){for(var t=function(t,r){var n=e[t],c=n.target,o=n.attributeName,u=n.oldValue,l=c.getAttribute(o);a.get(c).a[o].forEach((function(e){e.call(c,o,u,l)}))},r=0,n=e.length;r<n;r++)t(r)},c=function r(n,c,o,u){for(var l=0,i=n.length;l<i;l++){var d=n[l];o.has(d)||!u&&!("querySelectorAll"in d)||(o.add(d),a.has(d)&&a.get(d)[c].forEach(t,d),e.length&&r(d.querySelectorAll(e),c,o,!0))}},o=function(e){for(var t=0,r=e.length;t<r;t++){var a=e[t],o=a.addedNodes,l=a.removedNodes;c(o,"c",new Set,!1),n(u.takeRecords()),c(l,"d",new Set,!1)}},u=new MutationObserver(n),l=new MutationObserver(o);return l.observe(r,{childList:!0,subtree:!0}),function(e,t){var r=t.connectedCallback,n=t.disconnectedCallback,c=t.observedAttributes,i=t.attributeChangedCallback;o(l.takeRecords());var d=a.get(e)||function(e){var t={a:{},c:new Set,d:new Set};return a.set(e,t),t}(e),s=d.a,f=d.c,b=d.d;return c&&(u.observe(e,{attributes:!0,attributeOldValue:!0,attributeFilter:c}),c.forEach((function(t){(s[t]||(s[t]=new Set)).add(i),e.hasAttribute(t)&&i.call(e,t,null,e.getAttribute(t))}))),n&&b.add(n),r&&(f.add(r),e.ownerDocument.compareDocumentPosition(e)&e.DOCUMENT_POSITION_DISCONNECTED||r.call(e)),e}},e}({}).default;