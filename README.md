# MedBook-Admin

## Testing

Testing for Admin requires the following code to be run. (It will be run automatically during the tests.) Note that this will create a huge security vulnerability if run on production. 

```javascript
Accounts.createUser({
  email: 'admin@medbook.ucsc.edu',
  password: 'testing',
  profile: {
    collaborations: ['testing', 'admin']
  }
});
```
