ActionController::Routing::Routes.draw do |map|

  map.connect 'widgets/wikibot/search', :controller => 'wikibot', :action => 'search', :conditions => { :method => :get }
  map.connect 'b46eef20-d35a-11de-8a39-0800200c9a66/personal', :controller => 'license', :action => 'generate', :conditions => { :method => :get}, :license_type => 'personal'
  map.connect 'b46eef20-d35a-11de-8a39-0800200c9a66/workstation', :controller => 'license', :action => 'generate', :conditions => { :method => :get}, :license_type => 'workstation'  
 
  map.resources :documents    
  map.connect 'documents/publish', :controller => 'documents', :action => 'publish', :conditions => { :method => :post}  
  
  map.connect '*path', :controller => 'redirect', :action => 'redirect_to_url', :redirect_url => 'http://www.getuniboard.com'

end
