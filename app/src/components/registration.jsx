import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'

import app from 'ABB/feathers-client.js'


export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      education: '',
      password: '',
      passwordConfirmation: '',
      error: null,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  handleRegistrationChange = (field, value) => this.setState({ [field]: value, error: null })

  handleRegisterUser = event => {
    event.preventDefault()
    const { username, password, passwordConfirmation } = this.state

    if (password !== passwordConfirmation) {
      return this.setState({ error: 'Please make sure your passwords match' })
    }

    app.service('users').create({ username, password })
      .then(() => this.setState({ snackBarOpen: true, snackBarMessage: 'Successfully created user!' }))
      .catch(() => this.setState({ snackBarOpen: true, snackBarMessage: 'Sorry, this username has already been used' }))

  }

  render() {
    const { username, password, passwordConfirmation, error, snackBarOpen, snackBarMessage } = this.state

    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <TextField
          error={error === "username"}
          fullWidth
          required
          id="username"
          label="Username"
          margin="dense"
          onChange={(event) => this.handleRegistrationChange('username', event.target.value)}
          type="username"
          variant="filled"
          value={username}
        />
        <div style={{ display: 'flex' }}>
          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            margin="dense"
            onChange={(event) => this.handleRegistrationChange('password', event.target.value)}
            style={{ paddingRight: 5 }}
            variant="filled"
            value={password}
          />
          <TextField
            error={!!error}
            fullWidth
            required
            id="password-confirmation"
            label="Confirm Password"
            margin="dense"
            onChange={(event) => this.handleRegistrationChange('passwordConfirmation', event.target.value)}
            style={{ paddingLeft: 5 }}
            variant="filled"
            value={passwordConfirmation}
          />
        </div>
        <div style={{ marginBottom: 20, marginTop: 16 }}>
          <Button variant="contained" color="primary" onClick={this.handleRegisterUser}>
            Register
          </Button>
        </div>
      </div>
    )
  }
}
