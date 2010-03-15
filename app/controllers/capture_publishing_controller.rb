require 'net/http'
require 'uri'

class CapturePublishingController < ApplicationController
      
  @s3_bucket = nil

  attr_accessor :s3_bucket

  def publish
    
    init_s3_bucket        

    publishing_uuid = request.headers["Publishing-UUID"]

    self.s3_bucket.put("publishing/captures/" + publishing_uuid + ".jpg", request.body.read, {}, 'public-read', {})
          
    respond_to do |format|
      format.html { head :ok }
      format.xml  { head :ok }
    end
    
  end

  def init_s3_bucket
    
    if (self.s3_bucket == nil && APP_CONFIG['publishing_s3_bucket'])
      
      captures_s3_bucket = APP_CONFIG['publishing_s3_bucket']
      captures_s3_access_key_id = APP_CONFIG['publishing_s3_access_key_id']
      captures_s3_secret_access_key = APP_CONFIG['publishing_s3_secret_access_key']
          
      s3 = RightAws::S3.new(captures_s3_access_key_id, captures_s3_secret_access_key)
      
      self.s3_bucket = s3.bucket(captures_s3_bucket)
      
    end

  end
  
end
