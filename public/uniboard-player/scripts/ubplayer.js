var UbPlayer = {};

UbPlayer.reduceDomain = function(){
  var allDomainsParts = document.domain.split(".");
  
  if (allDomainsParts.length > 2)
    document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];    
}