# User System

Provides pages for:

- sign in;
- forgot password;
- registration; can be disabled individually using the `OPEN_REGISTRATION` variable in `_configuration.tsx`
- user management;
- accepting an invite;

These can all be disabled by setting `HAS_USERS = false` in `_configuration.tsx`

Access to variables and actions for: sign

- sign out;

Other options are:
- `CAN_CREATE_USERS`: disables or enables the CreateUserForm on the UserManagementPage;
- `CAN_INVITE_USERS`: disables or enables the CreateInviteForm on the UserManagementPage; 
