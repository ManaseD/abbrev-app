import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import App from './App.jsx'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1e88e5',
      dark: '#155fa0'
    }
  },
  overrides: {
    MuiInputLabel: {
      root: {
        fontSize: 14
      }
    },
    MuiFormControlLabel:{
      root: {
        marginLeft: 0
      },
      label: {
        fontSize: 14
      }
    }
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('app')
)
