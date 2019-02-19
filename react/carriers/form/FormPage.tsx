import * as React from 'react'
import { WithNavigate, Form } from 'gocommerce.gc-utils'
import { FormattedMessage } from 'react-intl'
import { Helmet, Link } from 'render'
import shortid from 'shortid'
import { TemplatePage } from 'gocommerce.gc-utils'
import {
  Button,
  IconUpload,
  IconCheckCircle,
  IconTimesCircle,
  IconSpinner,
  IconSyncAlt,
  Alert,
  CurrencyInput,
  Notify
} from 'gocommerce.styleguide'

import PlaceHolderContainerCard from './../../components/placeHolderContainerCard'
import FileUploadFragDrop from './components/FileUploadDragDrop'

interface FormPageProps {
  account: any
  action: 'create' | 'edit'
  carrier: any
  isLoadingData: boolean
  intl?: any
  errorSaveCarrier: [any]
  isLoadingSaveCarrier: boolean
  saveCarrier(options: any)
  navigate?: Function
}

interface FormPageState {
  activeTab: string
  tabsConfig: any
  file: File | null
  minimumValueAceptable: number | null
}

@WithNavigate.HOC()
class FormPage extends React.PureComponent<FormPageProps, FormPageState> {
  state: FormPageState = {
    minimumValueAceptable: null,
    file: null,
    activeTab: 'default',
    tabsConfig: [
      { label: <FormattedMessage id="admin.shipping.general" />, id: 'default', query: {} },
      { label: <FormattedMessage id="admin.shipping.shipping-zones" />, id: 'shippingZone', query: {} }
    ]
  }

  handleChangeMinimumValue = event => {
    this.setState({ minimumValueAceptable: event.target.value })
  }

  handleSubmitForm = values => {
    values.id = values.id || shortid.generate()
    values.maxDimension = {}

    values = {
      ...values,
      id: values.id || shortid.generate(),
      SlaType: values.SlaType || values.name,
      minimumValueAceptable: this.state.minimumValueAceptable || 0,
      additionalTime: values.additionalTime || '00:00:00',
      factorCubicWeight: 0,
      minimunCubicWeight: 0,
      maxDimension: { weight: 0, height: 0, width: 0, length: 0, maxSumDimension: 0 }
    }

    this.props
      .saveCarrier({
        variables: {
          data: JSON.stringify(values),
          type: 'carriers',
          file: this.state.file
        }
      })
      .then(response => {
        if (response.data.saveCarrier.status === 'success' && response.data.saveCarrier.userErrors.length === 0) {
          Notify.show(this.props.intl.formatMessage({ id: 'admin.shipping.msg-save-success' }), {
            position: 'top-right',
            type: 'success'
          })
          this.props.navigate({ to: '/admin/logistics/custom' })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleChangeFile = file => {
    this.setState({ file: file })
  }

  render() {
    const { isLoadingData, errorSaveCarrier, action, account } = this.props
    const carrier = (this.props.carrier && this.props.carrier.data && this.props.carrier.data.carrier) || {}
    const breadcrumbConfig = [
      { title: <FormattedMessage id="admin.shipping.custom-shipping" />, to: '/admin/logistics/custom' },
      {
        title:
          action === 'create' ? this.props.intl.formatMessage({ id: 'admin.shipping.add' }) : carrier.name! || ' - '
      }
    ]

    const additionalTimeOptions = [
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.no-additional-time' }), value: '00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.1-more-day' }), value: '1.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.2-more-days' }), value: '2.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.3-more-days' }), value: '3.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.4-more-days' }), value: '4.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.5-more-days' }), value: '5.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.6-more-days' }), value: '6.00:00:00' },
      { label: this.props.intl.formatMessage({ id: 'admin.shipping.7-more-days' }), value: '7.00:00:00' }
    ]

    const fileUploadFragDropConfig = {
      default: {
        disabledUpload: false,
        dragDropTitle: this.props.intl.formatMessage({ id: 'admin.shipping.drag-& drop-spreadsheet-here' }),
        dragDropText: this.props.intl.formatMessage({
          id: 'admin.shipping.maximun-size: 10mb-format: .xls-and-.zip'
        }),
        dragDropIcon: <IconUpload className="c-on-base-2 g-mb2" height="48px" width="48px" />
      },
      ready: {
        disabledUpload: false,
        dragDropTitle: this.props.intl.formatMessage({ id: 'admin.shipping.success' }),
        dragDropText: this.props.intl.formatMessage({
          id: 'admin.shipping.the-spreadsheet-has-been-successfully-processed'
        }),
        dragDropIcon: <IconCheckCircle className="c-on-base-2 g-mb2" height="48px" width="48px" />
      },
      pendingProcess: {
        disabledUpload: true,
        dragDropTitle: this.props.intl.formatMessage({ id: 'admin.shipping.processing' }),
        dragDropText: this.props.intl.formatMessage({
          id: 'admin.shipping.spreadsheet-is-being-processed. please-wait-a-moment'
        }),
        dragDropIcon: <IconSyncAlt className="c-on-base-2 g-mb2" height="48px" width="48px" />
      },
      processing: {
        disabledUpload: true,
        dragDropTitle: this.props.intl.formatMessage({ id: 'admin.shipping.processing' }),
        dragDropText: this.props.intl.formatMessage({
          id: 'admin.shipping.spreadsheet-is-being-processed. please-wait-a-moment'
        }),
        dragDropIcon: <IconSyncAlt className="c-on-base-2 g-mb2" height="48px" width="48px" />
      },
      error: {
        disabledUpload: false,
        dragDropTitle: this.props.intl.formatMessage({ id: 'admin.shipping.failed' }),
        dragDropText: this.props.intl.formatMessage({
          id: 'admin.shipping.there-was-an-error-while-processing-the-spreadsheet. please-try-again'
        }),
        dragDropIcon: <IconTimesCircle className="c-on-base-2 g-mb2" height="48px" width="48px" />
      }
    }

    const status = !carrier.freightTableValueError ? carrier.freightTableProcessStatus || 'default' : 'error'

    return (
      <TemplatePage>
        <Helmet title={this.props.intl.formatMessage({ id: 'admin.shipping.shipping-page-title' })} />
        <TemplatePage.Header
          breadcrumbConfig={breadcrumbConfig}
          buttons={
            <div className="dn db-ns">
              <Link className="link g-mr4" to="/admin/logistics">
                <Button style="secondary">
                  <FormattedMessage id="admin.shipping.cancel" />
                </Button>
              </Link>

              <Form.SubmitButton formId="FormId" disabled={this.props.isLoadingSaveCarrier}>
                <FormattedMessage id="admin.shipping.save" />{' '}
                {this.props.isLoadingSaveCarrier && <IconSpinner animate />}
              </Form.SubmitButton>
            </div>
          }
        />

        <TemplatePage.Content type="small" menuScroll={this.state.tabsConfig}>
          {isLoadingData ? (
            <PlaceHolderContainerCard isPlaceholderActive={true}>{() => <div />}</PlaceHolderContainerCard>
          ) : (
            <div>
              {errorSaveCarrier && errorSaveCarrier.length > 0 && (
                <div className="g-mb10">
                  <Alert type="error">
                    {errorSaveCarrier.reduce((prev, error) => {
                      return (
                        prev +
                        ' ' +
                        this.props.intl.formatMessage({
                          id: 'admin.shipping.error-' + error.message.toLowerCase().replace(/ /g, '-')
                        })
                      )
                    }, '')}
                    .
                  </Alert>
                </div>
              )}
              <div id="default" className="w-100 ba br2 b--base-4 flex flex-column bg-base-1 g-ph7 g-pv5 c-on-base">
                <h2 className="g-ma0 g-f4 fw6">
                  <FormattedMessage id="admin.shipping.general" />
                </h2>

                <div className="g-mt6 ">
                  <Form id="FormId" onSubmit={this.handleSubmitForm}>
                    {stateData => (
                      <>
                        <div className="g-f2 flex items-center c-on-base-2 g-mt3">
                          <Form.Toggle
                            name="isActive"
                            value="true"
                            className="dib g-mr1"
                            checked={carrier.isActive}
                            label={this.props.intl.formatMessage({
                              id: 'admin.shipping.active?'
                            })}
                          />
                        </div>
                        <p className="db c-on-base-2 g-mb1 g-f2 lh-copy">
                          <FormattedMessage id="admin.shipping.name" />
                        </p>
                        <div>
                          <Form.Input type="hidden" className="w-100" name="id" value={carrier.id} />
                          <Form.Input className="w-100" name="name" value={carrier.name} required />
                        </div>

                        <p className="db c-on-base-2 g-mb1 g-f2 lh-copy">
                          <FormattedMessage id="admin.shipping.sla-type" />
                        </p>
                        <div>
                          <Form.Input className="w-100" name="SlaType" value={carrier.slaType} required />
                        </div>

                        <div className="flex flex-wrap flex-nowrap-ns justify-between w-100">
                          <div className="g-mr4-ns w-100 w-50-ns">
                            <p className="db c-on-base-2 g-mb1 g-f2 lh-copy">
                              <FormattedMessage id="admin.shipping.minimum-value" />
                            </p>
                            <div>
                              <CurrencyInput
                                className="w-100"
                                name="minValue"
                                currencySpec={account.currencySpec}
                                showCurrency={true}
                                onChange={this.handleChangeMinimumValue}
                                value={carrier.minimumValueAceptable}
                              />
                            </div>
                          </div>

                          <div className="w-100 w-50-ns">
                            <p className="db c-on-base-2 g-mb1 g-f2 lh-copy">
                              <FormattedMessage id="admin.shipping.additional-time" />
                            </p>
                            <div>
                              <Form.Select
                                defaultValue="00:00:00"
                                className="w-100"
                                elementClassName="w-100 bg-danger"
                                name="additionalTime"
                                value={carrier.additionalTime}
                                list={additionalTimeOptions}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="g-f2 flex items-center c-on-base-2 g-mt4">
                          <Form.Toggle
                            name="deliveryOnWeekends"
                            value="true"
                            className="dib g-mr1"
                            checked={carrier.deliveryOnWeekends}
                            label={this.props.intl.formatMessage({
                              id: 'admin.shipping.delivery-on-weekends?'
                            })}
                          />
                        </div>
                      </>
                    )}
                  </Form>
                </div>
              </div>

              <FileUploadFragDrop
                disabledUpload={fileUploadFragDropConfig[status].disabledUpload}
                title={this.props.intl.formatMessage({ id: 'admin.shipping.shipping-zones' })}
                idContainer="shippingZone"
                exampleDownloadLink="https://s3.amazonaws.com/gc-ui/assets/logistics/sample/example-carrier.xls"
                exampleDownloadText={this.props.intl.formatMessage({ id: 'admin.shipping.spreadsheet-template' })}
                dragDropTitle={fileUploadFragDropConfig[status].dragDropTitle}
                dragDropText={fileUploadFragDropConfig[status].dragDropText}
                fileInputAccept=".xls,.zip"
                dragDropIcon={fileUploadFragDropConfig[status].dragDropIcon}
                onChangeFile={this.handleChangeFile}
                showCorreiosLink={this.props.account.country === 'BRA'}
              />

              <div className="flex justify-between g-mt10">
                <Link className="dn dib-ns link" to="/admin/logistics">
                  <Button style="secondary">
                    <FormattedMessage id="admin.shipping.cancel" />
                  </Button>
                </Link>
                <Form.SubmitButton
                  id="carrierSubmit"
                  formId="FormId"
                  className="fixed static-ns w-100 w-auto-ns bottom-0 left-0 z-999"
                  disabled={this.props.isLoadingSaveCarrier}
                >
                  <FormattedMessage id="admin.shipping.save" />{' '}
                  {this.props.isLoadingSaveCarrier && <IconSpinner animate />}
                </Form.SubmitButton>
              </div>
            </div>
          )}
        </TemplatePage.Content>
      </TemplatePage>
    )
  }
}

export default FormPage
