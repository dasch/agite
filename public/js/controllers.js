App.StoriesController = Em.ArrayController.extend({
  sprint: null,
  content: null,

  refresh: function() {
    this.set('sprintNumber', App.sprintController.sprint.number);

    if (this.get('sprintNumber') === undefined) return;

    this.set("content", []);

    this.loadIssues("open");
    this.loadIssues("closed");

    setTimeout(function() {
      App.storiesController.refresh();
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
