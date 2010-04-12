class AddDeletionTokenToPublishedCapture < ActiveRecord::Migration
  def self.up
    add_column :published_captures, :deletion_token, :string    
  end

  def self.down
    remove_column :published_captures, :deletion_token
  end
end
