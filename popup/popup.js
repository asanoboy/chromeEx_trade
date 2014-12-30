$(function(){
    var handler = chromeWrapper.getPopupHandler();
    (function($form){
        $form.find("button[type=submit]").click(function(){
            handler.sendMessageToBackground("asano", "yosuke",
                function(data){
                    $("body").append(data);
                },
                function(){
                    $("body").append("fail");
                });
            return false;
        });
    })($("#form_dmm"));
});
