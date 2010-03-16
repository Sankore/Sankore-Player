class CreatePublishingTokens < ActiveRecord::Migration
  def self.up
    create_table :publishing_tokens do |t|
      t.string :uuid
      t.string :token

      t.timestamps
    end
  end

  def self.down
    drop_table :publishing_tokens
  end
end
