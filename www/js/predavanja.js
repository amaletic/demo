(function (eko, $, undefined) {
    eko.predavanja = (function () {

        const MODULE_ID = "PredavanjaModule"
        const DEBUG_ME = false;
        const CHECK_OLD_EVERY_MILISECONDS = 60000;

        console.log(MODULE_ID + " PRESTART");

        getListControlerInstance = function () {
            return angular.element(document.getElementById('appControler')).scope();
        }

        formatVrijeme = function (data) {
            if (data == null) {
                return "00";
            }
            data = data + "";
            while (data.length < 2) {
                data = "0" + data;
            }
            return data;
        }

        filterPrevious = function () {

            var passedList = $(".predavanje-row");
            var current;
            var currentTime = (new Date()).getTime();
            var hide = eko.cache.getFilterPreviousHide();
            for (var i = 0; i < passedList.length; i++) {
                current = passedList.eq(i);
                if (parseInt(current.attr("eventmilisecondes"), 10) < currentTime) {
                    current.addClass("activePredavanje");
                } else {
                    current.removeClass("activePredavanje");
                }


                if (parseInt(current.attr("eventtotal"), 10) < currentTime) {

                    current.addClass("predavanjePassed");
                    current.removeClass("activePredavanje");
                    if (hide) {

                        current.addClass("pasedHidden");
                    } else {

                        current.removeClass("pasedHidden");
                    }


                } else {
                    current.removeClass("predavanjePassed");
                    current.removeClass("pasedHidden");
                }

            }

            if (hide) {
                $(".hidePassed").html(eko.message.SHOW_PASSED);

            } else {
                $(".hidePassed").html(eko.message.HIDE_PASSED);
            }

            fixPassed();
        }

        filterFavorites = function () {

            if (eko.cache.getFilterFavorites()) {
                $(".predavanje-row[favorite='false']").addClass("notFavoriteHidden");
                $(".hideNonFavorite").html(eko.message.SHOW_NOT_FAVORITE);

            } else {
                $(".predavanje-row[favorite='false']").removeClass("notFavoriteHidden");

                $(".hideNonFavorite").html(eko.message.HIDE_NOT_FAVORITE);
            }
            fixNoVisibleData();
        }
        fixPassed = function () {
            var dataToHide = $(".tbl-body-hdr, .prli");
            var current;
            for (var i = 0; i < dataToHide.length; i++) {
                current = dataToHide.eq(i);


                if (current.find(".predavanje-row:not(.activePredavanje)").length == 0) {
                    current.addClass("activePredavanje");
                } else {
                    current.removeClass("activePredavanje");
                }

                if (current.find(".predavanje-row:not(.predavanjePassed)").length == 0) {
                    current.removeClass("activePredavanje");
                    current.addClass("predavanjePassed");
                } else {
                    current.removeClass("predavanjePassed");
                }

                if (current.find(".predavanje-row:not(.pasedHidden)").length == 0) {
                    current.addClass("pasedHidden");
                } else {
                    current.removeClass("pasedHidden");
                }





            }
        }

        fixNoVisibleData = function () {

            var dataToHide = $(".tbl-body-hdr");
            var current;
            for (var i = 0; i < dataToHide.length; i++) {
                current = dataToHide.eq(i);

                if (current.find(".predavanje-row:not(.notFavoriteHidden,.pasedHidden)").length == 0) {
                    current.addClass("noDataHidden");
                } else {
                    current.removeClass("noDataHidden");
                }
            }


        }

        doExpandByCache = function () {

            var dataList = $('.date-time');
            if (dataList != null) {
                var currentExpand;
                var expanded;
                var remoteId;
                for (var i = 0; i < dataList.length; i++) {
                    currentExpand = dataList.eq(i);
                    remoteId = currentExpand.attr("dayremoteid");
                    expanded = eko.cache.getDayExpanded(remoteId);

                    if (expanded) {
                        var arrow = currentExpand.find(".arrow-title");
                        var show = arrow.attr("show");
                        arrow.closest(".prlu").find(".date-time-tbl").removeClass("notExpanded");
                        arrow.attr("show", true);

                        arrow.removeClass("ion-arrow-down-b");
                        arrow.addClass("icon ion-arrow-left-b");

                    }

                }
            }

            dataList = $('.tbl-hdr');
            if (dataList != null) {
                var currentExpand;
                var expanded;
                var remoteId;
                for (var i = 0; i < dataList.length; i++) {
                    currentExpand = dataList.eq(i);
                    remoteId = currentExpand.attr("timeremoteid");
                    expanded = eko.cache.getVrijemeExpanded(remoteId);

                    if (expanded) {

                        var arrow = currentExpand.find(".arrow-expand");
                        var show = arrow.attr("show");

                        arrow.closest(".tbl-body-hdr").find(".tbl-body-container").removeClass("notExpanded");
                        arrow.attr("show", true);
                        arrow.removeClass("ion-arrow-down-b");
                        arrow.addClass("icon ion-arrow-left-b");

                    }

                }
            }

        }

        loadEventHadler = function () {

            //    $(".date-time-tbl").addClass("notExpanded");
            //   $(".tbl-body-container").addClass("notExpanded");
            filterFavorites();
            doExpandByCache();
            filterPrevious();

            setInterval(filterPrevious, CHECK_OLD_EVERY_MILISECONDS);
            $('.predavanje-favorite').on('click', function (event) {

                var favoriteHolder = $(this).parent().find(".favorite-holder");
                var favorite = favoriteHolder.hasClass("icon-star-not-favorite");
                var Id = $(this).parent().attr("remoteIdPredavanje");
                eko.cache.setPredavanjeFavorite(Id, favorite);
                if (favorite) {

                    favoriteHolder.removeClass("icon-star-not-favorite");
                    favoriteHolder.addClass("icon-star-favorite");
                } else {

                    favoriteHolder.removeClass("icon-star-favorite");
                    favoriteHolder.addClass("icon-star-not-favorite");
                }
                $(this).parent().attr("favorite", favorite);


            });

            $('.details').on('click', function (event) {

                var id = $(this).parent().attr("remoteIdPredavanje");
                //   window.location.href= "/details.html?id="+Id; 
                getListControlerInstance().openDetails(id);

            });

            $('.date-time').on('click', function (event) {
                var arrow = $(this).find(".arrow-title");
                var show = arrow.attr("show");
                if (show == "true") {
                    arrow.closest(".prlu").find(".date-time-tbl").addClass("notExpanded");

                    arrow.attr("show", false);

                    arrow.removeClass("icon ion-arrow-left-b");
                    arrow.addClass("ion-arrow-down-b");
                    eko.cache.setDayExpanded($(this).attr("dayremoteid"), false);

                } else {
                    arrow.closest(".prlu").find(".date-time-tbl").removeClass("notExpanded");
                    arrow.attr("show", true);

                    arrow.removeClass("ion-arrow-down-b");
                    arrow.addClass("icon ion-arrow-left-b");
                    eko.cache.setDayExpanded($(this).attr("dayremoteid"), true);
                }
            });

            $('.tbl-hdr').on('click', function (event) {


                var arrow = $(this).find(".arrow-expand");
                var show = arrow.attr("show");

                if (show == "true") {

                    arrow.closest(".tbl-body-hdr").find(".tbl-body-container").addClass("notExpanded");



                    arrow.attr("show", false);
                    arrow.removeClass("icon ion-arrow-left-b");
                    arrow.addClass("ion-arrow-down-b");

                    eko.cache.setVrijemeExpanded($(this).attr("timeremoteid"), false);

                } else {
                    arrow.closest(".tbl-body-hdr").find(".tbl-body-container").removeClass("notExpanded");
                    arrow.attr("show", true);
                    arrow.removeClass("ion-arrow-down-b");
                    arrow.addClass("icon ion-arrow-left-b");
                    eko.cache.setVrijemeExpanded($(this).attr("timeremoteid"), true);
                }
            });





        }

        loadTemplate = function (callback) {


            // if (ionic.Platform.isAndroid()) { 
            //    url = "/android_asset/www/predavanjeTemplate.html";
            //} else {
            url = "predavanjeTemplate.html";
            //}

            $.ajax({
                url: url,
                context: document.body
            }).done(function (data) {
                if (DEBUG_ME) {
                    console.log(MODULE_ID + " Load template done")
                }
                if (callback != null) {
                    callback(data);
                }
            });


        }

        buildHtml = function (dataCont, dayList, template) {
            var cloned;
            var currentDay;
            var time;
            var currentBody;
            if (DEBUG_ME) {
                console.log(MODULE_ID + " dataSize=" + dayList.length);
            }
            for (var i = 0; i < dayList.length; i++) {
                currentDay = dayList[i];
                cloned = $(template);
                cloned.find(".date-time").attr("dayRemoteId", currentDay.id);
                cloned.find(".date-time-title").html(currentDay.code + " (" + currentDay.hrDayName + ")");


                currentBody = cloned.find(".tbl");
                currentBody.empty();

                buldVrijeme(currentDay, template, currentBody);




                cloned.appendTo(dataCont);
            }
        }
        buldVrijeme = function (currentDay, template, currentBody) {


            var currentVrijeme;
            var vrijemeHeaderTemplate;
            var predavanjeTemplate;
            var vrijemeUIRow;
            var predavanjeUIRow;
            var bodyContainer;
            if (currentDay.vrijemeList != null && currentDay.vrijemeList.length > 0) {
                for (var j = 0; j < currentDay.vrijemeList.length; j++) {
                    currentVrijeme = currentDay.vrijemeList[j];
                    if (DEBUG_ME) {
                        console.log(MODULE_ID + " vrijeme=" + currentVrijeme);
                    }

                    predavanjeUIRow = $(template).find(".tbl-body-hdr");




                    predavanjeUIRow.empty();
                    vrijemeHeaderTemplate = $(template).find(".tbl-hdr");
                    bodyContainer = $(template).find(".tbl-body-container");
                    bodyContainer.empty();

                    vrijemeHeaderTemplate.find(".hdr-cell2").html(formatVrijeme(currentVrijeme.sat) + ":" + formatVrijeme(currentVrijeme.min));
                    vrijemeHeaderTemplate.attr("timeremoteid", currentVrijeme.id);


                    buildPredavanje(bodyContainer, template, currentVrijeme.dvoranaList);
                    vrijemeHeaderTemplate.appendTo(predavanjeUIRow);
                    predavanjeUIRow.appendTo(currentBody);
                    bodyContainer.appendTo(predavanjeUIRow);
                }
            }
        }

        buildPredavanje = function (bodyContainer, template, dvoranaList) {
            if (DEBUG_ME) {
                console.log(MODULE_ID + " dvorana build =" + dvoranaList);
            }
            if (dvoranaList == null || dvoranaList.length == 0) {
                return;
            }
            var currentDvorana;
            var predavanjeTemplate;
            for (var i = 0; i < dvoranaList.length; i++) {
                predavanjeTemplate = $(template).find(".tbl-row");
                currentDvorana = dvoranaList[i];

                predavanjeTemplate.attr("remoteIdPredavanje", currentDvorana.predavanje.id);

                predavanjeTemplate.attr("eventmilisecondes", currentDvorana.predavanje.dateMiliseconds);
                predavanjeTemplate.attr("eventdurationmins", currentDvorana.predavanje.trajanje);
                predavanjeTemplate.attr("eventtotal", currentDvorana.predavanje.dateMiliseconds + currentDvorana.predavanje.trajanje * 60 * 1000);

                var favoriteHolder = predavanjeTemplate.find(".favorite-holder");
                favoriteHolder.removeClass("icon-star-not-favorite");
                favoriteHolder.removeClass("icon-star-favorite");
                //Moze biti undefined azto if
                if (currentDvorana.predavanje.favorite) {
                    predavanjeTemplate.attr("favorite", "true");
                } else {
                    predavanjeTemplate.attr("favorite", "false");
                }


                if (currentDvorana.predavanje.favorite) {


                    favoriteHolder.addClass("icon-star-favorite");
                } else {


                    favoriteHolder.addClass("icon-star-not-favorite");

                }
                predavanjeTemplate.find(".cell1").html(currentDvorana.naziv);
                predavanjeTemplate.find(".cell2").html(currentDvorana.predavanje.naziv + " (" + currentDvorana.predavanje.trajanje + " min)");

                predavanjeTemplate.appendTo(bodyContainer);
            }



        }

        getPredavanjeDetails = function () {
            var predavanje = eko.cache.getPredavanjeById(eko.cache.getDetailsId());
            console.log(predavanje);
            //	alert(eko.cache.getDetailsId());

            $(".naziv").html(predavanje.naziv)
            $(".dvorana").html(predavanje.dvorana.naziv);
            $(".opis").html(predavanje.opis);
            $(".lang").html(predavanje.jezik);
            $(".start").html(predavanje.datum + " (" + predavanje.danDesc + ")");
            $(".trajanje").html(predavanje.trajanje + " min");
            $(".oznaka").html(predavanje.oznakaPredavanja);
            if (predavanje.predavac1 != null) {
                $(".imePrezime1").html(predavanje.predavac1.imePrezime + " (" + predavanje.predavac1.poduzece + ") ");
                $(".zivotopis1").html(predavanje.predavac1.opis);
                  loadCacheImage($(".predavacSlika1"), predavanje.predavac1.slikaData);
            } else {
                $(".predavac1").hide();
            }
            if (predavanje.predavac2 != null) {
                $(".imePrezime2").html(predavanje.predavac2.imePrezime + " (" + predavanje.predavac2.poduzece + ") ");
                $(".zivotopis2").html(predavanje.predavac2.opis);
                loadCacheImage($(".predavacSlika2"), predavanje.predavac2.slikaData);
            } else {
                $(".predavac2").hide();
            }




          
        }
        loadCacheImage = function (cont, data) {
            cont.attr("src", "data:image/png;base64," + data);

        }


        getPredavanjaCache = function () {

            eko.message.showLoading();
            eko.cache.getPredavanjaCache(function (data) {


                if (DEBUG_ME) {
                    console.log(MODULE_ID + " LOAD START");
                    console.log(data);
                    console.log(MODULE_ID + " LOAD START data=" + data == null);
                }
                if (data == null || data.dayList == null || data.dayList.length == 0) {
                    console.error(MODULE_ID + " Load template no data")
                    return;
                }
                loadTemplate(function (template) {

                    var dataCont = $(".dataCont");

                    buildHtml(dataCont, data.dayList, template);

                    // $(template).appendTo(dataCont);
                    loadEventHadler();

                    eko.message.hideLoading();
					
					//$(".dataCont").attr("style", "height: calc(100vh - " + ($(".bar-header").height()+ "px")+ " - " + ($(".tab-nav").height() +"px )"));

                });

            });
        }
        $(document).ready(function () {

            if (window.location.href.indexOf("details.html") > -1) {
                getPredavanjeDetails();
            } else {
                getPredavanjaCache();
            }




        });







        angular.module('javaCro', ['ionic']).controller('SettingsCtrl', function ($scope, $ionicPopup, $location, $window) {
            $scope.favoritesFilter = eko.cache.getFilterFavorites();
            $scope.closedFilter = eko.cache.getFilterPreviousHide();

            $scope.backToList = function () {
                $window.open("index.html", '_self');
            }
            $scope.openDetails = function (id) {
                //alert("tu sam"+ "/#"+"/details.html");
                //$window.location.href = "/#"+"/details.html";

                eko.cache.setDetailsId(id);
                $window.open("details.html", '_self');

            }
            $scope.toggleFavorites = function () {
                eko.cache.setFilterFavorites($scope.favoritesFilter);
                filterFavorites()
            };
            $scope.toggleClosed = function () {
                eko.cache.setFilterPreviousHide($scope.closedFilter);
                filterPrevious();
            };

            // An alert dialog
            $scope.showAlert = function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: eko.message.ERROR_TITLE,
                    template: data
                });

                alertPopup.then(function (res) {
                   	ionic.Platform.exitApp();
                });
            };


        });

        return {


        };
    })();
} (window.eko = window.eko || {}, jQuery));