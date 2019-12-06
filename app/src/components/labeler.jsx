import React, { Component } from 'react'
import get from 'lodash/get'
import map from 'lodash/map'

import Autocomplete from '@material-ui/lab/Autocomplete'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FilledIcon from '@material-ui/icons/IndeterminateCheckBoxTwoTone'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import OutlineIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import TextField from '@material-ui/core/TextField'

import app from 'ABB/feathers-client.js'
import responsive from 'ABB/components/responsive.jsx'


@responsive
export default class Labeler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      index: 0,
      isLoading: true,
      selectedExpansions: [],
      sentences: [],
    }
  }

  handleCheckBox = (event) => this.setState({ disabled: event.target.checked })

  handleNext = () => {
    const { disabled, index, selectedExpansions, sentences } = this.state
    const sentence = sentences[index]
    const sentence_id = get(sentence, 'id')
    const abbrev_id = get(sentence, 'abbreviation.id')
    const response = get(sentence, 'response')
    const expansions = disabled ? [] : selectedExpansions
    const nextIndex = Math.min(index + 1, sentences.length)

    // Helper function to set the state once we increment to the next index
    const setNextState = (response) => {
      const nextSentence = sentences[nextIndex]
      const nextResponse = get(nextSentence, 'response')

      this.setState({
        index: nextIndex,
        disabled: nextResponse && nextResponse.expansions.length === 0,
        selectedExpansions: nextResponse ? nextResponse.expansions : [],
        ...response && { sentences: map(sentences, s =>  s.id === sentence_id ? { ...s, response } : s) }
      })

    }

    // Check if we already have a response for this sentence
    if (response) {
      // If we have a response and we've changed the answer, then we need update/patch it
      if ((response.expansions !== selectedExpansions) || (disabled && response.expansions.length > 0)) {
        return app.service('responses').patch(response.id, { expansions })
          .then(response => setNextState(response))
      }

      // Otherwise everything is the same and we can proceed to the next sentence
      return setNextState()
    }

    // If we don't have a response, then we need to create a new one
    return app.service('responses').create({ abbrev_id, expansions, sentence_id })
      .then(response => setNextState(response))
  }

  handlePrev = () => {
    const { index, sentences } = this.state

    // Decrement index to min 0
    const newIndex = Math.max(index - 1, 0)
    const sentence = sentences[newIndex]
    const response = get(sentence, 'response')

    let state = { index: newIndex}
    if (response) {
      state['disabled'] = response.expansions.length === 0
      state['selectedExpansions'] = response.expansions
    }

    this.setState(state)
  }

  componentDidMount() {
    return app.service('sentences').find()
      .then(result => {
        const response = get(result, 'data[0].response')
        const disabled = response && response.expansions.length === 0
        const selectedExpansions = response ? response.expansions : []

        this.setState({ disabled, isLoading: false, selectedExpansions, sentences: result.data })
      })
  }

  renderSentence() {
    const { disabled, index, selectedExpansions, sentences } = this.state
    const sentence = sentences[index]
    const abbreviation = get(sentence, 'abbreviation')
    const expansions = get(sentence, 'expansions')

    const abbrevLength = abbreviation.abbreviated_text.length
    const sentenceStart = sentence.text.slice(0, sentence.char_pos)
    const sentenceEnd = sentence.text.slice(sentence.char_pos + abbrevLength + 2)  // The 2 is for the <> brackets
    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 500,
    }

    const text =
      <em style={{ ...textStyle, color: '#232f3ec7', fontWeight: 300, fontSize: 16 }}>
        {sentenceStart}
        <span style={{ color: '#232f3e', fontWeight: 700 }}>{abbreviation.abbreviated_text}</span>
        {sentenceEnd}
      </em>

    return (
      <div style={{ marginBottom: 40 }}>
        <div style={{ ...textStyle, color: '#232f3e8a', fontSize: 13, marginBottom: 20 }}>
          What does the abbreviation refer to in this context?
        </div>
        {text}
        <div style={{ marginTop: 30, marginBottom: 80 }}>
          <Autocomplete
            autoHighlight
            disabled={disabled}
            id="expansion-options"
            multiple
            onChange={(event, value) => this.setState({ selectedExpansions: value })}
            options={expansions}
            getOptionLabel={option => option.expanded_text}
            renderInput={params => <TextField { ...params } label="Abbreviated text" variant="outlined" fullWidth />}
            value={disabled ? [] : selectedExpansions}
          />
          <FormGroup style={{ marginTop: 8 }}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<OutlineIcon />}
                  checked={disabled}
                  checkedIcon={<FilledIcon />}
                  onChange={this.handleCheckBox}
                />
              }
              label={
                <div style={{ color: disabled ? '#f50057' : '#757575' }}>
                  None of the above
                </div>
              }
            />
          </FormGroup>
        </div>
      </div>
    )
  }

  render() {
    const { onMobile } = this.props
    const { disabled, index, isLoading, selectedExpansions, sentences } = this.state
    const completed = sentences.length > 1 && index >= sentences.length

    if (isLoading) {
      return (
        <div style={{ position: 'fixed', right: 'calc(50vw - 22px)', top: 'calc(50vh - 22px)' }}>
          <CircularProgress />
        </div>
      )
    }

    return (
      <div>
        {completed
          ? <div
              style={{
                color: '#232f3e',
                fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
                fontSize: 28,
                fontWeight: 100,
                textAlign: 'center',
                margin: '80px 20px',
              }}
            >
              Congrats, you're all done!
              <div style={{ margin: 40 }}>
                =)
              </div>
            </div>
          : this.renderSentence()
        }
        <div style={ onMobile ? { position: 'absolute', bottom: 0, right: 0, margin: 10 } : { float: 'right' }}>
          <Button
            disabled={!disabled && selectedExpansions.length === 0}
            variant="contained"
            color="primary"
            onClick={this.handleNext}
          >
            Next
          </Button>
        </div>
        <div style={ onMobile ? { position: 'absolute', bottom: 0, left: 0, margin: 10 } : { float: 'left' }}>
          <Button
            disabled={index === 0}
            variant="contained"
            color="primary"
            onClick={this.handlePrev}
          >
            Prev
          </Button>
        </div>
      </div>
    )
  }
}
