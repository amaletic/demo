(function (eko, $, undefined) {
    eko.message = (function () {

        const MODULE_ID = "MessagingModule"
        const LOCAL_CACHE_ID = "LocalCahce";
        const DEBUG_ME = false;
        if (DEBUG_ME) {
            console.log(MODULE_ID + " PRESTART");
        }
		getListControlerInstance=function()
		{
			return angular.element(document.getElementById('appControler')).scope();
		}

        showError = function (data) {

		getListControlerInstance().showAlert(data);
		
	


        },

        showLoading =function()
        {
            	$(".spinner").show();
            	$(".tab-content").hide();

          	$(".tab-content").css('z-index', -1);
                //$(".tab-content")
                
                
        }
        hideLoading =function()
        {
           $(".spinner").hide();
            $(".tab-content").show();
           $(".tab-content").css('z-index', 1);
        }
        return {
            showError: showError,
            showLoading: showLoading,
            hideLoading : hideLoading,

            ERROR_TITLE: "Greška",
            ERROR_LOADING_CACHE: "Provjerite internet konekciju",
            HIDE_NOT_FAVORITE: "Sakriti neoznačene",
            SHOW_NOT_FAVORITE: "Prikaži i neoznačene",
            HIDE_PASSED: "Sakriti prošle",
            SHOW_PASSED: "Show prošle"

        };
    })();
} (window.eko = window.eko || {}, jQuery));