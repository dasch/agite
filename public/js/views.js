App.SectionView = Em.View.extend({
  templateName: "templates/section",
  title: null,
  status: null,
  storyList: null,
  storyListBinding: "App.storiesController",
  stories: function() {
    return this.get("storyList").filterProperty("status", this.status);
  }.property("storyList.@each")
});
