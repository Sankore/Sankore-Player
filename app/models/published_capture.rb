class PublishedCapture < ActiveRecord::Base

  def save_payload(payload)
    
    s3_bucket = PublishingHelper.publishing_s3_bucket

    self.persistence_url = "publishing/documents/" + self.publishing_uuid + ".jpg"

    puts "Saving file on S3: " + self.persistence_url

    s3_bucket.put(self.persistence_url, payload.read, {}, 'public-read', {})

  end

  def unpublish
    
    s3_bucket = PublishingHelper.publishing_s3_bucket

    key = s3_bucket.key(self.persistence_url)

    if(key)
      key.delete
    end
    
  end

  def public_url
    return PublishingHelper.publishing_s3_bucket_public_endpoint + "/" + self.persistence_url
  end


end
