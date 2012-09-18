var App = Em.Application.create({
  org: null,

  repo: null,

  accessToken: null,

  base_path: function() {
    var org = this.get('org');
    var repo = this.get('repo');

    if (org === undefined || repo === undefined) {
      throw "Invalid org or repo";
    }

    return "https://api.github.com/repos/" + org + "/" + repo;
  }.property('org', 'repo'),

  ready: function() {
    this._super();

    this.set('org', $(document.body).data('github-org'));
    this.set('repo', $(document.body).data('github-repo'));
    this.set('accessToken', $(document.body).data('github-token'));

    this.addSection("to-do", "To Do");
    this.addSection("in-progress", "In Progress");
    this.addSection("done", "Done");

    App.sprintController.refresh(); 

    App.sprintController.sprint.addObserver("number", function() {
      App.storiesController.refresh();
    });
  },

  addSection: function(status, title) {
    sectionView = App.SectionView.create({ status: status, title: title });
    sectionView.append();
  }
});

App.SectionView = Em.View.extend({
  templateName: "section",
  title: null,
  status: null,
  storyList: null,
  storyListBinding: "App.storiesController",
  stories: function() {
    return this.get("storyList").filterProperty("status", this.status);
  }.property("storyList.@each")
});

App.Story = Em.Object.extend({
  title: null,
  number: null,
  assignee: null,

  status: function() {
    var hasPullRequest = (this.pull_request.html_url !== null);

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
    var base_path = App.get("base_path");
    var endpoint = base_path + "/issues?callback=?";
    var sprintNumber = App.sprintController.sprint.number;
    var accessToken = App.get("accessToken");

    var params = {
      milestone: sprintNumber,
      state: state
    };

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

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
    var base_path = App.get("base_path");
    var endpoint = base_path + "/milestones?callback=?";
    var accessToken = App.get("accessToken");

    var params = {
      sort: "due_at",
      direction: "asc",
      limit: 1
    };

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

    $.getJSON(endpoint, params, function(response) {
      var sprint = response.data[0];

      if (sprint === undefined) {
        alert("No sprint has been set up");
      }

      self.sprint.set("title", sprint.title);
      self.sprint.set("number", sprint.number);
    });
  }
});
