# 0.0.2

* Restructured to domain folder
* Upgraded from React 16 to 17

```
npm install --save react@17.0.0 react-dom@17.0.2 react-scripts@4.0.3 @types/react@17.0.31 @types/react-dom@17.0.10
```

* [Upgraded from Material UI 4 to 5](https://mui.com/guides/migration-v4/#why-you-should-migrate) (requires React 17)

```
npm install --save @mui/material @mui/styles @mui/lab
npm install --save @emotion/react @emotion/styled
npx @mui/codemod v5.0.0/preset-safe ./
npx @mui/codemod v5.0.0/variant-prop ./
npx @mui/codemod v5.0.0/link-underline-hover ./

// Fix DatePickers https://mui.com/guides/pickers-migration/

npm remove --save @material-ui/core @material-ui/icons @material-ui/pickers styled-components
```

* Removed `@fortawesome/fontawesome-free` and `@flatfile/react`

# 0.0.1

* Copied from Max Analytics on 2021-10-15
