import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconTrashAlt, Modal, IconSpinner, Notify } from 'gocommerce.styleguide';
import { Button } from 'vtex.styleguide';
import { injectIntl } from 'react-intl'
import { GcMutation } from 'gocommerce.gc-utils'
import deleteCarrier from './../graphql/deleteCarrier.gql'
import { Intl } from './../../../utils/types'

interface ButtonDeleteCarrierProps {
  item: any
  refetch: Function
  intl: Intl
}

interface ButtonDeleteCarrierState {
  isModalOpen: boolean
}

class ButtonDeleteCarrier extends React.Component<ButtonDeleteCarrierProps, ButtonDeleteCarrierState> {
  state: ButtonDeleteCarrierState = {
    isModalOpen: false
  }

  handleToggleModal = () => {
    this.setState(prevState => ({ isModalOpen: !prevState.isModalOpen }))
  }

  handleClick = e => {
    e && e.preventDefault()
    e && e.stopPropagation()

    this.handleToggleModal()
    return false
  }

  handleClickYes = deleteCarrier => {
    deleteCarrier({ variables: { id: this.props.item.id } })
      .then(() => {
        Notify.show(this.props.intl.formatMessage({ id: 'admin/shipping.msg-delete-success' }), {
          position: 'top-right',
          type: 'success'
        })
        this.props.refetch({})
        this.handleToggleModal()
      })
      .catch(() => {
        this.handleToggleModal()
      })
  }

  render() {
    const isSendLoading = false
    const send = _ => {}

    const { isModalOpen } = this.state
    return <>
      <GcMutation mutation={deleteCarrier}>
        {(deleteCarrier, dataDeleteCarrier) => (
          <>
            <span onClick={this.handleClick}>
              <IconTrashAlt className="c-on-base-2 hover-c-danger" />
            </span>

            <div
              onClick={e => {
                e && e.preventDefault()
                e && e.stopPropagation()
              }}
            >
              <Modal open={isModalOpen} onClose={this.handleClick} showCloseIcon={true} centered={false}>
                <div>
                  <p className="g-ma0 g-f4 fw6">
                    <FormattedMessage id="admin/shipping.modal-delete-carrier-title" />
                  </p>
                  <p className="g-mv5 g-f2 lh-copy">
                    <FormattedMessage id="admin/shipping.modal-delete-carrier-description" />
                  </p>
                  <div className="flex flex-none-ns justify-between justify-end-ns g-mt8 g-nh3">
                    <div className="pointer g-mh3"><Button
                        size="large"
                        disabled={dataDeleteCarrier.loading}
                        variation="secondary"
                        onClick={this.handleClick}>
                        <FormattedMessage id="admin/shipping.modal-delete-carrier-no" />
                      </Button></div>

                    <div className="pointer g-mh3"><Button
                        size="large"
                        variation="danger"
                        onClick={() => {
                          this.handleClickYes(deleteCarrier)
                        }}
                        isDisabled={false}>
                        <FormattedMessage id="admin/shipping.modal-delete-carrier-yes" />{' '}
                        {dataDeleteCarrier.loading ? <IconSpinner animate /> : null}
                      </Button></div>
                  </div>
                </div>
              </Modal>
            </div>
          </>
        )}
      </GcMutation>
    </>;
  }
}

export default injectIntl(ButtonDeleteCarrier)
