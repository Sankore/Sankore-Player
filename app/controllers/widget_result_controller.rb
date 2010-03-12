require 'net/http'
require 'uri'

class WidgetResultController < ApplicationController
      
  def record_result
    
    test_result = {}
    test_result[:teacher_email] = "matthieu.rudaz@mnemis.com"
    test_result[:student_name] = "toto"
    test_result[:score] = 22
    
    WidgetResultMailer.deliver_notify(test_result)
    
    respond_to do |format|
      format.html { head :ok }
      format.xml  { head :ok }
    end
    
  end
  
end
