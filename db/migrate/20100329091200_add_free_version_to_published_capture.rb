class AddFreeVersionToPublishedCapture < ActiveRecord::Migration
  def self.up
    add_column :published_captures, :free_version, :boolean 
  end

  def self.down
    remove_colmun :published_captures, :free_version
  end
end
