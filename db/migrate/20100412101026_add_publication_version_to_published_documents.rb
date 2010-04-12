class AddPublicationVersionToPublishedDocuments < ActiveRecord::Migration
  def self.up
    add_column :published_documents, :publication_version, :integer   
  end

  def self.down
    remove_colmun :published_documents, :publication_version
  end
end
