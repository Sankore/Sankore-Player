class AddDeletionTokenToPublishedDocuments < ActiveRecord::Migration
  def self.up
    add_column :published_documents, :deletion_token, :string    
  end

  def self.down
    remove_colmun :published_documents, :deletion_token
  end
end
