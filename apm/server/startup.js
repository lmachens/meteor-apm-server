Meteor.startup(() => {
  if (!Meteor.users.findOne({ username: 'admin' })) {
    Accounts.createUser({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      plan: 'business'
    });
  }
});
