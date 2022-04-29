## Conventions ##

### Git Branches ###
Git branches should be named in the format 'feature-(feature-name)'.
 - eg: While working on the login page css, name the branch 'feature-login-css' 

Git branches should not be deleted after they have been merged. It can be useful to retain past code in case we need to go back to a previous version.

### Git Commits ###
Git commit messages should be made in the present tense.
 - eg: 'Add login functionality and storage of user IDs. Bug remains with redirect after login.'

### Code ###
Functions and variables should be named clearly and in camel case.
 - eg: A variable that stores the number of clicks should be labelled 'numClicks' or 'numUserClicks'
 - eg: A function that generates a form in the DOM should be labelled 'generateForm()' or 'createForm()'

Every line should end with a semi-colon.

Class names should be in the format `class-(class-item-name)`
 - eg: A username form input should have the class name `class-login-input`

ID names should be in the format `id-(id-item-name)`
 - eg: A login form should have the id name `id-login-form`

---
# Git Guide #

### Pulling ###
Warning: Always pull from a branch before you make changes, lest you run into merge conflicts.

To pull from a branch, navigate to the branch and type:
`git pull`

### Creating and Moving To a New Branch ###
To create a new branch, type:
`git branch (branch name)`

To go to the new branch, type:
`git checkout (branch name)`

Alternatively, these actions can be performed at once by typing:
`git checkout -b (branch name)`

### Switching Branches ###
To switch branches, type:
`git checkout (branch name)`

### Commiting ###
To check which files are currently slated to be commited, type:
`git status`

To add files to a commit, type:
`git add (filename)`
 - Alternatively, type: `git add *` to add all files to the commit.

To commit changes, type:
`git commit -m "(commit message)"`

Note: if necessary, longer commit messages can be created with `git commit -m` which will take you to a text editor. Write your commit message, save, and close to commit.

### Pushing ###
To make doubly sure you are on the correct branch, type:
`git branch`

To push commited changes to the desired branch, type:
`git push`

### Merging Branches ###
To merge branches:
 1. Go to the repository on GitHub.
 2. Click the dropdown to the top-left of where the files in the repo are displayed.
 3. Click the branch you want to merge.
 4. Click the dropdown menu labelled 'Contribute' located in the text box just below the branch-selection dropdown.
 5. Click 'Open pull request'.
 6. Select the branch you would like to merge into in the dropdown menu above the comment box.
 7. Click 'Create pull request'.
 8. Resolve any merge conficts.
 9. Merge.

There are other ways to merge using the command line that can be googled if desired.

### Troubleshooting ###
Things are bound to get messy at some point. There are many resources online which can be helpful for solving git-related issues. for example, [Oh Sh*t Git](ohshitgit.com).
If things are really bad, get in touch with a team member.
