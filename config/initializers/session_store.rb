# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_uniboard-publishing_session',
  :secret      => '59de4d7cd87794e95d960c3ac050b8617516e4c202d379523f534c1777baac1706dbaa1dec49644596dc1852341eef294d9c6bb5cc8bfd65a1d3636e125d568e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
