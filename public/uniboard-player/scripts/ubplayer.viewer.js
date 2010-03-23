
UbPlayer.Viewer = function() {
  var that = this;
  
  jQuery("#app-viewer").hide();
  jQuery("#app-viewer").click(function(){
    that.hide();
  });
};

UbPlayer.Viewer.prototype.show = function(appUrl){
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
  
  jQuery.ajax({
    url: app.config,
    dataType: 'xml',
    success: function(data){
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
      jQuery("#app-viewer").show();
    }
  });
}

UbPlayer.Viewer.prototype.hide = function(){
  jQuery("#app-viewer").hide();
}