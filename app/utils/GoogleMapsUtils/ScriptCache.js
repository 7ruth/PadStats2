let counter = 0;
const scriptMap = new Map();

export const ScriptCache = (function (global) { // eslint-disable-line
  return function ScriptCache(scripts) { // eslint-disable-line
    const Cache = {};

    Cache._onLoad = function (key) { // eslint-disable-line
      return (cb) => {
        let stored = scriptMap.get(key); // eslint-disable-line
        if (stored) {
          stored.promise.then(() => {
            stored.error ? cb(stored.error) : cb(null, stored); // eslint-disable-line
          });
        } else {
          // TODO:
        }
      };
    };

    Cache._scriptTag = (key, src) => { // eslint-disable-line
      if (!scriptMap.has(key) && window.google === null) {
        const tag = document.createElement('script');
        const promise = new Promise((resolve, reject) => {
          const resolved = false, // eslint-disable-line
             errored = false, // eslint-disable-line
            body = document.getElementsByTagName('body')[0];

          tag.type = 'text/javascript';
          tag.async = false; // Load in order

          const cbName = `loaderCB${counter++}${Date.now()}`; // eslint-disable-line
          let cb; // eslint-disable-line

          let handleResult = (state) => { // eslint-disable-line
            return (evt) => {
              let stored = scriptMap.get(key); // eslint-disable-line
              if (state === 'loaded') {
                stored.resolved = true;
                resolve(src);
                // stored.handlers.forEach(h => h.call(null, stored))
                // stored.handlers = []
              } else if (state === 'error') {
                stored.errored = true;
                // stored.handlers.forEach(h => h.call(null, stored))
                // stored.handlers = [];
                reject(evt);
              }

              cleanup();
            };
          };

          const cleanup = () => {
            if (global[cbName] && typeof global[cbName] === 'function') {
              global[cbName] = null; // eslint-disable-line
            }
          };

          tag.onload = handleResult('loaded');
          tag.onerror = handleResult('error');
          tag.onreadystatechange = () => {
            handleResult(tag.readyState);
          };

          // Pick off callback, if there is one
          if (src.match(/callback=CALLBACK_NAME/)) {
            src = src.replace(/(callback=)[^\&]+/, `$1${cbName}`); // eslint-disable-line
            cb = window[cbName] = tag.onload;
          } else {
            tag.addEventListener('load', tag.onload);
          }
          tag.addEventListener('error', tag.onerror);
          tag.src = src;
          body.appendChild(tag);
          return tag;
        });
        const initialState = {
          loaded: false,
          error: false,
          promise: promise, // eslint-disable-line
          tag,
        };
        scriptMap.set(key, initialState);
      }
      return scriptMap.get(key);
    };

    Object.keys(scripts).forEach(function (key) { // eslint-disable-line
      const script = scripts[key];
      Cache[key] = {
        tag: Cache._scriptTag(key, script), // eslint-disable-line
        onLoad: Cache._onLoad(key) // eslint-disable-line
      };
    });

    return Cache;
  };
})(window);

export default ScriptCache;
