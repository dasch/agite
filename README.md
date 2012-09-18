Agite
=====

A simple KanBan board based on the GitHub issues API.

Each GitHub milestone corresponds to a sprint, and each issue to a story. When
the application is loaded, the next upcoming milestone is used as the current
sprint, and its issues are fetched.

The stories are presented in three columns:

1. To Do: open issues that do not have a pull request attached.
2. In Progress: open issues that _do_ have a pull request attached.
3. Done: closed issues.
