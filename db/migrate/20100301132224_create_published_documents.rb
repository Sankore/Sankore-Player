class CreatePublishedDocuments < ActiveRecord::Migration
  def self.up
    create_table :published_documents do |t|
      t.string :publishing_uuid
      t.string :document_uuid
      t.string :title
      t.string :description
      t.string :author
      t.string :author_email
      t.integer :page_count
      t.string :persistence_url
      t.boolean :has_pdf
      t.boolean :has_ubz

      t.timestamps
    end
  end

  def self.down
    drop_table :published_documents
  end
end
