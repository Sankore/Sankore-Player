class AddFreeVersionToPublishedDocument < ActiveRecord::Migration
  def self.up
    add_column :published_documents, :free_version, :boolean 
  end

  def self.down
    remove_colmun :published_documents, :free_version
  end
end
