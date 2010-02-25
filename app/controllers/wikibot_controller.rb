class WikibotController < ActionController::Base
  
  def search
    @input = params[:input]
    @lang = params[:lang]
    @mode = params[:mode]
    
    agent = Mechanize.new { |a| a.user_agent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_2; de-at) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10 info@mnemis.com' }
    
    if @mode == 'wiki'
      @surl = "http://" + @lang +".m.wikipedia.org/wiki/" + @input;
      page = agent.get(@surl)
      
      @reqUrl = '<a href="http://' + @lang + '.m.wikipedia.org/wiki/';
      @fixImgLinks = page.body.gsub('<a href="/wiki', @reqUrl);
      @wikibuttons = '<img src="http://' + @lang + '.m.wikipedia.org/skins-1.5/common/images/';
      @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/', @wikibuttons);
      @fixButtons = @fixButtons.gsub('SRC="/javascripts/', 'SRC="http://m.wikipedia.com/javascripts/');
      @fixButtons = @fixButtons.gsub("<link href='/", "<link href='http://m.wikipedia.com/");
      @fixButtons.insert(@fixButtons.index("</head>"), '<link href="/widgets/wikipedia/wikipedia/stylesheets/wiki.css" media="all" rel="Stylesheet" type="text/css" />');
    elsif @mode == 'wiktionary'
      @surl = "http://" + @lang +".wiktionary.org/wiki/Special:Search/" + @input;
      page = agent.get(@surl)
      
      @reqUrl = '<a href="http://' + @lang + '.m.wiktionary.org/wiki/Special:Search'
      @fixImgLinks = page.body.gsub('<a href="/wiki', @reqUrl);
      @wikibuttons = '<img src="http://' + @lang + '.m.wiktionary.org/skins-1.5/common/images/'
      @fixButtons = @fixImgLinks.gsub('<img src="/skins-1.5/common/images/', @wikibuttons);
    end
    @content = @fixButtons
  end
end