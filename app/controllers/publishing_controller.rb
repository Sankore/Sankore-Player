require 'net/http'
require 'uri'
require 'uuid'

class PublishingController < ApplicationController
 
  def generate_token

    token = PublishingToken.new
 
    token.uuid = UUID.generate
    token.token = random_alphanumeric(128)
    token.salt = random_alphanumeric(16)

    token.save

    respond_to do |format|
      format.xml { render :xml => token.to_xml }
    end
  end

  def random_alphanumeric(size=128)
    s = ""
    size.times { s << (i = Kernel.rand(62); i += ((i < 10) ? 48 : ((i < 36) ? 55 : 61 ))).chr }
    s
  end
 
end
