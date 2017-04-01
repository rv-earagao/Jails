!function(){Array.from||(Array.from=function(){var n=Object.prototype.toString,e=function(e){return"function"==typeof e||"[object Function]"===n.call(e)},t=function(n){var e=+n;return isNaN(e)?0:0!==e&&isFinite(e)?(e>0?1:-1)*Math.floor(Math.abs(e)):e},o=Math.pow(2,53)-1,r=function(n){var e=t(n);return Math.min(Math.max(e,0),o)};return function(n){var t=this,o=Object(n);if(null==n)throw new TypeError("Array.from requires an array-like object - not null or undefined");var i,u=arguments.length>1?arguments[1]:void 0;if(void 0!==u){if(!e(u))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(i=arguments[2])}for(var c,s=r(o.length),a=e(t)?Object(new t(s)):Array(s),l=0;s>l;)c=o[l],a[l]=u?void 0===i?u(c,l):u.call(i,c,l):c,l+=1;return a.length=s,a}}()),Object.assign||(Object.assign=function(n){n=Object(n);for(var e=1,t=arguments.length;t>e;e++){var o=arguments[e];if(null!=o)for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n[r]=o[r])}return n}),Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(n){for(var e=(this.document||this.ownerDocument).querySelectorAll(n),t=e.length;--t>=0&&e.item(t)!==this;);return t>-1})}(),function(n){function e(n,t,o){e.components[n]=t,e.components[n].options=o||{}}function t(n){var e,t={};return e=n.previousSibling,e=e&&8==e.nodeType?e:e?e.previousSibling:null,e&&8==e.nodeType&&e.data.replace(/@([a-zA-z0-9-\/]*)(?:\((.*)\))?/g,function(n,e,o){t[e]=Function("return "+o)()}),t}function o(n){var e=n.getAttribute(p).split(/\s/);s(e,r(n))}function r(n){return function(t){var o,r;n.j=n.j||{},t in e.components&&!n.j[t]&&(r=e.components[t],n.j[t]={methods:{}},o=e.component(t,n,r.options),r(o,n,o.props),o.__initialize(o))}}function i(n){var e={data:{}};return s(n.attributes,u(e)),e}function u(n){return function(e){var t,o=e.name.split(/data\-/);try{t=e.value in window?e.value:Function("return "+e.value)()}catch(r){t=e.value}return o[1]?n.data[o.pop().replace(/-([a-z])/g,c)]=t:n[e.name]=t,n}}function c(n,e){return e.toUpperCase()}function s(n,e,t){n=t?Array.from(n).reverse():n;for(var o=0,r=n.length;r>o;o++)e(n[o],o,n)}function a(){function n(n,e){var t=document.createEvent(n);return e=e||{},t.initEvent(n,e.bubbles||!1,e.cancelable||!1,e.detail||null),t}function e(n,e){return function(t){var o=this,r=t.detail||{};n.__events[e].forEach(function(n){n.handler.apply(o,[t].concat(r.args))})}}function t(n,e){n.removeEventListener(e,n.__events[e].listener,!1),delete n.__events[e]}function o(n,e,t){return function(o){for(var r=this,i=o.target,u=o.detail||{};i&&i!==n;)i.matches(e)&&t.apply(r,[o].concat(u.args)),i=i.parentNode}}return{on:function(n,t,r){if(n.__events=n.__events||{},n.__events[t]=n.__events[t]||[],!n.__events[t].length){var i=e(n,t);n.addEventListener(t,i,"focus"==t||"blur"==t),n.__events[t].listener=i}r.call?n.__events[t].push({handler:r,callback:r}):Object.keys(r).forEach(function(e){n.__events[t].push({handler:o(n,e,r[e]),callback:r[e]})})},off:function(n,e,o){if(o&&n.__events[e]&&n.__events[e].length){var r=n.__events[e];n.__events[e]=n.__events[e].filter(function(n){return n.callback!=o}),n.__events[e].listener=r.listener,n.__events[e].length||t(n,e)}else t(n,e)},trigger:function(e,t,o){e.dispatchEvent(/\:/.test(t)?new CustomEvent(t,{bubbles:!0,detail:o}):new n(t,{bubbles:!0,detail:o}))}}}function l(n,e){return n={},e={},{publish:function(t,o){t in n?s(n[t],function(n){n(o)}):e[t]=o},subscribe:function(t,o){return n[t]=n[t]||[],n[t].push(o),t in e&&s(n[t],function(n){n(e[t])}),function(){n[t]=n[t].filter(function(n){return n==o})}}}}var f=l(),p="data-component",v="["+p+"]";e.events=a(),e.components={},e.publish=f.publish,e.subscribe=f.subscribe,e.start=function(n){n=n||document.documentElement,s(n.querySelectorAll(v),o,!0)},e.destroy=function(n,t){n=n||document.documentElement,t=t||v,s(n.querySelectorAll(t),function(n){n.__events&&(n.__events=null,n.j=null),e.events.trigger(n,":destroy")},!0)},e.component=function(n,o,r){var u,c={},a=e.events;return u={elm:o,subscribe:f.subscribe,publish:f.publish,injection:r.injection,__initialize:function(){},expose:function(e){o.j[n].methods=e},on:function(n,e){a.on(o,n,e)},off:function(n,e){a.off(o,n,e)},init:function(n){n&&n.call?u.__initialize=n:n&&n.join&&(u.__initialize=function(e){var t={};n.forEach(function(n){t=n(e,t)||t})})},props:function(n){return c.props=c.props||i(o),n?c.props[n]:c.props},annotations:function(e){return c.annotations=c.annotations||t(o)[n]||{},e?c.annotations[e]:c.annotations},get:function(n,e){return function(){var t=Array.from(arguments),r=t.shift(),i="[data-component*="+n+"]";e=e?i+e:i,s(o.querySelectorAll(e),function(e){e.j&&e.j[n]&&r in e.j[n].methods&&e.j[n].methods[r].apply(null,t)}),o.matches(e)&&o.j&&o.j[n]&&r in o.j[n].methods&&o.j[n].methods[r].apply(null,t)}},emit:function(){var n=Array.from(arguments);a.trigger(o,n.shift(),{args:n})}}},"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof module&&module.exports?module.exports=e:n.jails=e}(window);
