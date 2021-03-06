App.SectionView = Em.View.extend({
  templateName: "templates/section",
  title: null,
  status: null,
  storyList: null,
  storyListBinding: "App.storiesController",
  stories: function() {
    return this.get("storyList").filterProperty("status", this.status);
  }.property("storyList.@each.status")
});

App.StoryView = Em.View.extend({
  templateName: "templates/story"
});

App.CurrentUserView = Em.View.extend({
  templateName: "templates/current_user",
  user: null
});

App.AvatarView = Em.View.extend({
  templateName: "templates/avatar",
  user: null
});
