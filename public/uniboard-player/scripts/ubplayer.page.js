
var UBPage = {};

UBPage.svgNS = 'http://www.w3.org/2000/svg';
UBPage.uniboardNS = 'http://uniboard.mnemis.com/document';

UBPage.reduceDomain = function()
{
  var allDomainsParts = document.domain.split(".");
  
  if (allDomainsParts.length > 2)
    document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
}

UBPage.updateForeignObjects = function()
{
  var foreignObjects = document.getElementsByTagName('foreignObject'); 

  for(var i = 0; i < foreignObjects.length; i++)
  {
    var fo = foreignObjects[i];
    var outline = document.createElementNS(UBPage.svgNS, 'rect');
    outline.setAttributeNS(null, 'x', fo.attributes['x'].value);
    outline.setAttributeNS(null, 'y', fo.attributes['y'].value - 20);
    outline.setAttributeNS(null, 'width', fo.attributes['width'].value);
    outline.setAttributeNS(null, 'height', 20 /*fo.attributes['height'].value*/);

    outline.setAttributeNS(null, 'transform', fo.attributes['transform'].value);
    outline.setAttributeNS(null, 'fill', '#D8D8D8');

    var widgetUrl = window.location + '/../' + fo.getAttributeNS(UBPage.uniboardNS, 'src') + "/index.html";
    outline.setAttributeNS(null, 'onclick', "window.open('" + widgetUrl + "');");

    foreignObjects[i].parentNode.insertBefore(outline, foreignObjects[i]);
  }
}

UBPage.init = function() 
{
  UBPage.reduceDomain();
  UBPage.updateForeignObjects();
}

window.onload = UBPage.init;



 






