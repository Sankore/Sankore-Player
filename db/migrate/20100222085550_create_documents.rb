class CreateDocuments < ActiveRecord::Migration
  def self.up
    create_table :documents do |t|
      t.string :uuid
      t.string :group
      t.string :name
      t.string :publishing_date
      t.string :publishing_url

      t.timestamps
    end
  end

  def self.down
    drop_table :documents
  end
end
