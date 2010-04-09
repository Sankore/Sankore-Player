
UbPlayer.Page = {};

UbPlayer.Page.svgNS = 'http://www.w3.org/2000/svg';
UbPlayer.Page.uniboardNS = 'http://uniboard.mnemis.com/document';
UbPlayer.Page.xlinkNS = 'http://www.w3.org/1999/xlink';

/*UbPlayer.Page.reduceDomain = function()
{
  var allDomainsParts = document.domain.split(".");
  
  if (allDomainsParts.length > 2)
    document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    
  console.log(document.domain);
}*/

UbPlayer.Page.updateForeignObjects = function()
{
  var foreignObjects = document.getElementsByTagName('foreignObject'); 

  for(var i = 0; i < foreignObjects.length; i++)
  {
    
    if(foreignObjects[i].getAttributeNS(UbPlayer.Page.uniboardNS, "source").length===0) continue;
    
    var fo = foreignObjects[i];
    var appbody = document.createElementNS(UbPlayer.Page.svgNS, 'rect');
    var appview = document.createElementNS(UbPlayer.Page.svgNS, 'image');
    var appborder = document.createElementNS(UbPlayer.Page.svgNS, 'rect');
    var widgetUrl = window.location + '/../' + fo.getAttributeNS(UbPlayer.Page.uniboardNS, 'src');
    var widgetUuid = fo.getAttributeNS(UbPlayer.Page.uniboardNS, 'uuid');
    var widgetImg = window.location + '/../widgets/' + widgetUuid + ".png";
    
    appbody.setAttributeNS(null, 'x', fo.attributes['x'].value);
    appbody.setAttributeNS(null, 'y', fo.attributes['y'].value);
    appbody.setAttributeNS(null, 'width', fo.attributes['width'].value);
    appbody.setAttributeNS(null, 'height', fo.attributes['height'].value);
    appbody.setAttributeNS(null, 'transform', fo.attributes['transform'].value);
    appbody.setAttributeNS(null, 'class', 'ghost');
    
    appview.setAttributeNS(null, 'x', fo.attributes['x'].value);
    appview.setAttributeNS(null, 'y', fo.attributes['y'].value);
    appview.setAttributeNS(null, 'width', fo.attributes['width'].value);
    appview.setAttributeNS(null, 'height', fo.attributes['height'].value);
    appview.setAttributeNS(null, 'transform', fo.attributes['transform'].value);
    
    this.testImage(appview, appbody, widgetImg);
    appview.setAttributeNS(UbPlayer.Page.xlinkNS, 'href', widgetImg);

    appborder.setAttributeNS(null, 'x', fo.attributes['x'].value - 10);
    appborder.setAttributeNS(null, 'y', fo.attributes['y'].value - 10);
    appborder.setAttributeNS(null, 'width', parseInt(fo.attributes['width'].value) + 20);
    appborder.setAttributeNS(null, 'height', parseInt(fo.attributes['height'].value) + 20);
    appborder.setAttributeNS(null, 'rx', 10);
    appborder.setAttributeNS(null, 'transform', fo.attributes['transform'].value);
    
    appborder.setAttributeNS(null, 'id', widgetUuid);
    appborder.setAttributeNS(null, 'class', 'out');
        
    if(window.parent.myUbPlayer.state !== "embedded"){
      appview.setAttributeNS(null, 'onclick', "window.parent.myUbPlayer.viewer.show('" + widgetUrl + "');");
      appview.setAttributeNS(null, 'onmouseover', "UbPlayer.Page.highlight('" + widgetUuid + "')");
      appview.setAttributeNS(null, 'onmouseout', "document.getElementById('" + widgetUuid + "').setAttributeNS(null, 'class', 'out')");
    }
    
    foreignObjects[i].setAttributeNS(null, 'class', 'app');
    foreignObjects[i].parentNode.insertBefore(appbody, foreignObjects[i]);
    foreignObjects[i].parentNode.insertBefore(appborder, foreignObjects[i]);
    foreignObjects[i].parentNode.insertBefore(appview, foreignObjects[i]);
  }
  
}

UbPlayer.Page.init = function() 
{
  UbPlayer.reduceDomain();
  UbPlayer.Page.updateForeignObjects();
}

UbPlayer.Page.highlight = function(widgetUuid)
{
  document.getElementById(widgetUuid).setAttributeNS(null, 'class', 'over');
  //var clickmeDiv = jQuery("div");
  //clickmeDiv.css({height:50, width:100, backgroundColor:"red"});
  //$("body").append(clickmeDiv);
}

UbPlayer.Page.testImage = function(appview, appbody, url)
{
  var myImage = new Image();
  
  myImage.src = url;
  myImage.onerror = errorHandler;

  function errorHandler()
  {
    appview.setAttributeNS(null, 'display', 'none');
    appbody.setAttributeNS(null, 'class', 'body');
  }
}

window.onload = UbPlayer.Page.init; 






