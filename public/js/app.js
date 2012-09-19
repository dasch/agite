var App = Em.Application.create({
  UPDATE_INTERVAL: 60 * 1000,

  accessToken: null,

  repo: null,

  sprintController: null,

  storiesController: null,

  ready: function() {
    this._super();

    this.set('storiesController', App.StoriesController.create());
    this.set('sprintController', App.SprintController.create());

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

    App.sprintController.addObserver("sprint", function() {
      App.storiesController.refresh();
    });
  },

  addSection: function(status, title) {
    sectionView = App.SectionView.create({ status: status, title: title });
    sectionView.append();
  }
});
