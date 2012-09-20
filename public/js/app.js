var App = Em.Application.create({
  UPDATE_INTERVAL: 60 * 1000,

  basePath: "https://api.github.com",

  repo: null,

  accessToken: null,

  sprintController: null,

  storiesController: null,

  isAuthenticated: function() {
    return this.get('accessToken') !== null;
  }.property('accessToken'),

  request: function(path, params, callback) {
    var basePath = this.get("basePath");
    var accessToken = this.get("accessToken");

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

    $.getJSON(basePath + path, params, callback);
  },

  ready: function() {
    this._super();

    this.set('accessToken', $(document.body).data('github-token'));
    this.set('storiesController', App.StoriesController.create());
    this.set('sprintController', App.SprintController.create());

    this.set('repo', App.Repo.create({
      organization: $(document.body).data('github-org'),
      name: $(document.body).data('github-repo')
    }));

    var sprintView = Ember.View.create({
      templateName: "templates/sprint"
    });

    sprintView.append();

    App.currentUserController = App.CurrentUserController.create();

    App.CurrentUserView.create({
      user: function() {
        return App.currentUserController.get('content');
      }.property('App.currentUserController.content')
    }).append();

    App.currentUserController.refresh();

    this.addSection("to-do", "To Do");
    this.addSection("in-progress", "In Progress");
    this.addSection("done", "Done");

    App.sprintController.refresh(); 

    App.sprintController.addObserver("sprint", function() {
      App.storiesController.refresh();
    });
  },

  addSection: function(status, title) {
    sectionView = App.SectionView.create({ status: status, title: title });
    sectionView.append();
  }
});
