# Client Boilerplate

This boilerplate is a starting point for the client-side portion of web and mobile applications.

## Features

-  [Authentication and User Management](./docs/_boilerplate/UserSystem.md)

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

*While manual copying isn't ideal, there are a number of benefits:*
 
 - *forces manual review and approval of updates going into production applications;*
 - *core files can be changed without concern about maintaining compatibility with the boilerplate; and,*
 - *boilerplate changes can be planned and refined before being added to the main repo without blocking an
 existing project's needs.*  
