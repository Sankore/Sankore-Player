require 'openssl'

module PublishingTokenHelper

  def self.burn_token(token_uuid, token_encrypted_base64)

    token_encrypted = Base64.decode64(token_encrypted_base64)
    db_token = PublishingToken.find(:first , :conditions => {:uuid => token_uuid})

    if db_token

      server_token = db_token.token
      db_token.delete

      begin
        aes = OpenSSL::Cipher::Cipher.new("aes-256-ecb")
        aes.decrypt
        aes.key = "9ecHaspud9uD9ste5erAchehefrup3ec"
   
        clear_client_token = aes.update(token_encrypted) + aes.final

        return clear_client_token == server_token
      rescue
        return false
      end
    else
      return false
    end
  end

end
