import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'

import app from 'ABB/feathers-client.js'


export default class Registration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      education: '',
      password: '',
      passwordConfirmation: '',
      error: null,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  handleValidation = () => {
    const { education, email } = this.state

    if (!this.isValidEmail(email)){
      this.setState({ error: 'email' })
      return true
    } else if (education === '') {
      this.setState({ error: 'education' })
      return true
    }

    return false
  }

  isValidEmail = email => email && email.match(/^.+@.+\..+$/)

  handleRegistrationChange = (field, value) => this.setState({ [field]: value, error: null })

  handleRegisterUser = event => {
    event.preventDefault()
    const { authenticate } = this.props
    const { email, education, password, passwordConfirmation } = this.state

    if (!education) {
      return this.setState({ error: 'Please indicate your level of education' })
    }

    if (password !== passwordConfirmation) {
      return this.setState({ error: 'Please make sure your passwords match' })
    }

    app.service('users').create({ email, education, password })
      .then(() => authenticate({ strategy: 'local', email, password }))
      .catch(() => this.setState({ snackBarOpen: true, snackBarMessage: 'Sorry, this email has already been used' }))

  }

  render() {
    const { email, education, password, passwordConfirmation, error, snackBarOpen, snackBarMessage } = this.state
    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 500,
    }

    return (
      <div style={{ flexBasis: '50%', paddingLeft: 20 }}>
        <div style={{ ...textStyle, fontSize: 16 }}>
          Register as a new user:
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <TextField
          error={error === "email"}
          fullWidth
          required
          id="email"
          label="Email"
          margin="dense"
          onChange={(event) => this.handleRegistrationChange('email', event.target.value)}
          type="email"
          variant="filled"
          value={email}
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
            type="password"
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
            type="password"
            variant="filled"
            value={passwordConfirmation}
          />
        </div>
        <TextField
          error={error === "education"}
          fullWidth
          required
          id="education"
          select
          label="Highest level of education?"
          SelectProps={{ native: true }}
          margin="dense"
          onChange={(event) => this.handleRegistrationChange('education', event.target.value)}
          variant="filled"
          value={education}
        >
          <option value="" />
          <option value="highschool">High school diploma</option>
          <option value="college">College diploma</option>
          <option value="bachelors">Bachelor's degree</option>
          <option value="masters">Master's degree</option>
          <option value="phd">MD Medical Doctor</option>
          <option value="professional">Nurse / Nurse Practitioner</option>
        </TextField>
        <div style={{ marginBottom: 20, marginTop: 16 }}>
          <Button variant="contained" color="primary" onClick={this.handleRegisterUser}>
            Register
          </Button>
        </div>
      </div>
    )
  }
}
