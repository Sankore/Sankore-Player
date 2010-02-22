require "base64"

class LicenseController < ApplicationController
 
  def generate

    licenseeName = ''
    
    if params[:licensee_name]
      licenseeName = params[:licensee_name]
    elsif params[:first_name] && params[:last_name]
      licenseeName = params[:first_name] + ' ' + params[:last_name]
    else
      render :text => ''
      return
    end
      
    licensor_path = File.join(RAILS_ROOT, 'lib', 'license')
    
    generate_command = 'java -cp ' + licensor_path + ' LicenseGenerator ' + Base64.encode64(licenseeName) + ' ' + params[:license_type]
    
		key = ''
		IO.popen(generate_command) do |readme|
		  readme.each do |line|
		    key << line
		  end
		end
		
    partsCount = (key.length() / 41)
    splitLicensekey = ''

		for i in 0..partsCount - 1
		    splitLicensekey = splitLicensekey + key.slice(i * 41, 41) + '<br/>'
		end
     
    render :text => '<code>' + splitLicensekey + '</code>'
    
  end
end
