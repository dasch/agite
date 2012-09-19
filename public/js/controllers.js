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
    var base_path = App.repo.get("base_path");
    var endpoint = base_path + "/issues";
    var sprintNumber = App.sprintController.sprint.number;
    var accessToken = App.repo.get("accessToken");

    var params = {
      milestone: sprintNumber,
      state: state
    };

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

    $.getJSON(endpoint, params, function(data) {
      for (var i = 0; i < data.length; i++) {
        var story = App.Story.create(data[i]);
        self.pushObject(story);
      }
    });
  }
});

App.sprintController = Em.Object.create({
  sprint: Em.Object.create({
    number: null,
    title: "N/A"
  }),

  refresh: function() {
    var self = this;
    var base_path = App.repo.get("base_path");
    var endpoint = base_path + "/milestones";
    var accessToken = App.repo.get("accessToken");

    var params = {
      sort: "due_at",
      direction: "asc",
      limit: 1
    };

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

    $.getJSON(endpoint, params, function(sprints) {
      var sprint = sprints[0];

      if (sprint === undefined) {
        alert("No sprint has been set up");
      }

      self.sprint.set("title", sprint.title);
      self.sprint.set("number", sprint.number);
    });
  }
});
