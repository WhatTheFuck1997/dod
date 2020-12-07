{"version":3,"sources":["script.js"],"names":["BX","namespace","Main","TileGrid","options","Grid","apply","this","arguments","navigation","isLoadingNextPortion","init","prototype","__proto__","constructor","bindEvents","call","window","addEventListener","throttle","handleScroll","bind","parameters","userOptions","UserOptions","userOptionsActions","userOptionsHandlerUrl","needToShowNextPortion","showNextPortion","handleBackspace","history","back","reload","url","data","type","isString","document","location","toString","message","SITE_ID","sessid","bitrix_sessid","eventArgs","gridId","getId","onCustomEvent","promise","ajax","util","add_url_param","grid_id","internal","method","dataType","setHeightContainer","setFadeContainer","loader","getLoader","showLoader","then","response","redraw","tileGrid","items","destroy","unSetFadeContainer","unSetHeightContainer","getUserOptions","prepareSortUrl","header","by","sort_by","order","sort_order","sortByColumn","column","sort_url","setSort","grid_action","hasNextPage","containerHeight","pos","container","height","windowHeight","body","offsetHeight","offsetBottomBorder","getBoundingClientRect","top","countOfRows","parseInt","pageSize","countItemsPerRow","itemHeight","layout","Math","max","urlNextPage","forEach","item","appendItem","catch"],"mappings":"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","file":""}