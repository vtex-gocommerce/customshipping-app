import * as React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { IconDownload, IconUpload, IconTrashAlt, Notify } from 'gocommerce.styleguide'

interface FileUploadDragDropProps {
  title: string
  idContainer: string
  exampleDownloadLink: string
  exampleDownloadText: string
  disabledUpload: boolean
  dragDropIcon: any
  dragDropTitle: string
  dragDropText: string
  fileInputAccept: string
  onChangeFile: (file: File | null) => {}
  intl: any
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
    idFileInput: 0,
  }

  containerRef: any = React.createRef<HTMLDivElement>()
  fileUploadRef: any = React.createRef<HTMLInputElement>()

  onDragEnter = evt => {
    evt.preventDefault()
    if (!this.props.disabledUpload) {
      this.setState({ lastTarget: evt.target, showOverlay: true })
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
      this.fileUploadRef.current.files = evt.dataTransfer.files
      this.handleChangeFile()
    } else {
      Notify.show(this.props.intl.formatMessage({ id: 'admin/shipping.upload-error' }), {
        type: 'danger',
        position: 'top-right',
      })
    }

    this.setState({ showOverlay: false })
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
      fileInputAccept,
    } = this.props

    const { showOverlay, file, idFileInput } = this.state
    const { disabledUpload } = this.props

    return (
      <div
        draggable
        ref={this.containerRef}
        id={idContainer ? idContainer : 'fileUploadDragDrop'}
        className={`w-100 ba br2 b--base-4 flex flex-column mt8 bg-base-1 ph7 pv5 c-on-base ${showOverlay &&
  'bg-base-4'}`}
      >
        <div className="flex flex-wrap flex-nowrap-ns justify-between items-center">
          <h2 className="ma0 f4 fw6 mb2 mb0-ns">{title}</h2>
          <div className="w-100 w-auto-ns">
            <a
              onClick={this.handleOpenFileExploer}
              className={`db dib-ns mv2 mv0-ns link f6 ${disabledUpload ? 'c-on-base-3' : 'pointer c-on-base-2 hover-c-primary underline-hover'}`}
            >
              <IconUpload /> <FormattedMessage id="admin/shipping.upload" />
            </a>
            {exampleDownloadLink && (
              <a
                href={exampleDownloadLink}
                className="db dib-ns  ml4-ns f6 link pointer c-on-base-2 hover-c-primary underline-hover"
              >
                <IconDownload /> {exampleDownloadText ? exampleDownloadText : 'Exemple download'}
              </a>
            )}
          </div>
        </div>
        <div
          className={`mt6 flex flex-column justify-center items-center ${!disabledUpload ? 'pointer' : ''}`}
          onClick={this.handleOpenFileExploer}
        >
          <div>
            <div className="pv9 tc">
              {dragDropIcon}
              {!file && (
                <>
                  <p className=" ma0 c-on-base-2 fw6 f3">{dragDropTitle}</p>
                  <p className="ma-0 c-on-base-2 f7">{dragDropText}</p>
                </>
              )}
              {file && (
                <>
                  <p className=" ma0 c-on-base-2 fw6 f3">{file.name}</p>
                  <p className="ma-0 c-on-base-2 f7" onClick={this.handleDeleteFile}>
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

export default injectIntl(FileUploadDragDrop)
