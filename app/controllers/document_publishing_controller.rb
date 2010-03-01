require 'net/http'
require 'uri'

class DocumentPublishingController < ApplicationController
      
  def publish
    
    publishing = PublishedDocument.new();
    
    publishing.document_uuid = request.headers["Document-UUID"]
    publishing.publishing_uuid = request.headers["Publishing-UUID"]
    publishing.title = request.headers["Publishing-Title"]
    publishing.description = request.headers["Publishing-Description"]
    publishing.author = request.headers["Publishing-Author"]
    publishing.author_email = request.headers["Publishing-AuthorEMail"]
    publishing.page_count = request.headers["Publishing-PageCount"]
    
    publishing.save_payload(request.body)
    
    publishing.save
    
    respond_to do |format|
      format.html { head :ok }
      format.xml  { head :ok }
    end
    
  end
  
  def show
    
    publishing = PublishedDocument.find(:first , :conditions => {:document_uuid => params[:uuid]} , :order => "created_at DESC")
    
    redirect_to publishing.persistence_url + "/index.html"

    #respond_to do |format|
    #  format.html { head :ok }
    #  format.xml  { head :ok }
    #end
    
  end
  
end
