require 'net/http'
require 'uri'

class DocumentPublishingController < ApplicationController
      
  def publish
    
    published_document = PublishedDocument.new();
    
    published_document.document_uuid = request.headers["Document-UUID"]
    published_document.publishing_uuid = request.headers["Publishing-UUID"]
    published_document.title = request.headers["Document-Title"]
    published_document.description = request.headers["Document-Description"]
    published_document.author = request.headers["Document-Author"]
    published_document.author_email = request.headers["Document-AuthorEMail"]
    published_document.page_count = request.headers["Document-PageCount"]
    published_document.deletion_token = request.headers["Deletion-Token"]

    published_document.save_payload(request.body)
    
    published_document.save
    
    DocumentPublishingMailer.deliver_notify(published_document)
    
    respond_to do |format|
      format.html { head :ok }
      format.xml  { head :ok }
    end
    
  end
  
  def show
   
    @published_document = PublishedDocument.find(:first , :conditions => {:document_uuid => params[:uuid]} , :order => "created_at DESC")

    respond_to do |format|
      format.html
    end    

  end
  
  def unpublish
  
    @to_be_unpublished_active = PublishedDocument.find(:first , :conditions => {:deletion_token => params[:deletion_token]})
    
    if @to_be_unpublished_active
      
      PublishedDocument.find(:all, :conditions => {:document_uuid => to_be_unpublished_active.document_uuid}).each do |to_be_unpublished|  
          to_be_unpublished_active.unpublish   
      end
      
      PublishedDocument.destroy_all(:document_uuid => to_be_unpublished_active.document_uuid)

      respond_to do |format|
        format.html
      end            
    else
      respond_to do |format|
        format.any { head :forbidden }
      end
    end    
  end
  
end
