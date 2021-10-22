# Client Boilerplate

This boilerplate is a starting point for the client-side portion of web and mobile applications.

## Features

### 
 - Login
 - 

The following features can be 
- 

## Starting a new project

It's recommended to work from a fresh repository rather than retaining the git history.

Clone the repository and reinitialize:
```
git clone git@github.com:sklink/boilerplate-client.git project_name
cd project_name
rm -rf .git
git init
```

## Keeping your project up-to-date

Use the doc in your project at `/docs/_boilerplate/CHANGELOG.md` to determine your boilerplate version.

Compare that version to the [latest one](https://github.com/sklink/boilerplate-client/docs/_boilerplate).

Decide which changes you want to copy over and manually copy the files listed. Before doing so, be sure that
the existing file hasn't diverged from the boilerplate. Checking the file's git history is the safest way to do so:

```
git log -p path/to/filename.js
```

*While manual copying isn't ideal, it is the safest method of ensuring that future updates don't negatively affect
applications already in production. It also means that core files can be changed *
