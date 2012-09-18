require 'sinatra'

class GitBoard < Sinatra::Base
  get '/' do
    erb :index
  end
end
