class WidgetResultMailer < ActionMailer::Base
  
  def notify(test_result)
    
    subject    'widget result'
    recipients test_result.teacher_email
    from       'info@getuniboard.com'
    sent_on    Time.now
    
    body       :test_result => test_result
  end

end
