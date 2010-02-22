
class RedirectController < ApplicationController
 
  def redirect_to_url

    redirect_to params[:redirect_url]
    
  end
end
