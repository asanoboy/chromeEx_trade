(function(){
    var handler = chromeWrapper.getBackgroundHandler();
    handler.onRequest = function(request, resolve, reject) {
        handler.createTab("http://fx.dmm.com",
            function(tab){
                tab.onUpdated = function(info) {
                    if( info.status == "complete" ) {
                        tab.sendMessage(request.action, request.data, resolve, reject);
                        tab.onUpdated = null;
                    }
                };
            },
            function(){})
            ;
    };
})();