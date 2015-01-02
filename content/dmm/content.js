"use strict";

(function($lib, $, global){
    var URLS = $lib.urls;
    var Currency = $lib.classes.Currency;

    var onRequestForInvalid = function(request, resolve, reject){
        reject("Invalid location: " + document.location);
    };

    var onRequestForSwap = function(request, resolve, reject){
        var currencyList = [];
        try {
            $("table.swap_list").each(function(i){
                var $table = $(this);
                var currencyListInTable = [];

                var currentDate = null;
                var currentDayNumsInTable = [];
                $table.find("th").each(function(i){
                    var curIndex = i-2;
                    if( curIndex >= 0 ){
                        currencyListInTable.push(new Currency($(this).html()));
                    }
                });

                $table.find("tbody tr").each(function(i){
                    var $tr = $(this);
                    switch(i%3){
                        case 0: // huyo nissuu
                            var dateStr = $tr.find("td:first").html(),
                                match = dateStr.match(/^(\d{2})\/(\d{2})/);

                            if( !match ) reject("Invalid date string: " + dateStr);

                            var month = parseInt(match[1], 10),
                                day = parseInt(match[2], 10),
                                now = new Date();
                            if( now.getMonth() >= 6 && month <= 2) { // Next year
                                currentDate = new Date((now.getFullYear()+1) + '/' + month + '/' + day);
                            }
                            else if( now.getMonth() < 6 && month >=11 ) { // Last year
                                currentDate = new Date((now.getFullYear()-1) + '/' + month + '/' + day);
                            }
                            else {
                                currentDate = new Date((now.getFullYear()) + '/' + month + '/' + day);
                            }

                            $tr.find("td").each(function(i){
                                var curIndex = i-2;
                                if( curIndex >= 0 ){
                                    var num = parseInt($(this).html(), 10);
                                    currentDayNumsInTable.push( isNaN(num) ? false : num );
                                }
                            });
                            break;
                        case 1:  // kai
                            $tr.find("td").each(function(i){
                                var curIndex = i-1;
                                if( curIndex >= 0 ){
                                    var currency = currencyListInTable[curIndex];
                                    var num = currentDayNumsInTable[curIndex];
                                    if( num !== false ) {
                                        var swap = parseInt($(this).html(), 10);
                                        if( isNaN(swap) ) throw "Invalid swap";
                                        if( num > 0 ) {
                                            if( !currency.addDateAndYenPer10k(currentDate, swap/num) ){
                                                throw { msg: "Already exists", currency: currency, date: currentDate };
                                            }
                                        }
                                    }
                                }
                            });
                            break;
                        case 2: // uri
                            currentDate = null;
                            currentDayNumsInTable = [];
                            break;
                    }
                });
                currencyList = currencyList.concat(currencyListInTable);
            });
        }
        catch(e){
            reject(e);
            return;
        }
        resolve(currencyList);
    };

    { // main
        var handler = chromeWrapper.getContentHandler();
        switch(document.location+"")
        {
            case URLS.SWAP:
                handler.onRequest = onRequestForSwap;
                break;

            default:
                handler.onRequest = onRequestForInvalid;
                break;
        }
    }

    onRequestForSwap('', function(){
        debugger;
    }, function(){
        debugger;
    });
})(this.Ex.dmm, jQuery, this);
