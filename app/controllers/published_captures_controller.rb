class PublishedCapturesController < ApplicationController
  # GET /published_captures
  # GET /published_captures.xml
  def index
    @published_captures = PublishedCapture.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @published_captures }
    end
  end

  # GET /published_captures/1
  # GET /published_captures/1.xml
  def show
    @published_capture = PublishedCapture.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @published_capture }
    end
  end

  # GET /published_captures/new
  # GET /published_captures/new.xml
  def new
    @published_capture = PublishedCapture.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @published_capture }
    end
  end

  # GET /published_captures/1/edit
  def edit
    @published_capture = PublishedCapture.find(params[:id])
  end

  # POST /published_captures
  # POST /published_captures.xml
  def create
    @published_capture = PublishedCapture.new(params[:published_capture])

    respond_to do |format|
      if @published_capture.save
        flash[:notice] = 'PublishedCapture was successfully created.'
        format.html { redirect_to(@published_capture) }
        format.xml  { render :xml => @published_capture, :status => :created, :location => @published_capture }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @published_capture.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /published_captures/1
  # PUT /published_captures/1.xml
  def update
    @published_capture = PublishedCapture.find(params[:id])

    respond_to do |format|
      if @published_capture.update_attributes(params[:published_capture])
        flash[:notice] = 'PublishedCapture was successfully updated.'
        format.html { redirect_to(@published_capture) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @published_capture.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /published_captures/1
  # DELETE /published_captures/1.xml
  def destroy
    @published_capture = PublishedCapture.find(params[:id])
    @published_capture.destroy

    respond_to do |format|
      format.html { redirect_to(published_captures_url) }
      format.xml  { head :ok }
    end
  end
end
