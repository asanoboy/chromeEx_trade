$(function(){
    var handler = chromeWrapper.getPopupHandler();
    $("#dmm_scraping_btn").click(function(){
        handler.sendMessageToBackground("", "",
            function(data){
                $("body").append(data);
            },
            function(){
                $("body").append("fail");
            });
        return false;
    });
});
