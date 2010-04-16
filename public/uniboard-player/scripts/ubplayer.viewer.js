
UbPlayer.Viewer = function() {
  var that = this;
  
  jQuery("#app-viewer").hide();
  jQuery("#app-viewer").click(function(){
    that.hide();
  });
  
  YAHOO.util.CrossFrame.onMessageEvent.subscribe(
    function (type, args, obj) {
      var message = args[0];
      var domain = args[1];
      var appData = [];
      var app = {}
            
      appData = message.split(",");
      app.index = appData[0];
      app.width = parseInt(appData[1]);
      app.height = parseInt(appData[2]);
            
      jQuery("#app-viewer-app")
        .attr("src", app.index)
        .width(app.width)
        .height(app.height);
      jQuery("#app-viewer-appborder")
        .width(app.width + 20)
        .height(app.height + 35)
        
      jQuery("#app-viewer-background").show();
      jQuery("#app-viewer").show();
      jQuery("#app-viewer-app").show();
      jQuery("#app-viewer-background").animate({opacity:"0.8"},600);
      jQuery("#app-viewer").animate({opacity:"1"});
    }
  );
};

UbPlayer.Viewer.prototype.show = function(appUrl){  
  // Ask for app config.xml
  YAHOO.util.CrossFrame.send(
    "http://assets.getuniboard.com/publishing/proxy/proxy.html",
    "frames['getAppConf']",
    appUrl);
}

UbPlayer.Viewer.prototype.hide = function(){
  jQuery("#app-viewer-background").animate(
      {opacity:"0"}, 
      500, 
      function(){
        jQuery(this).hide()
      });
  jQuery("#app-viewer").animate(
    {opacity:"0"}, 
    function(){
      jQuery(this).hide();
      jQuery("#app-viewer-app").hide();
    });
}