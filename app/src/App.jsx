import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import app from 'ABB/feathers-client.js'
import responsive from 'ABB/components/responsive.jsx'
import Labeler from 'ABB/components/labeler.jsx'
import Login from 'ABB/components/login.jsx'
import Registration from 'ABB/components/registration.jsx'


@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      isLoading: true,
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  authenticate = (options) => {
    return app.authenticate({ strategy: 'local', ...options })
      .then(() => this.setState({ isAuthenticated: true }))
      .catch((err) => {
        console.log('authenticate error, ', err)
        this.setState({
            isAuthenticated: false,
            snackBarOpen: true,
            snackBarMessage: 'Login failed, please check your email and/or password'
          })
        }
      )
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  componentDidMount() {
    return app.authentication.getAccessToken()
      .then(accessToken => {
        if (accessToken) {
          return app.reAuthenticate()
            .then(() => this.setState({ isAuthenticated: true }))
            .catch((err) => app.authentication.removeAccessToken())
        }
      })
      .then(() => this.setState({ isLoading: false }))
      .catch((err) => this.setState({ isLoading: false }))
  }

  render() {
    const { onMobile } = this.props
    const { isAuthenticated, isLoading, snackBarOpen, snackBarMessage } = this.state

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          position: 'absolute'
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message={snackBarMessage}
        />
        <Paper
          elevation={onMobile ? 0 : 3}
          style={{
            padding: onMobile ? '0 10px' : 20,
            position: 'relative',
            ...onMobile
              ? { height: '100%', width: '100%', overflow: 'scroll' }
              : { width: isAuthenticated ? 500 : 650, marginBottom: 80 }
          }}
        >
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
          {isLoading
            ? <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                <CircularProgress />
              </div>
            : isAuthenticated
              ? <Labeler />
              : <div style={{ display: 'flex' }}>
                  <Login authenticate={this.authenticate} />
                  <div style={{ borderRight: '1px solid #d5d5d55e', marginBottom: 16 }}/>
                  <Registration authenticate={this.authenticate} />
                </div>
          }
        </Paper>
      </div>
    )
  }
}
