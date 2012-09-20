App.Repo = Em.Object.extend({
  organization: null,
  name: null,

  basePath: function() {
    var org = this.get('organization');
    var repo = this.get('name');

    if (org === undefined || repo === undefined) {
      throw "Invalid org or repo";
    }

    return "/repos/" + org + "/" + repo;
  }.property('organization', 'name'),

  request: function(path, params, callback) {
    var basePath = this.get("basePath");
    App.request(basePath + path, params, callback);
  }
});

App.Sprint = Em.Object.extend({
  number: null,
  title: "N/A"
});

App.Story = Em.Object.extend({
  title: null,
  number: null,
  assignee: null,
  labels: null,

  needsReview: function() {
    var labels = this.get("labels");

    if (this.get("status") !== "in-progress")
      return false;

    if (labels === undefined)
      return false;

    return labels.some(function(label) {
      return label.name === "needs-review";
    });
  }.property('status', 'labels'),

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
  }.property('pull_request')
});
