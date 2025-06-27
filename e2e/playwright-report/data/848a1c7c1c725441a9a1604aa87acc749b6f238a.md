# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- paragraph: Please login to your account.
- text: Username
- textbox "Username": testuser
- text: Password
- textbox "Password": password123
- text: "Default: admin / changeme"
- button "Login"
- dialog:
  - text: Login Error
  - img
  - text: Invalid username or password. Please try again.
  - button "Close"
```