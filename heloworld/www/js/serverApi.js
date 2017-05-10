(function (eko, $, undefined) {
    eko.serverApi = (function() {
        const MODULE_ID = "ServerAPI"
        const SERVER_URL = "http://www.ekonerg.hr/ionic/rs";
        const LECTURE_LIST = "pn/listj";
        const CACHE_VERSION = "pn/cacheVersion";
        const DEBUG_ME = false;


        reloadCache = function(data) {

            eko.database.uploadPredavanjeDataToDatabase(data);

        }


        getJsonData = function(serviceCode, showError, callback) {
            var jqxhr = $.getJSON(SERVER_URL + "/" + serviceCode, function(data) {
                    if (DEBUG_ME) {
                        console.log(MODULE_ID + "AJAX success");
                    }
                    callback(true, data);
                })
                .fail(function(error) {

                    console.error(MODULE_ID + " AJAX failed " + error.message);
					 callback(false,  error.message);
                });


        }


        getCacheVersion = function(sucessCallback) {
            eko.message.showLoading();
            getJsonData(CACHE_VERSION, false, function(sucess, data) {
             
                if (DEBUG_ME) {
                    console.log(MODULE_ID + " result " + sucess);
                }
                if (!sucess) {
                    sucessCallback(-2);
					return;
                }

                if (data != null && data.value != null) {
                    sucessCallback(data.value);
                } else {
                    sucessCallback(-1);
                }


            });

        };


        getPredavanja = function(sucessCallback) {

		
            getJsonData(LECTURE_LIST, true, function(sucess, data) {

                if (DEBUG_ME) {
                    console.log(MODULE_ID + " result " + sucess + "CACHE VERSION =" + cache);
                }
				
                sucessCallback(sucess, data);
                //console.log($(".data"))


            });


        }


        return {
            getPredavanja: getPredavanja,
            getCacheVersion: getCacheVersion
        };
    })();
}(window.eko = window.eko || {}, jQuery));