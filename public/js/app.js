var App = Em.Application.create({
  UPDATE_INTERVAL: 60 * 1000,

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

    var sprintView = Ember.View.create({
      templateName: "templates/sprint"
    });

    sprintView.append();

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
