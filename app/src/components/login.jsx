import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import responsive from 'ABB/components/responsive.jsx'

@responsive
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = (field, value) => this.setState({ [field]: value })

  render() {
    const { authenticate, onMobile } = this.props
    const { email, password } = this.state

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 500,
    }

    return (
      <div>
        <div
          style={{
            color: '#232f3e',
            fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
            fontSize: 28,
            fontWeight: 700,
            textAlign: 'center',
            marginTop: onMobile ? 10 : 20,
            marginBottom: onMobile ? 10 : 40,
          }}
        >
          Abbreviation App
        </div>
        <div style={{ ...textStyle, fontSize: 16 }}>
          Please sign in with your provided account:
        </div>
        <TextField
          fullWidth
          required
          id="email-local"
          label="Email"
          margin="dense"
          onChange={(event) => this.handleChange('email', event.target.value)}
          type="email"
          variant="filled"
          value={email}
        />
        <TextField
          fullWidth
          required
          id="password-local"
          label="Password"
          margin="dense"
          onChange={(event) => this.handleChange('password', event.target.value)}
          type="password"
          variant="filled"
          value={password}
        />
        <div style={{ ...textStyle, color: '#232f3e', fontSize: 13, paddingTop: 18, paddingBottom: 12 }}>
          Forgot your password? Please contact <a style={{ textDecoration: 'none', color: '#0b56ca' }} href="mailto:marta.skreta@sickkids.ca">Marta Skreta</a> to reset your account
        </div>
        <div style={{ marginBottom: 20, marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => authenticate({ email, password })}
          >
            Login
          </Button>
        </div>
      </div>
    )
  }
}
