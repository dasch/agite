require 'sinatra'
require 'omniauth'
require 'omniauth-github'

class GitBoard < Sinatra::Base
  configure(:development) do
    set :session_secret, "something"
  end

  use Rack::Session::Cookie

  use OmniAuth::Builder do
    provider :developer
    provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']
  end

  enable :sessions

  get '/' do
    @token = session['token']

    if @token.nil?
      redirect '/auth'
    else
      erb :index
    end
  end

  get '/auth' do
    if development?
      redirect '/auth/developer'
    else
      redirect '/auth/github'
    end
  end

  get '/auth/:provider/callback' do
    if params[:provider] == 'github'
      auth = request.env['omniauth.auth']
      token = auth['credential']['token']
    else
      token = "foo"
    end

    session['token'] = token

    redirect '/'
  end
end
