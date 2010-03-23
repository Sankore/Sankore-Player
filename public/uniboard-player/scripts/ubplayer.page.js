
UbPlayer.Page = {};

UbPlayer.Page.svgNS = 'http://www.w3.org/2000/svg';
UbPlayer.Page.uniboardNS = 'http://uniboard.mnemis.com/document';

UbPlayer.Page.reduceDomain = function()
{
  var allDomainsParts = document.domain.split(".");
  
  if (allDomainsParts.length > 2)
    document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
}

UbPlayer.Page.updateForeignObjects = function()
{
  var foreignObjects = document.getElementsByTagName('foreignObject'); 

  for(var i = 0; i < foreignObjects.length; i++)
  {
    var fo = foreignObjects[i];
    var outline = document.createElementNS(UbPlayer.Page.svgNS, 'rect');
    var widgetUrl = window.location + '/../' + fo.getAttributeNS(UbPlayer.Page.uniboardNS, 'src');
    var widgetUuid = fo.getAttributeNS(UbPlayer.Page.uniboardNS, 'uuid');
    
    outline.setAttributeNS(null, 'ry', 5);
    outline.setAttributeNS(null, 'rx', 5);
    outline.setAttributeNS(null, 'x', fo.attributes['x'].value);
    outline.setAttributeNS(null, 'y', fo.attributes['y'].value - 20);
    outline.setAttributeNS(null, 'width', fo.attributes['width'].value);
    outline.setAttributeNS(null, 'height', fo.attributes['height'].value);

    outline.setAttributeNS(null, 'transform', fo.attributes['transform'].value);
    outline.setAttributeNS(null, 'id', widgetUuid);
    outline.setAttributeNS(null, 'class', 'out');

    outline.setAttributeNS(null, 'onclick', "window.parent.myUbPlayer.viewer.show('" + widgetUrl + "');");
    outline.setAttributeNS(null, 'onmouseover', "UbPlayer.Page.highlight('" + widgetUuid + "')");
    outline.setAttributeNS(null, 'onmouseout', "document.getElementById('" + widgetUuid + "').setAttributeNS(null, 'class', 'out')");

    foreignObjects[i].parentNode.insertBefore(outline, foreignObjects[i]);
  }
}

UbPlayer.Page.init = function() 
{
  UbPlayer.Page.reduceDomain();
  UbPlayer.Page.updateForeignObjects();
}

UbPlayer.Page.highlight = function(widgetUuid)
{
  document.getElementById(widgetUuid).setAttributeNS(null, 'class', 'over');
}

window.onload = UbPlayer.Page.init;



 






