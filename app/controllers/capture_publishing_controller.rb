require 'net/http'
require 'uri'
require 'publishing_token_helper'
require 'publishing_helper'

class CapturePublishingController < ApplicationController
      
  def publish
    
    token_uuid = request.headers["Token-UUID"]
    token_encrypted_base64 = request.headers["Token-Encrypted"]
    
    if PublishingTokenHelper.burn_token(token_uuid, token_encrypted_base64)
      
      published_capture = PublishedCapture.new();
    
      published_capture.publishing_uuid = request.headers["Publishing-UUID"]
      published_capture.title = request.headers["Document-Title"]
      published_capture.description = request.headers["Document-Description"]
      published_capture.author = request.headers["Document-Author"]
      published_capture.author_email = request.headers["Document-AuthorEMail"]
      published_capture.deletion_token = request.headers["Deletion-Token"]
      published_capture.free_version = request.headers["Document-FreeVersion"] == 'true'

      spawn do
        
        published_capture.save_payload(request.body)
    
        published_capture.save
    
        CapturePublishingMailer.deliver_notify(published_capture)
    
      end

      respond_to do |format|
        format.any { head :ok }
      end
    else
      respond_to do |format|
        format.any { head :forbidden }
      end
    end
    
  end
  

  def show
   
    @published_capture = PublishedCapture.find(:first , :conditions => {:publishing_uuid => params[:uuid]} , :order => "created_at DESC")

    if @published_capture
      respond_to do |format|
        format.html
      end
    else
      respond_to do |format|
        format.any { head :forbidden }
      end
    end
  end
  
  def unpublish
  
    @to_be_unpublished = PublishedCapture.find(:first , :conditions => {:deletion_token => params[:deletion_token]})
    
    if @to_be_unpublished
      
      @to_be_unpublished.unpublish   
      
      PublishedCapture.destroy_all(:publishing_uuid => @to_be_unpublished.publishing_uuid)

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
