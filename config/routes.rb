ActionController::Routing::Routes.draw do |map|
 
  #map.resources :published_documents

  map.connect 'documents/publish', :controller => 'DocumentPublishing', :action => 'publish', :conditions => { :method => :post}
  map.connect 'documents/publish/:uuid', :controller => 'DocumentPublishing', :action => 'show' , :conditions => { :method => :get}
  map.connect 'documents/unpublish/:deletion_token', :controller => 'DocumentPublishing', :action => 'unpublish' , :conditions => { :method => :get}

  map.connect 'captures/publish', :controller => 'CapturePublishing', :action => 'publish', :conditions => { :method => :post}

  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  map.connect 'widgets/edu-game', :controller => 'WidgetResult', :action => 'record_result', :conditions => { :method => :post}
  
  map.connect 'b46eef20-d35a-11de-8a39-0800200c9a66/personal', :controller => 'license', :action => 'generate', :conditions => { :method => :get}, :license_type => 'personal'
  map.connect 'b46eef20-d35a-11de-8a39-0800200c9a66/workstation', :controller => 'license', :action => 'generate', :conditions => { :method => :get}, :license_type => 'workstation'  
   
  map.connect '*path', :controller => 'redirect', :action => 'redirect_to_url', :redirect_url => 'http://www.getuniboard.com'

end
