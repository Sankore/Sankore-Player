class PublishedDocument < ActiveRecord::Base
  
  attr_accessor :documents_s3_publishing_endpoint 
  attr_accessor :s3_bucket
  
  @documents_s3_publishing_endpoint = nil 
  @s3_bucket = nil
  
  def save_payload(payload)
    
    init_s3_bucket

    zip_file_path = File.join(RAILS_ROOT, 'tmp', 'upload', self.publishing_uuid + '.zip')
    
    FileUtils.rm_f(zip_file_path)
    
    zip_file = File.open(zip_file_path, "wb")
    zip_file.write(payload.read)
    zip_file.close
       
    Zip::ZipFile.foreach(zip_file_path) do |zip_file|
      if (!zip_file.directory?)
          puts "Saving file on S3: " + zip_file.name
          self.s3_bucket.put("publishing/documents/" + self.publishing_uuid + "/" + zip_file.name, zip_file.get_input_stream.read, {}, 'public-read', {})
      end
    end
    
    FileUtils.rm_f(zip_file_path)
       
    self.persistence_url = self.documents_s3_publishing_endpoint + "/publishing/documents/" + self.publishing_uuid

  end

  def init_s3_bucket
    
    if (self.s3_bucket == nil && APP_CONFIG['documents_s3_bucket'])
      
      documents_s3_bucket = APP_CONFIG['documents_s3_bucket']
      documents_s3_access_key_id = APP_CONFIG['documents_s3_access_key_id']
      documents_s3_secret_access_key = APP_CONFIG['documents_s3_secret_access_key']
      
      self.documents_s3_publishing_endpoint = APP_CONFIG['documents_s3_publishing_endpoint']
            
      s3 = RightAws::S3.new(documents_s3_access_key_id, documents_s3_secret_access_key)
      
      self.s3_bucket = s3.bucket(documents_s3_bucket)
      
    end
  
  end

end
