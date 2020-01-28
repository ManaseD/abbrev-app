import React, { Component } from 'react'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import join from 'lodash/join'
import map from 'lodash/map'
import slice from 'lodash/slice'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import ClearIcon from '@material-ui/icons/Clear'
import NoneIcon from '@material-ui/icons/IndeterminateCheckBoxTwoTone'
import FilledIcon from '@material-ui/icons/CheckBox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import OutlineIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import TextField from '@material-ui/core/TextField'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import app from 'ABB/feathers-client.js'
import responsive from 'ABB/components/responsive.jsx'


@responsive
export default class Labeler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0,
      expansionId: "",
      other: null,
      sentences: [],
      responses: []
    }
  }

  handleCheckBox = (label, checked) => checked
    ? this.setState({ other: label, expansionId: "" })
    : this.setState({ other: null })

  getResponse = (sentence_id) => find(this.state.responses, r => r.sentence_id === sentence_id)

  saveResponse = () => {
    const { index, expansionId, other, sentences, responses } = this.state

    const sentence = sentences[index]
    const sentence_id = get(sentence, 'id')
    const abbrev_id = get(sentence, 'abbrev_id')
    const response = this.getResponse(sentence_id)
    const expansion_id = expansionId === "" ? null : expansionId
    const other_text = other

    // Check if we already have a response for this sentence
    if (response) {
      // If we have a response and we've changed the answer, then we need patch it
      if (response.expansion_id !== expansion_id || response.other_text !== other) {
        return app.service('responses').patch(response.id, { expansion_id, other_text })
          .then(result => {
            const newResponses = map(responses, (r) => r.id === result.id ? result : r )

            this.setState({ responses: newResponses })
          })
      }

      // Otherwise everything is the same and we can proceed
      return
    }

    // If we don't have an existing response, then we need to create a new one
    return app.service('responses').create({ abbrev_id, expansion_id, other_text, sentence_id })
      .then(result => this.setState( prevState => ({
        ...prevState,
        responses: [ ...prevState.responses, result ]
      })))
  }

  handleSelect = event => this.setState({ expansionId: event.target.value, other: null })

  handleNext = () => {
    const { index, sentences } = this.state
    // First save any changes
    this.saveResponse()

    // If we were on the last response then we can complete here
    if (index + 1 === sentences.length){
      return this.onClose()
    }

    const nextIndex = Math.min(index + 1, sentences.length)
    const nextSentence = sentences[nextIndex]
    const nextResponse = this.getResponse(nextSentence.id)
    const other = get(nextResponse, 'other_text') ? nextResponse.other_text : null
    const expansionId = get(nextResponse, 'expansion_id') ? nextResponse.expansion_id : ""

    this.setState({ index: nextIndex, expansionId, other })
  }

  handlePrev = () => {
    const { index, sentences } = this.state

    // Decrement index to min 0
    const newIndex = Math.max(index - 1, 0)
    const prevSentence = sentences[newIndex]
    const prevResponse = this.getResponse(prevSentence.id)
    const other = get(prevResponse, 'other_text') ? prevResponse.other_text : null
    const expansionId = get(prevResponse, 'expansion_id') ? prevResponse.expansion_id : ""

    this.setState({ index: newIndex, expansionId, other })
  }

  onClose = () => {
    const { handleClose } = this.props

    this.setState({ index: 0, expansionId: "", other: null, sentences: [], responses: [] })

    handleClose()
  }

  componentDidMount() {
    // Set the initial state
    const { abbreviation } = this.props
    const sentences = get(abbreviation, 'sentences')
    const responses = get(abbreviation, 'responses')
    const numResponses = responses.length

    if (numResponses === 0) {
      // if no responses we start from the beginning
      this.setState({ responses, sentences, index: 0 })

    } else if (numResponses === sentences.length) {
      // if we have all the responses show the last one
      const index = numResponses - 1
      const lastResponse = find(responses, r => r.sentence_id === sentences[index].id)
      const other = get(lastResponse, 'other_text') ? lastResponse.other_text : null
      const expansionId = get(lastResponse, 'expansion_id') ? lastResponse.expansion_id : ""

      this.setState({ responses, expansionId, other, sentences, index: numResponses - 1 })

    } else {
      // if we are part way through, go to the next available sentence
      this.setState({ responses, sentences, index: numResponses })
    }
  }

  renderSentence() {
    const { abbreviation } = this.props
    const { index, expansionId, other } = this.state
    const abbreviated_text = abbreviation.abbreviated_text
    const expansions = get(abbreviation, 'expansions')
    const sentences = get(abbreviation, 'sentences')
    const sentenceText = get(sentences[index], 'text')

    // Split the sentence into words
    const words = sentenceText.split(/(\s+)/).filter( (word) => word.trim().length > 0 )
    // Grab the index of the abbreviation
    const abbrIndex = findIndex(words, word => word.includes(`<${abbreviated_text}>`))
    // Split the sentence into words preceding and following the abbreviation
    let start = slice(words, 0, abbrIndex)
    let end = slice(words, abbrIndex + 1, words.length)

    // Determine if we have more than 5 words that we can bold either side of the abbreviation
    // If not we will just bold everything before and after
    let boldStart = start
    if (start.length > 5) {
      boldStart = slice(start, start.length - 5, start.length)
      start = slice(start, 0, start.length - 5)
    } else {
      start = []
    }

    let boldEnd = end
    if (end.length > 5) {
      boldEnd = slice(end, 0, 5)
      end = slice(end, 5, end.length)
    } else {
      end = []
    }

    const startText = join(start, " ")
    const startBoldText = join(boldStart, " ")
    const abbreviationText = words[abbrIndex].replace(`<${abbreviated_text}>`, `${abbreviated_text}`)
    const endBoldText = join(boldEnd, " ")
    const endText = join(end, " ")

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 22,
      fontWeight: 500,
    }

    const text =
      <em style={{ ...textStyle, color: '#232f3ec7', fontWeight: 300, fontSize: 16 }}>
        {startText}
        &nbsp;
        <strong style={{ color: '#232f3e', fontWeight: 700 }}>
          {startBoldText}
        </strong>
        &nbsp;
        <mark style={{ color: '#232f3e', fontWeight: 700 }}>
          {abbreviationText}
        </mark>
        &nbsp;
        <strong style={{ color: '#232f3e', fontWeight: 700 }}>
          {endBoldText}
        </strong>
        &nbsp;
        {endText}
      </em>

    return (
      <div style={{ marginTop: 15, marginBottom: 40 }}>
        {text}
        <div style={{ marginTop: 30, marginBottom: 80 }}>
          <TextField
            fullWidth
            label="Select an expansion"
            onChange={this.handleSelect}
            select
            SelectProps={{ native: true }}
            value={expansionId}
            variant="filled"
          >
            <option value="" />
            {map(expansions, expansion => <option value={expansion.id}>{expansion.expanded_text}</option>)}
          </TextField>
          <FormGroup style={{ marginTop: 8 }}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<OutlineIcon />}
                  checked={other === 'none'}
                  checkedIcon={<NoneIcon />}
                  onChange={(event) => this.handleCheckBox('none', event.target.checked)}
                />
              }
              label={
                <div style={{ color: other === 'none' ? '#f50057' : '#757575' }}>
                  None of the above
                </div>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  icon={<OutlineIcon />}
                  checked={other === 'ambiguous'}
                  checkedIcon={<FilledIcon color="primary" />}
                  onChange={(event) => this.handleCheckBox('ambiguous', event.target.checked)}
                />
              }
              label={
                <div style={{ color: other === 'ambiguous' ? '#1e88e5' : '#757575' }}>
                  Ambiguous
                </div>
              }
            />
          </FormGroup>
        </div>
      </div>
    )
  }

  render() {
    const { abbreviation, onMobile, open } = this.props
    const abbreviated_text = get(abbreviation, 'abbreviated_text')

    const { index, expansionId, other, sentences } = this.state

    const textStyle = {
      fontFamily: 'Roboto, Arial, Helvetica, sans-serif',
      fontSize: 13,
      fontWeight: 500,
    }

    return (
      <Dialog fullScreen={onMobile} open={open} onClose={this.onClose} fullWidth maxWidth="sm">
        <DialogTitle style={{ position: 'relative', ...onMobile && { padding: '8px 12px' } }}>
          <IconButton style={{ position: 'absolute', right: 0, top: 0 }}>
            <ClearIcon onClick={this.onClose} />
          </IconButton>
          <span style={{ fontWeight: 700 }}>
            {`Abbreviation: ${abbreviated_text}`}
          </span>
        </DialogTitle>
        <DialogContent style={{ ...onMobile && { padding: '8px 12px' } }}>
          <DialogContentText style={{ ...textStyle, color: '#232f3ec7' }}>
            What does the abbreviation refer to in this context?
          </DialogContentText>
          {abbreviation ? this.renderSentence() : null}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={index === 0}
            variant="contained"
            color="primary"
            onClick={this.handlePrev}
          >
            Prev
          </Button>
          <Button
            disabled={expansionId === "" && other === null}
            variant="contained"
            color="primary"
            onClick={this.handleNext}
          >
            {index + 1 === sentences.length ? 'Complete' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
