class RemovePublicationVersionFromPublishedDocuments < ActiveRecord::Migration
  def self.up
    remove_column :published_documents, :publication_version
  end

  def self.down
    add_column :published_documents, :publication_version, :integer   
  end
end