# Nodejs boilerplate project
This boilerplate project was integrate with list of libs below, just use it and save your time:
- **express**: Http library
- **dotenv-safe**: Check and get environment property from .env file
- **morgan**: Create logs for application
- **pm2**: Process management for nodejs 
- **eslint**: Pluggable linting utility for JavaScript
- **lint-staged**: Run linters on git staged files
- **prettier-standard**: Formatter utility for JavaScript
- **mysql**: Mysql utility such as connector
- **And other useful libs...**

Bonus features:
- **Base Model**: An easy way to work with mysql database

```javascript
let model = new Model('products') // Create model for products table
let products = await model.index({
  // query options
  limit: 10,
  sort: '-id',
  page: 2
})
```

- **Run lint-staged when commit**: check syntax & reformat code using javascript standard (eslint & prettier-standard)

# Usage
Comming soon

# Contribute
- You are welcome <3
