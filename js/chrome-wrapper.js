(function(global){
    function createRequestMessage(action, data){
        return {action: action, data: data, isRequest: true};
    }

    function createResponseMessage(status, data){
        return {status: !!status, data: data, isResponse: true};
    }

    function receiveResponse(response, resolve, reject){
        if( !response.isResponse ) throw "Invalid response message.";

        if( response.status ) {
            resolve(response.data);
        }
        else {
            reject(response.data);
        }
    }

    function createRequestListener(handler) {
        return function(request, sender, sendResponse) {
            if( !request.isRequest ) throw "Invalid request message.";
            handler.onRequest(
                request,
                function(data){
                    sendResponse(createResponseMessage(true, data));
                }, 
                function(data){
                    sendResponse(createResponseMessage(false, data));
                });
            return true;
        };
    }

    var createdTabHandlers = [];
    function createTabHandler(tab) {
        var handler = {
            tab: tab,
            id: function(){ return tab.id; },
            sendMessage: function(action, data, resolve, reject){
                if( !resolve ) resolve = function(){};
                if( !reject ) reject = function(){};
                chrome.tabs.sendMessage(tab.id, createRequestMessage(action, data), function(res){
                    receiveResponse(res, resolve, reject);
                });
            },
            onUpdated: function(info) {}, // Should be overrided.
        };
        createdTabHandlers.push(handler);
        return handler;
    }

    var popupHandler = {
        sendMessageToBackground: function(action, data, resolve, reject){
            if( !resolve ) resolve = function(){};
            if( !reject ) reject = function(){};
            chrome.runtime.sendMessage(createRequestMessage(action, data), function(res){
                receiveResponse(res, resolve, reject);
            });
        },
    };

    var backgroundHandler = {
        onRequest: null,  // Shoule be overrided.
        createTab: function(url, resolve, reject){
            chrome.tabs.create({url: url, active: false}, function(tab){
                resolve(createTabHandler(tab));
            });
        },
    };

    var contentHandler = {
        onRequest: null,  // Shoule be overrided.
    };

    var hasInitialized = false;
    global.chromeWrapper = {
        getPopupHandler: function(){
            hasInitialized = true;
            return popupHandler;
        },
        getBackgroundHandler: function(){
            if( !hasInitialized ) {
                chrome.runtime.onMessage.addListener(createRequestListener(backgroundHandler));

                chrome.tabs.onUpdated.addListener(function(tabId, info) {
                    createdTabHandlers.filter(function(handler){
                        return handler.id() == tabId;
                    })
                    .forEach(function(handler){
                        if( handler.onUpdated ) {
                            handler.onUpdated(info);
                        }
                    });
                });
                hasInitialized = true;
            } 
            return backgroundHandler;
        },
        getContentHandler: function(){
            if( !hasInitialized ) {
                chrome.runtime.onMessage.addListener(createRequestListener(contentHandler));
                hasInitialized = true;
            }
            return contentHandler;
        },
    };
})(this);