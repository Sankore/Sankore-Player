require 'net/http'
require 'uri'
require 'publishing_token_helper'
require 'publishing_helper'

class CapturePublishingController < ApplicationController
      
  def publish
    
    s3_bucket = PublishingHelper.publishing_s3_bucket

    publishing_uuid = request.headers["Publishing-UUID"]

    token_uuid = request.headers["Token-UUID"]
    token_encrypted_base64 = request.headers["Token-Encrypted"]
    
    if PublishingTokenHelper.burn_token(token_uuid, token_encrypted_base64)

      site_url = "publishing/captures/" + publishing_uuid + ".jpg"
      s3_bucket.put(site_url, request.body.read, {}, 'public-read', {})

      public_url = PublishingHelper.publishing_s3_bucket_public_endpoint + "/" + site_url
          
      respond_to do |format|
        format.any { render :text => public_url }
      end
    else
      respond_to do |format|
        format.any { head :forbiden }
      end
    end    
  end

end
