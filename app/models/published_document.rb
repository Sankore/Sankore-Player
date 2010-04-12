class PublishedDocument < ActiveRecord::Base
   
  def set_minimal_version(version)
    if self.publication_version == nil || self.publication_version < version
      self.publication_version = version
    end
  end

  def page_file_extension
    if self.publication_version && self.publication_version >= 2
        return "xml"
    else
        return "svg"
    end
  end

  def save_payload(payload)
    
    s3_bucket = PublishingHelper.publishing_s3_bucket

    zip_file_path = File.join(RAILS_ROOT, 'tmp', 'upload', self.publishing_uuid + '.zip')
    
    FileUtils.rm_f(zip_file_path)
    
    zip_file = File.open(zip_file_path, "wb")
    zip_file.write(payload.read)
    zip_file.close

    self.set_minimal_version(2)
       
    Zip::ZipFile.foreach(zip_file_path) do |zip_file|
      if (!zip_file.directory?)
          
          filename = zip_file.name 

          if filename[0, 4] == "page" && filename[filename.length - 4, 4] == ".svg" then
            filename[".svg"] = ".xml"
          end

          s3_bucket.put("publishing/documents/" + self.publishing_uuid + "/" + filename, zip_file.get_input_stream.read, {}, 'public-read', {})
          
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
