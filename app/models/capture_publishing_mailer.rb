class CapturePublishingMailer < ActionMailer::Base
  
  def notify(published_capture)
    
    subject    'Uniboard Capture ' + published_capture.title
    recipients published_capture.author_email
    from       'info@getuniboard.com'
    sent_on    Time.now
    
    body       :published_capture => published_capture
  end

end
