App.StoriesController = Em.ArrayController.extend({
  sprint: null,
  content: null,

  refresh: function() {
    this.set('sprintNumber', App.sprintController.sprint.number);

    if (this.get('sprintNumber') === undefined) return;

    this.set("content", []);

    this.loadIssues("open");
    this.loadIssues("closed");

    Ember.run.later(this, function() {
      this.refresh();
    }, App.UPDATE_INTERVAL);
  },

  loadIssues: function(state) {
    var self = this;
    var params = {
      milestone: this.get('sprintNumber'),
      state: state
    };

    App.repo.request("/issues", params, function(issues) {
      var stories = issues.map(function(issue) { return App.Story.create(issue); });
      self.pushObjects(stories);
    });
  }
});

App.SprintController = Em.Object.extend({
  sprint: null,

  refresh: function() {
    var self = this;
    var params = {
      sort: "due_at",
      direction: "asc",
      limit: 1
    };

    App.repo.request("/milestones", params, function(milestones) {
      var milestone = milestones[0];

      if (milestone === undefined) {
        alert("No milestone has been set up");
      }

      self.set("sprint", App.Sprint.create(milestone));
    });
  }
});

App.CurrentUserController = Em.Object.extend({
  content: {
    login: "dasch",
    avatar_url: "https://secure.gravatar.com/avatar/a9cc05e6a7866e5fa9a7d107b5070174?d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png"
  },

  refresh: function() {
    var self = this;

    if (!App.get("isAuthenticated"))
      return;

    App.request("/user", {}, function(user) {
      self.set('content', user);
    });
  }
});
