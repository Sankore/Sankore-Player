class CreatePublishedCaptures < ActiveRecord::Migration
  def self.up
    create_table :published_captures do |t|
      t.string :publishing_uuid
      t.string :title
      t.string :description
      t.string :author
      t.string :author_email
      t.string :persistence_url

      t.timestamps
    end
  end

  def self.down
    drop_table :published_captures
  end
end
