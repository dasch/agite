App.storiesController = Em.ArrayController.create({
  content: null,

  refresh: function() {
    var sprintNumber = App.sprintController.sprint.number;
    if (sprintNumber === undefined) return;

    this.set("content", []);

    this.loadIssues("open");
    this.loadIssues("closed");

    setTimeout(function() {
      App.storiesController.refresh();
    }, App.UPDATE_INTERVAL);
  },

  loadIssues: function(state) {
    var self = this;
    var sprintNumber = App.sprintController.sprint.number;
    var params = {
      milestone: sprintNumber,
      state: state
    };

    App.repo.request("/issues", params, function(issues) {
      for (var i = 0; i < issues.length; i++) {
        var story = App.Story.create(issues[i]);
        self.pushObject(story);
      }
    });
  }
});

App.sprintController = Em.Object.create({
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
