require 'bundler'

Bundler.require

class GitBoard < Sinatra::Base
  register Sinatra::Ember

  ember do
    templates "/js/templates.js", ["templates/*.handlebars"]
  end

  configure(:development) do
    set :session_secret, "something"
  end

  use Rack::Session::Cookie

  use OmniAuth::Builder do
    provider :developer
    provider :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET'], scope: "user,repo"
  end

  enable :sessions

  get '/auth' do
    if development?
      redirect '/auth/developer'
    else
      redirect '/auth/github'
    end
  end

  %w(get post).each do |method|
    send(method, '/auth/:provider/callback') do
      if params[:provider] == 'github'
        auth = request.env['omniauth.auth']
        token = auth['credentials']['token']
      else
        token = ""
      end

      session['token'] = token

      redirect session['return_to']
    end
  end

  get '/' do
    redirect '/dasch/agile-glory'
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
