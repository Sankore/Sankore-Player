
UbPlayer.Player = function(args) {
  var that = this;
  
  this.thumbsBar = { 
    state:"min", 
    fullHeightVal:100, 
    minHeightVal:0, 
    sliding:false
  };
  this.viewer = new UbPlayer.Viewer();
  this.currentPage = { number:1, width:0, height:0 };
  this.state = "full";
  this.mode = "normal";
  this.adaptPageTimer = null;
  this.sliderTimer = null;
  this.documentData = args.documentData;
  this.thumbnails = {
    thumbsToHide:[],
    firstVisibleThumb:null,
    next:function(){
      var yToCheck = jQuery("#thumbnails>#thumbnails-canvas>.thumbnail:first").position().top;
      jQuery("#thumbnails>#thumbnails-canvas>.thumbnail").each(function(){
        if(jQuery(this).position().top === yToCheck){
          if(jQuery(this).index() === that.documentData.numberOfPages-1){
            jQuery("#thumbnail-next").addClass("disabled");
            that.thumbnails.thumbsToHide = [];
            return false;
          }
          jQuery("#thumbnail-previous").removeClass("disabled");
          that.thumbnails.thumbsToHide.push(jQuery(this));
        }else{
          that.thumbnails.firstVisibleThumb = jQuery(this);
          return false;
        }
      });
      for(var i=0; i<that.thumbnails.thumbsToHide.length; i++){
        that.thumbnails.thumbsToHide[i].hide();
      }
      that.thumbnails.thumbsToHide = [];
    },
    previous:function(){
      var thumbIndex = 0;
      var currentThumb = null;
      jQuery("#thumbnails>#thumbnails-canvas>.thumbnail").each(function(){
        thumbIndex++;
        currentThumb = jQuery(jQuery("#thumbnails>#thumbnails-canvas>.thumbnail")[that.thumbnails.firstVisibleThumb.index()-thumbIndex]);
        if(currentThumb.length > 0){
          jQuery("#thumbnail-next").removeClass("disabled");
          currentThumb.show();
          if(that.thumbnails.firstVisibleThumb.position().top !== currentThumb.position().top) {
            that.thumbnails.firstVisibleThumb = currentThumb;
            return false;
          }
        }else{
          jQuery("#thumbnail-previous").addClass("disabled");
          return false;
        }
      });
    }
  }
  
  // Events binding  
  jQuery("#menu-button-previous").click(function(){ that.goToPage("PREVIOUS") });
  jQuery("#menu-button-index").toggle(function(){ that.showIndex() }, function(){ that.hideIndex() });
  jQuery("#menu-button-next").click(function(){ that.goToPage("NEXT") });
  jQuery("#board-button-previous").click(function(){ that.goToPage("PREVIOUS") });
  jQuery("#board-button-next").click(function(){ that.goToPage("NEXT") });

  jQuery("#current-page")
    .mouseenter(function(){jQuery(".board-button>div").stop().animate({opacity:0})})
    .bind("mouseleave", this.boardButtonOutHandler);
  jQuery("#boards")
    .mouseleave(function(){jQuery(".board-button>div").stop().animate({opacity:0})})
    .bind("mouseenter", this.boardButtonOutHandler);

  jQuery("#thumbnail-next").click(function(){that.thumbnails.next()});
  jQuery("#thumbnail-previous").click(function(){that.thumbnails.previous()});

  jQuery("#menubottom-input").change(function(){ that.goToPage(jQuery("#menubottom-input").val()) });
  jQuery("#moreLink").click(function(){ that.showDescription() });
  jQuery("#head-button-close").click(function(){ if(that.mode=="description"){that.hideDescription()}else if(that.mode=="full"){that.switchToNormalMode()} });
  jQuery("#menu-button-export")
    .toggle(
      function(){ jQuery("#menu-export-dropdown").show() },
      function(){ jQuery("#menu-export-dropdown").hide() })
    .hover(
      function(){ jQuery("#menu-button-export-left").css("background", "url(/uniboard-player/images/menu-button-export-left-over.png)") },
      function(){ jQuery("#menu-button-export-left").css("background", "url(/uniboard-player/images/menu-button-export-left.png)") });
  jQuery("#menu-button-full").click(function(){ 
    that.switchToFullMode();
  });
  jQuery("#menu-button-showthumbnails").click(function(){
    var newFootHeight = 0;
    var easing = "";
        
    if(that.thumbsBar.state === "min"){
      newFootHeight = that.thumbsBar.fullHeightVal;
      that.thumbsBar.state = "full";
      easing = "easeOutBack";
    } else {
      newFootHeight = that.thumbsBar.minHeightVal;
      that.thumbsBar.state = "min";
      easing = "easeInQuint";
    }
  
    if(that.thumbsBar.state === "full"){
      jQuery("#body").css({paddingBottom:110 + newFootHeight });
      jQuery(window).resize();
    }
    jQuery("#thumbnails").animate(
      {height:32 + newFootHeight},
      400,
      easing,
      function(){ 
        jQuery("#body").css({paddingBottom:110 + newFootHeight });
        jQuery(window).resize();
      }
    );
    jQuery("#foot").animate(
      {height:96 + newFootHeight, marginTop:-96 -newFootHeight},
      400,
      easing
    );
  });

  // Constructs the slider
  var sliderPage = jQuery("#thumbnails-slider>div:first").clone();
  var sliderPageWidth = (100/this.documentData.numberOfPages) + "%";
  jQuery("#thumbnails-slider>div:first").remove();
  for(var i=1; i<=this.documentData.numberOfPages; i++){
    var newSliderPage = sliderPage.clone();
    newSliderPage
      .css({ width:sliderPageWidth })
      .click(function(){
        that.goToPage(jQuery(this).index()+1);
      });
    if(i===this.documentData.numberOfPages) newSliderPage.addClass("last");
    jQuery("#thumbnails-slider").append(newSliderPage);
  }

  // Slider handler
  jQuery("#thumbnails-slider>div:first").append(jQuery("#thumbnails-slider-handler"));
  jQuery("#thumbnails-slider-handler").draggable({
    axis: 'x',
    containment:[ jQuery("#thumbnails-slider>div:first-child").offset().left, 0, 
                  jQuery("#thumbnails-slider>div:first-child").offset().left + jQuery("#thumbnails-slider>div:first-child").width()*this.documentData.numberOfPages-20, 0  ],
    start:function(e){
      jQuery(this).css({left:"0"});
      jQuery(this).parent("div").css({zIndex:1});
      that.sliderListener(that.currentPage.number);
      that.thumbsBar.sliding = true;
    },
    stop:function(e){
      jQuery(this).css({left:"0"});
      clearTimeout(that.sliderTimer);
      jQuery(this).appendTo(jQuery("#thumbnails-slider>div")[that.currentPage.number-1]);
      that.thumbsBar.sliding = false;
    } 
  });

  // Add the thumbnails
  var newThumbnail = null;
  var formattedThumbNumber = null;
  for(var i=0; i<this.documentData.numberOfPages; i++){
    newThumbnail = jQuery("#thumbnails>#thumbnails-canvas>.thumbnail:first").clone();
    formattedThumbNumber = this.formatPageNumber(i+1);
    newThumbnail
      .find("img").attr("src", this.documentData.pagesBaseUrl + "/page" + formattedThumbNumber + ".thumbnail.jpg")
      .attr("title", "page " + (i+1));
    jQuery("#thumbnails>#thumbnails-canvas>div:last-child").after(newThumbnail); 
  }
  jQuery("#thumbnails>#thumbnails-canvas>.thumbnail:first").remove();

  jQuery(".thumbnail")
    .hover(
      function(){ jQuery(this).addClass("current") },
      function(){ jQuery(this).removeClass("current") })
    .click(function(){
      that.goToPage(jQuery(this).index()+1);
    });


  if(!this.documentData.hasPdf){ 
    jQuery("#menu-export-hasPdf>a").addClass("disabled");
  }else{ 
    jQuery("#menu-export-hasPdf")
      .hover(
        function(){
          jQuery(this).children("a").addClass("over");
          jQuery(this).addClass("over")}, 
        function(){
          jQuery(this).children("a").removeClass("over");
          jQuery(this).removeClass("over");
      })
      .children("a").attr("href", this.documentData.pagesBaseUrl + "/" + this.documentData.uuid + ".pdf");
  }
  if(!this.documentData.hasUbz){
    jQuery("#menu-export-hasUbz>a").addClass("disabled");
  }else{ 
    jQuery("#menu-export-hasUbz")
      .hover(
        function(){
          jQuery(this).children("a").addClass("over");
          jQuery(this).addClass("over")}, 
        function(){
          jQuery(this).children("a").removeClass("over");
          jQuery(this).removeClass("over");
      })
      .children("a").attr("href", this.documentData.pagesBaseUrl + "/" + this.documentData.uuid + ".ubz");
  }

  jQuery(document).click(function(){
    if(jQuery("#menu-export-dropdown").css("display") !== "none"){
      jQuery("#menu-button-export").click();
    }
  });
  jQuery(".board-button>div").animate({opacity: 0}, 3000);
  var docTitle = jQuery("<span>" + this.documentData.title + ", </span>");
  jQuery("#data-document-title").append(docTitle);
  jQuery("#data-document-title").append(this.documentData.author);
  jQuery("#description-text").append("<a href='mailto:" + this.documentData.authorEmail + "'>" + this.documentData.author + 
                                      "</a><br/>" + this.documentData.title + 
                                      "<br/>" + this.formatDate(this.documentData.publishedAt) + 
                                      "<br/><br/>" + this.documentData.description);
  jQuery("#menubottom-input").after("/" + this.documentData.numberOfPages);
  this.openPage(1);
};

UbPlayer.Player.prototype.sliderListener = function(currentPageNmbr){
  var that = this;
  var slider = jQuery("#thumbnails-slider-handler");
  var unitWidth = slider.parent("div").width();
  var sliderIndex = 1 + Math.floor((slider.position().left + ((currentPageNmbr-1) * unitWidth)) / unitWidth);	      
  if(sliderIndex !== this.currentPage.number) this.goToPage(sliderIndex);
  this.sliderTimer = setTimeout(function(){that.sliderListener(currentPageNmbr)}, 10);
}

UbPlayer.Player.prototype.boardButtonOutHandler = function(event){
  if( event.pageY >= jQuery("#boards").position().top && 
      event.pageY <= (jQuery("#boards").position().top + jQuery("#boards").height()) ){
    if(event.pageX >= (jQuery("#current-page").position().left + jQuery("#current-page").width())){
      jQuery("#board-button-next").stop().animate({opacity:1}, 200);
    }else if(event.pageX < jQuery("#current-page").position().left){
      jQuery("#board-button-previous").stop().animate({opacity:1}, 200);
    }
  }
}

UbPlayer.Player.prototype.goToPage = function(pageNumber){
  var checkPoint = { finish:"%", start:"%" };
  var that = this;
  
  if(pageNumber === "NEXT"){
    this.currentPage.number++;
    checkPoint = { finish:"-200%", start:"100%" };
  }else if(pageNumber === "PREVIOUS"){
    this.currentPage.number--;
    checkPoint = { finish:"100%", start:"-200%" };
  }else{
    if(pageNumber > this.currentPage.number){
      checkPoint = { finish:"-200%", start:"100%" };
    }else if(pageNumber < this.currentPage.number){
      checkPoint = { finish:"100%", start:"-200%" };
    }else{
      return 0;
    }
    this.currentPage.number = pageNumber;
  }

  if(this.currentPage.number < 1){
    this.currentPage.number = 1;
  }else if(this.currentPage.number > this.documentData.numberOfPages){
    this.currentPage.number = this.documentData.numberOfPages;
  }
	
	jQuery("#current-page")
	  .unbind("mouseenter")
	  .unbind("mouseleave");
	
  jQuery("#board-current").stop().animate(
    {marginLeft:checkPoint.finish},
    300,
    "easeInQuint",
    function(){
    	jQuery("#thumbnails").css({width: jQuery("#thumbnails").width()});
      jQuery("#board-current").css({ marginLeft:checkPoint.start });
      that.openPage(that.currentPage.number);
      jQuery("#board-current").animate(
        {marginLeft:"0"},
        300,
        "easeOutQuint",
        function(){
          jQuery("#thumbnails").css({width: "auto"});
          jQuery("#current-page")
            .mouseenter(function(){jQuery(".board-button>div").animate({opacity:0})})
            .bind("mouseleave", that.boardButtonOutHandler);
        }
      );
    }
  );
}

UbPlayer.Player.prototype.adaptPage = function(){
  jQuery(window).resize();
  this.adaptPageTimer = setTimeout(function(){adaptPage()}, 10);
}

UbPlayer.Player.prototype.switchToFullMode = function(){
  jQuery("#logo-uniboard").hide();
  jQuery("#document-title").hide();
  jQuery("#head-button-close").show();
  jQuery("#head").css({height:40});
  jQuery("#foot").hide();
  jQuery("#body").css({paddingTop:40, paddingBottom:40});
  jQuery(window).resize();
  this.mode = "full";
}

UbPlayer.Player.prototype.switchToNormalMode = function(){
  jQuery("#logo-uniboard").show();
  jQuery("#document-title").show();
  jQuery("#head-button-close").hide();
  jQuery("#head").css({height:55});
  jQuery("#foot").show();
  jQuery("#body").css({paddingTop:85, paddingBottom:110});
  jQuery(window).resize();
  this.mode = "normal";
}

UbPlayer.Player.prototype.showDescription = function(){
  jQuery("#boards").animate({marginTop:"100%"}, function(){
    jQuery("#boards").hide();
    jQuery("#document-title").hide();
    jQuery("#head-button-close").show();
    jQuery("#description").show();
  });
  this.mode = "description";
}

UbPlayer.Player.prototype.hideDescription = function(){
  jQuery("#boards").animate({marginTop:"0"}, function(){
    jQuery("#boards").show();
    jQuery("#document-title").show();
    jQuery("#head-button-close").hide();
    jQuery("#description").hide();
  });
  this.mode = "normal";
}

UbPlayer.Player.prototype.showIndex = function(){
  var that = this;
  var thumbsPerRow = Math.round(Math.sqrt(this.documentData.numberOfPages));
  jQuery("#boards").animate({marginTop:"-100%"}, function(){
    jQuery("#boards").hide();
    jQuery("#index")
      .show()
      .empty();
    that.drawIndexThumbnails(thumbsPerRow);
  });
}

UbPlayer.Player.prototype.hideIndex = function(){
  jQuery("#index").hide();
  jQuery("#boards").show();
  jQuery("#thumbnails").show();
  jQuery("#boards").animate({marginTop:"0"});
  jQuery("#thumbnails").animate({marginTop:"0"});
}

UbPlayer.Player.prototype.drawIndexThumbnails = function(thumbsPerRow){
  var that = this;
  var newIndex = jQuery("#index>div").length + 1;
  var newIndexThumbnailNumber = this.formatPageNumber(newIndex);
  var newIndexThumbnail = jQuery("<div class='thumbnail index'><img src='" + this.documentData.pagesBaseUrl + "/page" + 
                          newIndexThumbnailNumber + 
                          ".thumbnail.jpg' width='auto' height='100%'/></div>");
  newIndexThumbnail
    .hover(
      function(){ jQuery(this).addClass("current") },
      function(){ jQuery(this).removeClass("current") })
    .click(function(){
      that.openPage(newIndex);
      jQuery("#menu-button-index").click();
      jQuery(window).resize();
    });
  jQuery("#index").append(newIndexThumbnail);
  if((newIndex)%thumbsPerRow === 0)jQuery("#index").append("<br/>");
  if(jQuery("#index>div").length < this.documentData.numberOfPages) setTimeout(function(){that.drawIndexThumbnails(thumbsPerRow)}, 100);
}

jQuery(window).resize(function(){
  var ratioWh = 1.66;//this.currentPage.width / this.currentPage.height;
  jQuery(".page").width(jQuery(".page").height() * ratioWh);
  jQuery("#app-viewer-c").width(jQuery(".page").width());
  jQuery("#document-title").width(jQuery(".page").width());
  if(jQuery(window).height() < 500){
    this.state = "mini";
  }
});

UbPlayer.Player.prototype.formatPageNumber = function(pageNumber){
  var formattedPageNumber = ("00" + pageNumber).substr(("00" + pageNumber).length-3, 3);
  return formattedPageNumber;
}

UbPlayer.Player.prototype.formatDate = function(date){
  var months = new Array("January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December");
  var formattedDate = "";
  formattedDate = this.documentData.publishedAt.split(" ")[0].split("-");
  formattedDate = formattedDate[2] + " " + months[parseInt(formattedDate[1])-1] + " " + formattedDate[0];
  return formattedDate;
}

UbPlayer.Player.prototype.openPage = function(pageNumber){
  var that = this;
  var formattedPageNumber = this.formatPageNumber(pageNumber);
  var fileName = this.documentData.pagesBaseUrl + "/page" + formattedPageNumber + ".svg";
  this.currentPage.number = pageNumber;
  /*jQuery.ajax({ 
    url: fileName,
    dataType: 'xml',
    success: function(data){
      this.currentPage.width = jQuery(data).find("rect").attr("width");
      this.currentPage.height = jQuery(data).find("rect").attr("height");*/
      jQuery("#current-page").attr("src", fileName);
      jQuery("#menubottom-input").val(pageNumber);
      jQuery("#thumbnails-slider>div").removeClass("current");
      jQuery(jQuery("#thumbnails-slider>div")[pageNumber-1]).addClass("current");
      if(!this.thumbsBar.sliding)jQuery("#thumbnails-slider-handler").appendTo(jQuery("#thumbnails-slider>div")[pageNumber-1]);
      jQuery(window).resize();
    /*}
  });*/

  if(pageNumber === 1){
    jQuery("#menu-button-previous").unbind("click");
    jQuery("#board-button-previous").unbind("click");
  }else{ 
    if(jQuery("#menu-button-previous").data("events") === null){
      jQuery("#menu-button-previous").bind("click", function(){that.goToPage("PREVIOUS")});
      jQuery("#board-button-previous").bind("click", function(){that.goToPage("PREVIOUS")});
    }
  }
  
  if(pageNumber === this.documentData.numberOfPages){
    jQuery("#menu-button-next").unbind("click");
    jQuery("#board-button-next").unbind("click");
  }else{ 
    if(jQuery("#menu-button-next").data("events") === null){
      jQuery("#menu-button-next").bind("click", function(){that.goToPage("NEXT")});
      jQuery("#board-button-next").bind("click", function(){that.goToPage("NEXT")});
    }
  }
}