# Contributing to Ottemo

Fork the [Ottemo project](http://github.com/ottemo/ottemo-go) on Github.

For example, to fork the Ottemo repository, and set up a new local branch that 
tracks against develop in our github repository, from your shell you would run:

    > git clone https://github.com/ottemo/core.git
    > cd core
    > git checkout -t origin/develop

## Introducing the git workflow

It is encouraged to use the git-flow workflow within git, you can do it manually or
 using [git-flow](http://nvie.com/posts/a-successful-git-branching-model)

### Topic branch

A good habit to get into is using topic branches for your work, while keeping 
the source branch untouched. You can then keep the source branch up-to-date 
with the main repository without worrying about merge conflicts.

#### Reduce merge conflicts

By not working on the source branch, you ensure that the branch's history will 
not diverge from the main repository's source branch. This allows you to pull 
in updates from the main repository to your local source branch without merge conflicts.

### Organize and isolate contributions

By creating a topic branch for each contribution, you effectively isolate your 
changes into a single branch of history. As long as the topic branch is up-to-date, 
your changes will merge cleanly into the main repository. If your contributions 
cannot be merged cleanly, the repository maintainer may have to reject your 
contribution until you update it.

### An example git workflow not using git-flow

Consider that you are charged with updating a README.md file.

#### Update your develop branch

We're assuming you have cloned the ottemo repository as per the example above. 
Let's first make sure your fork is up-to-date, by retrieving new commits from 
the canonical origin and then merging them as a fast-forward into your local branch.


    // switch to our own local develop branch
    > git checkout develop
    // retrieve all new commits from the remote origin, into our local git repo
    > git fetch origin develop
    // merge those new commits into the local develop branch only if there is a direct and linear commit path
    > git merge --ff-only origin/develop

If the merge fails, then your develop branch has diverged from origin. Normally 
this is not desirable as when you push patches back they may not be able to be 
applied cleanly.

#### Creating a topic branch

Topic branches should be named issue#-`fix|feature`-`short-description`. For 
example, `1368-fix-multipart-header` refers to an open issue on Github, and 
is a `fix` for the `multipart-header-parts` issue.

Let's assume a fictional issue number of 123.  Let's create a new branch 
based off of master and call it "123-fix-readme-file"

    > git checkout develop
    // make a new branch that is up to date with the ASF repo develop branch.
    > git checkout -b 123-fix-readme-file

This topic branch is now isolated and branched off the history of your develop 
branch, which also matches the current develop branch in Github. 

#### Make file changes

Let's update the text file:

    > vim README.md

    > git status
    modified: README.md

`git status` shows you have modified one file.

#### Commit the file changes 

`git add` will stage the file changes. You can then commit the staged file(s) 
with a git commit. This is the process you use to make changes to a git 
repository: first stage, then commit.

    > git add README.md
    > git status
    > git commit -m "Added new foo-bar setting."

Alternatively, you could combine both staging and committing by using `git commit -am "...."`

#### Commit more file changes

    > vim README.md
    > git commit -am "Fix typo in foo-bar comments."

#### Prepare to send pull request

Before sending the pull request, you should ensure that your changes merge 
cleanly with the main repository. You can do this by pulling the latest 
changes from the Github repository back into your local develop branch. Always 
make sure the source branch is in sync before issuing pull requests:

    > git checkout develop
    > git pull origin develop
    > git checkout 123-fix-readme-file
    > git rebase develop

This approach will pop off any of your commits that are *not* on the source 
branch, subsequently apply the missing commits from the source branch to bring 
yours up to date. The final step is to push your commits back on, in the same 
order, to keep the commit history pure. The result is a nice clear linear history 
on the Github repoository. The [git-community book](http://book.git-scm.com/4_rebasing.html)
has an excellent chapter on rebasing, in case the process is still foggy for you.

Last step is to make your code changes available from your fork, and push them 
up to Github, (if you are a committer), or to your own repo (e.g. 
on Github in your own account) if you are not a committer.

    > git checkout 123-fix-readme-file
    > git push origin 123-fix-readme-file

#### Sharing your changes

By pushing your topic branch onto your fork, a maintainer can then review and merge 
the topic branch into the main repository.

#### Sending a pull request from GitHub

Pull requests sent to the [Ottemo Github repositories](http://github.com/ottemo) 
should forward a pull request e-mail to the dev mailing list. It is strongly 
recommended that you sign up for the mailing list before issuing a pull request 
and make sure the list is notified. 

 * Open a web browser to your GitHub account's Ottemo fork.
 * Select your topic branch so that the pull request references the topic branch.
 * Click the Pull Request button.

### While waiting, feel free to continue crafting commits

Since you worked on the topic branch instead of the source branch, you can 
continue working while waiting for the pull request to go through.

Be sure to create the topic branch from the source branch.

    > git checkout develop
    > git pull origin develop
    > git checkout -b blah_blah_addition

### When your Pull Request is accepted

    > git checkout develop
    > git pull origin develop
    > git log 

You can now delete your topic branch, because it is now merged into the main 
repository and in the source branch. 

    > git branch -d 123-fix-readme-file 
    > git branch -D 123-fix-readme-file 

Note using the `-d` only deletes your local copy of the branch.  If it exists 
on the remote still, a follow-up `git pull` or `git fetch` will re-create it locally.
If you have local commits that are not the remote tracking branch, you might need to 
use the `-D` option to delete the local branch and abandon your local commits. 
