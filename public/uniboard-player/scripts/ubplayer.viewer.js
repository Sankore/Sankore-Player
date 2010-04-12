
UbPlayer.Viewer = function() {
  var that = this;
  
  jQuery("#app-viewer").hide();
  jQuery("#app-viewer").click(function(){
    that.hide();
  });
};

UbPlayer.Viewer.prototype.show = function(appUrl){  
  var appData = [];
  var app = {
    index:"", 
    config:appUrl + "/config.xml", 
    icon:appUrl + "/icon.png",
    width:0,
    height:0,
    data:{
      name:"",
      author:"",
      description:""
    }
  };
    
  /*jQuery.ajax({
    url: app.config,
    dataType: 'xml',
    success: function(data){
      alert("vshow 2");
      app.index = appUrl + "/" + jQuery(data).find("content").attr("src");
      app.width = parseInt(jQuery(data).find("widget").attr("width"));
      app.height = parseInt(jQuery(data).find("widget").attr("height"));
      app.data.name = jQuery(data).find("name").text();
      app.data.author = jQuery(data).find("author").text();
      app.data.description = jQuery(data).find("description").text();

      jQuery("#app-viewer-app")
        .attr("src", app.index)
        .width(app.width)
        .height(app.height);
      jQuery("#app-viewer-appborder")
        .width(app.width + 20)
        .height(app.height + 35)
      jQuery("#app-viewer").show();
      jQuery("#app-viewer-app").show();
    }
  });*/
  
  //if(window.location)
  
  YAHOO.util.CrossFrame.onMessageEvent.subscribe(
    function (type, args, obj) {
      var message = args[0];
      var domain = args[1];
      
      alert(message);
      
      appData = message.split(",");
      
      alert(appData[0] + ", " + appData[1]);
    }
  );
    
  YAHOO.util.CrossFrame.send(
    "http://assets.getuniboard.com/publishing/proxy/proxy.html",
    "frames['getAppConf']",
    appUrl);
}

UbPlayer.Viewer.prototype.hide = function(){
  jQuery("#app-viewer").hide();
}