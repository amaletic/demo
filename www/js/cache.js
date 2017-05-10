(function (eko, $, undefined) {
    eko.cache = (function () {

        const MODULE_ID = "CahceModule"
        const LOCAL_CACHE_ID = "LocalCahce";
        const HIDE_UNAMRKED_ID = "HideUnmarked";
        const HIDE_PREVIOUS_ID = "HidePrevious";
        const APP_CACHE_VERSION = "AppCacheVersion";
		const APP_DETAILS="DetailsForPredavanje";
		
        const DEBUG_ME = true;
        if (DEBUG_ME) {
            console.log(MODULE_ID + " PRESTART");
        }
        setFilterFavorites = function (marked) {

            localStorage.setItem(HIDE_UNAMRKED_ID, marked);

        }

        getFilterFavorites = function () {
            var ret = localStorage.getItem(HIDE_UNAMRKED_ID);
            if (ret != null && !(ret === undefined) && ret != "undefined") {
                return ret != null && ret != "" && ret === "true";
            }


            return false;


        }



        setAppCache = function (marked) {

            localStorage.setItem(APP_CACHE_VERSION, marked);

        }


        getAppCache = function () {
            var ret = localStorage.getItem(APP_CACHE_VERSION);
            if (ret != null && !(ret === undefined) && ret != "undefined") {
                return ret;
            }


            return null;


        }



        setFilterPreviousHide = function (marked) {

            localStorage.setItem(HIDE_PREVIOUS_ID, marked);

        }

        getFilterPreviousHide = function () {
            var ret = localStorage.getItem(HIDE_PREVIOUS_ID);
            if (ret != null && !(ret === undefined) && ret != "undefined") {
                return ret != null && ret != "" && ret === "true";
            }


            return false;


        }
		getDetailsId = function () {


            var ret = localStorage.getItem(APP_DETAILS);
            if (ret != null && !(ret === undefined) && ret != "undefined") {
                return ret;
            }


            return null;

        }

        setDetailsId = function (id) {

            localStorage.setItem(APP_DETAILS, id);

        }
        getPredavanja = function () {


            var ret = localStorage.getItem(LOCAL_CACHE_ID);
            if (ret != null && !(ret === undefined) && ret != "undefined") {
                return JSON.parse(ret);
            }


            return null;

        }

        setPredavanja = function (data) {

            localStorage.setItem(LOCAL_CACHE_ID, JSON.stringify(data));

        }
        getPredavanjeByRemoteId = function (data, remoteId) {
            if (data == null || data.dayList == null || data.dayList == 0) {
                return null;
            }


            var currentDay;
            var vrijeme;
            var predavanje;
            var currentDvorana;
            for (var i = 0; i < data.dayList.length; i++) {
                currentDay = data.dayList[i];

                for (var j = 0; j < currentDay.vrijemeList.length; j++) {

                    vrijeme = currentDay.vrijemeList[j];
                    for (var k = 0; k < vrijeme.dvoranaList.length; k++) {
                        {

                            currentDvorana = vrijeme.dvoranaList[k];
                            if (currentDvorana && currentDvorana.predavanje) {
                                if (currentDvorana.predavanje.id == remoteId) {
                                    return currentDvorana.predavanje;
                                }
                            }
                        }
                    }
                }

            }
            return null;

        }


        getDanRemoteId = function (data, remoteId) {
            if (data == null || data.dayList == null || data.dayList == 0) {
                return null;
            }


            var currentDay;
            var vrijeme;
            var predavanje;
            var currentDvorana;
            for (var i = 0; i < data.dayList.length; i++) {
                currentDay = data.dayList[i];
                if (currentDay.id == remoteId) {
                    return currentDay;
                }


            }
            return null;

        }

        getVrijemeByRemoteId = function (data, remoteId) {
            if (data == null || data.dayList == null || data.dayList == 0) {
                return null;
            }


            var currentDay;
            var vrijeme;
            var predavanje;
            var currentDvorana;
            for (var i = 0; i < data.dayList.length; i++) {
                currentDay = data.dayList[i];
                for (var j = 0; j < currentDay.vrijemeList.length; j++) {

                    vrijeme = currentDay.vrijemeList[j];
                    if (vrijeme.id == remoteId) {
                        return vrijeme;
                    }
                }


            }
            return null;

        }
        setVrijemeExpanded = function (remoteId, expanded) {

            var data = getPredavanja();
            var vrijeme = getVrijemeByRemoteId(data, remoteId);
            vrijeme.expanded = expanded;
            setPredavanja(data);
        }
        getVrijemeExpanded = function (remoteId) {

            var data = getPredavanja();
            var vrijeme = getVrijemeByRemoteId(data, remoteId);
            if (!vrijeme.hasOwnProperty("expanded")) {
                vrijeme.expanded = false;
            }


            return vrijeme.expanded;

        }

        setDayExpanded = function (remoteId, expanded) {
            console.log(remoteId);
            var data = getPredavanja();
            var dan = getDanRemoteId(data, remoteId);
            dan.expanded = expanded;
            setPredavanja(data);
        }
        getDayExpanded = function (remoteId) {

            var data = getPredavanja();
            var dan = getDanRemoteId(data, remoteId);
            if (!dan.hasOwnProperty("expanded")) {
                dan.expanded = false;
            }
            return dan.expanded;

        }

        setPredavanjeFavorite = function (remoteId, favorite) {

            var data = getPredavanja();
            var predavanje = getPredavanjeByRemoteId(data, remoteId);
            predavanje.favorite = favorite;
            setPredavanja(data);

        };
		getPredavanjeById=function(remoteId)
		{
			var data = getPredavanja();
            var predavanje = getPredavanjeByRemoteId(data, remoteId);
			return predavanje;
		};



        getPredavanjaCache = function (onSucess) {

            eko.serverApi.getCacheVersion(function (cache) {

                var data = getPredavanja();
			//	data=null;
                var appCache=getAppCache();

                if (appCache == null || (cache != null && cache > 0 && cache != appCache)) {
                    data = null;
                    setAppCache(cache);
                }
                
                
                if (DEBUG_ME) {
                    console.log(MODULE_ID + ".getPredavanjaCache cache data =" + data + " cahce = "+ cache);
                }
                if (data != null && !(data === undefined) && data != "undefined") {
                    if (onSucess != null) {

                        onSucess(data);
                    
                    }
                    return;
                }
                if (DEBUG_ME) {
                    console.log(MODULE_ID + ".getPredavanjaCache server load start");
                }
                eko.serverApi.getPredavanja(function (sucess, data) {



                    //  console.log(MODULE_ID + ".getPredavanjaCache server load end sucess= "+ sucess + " data="+data);
                    if (!sucess) {
                        eko.message.showError(eko.message.ERROR_LOADING_CACHE);
                        return;
                    } else {
                        setPredavanja(data);
                        if (onSucess != null) {
                            onSucess(data);

                        }
                        return;
                    }
                });
            });
        }


        return {
            getPredavanjaCache: getPredavanjaCache,
            setPredavanjeFavorite: setPredavanjeFavorite,
            getFilterFavorites: getFilterFavorites,
            setFilterFavorites: setFilterFavorites,
            setDayExpanded: setDayExpanded,
            getDayExpanded: getDayExpanded,
            setVrijemeExpanded: setVrijemeExpanded,
            getVrijemeExpanded: getVrijemeExpanded,
            setFilterPreviousHide: setFilterPreviousHide,
            getFilterPreviousHide: getFilterPreviousHide,
			getDetailsId: getDetailsId,
			setDetailsId: setDetailsId,
			getPredavanjeById: getPredavanjeById,

        };
    })();
}(window.eko = window.eko || {}, jQuery));