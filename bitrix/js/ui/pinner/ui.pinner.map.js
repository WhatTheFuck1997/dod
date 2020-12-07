{"version":3,"sources":["ui.pinner.js"],"names":["BX","namespace","UI","Pinner","node","options","this","pinTop","pinBottom","fixTop","fixBottom","initialWidth","style","width","init","prototype","timeout","classUi","classTop","classBottom","classFullWidth","anchorTop","document","createElement","parentNode","insertBefore","anchorBottom","nextSibling","bind","window","throttle","onChange","box","isNodeOnScreenBottom","applyNodeWidth","removeClass","addClass","pos","height","isNodeOnScreenTop","fullWidth","anchorNode","getBoundingClientRect","coordinates","getCoordinates","top","windowTop","bottom","windowBottom","documentElement","scrollHeight","pageYOffset","scrollTop","clientHeight","offsetHeight","left","pageXOffset"],"mappings":"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","file":"ui.pinner.map.js"}