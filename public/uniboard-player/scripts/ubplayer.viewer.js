
UbPlayer.Viewer = function() {
  var that = this;
  
  this.appWidth = 0;
  this.appHeight = 0;
  
  jQuery("#app-viewer").hide();
  jQuery("#app-viewer").click(function(){
    that.hide();
  });
  
  if(jQuery.browser.msie || jQuery.browser.mozilla){
    
  }else{
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
          .width(that.appWidth)
          .height(that.appHeight);
        jQuery("#app-viewer-appborder")
          .width(that.appWidth + 20)
          .height(that.appHeight + 35)

        jQuery("#app-viewer-background").show();
        jQuery("#app-viewer").show();
        jQuery("#app-viewer-app").show();
        jQuery("#app-viewer-background").animate({opacity:"0.8"},600);
        jQuery("#app-viewer").animate({opacity:"1"});
      }
    );
  }
};

UbPlayer.Viewer.prototype.show = function(appUrl, width, height){
  this.appWidth = width;
  this.appHeight = height;
  
  if(jQuery.browser.msie || jQuery.browser.mozilla){
    alert("show " + appUrl + " : " + width + ", " + height);
    jQuery("#app-viewer-app")
      .attr("src", appUrl)
      .width(this.appWidth)
      .height(this.appHeight);
    jQuery("#app-viewer-appborder")
      .width(this.appWidth + 20)
      .height(this.appHeight + 35)
      
      jQuery("#app-viewer-background").show();
      jQuery("#app-viewer").show();
      jQuery("#app-viewer-app").show();
      jQuery("#app-viewer-background").animate({opacity:"0.8"},600);
      jQuery("#app-viewer").animate({opacity:"1"});
  }else{
    // Ask for app config.xml
    YAHOO.util.CrossFrame.send(
      "http://assets.getuniboard.com/publishing/proxy/proxy.html",
      "frames['getAppConf']",
      appUrl);
  }
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
      jQuery("#app-viewer-app")
        .attr("src", "")
        .hide();
    });
}