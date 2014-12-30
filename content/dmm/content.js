(function(){
    var handler = chromeWrapper.getContentHandler();
    handler.onRequest = function(request, resolve, reject){
        resolve("Hello " + request.data);
    };
})();
