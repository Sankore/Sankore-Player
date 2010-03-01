class DocumentPublishingMailer < ActionMailer::Base
  
  def notify(published_document)
    
    subject    'Uniboard Document ' + published_document.title
    recipients published_document.author_email
    from       'info@getuniboard.com'
    sent_on    Time.now
    
    body       :published_document => published_document
  end

end
