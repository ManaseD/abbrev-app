import React, { Component } from 'react'
import get from 'lodash/get'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import app from 'ABB/feathers-client.js'
import responsive from 'ABB/components/responsive.jsx'
import Labeler from 'ABB/components/labeler.jsx'
import Login from 'ABB/components/login.jsx'
import Registration from 'ABB/components/registration.jsx'
import SetSelector from 'ABB/components/setSelector.jsx'


@responsive
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      abbreviations: [],
      open: false,
      selectedAbbreviation: null,
      isAuthenticated: false,
      isLoading: true,
      registrationOpen: false,
      role: 'user',
      snackBarOpen: false,
      snackBarMessage: null
    }
  }

  authenticate = (options) => {
    return app.authenticate({ strategy: 'local', ...options })
      .then((auth) => this.setState({ role: get(auth, 'user.role') }))
      .then(() => this.fetchAbbreviations())
      .then(() => this.setState({ isAuthenticated: true }))
      .catch((err) => {
        console.log('authenticate error, ', err)
        this.setState({
            isAuthenticated: false,
            snackBarOpen: true,
            snackBarMessage: 'Login failed, please check your username and/or password'
          })
        }
      )
  }

  fetchAbbreviations = () => app.service('abbreviations').find()
    .then((abbreviations) => this.setState({ abbreviations }))

  onAbbreviationSelect = (abbreviation) => this.setState({ selectedAbbreviation: abbreviation, open: true })

  handleClose = () => {
    Promise.resolve()
      .then(() => this.setState({ selectedAbbreviation: null, open: false }))
      .then(() => this.fetchAbbreviations())
  }

  handleCloseSnackBar = () => this.setState({ snackBarOpen: false })

  componentDidMount() {
    return app.authentication.getAccessToken()
      .then(accessToken => {
        if (accessToken) {
          return app.reAuthenticate()
            .then((auth) => this.setState({ role: get(auth, 'user.role') }))
            .then(()=> this.fetchAbbreviations())
            .then(() => this.setState({ isAuthenticated: true }))
            .catch((err) => app.authentication.removeAccessToken())
        }
      })
      .then(() => this.setState({ isLoading: false }))
      .catch((err) => this.setState({ isLoading: false }))
  }

  renderLabelerDialog() {
    const { selectedAbbreviation, open } = this.state

    if (selectedAbbreviation) {
      return (
        <Labeler
          open={open}
          abbreviation={selectedAbbreviation}
          handleClose={this.handleClose}
        />
      )
    }
  }

  renderRegistrationDialog() {
    const { onMobile } = this.props
    const { registrationOpen } = this.state

    return (
      <Dialog
        fullScreen={onMobile}
        open={registrationOpen}
        onClose={() => this.setState({ registrationOpen: false})}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <span style={{ fontWeight: 700 }}>
            Register new users
          </span>
        </DialogTitle>
        <DialogContent>
          <Registration />
        </DialogContent>
        <DialogActions style={{ float: 'right' }}>
          <Button
            onClick={() => this.setState({ registrationOpen: false})}
            disableElevation
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const { onMobile } = this.props
    const { abbreviations, isAuthenticated, isLoading, role, snackBarOpen, snackBarMessage } = this.state

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
        {isAuthenticated && role === 'admin'
          ? <Fab
              color="primary"
              style={{ position: 'absolute', right: 10, bottom: 10 }}
              onClick={()=>this.setState({ registrationOpen: true })}
            >
              <AddIcon />
            </Fab>
          : null
        }
        <Paper
          elevation={onMobile ? 0 : 3}
          style={{
            padding: onMobile ? '0 10px' : 20,
            position: 'relative',
            ...onMobile
              ? { height: '100%', width: '100%', overflow: 'scroll' }
              : { ...isAuthenticated && { width: 500 }, marginBottom: 80 }
          }}
        >
          {this.renderLabelerDialog()}
          {this.renderRegistrationDialog()}
          {isLoading
            ? <div style={{ minHeight: 300, minWidth: 300}}>
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
                <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
                  <CircularProgress />
                </div>
              </div>
            : isAuthenticated
              ? <SetSelector abbreviations={abbreviations} onSelect={this.onAbbreviationSelect} />
              : <Login authenticate={this.authenticate} />
          }
        </Paper>
      </div>
    )
  }
}
