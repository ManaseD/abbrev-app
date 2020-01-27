import React, { Component } from 'react'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import responsive from 'ABB/components/responsive.jsx'

@responsive
export default class SetSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  renderRow = (abbreviation) => {
    const { onSelect } = this.props
    const { id, abbreviated_text, sentences, responses } = abbreviation

    return (
      <TableRow hover style={{ cursor: 'pointer' }} key={id} onClick={() => onSelect(abbreviation)}>
        <TableCell align="left" style={{ fontSize: 16, fontWeight: 'bold' }}>
          {abbreviated_text}
        </TableCell>
        <TableCell align="left">
          {sentences.length}
        </TableCell>
        <TableCell align="left">
          {`${(responses.length / sentences.length * 100).toFixed(0)}%`}
        </TableCell>
      </TableRow>
    )
  }

  render() {
    const { abbreviations, onMobile } = this.props
    const sorted = sortBy(abbreviations, (abbr) => abbr.abbreviated_text)

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
          Abbreviations
        </div>
        <div style={{ ...textStyle, color: '#232f3e8a', fontSize: 13, marginTop: 30, marginBottom: 10 }}>
          Choose an abbreviation set below to start:
        </div>
        <TableContainer
          style={{
            maxHeight: onMobile ? 'calc(100vh - 110px)' : 400,
            border: '1px solid lightgrey',
            borderRadius: onMobile ? 8 : '8px 0 0 8px'
          }}
        >
          <Table stickyHeader size="small">
            <TableHead >
              <TableRow>
                <TableCell
                  align="left"
                  style={{ minWidth: 40, backgroundColor:'#1e88e5', color: '#fff' }}
                >
                  Abbr.
                </TableCell>
                <TableCell
                  align="left"
                  style={{ minWidth: 40, backgroundColor:'#1e88e5', color: '#fff' }}
                >
                  Sentences
                </TableCell>
                <TableCell
                  align="left"
                  style={{ minWidth: 40, backgroundColor:'#1e88e5', color: '#fff' }}
                >
                  Completed
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(sorted, (abbr) => this.renderRow(abbr))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}
