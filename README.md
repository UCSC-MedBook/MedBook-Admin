# MedBook-Wrangler

## Testing

Testing for Wrangler requires the following code to be run.

```javascript
Accounts.createUser({
  email: 'admin@medbook.ucsc.edu',
  password: 'testing',
  profile: {
    collaborations: ['testing', 'admin']
  }
});
```
