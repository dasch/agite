var App = Em.Application.create({
  repo_path: "https://api.github.com/repos/dasch/agile-glory",

  ready: function() {
    this._super();

    this.addSection("to-do", "To Do");
    this.addSection("in-progress", "In Progress");
    this.addSection("done", "Done");

    App.sprintController.refresh(); 

    App.sprintController.sprint.addObserver("number", function() {
      App.storiesController.refresh();
    });
  },

  addSection: function(status, title) {
    var sectionView = Em.View.create({
      templateName: "section",
      title: title,
      storyList: null,
      storyListBinding: "App.storiesController",
      stories: function() {
        return this.get("storyList").filterProperty("status", status);
      }.property("storyList.@each")
    });

    sectionView.append();
  }
});

App.Story = Em.Object.extend({
  title: null,
  number: null,
  assignee: null,

  status: function() {
    var hasPullRequest = (this.pull_request.html_url === null);

    if (this.state === "closed") {
      return "done";
    } else if (this.state === "open") {
      if (hasPullRequest) {
        return "in-progress";
      } else {
        return "to-do";
      }
    }
  }.property()
});

App.storiesController = Em.ArrayController.create({
  content: null,

  refresh: function() {
    this.set("content", []);

    var sprintNumber = App.sprintController.sprint.number;
    if (sprintNumber === undefined) return;

    this.loadIssues("open");
    this.loadIssues("closed");
  },

  loadIssues: function(state) {
    var self = this;
    var endpoint = App.repo_path + "/issues?callback=?";
    var sprintNumber = App.sprintController.sprint.number;
    var params = { milestone: sprintNumber, state: state };

    $.getJSON(endpoint, params, function(response) {
      var data = response.data;

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
    var params = { sort: "due_at", direction: "asc", limit: 1 };
    var endpoint = App.repo_path + "/milestones?callback=?";

    $.getJSON(endpoint, params, function(response) {
      var sprint = response.data[0];

      self.sprint.set("title", sprint.title);
      self.sprint.set("number", sprint.number);
    });
  }
});
