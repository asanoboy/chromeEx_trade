(function($lib){
    var ACTIONS = $lib.background.actions;

    var handler = chromeWrapper.getBackgroundHandler();
    handler.onRequest = function(request, resolve, reject) {
        switch(request.action)
        {
            case ACTIONS.SCRAPE_DMM:
                handler.createTab($lib.dmm.urls.SWAP,
                    function(tab){
                        tab.onUpdated = function(info) {
                            if( info.status == "complete" ) {
                                tab.sendMessage(request.action, request.data, resolve, reject);
                                tab.onUpdated = null;
                                tab.close();
                            }
                        };
                    },
                    function(){})
                    ;
                break;
            case ACTIONS.SCRAPE_SBI:
                break;
            case ACTIONS.GET_RESOURCE:
                break;
        }
    };
})(this.Ex);