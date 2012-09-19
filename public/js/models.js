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
