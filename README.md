# Conventions #

## Git Branches ##
Git branches should be named in the format 'feature-(feature-name)'
 - eg: While working on the login page css, name the branch 'feature-login-css' 

Git branches should not be deleted after they have been merged. It can be useful to retain past code in case we need to go back to a previous version.

## Code ##
Functions and variables should be named clearly and in camel case
 - eg: A variable that stores the number of clicks should be labelled 'numClicks' or 'numUserClicks'
 - eg: A function that generates a form in the DOM should be labelled 'generateForm()' or 'createForm()'

Every line should end with a semi-colon

---
# Git Guide #

## Creating and Moving To a New Branch ##
To create a new branch, type:
`git branch (branch name)`

To go to the new branch, type:
`git checkout (branch name)`

Alternatively, these actions can be performed at once by typing:
`git checkout -b (branch name)`

## Switching Branches ##
To switch branches, type:
`git checkout (branch name)`

## Merging Branches ##


