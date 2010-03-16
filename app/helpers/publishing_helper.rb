module PublishingHelper

  @s3_bucket = nil

  def self.init_s3_bucket
    
    if (@s3_bucket == nil && APP_CONFIG['publishing_s3_bucket'])
      
      captures_s3_bucket = APP_CONFIG['publishing_s3_bucket']
      captures_s3_access_key_id = APP_CONFIG['publishing_s3_access_key_id']
      captures_s3_secret_access_key = APP_CONFIG['publishing_s3_secret_access_key']
          
      s3 = RightAws::S3.new(captures_s3_access_key_id, captures_s3_secret_access_key)
      
      @s3_bucket = s3.bucket(captures_s3_bucket)

    end
  end

  def self.publishing_s3_bucket

    init_s3_bucket

    return @s3_bucket
  
  end

  def self.publishing_s3_bucket_public_endpoint

    return APP_CONFIG['publishing_s3_document_endpoint']
  
  end

end
