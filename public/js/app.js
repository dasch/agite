var App = Em.Application.create({
  UPDATE_INTERVAL: 60 * 1000,

  accessToken: null,

  repo: null,

  ready: function() {
    this._super();

    this.set('repo', App.Repo.create({
      organization: $(document.body).data('github-org'),
      name: $(document.body).data('github-repo'),
      accessToken: $(document.body).data('github-token')
    }));

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
