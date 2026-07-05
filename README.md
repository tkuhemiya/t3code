One-time setup
```sh
git checkout main
git pull origin main
git checkout -b fork/themiya
git push -u origin fork/themiya
```

# Start a Feat
```sh
git fetch origin
git checkout fork/themiya
git pull origin fork/themiya
git checkout -b themiya/pwa-install
# ... work, commit ...
git push -u origin themiya/pwa-install
```

# Sync original repo → main → rebase fork/themiya
```sh
# 1. Update main from OG
git checkout main
git fetch https://github.com/pingdotgg/t3code.git main
git merge FETCH_HEAD
# 2. Rebase your integration branch on top
git checkout fork/themiya
git rebase main
# 3. If fork/themiya was already pushed, update remote
git push --force-with-lease origin fork/themiya
```

on conflict
```sh
# fix files, then:
git add <fixed-files>
git rebase --continue
# or abort:
git rebase --abort
```

After rebasing fork/themiya, update any open feature branches:
```sh
git checkout themiya/some-feature
git rebase fork/themiya
git push --force-with-lease origin themiya/some-feature
```
