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
      token = auth['credentials']['token']
    else
      token = "foo"
    end

    session['token'] = token

    redirect session['return_to']
  end

  get '/' do
    redirect '/dasch/agite'
  end

  get '/:org/:repo' do
    @org = params[:org]
    @repo = params[:repo]
    @token = session['token']

    if @token.nil?
      session['return_to'] = "/#{@org}/#{@repo}"
      redirect '/auth'
    else
      erb :index
    end
  end
end
