class PublishedDocument < ActiveRecord::Base
  
  def save_payload(payload)
    
    s3_bucket = PublishingHelper.publishing_s3_bucket

    zip_file_path = File.join(RAILS_ROOT, 'tmp', 'upload', self.publishing_uuid + '.zip')
    
    FileUtils.rm_f(zip_file_path)
    
    zip_file = File.open(zip_file_path, "wb")
    zip_file.write(payload.read)
    zip_file.close
       
    Zip::ZipFile.foreach(zip_file_path) do |zip_file|
      if (!zip_file.directory?)

          s3_bucket.put("publishing/documents/" + self.publishing_uuid + "/" + zip_file.name, zip_file.get_input_stream.read, {}, 'public-read', {})
          
          if zip_file.name == self.publishing_uuid + '.pdf'
            self.has_pdf = true
          end

          if zip_file.name == self.publishing_uuid + '.ubz'
            self.has_ubz = true
          end
      end
    end
    
    FileUtils.rm_f(zip_file_path)

    self.persistence_url = "publishing/documents/" + self.publishing_uuid

  end


  def unpublish
    
    s3_bucket = PublishingHelper.publishing_s3_bucket
    s3_bucket.delete_folder(self.persistence_url)
    
  end

  def public_url

    # compatibility with first versions which included the full url access
    if (self.persistence_url.include? PublishingHelper.publishing_s3_bucket_public_endpoint)
        return self.persistence_url
    end

    return PublishingHelper.publishing_s3_bucket_public_endpoint + "/" + self.persistence_url
  end

end
