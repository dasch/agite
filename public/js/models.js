App.Repo = Em.Object.extend({
  organization: null,
  name: null,

  base_path: function() {
    var org = this.get('organization');
    var repo = this.get('name');

    if (org === undefined || repo === undefined) {
      throw "Invalid org or repo";
    }

    return "https://api.github.com/repos/" + org + "/" + repo;
  }.property('organization', 'name'),

  request: function(path, params, callback) {
    var base_path = this.get("base_path");
    var accessToken = this.get("accessToken");
    var endpoint = base_path + path;

    if (accessToken !== "") {
      params.access_token = accessToken;
    }

    $.getJSON(endpoint, params, callback);
  }
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
