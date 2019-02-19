import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconDownload, IconUpload, IconTrashAlt } from 'gocommerce.styleguide'

interface FileUploadDragDropProps {
  title: string
  idContainer: string
  exampleDownloadLink: string
  exampleDownloadText: string
  disabledUpload: boolean
  dragDropIcon: any
  showCorreiosLink: boolean
  dragDropTitle: string
  dragDropText: string
  fileInputAccept: string
  onChangeFile(file: File)
}

interface FileUploadDragDropState {
  showOverlay: boolean
  lastTarget: any
  file: File | null
  idFileInput: number
}

class FileUploadDragDrop extends React.Component<FileUploadDragDropProps, FileUploadDragDropState> {
  state: FileUploadDragDropState = {
    showOverlay: false,
    lastTarget: null,
    file: null,
    idFileInput: 0
  }

  containerRef: any = React.createRef<HTMLDivElement>()
  fileUploadRef: any = React.createRef<HTMLInputElement>()

  onDragEnter = evt => {
    evt.preventDefault()
    if (!this.props.disabledUpload) {
      this.setState({ lastTarget: evt.target })
      this.setState({ showOverlay: true })
    }
  }

  onDragOver = evt => {
    evt.preventDefault()
  }

  onDragLeave = evt => {
    evt.preventDefault()
    if (!this.props.disabledUpload && evt.target === this.state.lastTarget) {
      this.setState({ showOverlay: false })
    }
  }

  onDrop = evt => {
    evt.preventDefault()

    if (!this.props.disabledUpload && evt.dataTransfer.files[0].name.match(/(zip|xls)$/)) {
      const files = evt.dataTransfer.files
      this.fileUploadRef.current.files = evt.dataTransfer.files
      this.handleChangeFile()
      this.setState({ showOverlay: false })
    }
  }

  handleDeleteFile = e => {
    this.setState({ idFileInput: this.state.idFileInput + 1, file: null })
    this.props.onChangeFile(null)
    e.preventDefault()
    e.stopPropagation()
  }

  handleOpenFileExploer = () => {
    if (!this.props.disabledUpload) {
      this.fileUploadRef.current.click()
    }
  }

  handleChangeFile = () => {
    if (this.fileUploadRef.current.files.length > 0)
      this.setState({ file: this.fileUploadRef.current.files[0] }, () => {
        this.props.onChangeFile(this.state.file)
      })
  }

  componentDidMount() {
    this.containerRef.current.addEventListener('dragenter', this.onDragEnter)
    this.containerRef.current.addEventListener('dragleave', this.onDragLeave)
    this.containerRef.current.addEventListener('dragover', this.onDragOver)
    this.containerRef.current.addEventListener('drop', this.onDrop)
  }

  componentWillUnmount() {
    this.containerRef.current.removeEventListener('dragenter', this.onDragEnter)
    this.containerRef.current.removeEventListener('dragleave', this.onDragLeave)
    this.containerRef.current.removeEventListener('dragover', this.onDragOver)
    this.containerRef.current.removeEventListener('drop', this.onDrop)
  }

  render() {
    const {
      title,
      idContainer,
      exampleDownloadLink,
      exampleDownloadText,
      dragDropIcon,
      dragDropText,
      dragDropTitle,
      fileInputAccept
    } = this.props

    const { showOverlay, file, idFileInput } = this.state
    const { disabledUpload } = this.props

    return (
      <div
        draggable
        ref={this.containerRef}
        id={idContainer ? idContainer : 'fileUploadDragDrop'}
        className={`w-100 ba br2 b--base-4 flex flex-column g-mt10 bg-base-1 g-ph7 g-pv5 c-on-base ${showOverlay &&
          'bg-base-4'}`}
      >
        <div className="flex flex-wrap flex-nowrap-ns justify-between items-center">
          <h2 className="g-ma0 g-f4 fw6 g-mb2 g-mb0-ns">{title}</h2>
          <div className="w-100 w-auto-ns">
            {this.props.showCorreiosLink && (
              <a
                target="_blank"
                href="http://planilha.xpagencia.com.br/"
                className="db dib-ns g-ml4-ns g-f2 g-mr4 link pointer c-on-base-2 hover-c-primary underline-hover"
              >
                Gerar planilha Correios
              </a>
            )}
            <a
              onClick={this.handleOpenFileExploer}
              className={`db dib-ns g-mv2 g-mv0-ns link g-f2 ${
                disabledUpload ? 'c-on-base-3' : 'pointer c-on-base-2 hover-c-primary underline-hover'
              }`}
            >
              <IconUpload /> <FormattedMessage id="admin.shipping.upload" />
            </a>
            {exampleDownloadLink && (
              <a
                href={exampleDownloadLink}
                className="db dib-ns  g-ml4-ns g-f2 link pointer c-on-base-2 hover-c-primary underline-hover"
              >
                <IconDownload /> {exampleDownloadText ? exampleDownloadText : 'Exemple download'}
              </a>
            )}
          </div>
        </div>
        <div
          className={`g-mt6 flex flex-column justify-center items-center ${!disabledUpload ? 'pointer' : ''}`}
          onClick={this.handleOpenFileExploer}
        >
          <div>
            <div className="g-pv11 tc">
              {dragDropIcon}
              {!file && (
                <>
                  <p className=" g-ma0 c-on-base-2 fw6 g-f5">{dragDropTitle}</p>
                  <p className="g-ma-0 c-on-base-2 g-f1">{dragDropText}</p>
                </>
              )}
              {file && (
                <>
                  <p className=" g-ma0 c-on-base-2 fw6 g-f5">{file.name}</p>
                  <p className="g-ma-0 c-on-base-2 g-f1" onClick={this.handleDeleteFile}>
                    <IconTrashAlt className="hover-c-danger bg-animate" />
                  </p>
                </>
              )}
            </div>
          </div>
          <input
            key={`fileinput${idFileInput}`}
            className="dn"
            type="file"
            ref={this.fileUploadRef}
            onChange={this.handleChangeFile}
            accept={fileInputAccept}
          />
        </div>
      </div>
    )
  }
}

export default FileUploadDragDrop