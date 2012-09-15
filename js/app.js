var App = Em.Application.create({
  repo_path: "https://api.github.com/repos/dasch/agile-glory",

  ready: function() {
    this._super();

    this.getMilestone();

    var sectionView = Em.View.create({
      templateName: "section",
      stories: App.issuesController
    });

    sectionView.append();
  },

  getMilestone: function() {
    App.milestoneController.refresh();
  }
});

App.Issue = Em.Object.extend({
  title: null,
  number: null,
  assignee: null,
  state: "open"
});

App.issuesController = Em.ArrayController.create({
  content: [],

  addIssue: function(issue) {
    this.pushObject(issue);
  },

  refresh: function() {
    var self = this;
    var milestoneNumber = App.milestoneController.milestone.number;

    if (milestoneNumber === undefined) return;

    var state = "open";
    var endpoint = App.repo_path + "/issues";
    var params = { milestone: milestoneNumber, state: state };

    $.getJSON(endpoint, params, function(issues) {
      for (var i = 0; i < issues.length; i++) {
        var issue = issues[i];
        console.log(issue);
        self.addIssue(issue);
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
    var params = { sort: "due_at", direction: "asc", limit:1 };
    var endpoint = App.repo_path + "/milestones";

    $.getJSON(endpoint, params, function(milestones) {
      var milestone = milestones[0];

      self.milestone.set("title", milestone.title);
      self.milestone.set("number", milestone.number);

      App.issuesController.refresh();
    });
  }
});
