class PublishedDocumentsController < ApplicationController
  # GET /published_documents
  # GET /published_documents.xml
  def index
    @published_documents = PublishedDocument.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @published_documents }
    end
  end

  # GET /published_documents/1
  # GET /published_documents/1.xml
  def show
    @published_document = PublishedDocument.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @published_document }
    end
  end

  # GET /published_documents/new
  # GET /published_documents/new.xml
  def new
    @published_document = PublishedDocument.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @published_document }
    end
  end

  # GET /published_documents/1/edit
  def edit
    @published_document = PublishedDocument.find(params[:id])
  end

  # POST /published_documents
  # POST /published_documents.xml
  def create
    @published_document = PublishedDocument.new(params[:published_document])

    respond_to do |format|
      if @published_document.save
        flash[:notice] = 'PublishedDocument was successfully created.'
        format.html { redirect_to(@published_document) }
        format.xml  { render :xml => @published_document, :status => :created, :location => @published_document }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @published_document.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /published_documents/1
  # PUT /published_documents/1.xml
  def update
    @published_document = PublishedDocument.find(params[:id])

    respond_to do |format|
      if @published_document.update_attributes(params[:published_document])
        flash[:notice] = 'PublishedDocument was successfully updated.'
        format.html { redirect_to(@published_document) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @published_document.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /published_documents/1
  # DELETE /published_documents/1.xml
  def destroy
    @published_document = PublishedDocument.find(params[:id])
    @published_document.destroy

    respond_to do |format|
      format.html { redirect_to(published_documents_url) }
      format.xml  { head :ok }
    end
  end
end
