var App = Em.Application.create({
  repo_path: "https://api.github.com/repos/dasch/agile-glory",

  ready: function() {
    this._super();

    this.addSection("to-do", "To Do");
    this.addSection("in-progress", "In Progress");
    this.addSection("done", "Done");

    App.milestoneController.refresh(); 

    App.milestoneController.milestone.addObserver("number", function() {
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

    var milestoneNumber = App.milestoneController.milestone.number;
    if (milestoneNumber === undefined) return;

    this.loadIssues("open");
    this.loadIssues("closed");
  },

  loadIssues: function(state) {
    var self = this;
    var endpoint = App.repo_path + "/issues";
    var milestoneNumber = App.milestoneController.milestone.number;
    var params = { milestone: milestoneNumber, state: state };

    $.getJSON(endpoint, params, function(data) {
      for (var i = 0; i < data.length; i++) {
        var story = App.Story.create(data[i]);
        console.log(story);
        self.pushObject(story);
      }
    });
  }
});

App.milestoneController = Em.Object.create({
  milestone: Em.Object.create({
    number: null,
    title: "N/A"
  }),

  refresh: function() {
    var self = this;
    var params = { sort: "due_at", direction: "asc", limit: 1 };
    var endpoint = App.repo_path + "/milestones";

    $.getJSON(endpoint, params, function(milestones) {
      var milestone = milestones[0];

      self.milestone.set("title", milestone.title);
      self.milestone.set("number", milestone.number);
    });
  }
});
