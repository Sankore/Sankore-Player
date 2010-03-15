require 'net/http'
require 'uri'

class WidgetResultController < ApplicationController
      
  def record_result
    
    test_result = {}
    test_result[:teacher_email] = params[:teacher_email]
    test_result[:student_email] = params[:student_email]
    test_result[:student_name] = params[:student_name]
    test_result[:score] = params[:score]
    
    WidgetResultMailer.deliver_notify(test_result)
    
    respond_to do |format|
      format.html
    end
    
  end
  
end
