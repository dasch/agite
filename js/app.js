var App = Em.Application.create({
  repo_path: "https://api.github.com/repos/dasch/agile-glory",

  ready: function() {
    this._super();

    this.addSection("open", "In Progress");
    this.addSection("closed", "Done");

    App.milestoneController.refresh(); 
  },

  addSection: function(state, title) {
    var controller = App.StoriesController.create({ state: state });

    var sectionView = Em.View.create({
      templateName: "section",
      title: title,
      stories: controller
    });

    sectionView.append();

    App.milestoneController.milestone.addObserver("number", function() {
      controller.refresh();
    });
  }
});

App.Story = Em.Object.extend({
  title: null,
  number: null,
  assignee: null,
  state: null
});

App.StoriesController = Em.ArrayController.extend({
  state: null,

  content: null,

  addIssue: function(issue) {
    this.pushObject(issue);
  },

  refresh: function() {
    this.set("content", []);

    var self = this;
    var milestoneNumber = App.milestoneController.milestone.number;

    if (milestoneNumber === undefined) return;

    var endpoint = App.repo_path + "/issues";
    var params = { milestone: milestoneNumber, state: this.state };

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
    });
  }
});
