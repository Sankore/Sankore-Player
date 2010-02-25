/*function getUrlsHistory() {
  var separator = ";;;";
  var urlsHistory = [];
  var urlsHistoryRaw = "";
  
  urlsHistoryRaw = widget.preferences.getValue('urlsHistory', "http://www.google.com");
  urlsHistory = urlsHistoryRaw.split(separator);
  
  return urlsHistory;
};

if(Array.prototype.toUrlsHistory == null) Array.prototype.toUrlsHistory = function(){
  return this.join(";;;");
}*/

var urls = {
  _default:"http://m.yahoo.com",
  home:"",
  last:"",
  past:""
};

if(String.prototype.makeUrl == null) String.prototype.makeUrl = function() {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	//alert(regexp.test(this));
	return this;
}