import * as React from 'react'
import { injectIntl } from 'react-intl'
import { RenderContextConsumer } from 'render'
import FormPage from './FormPage'
import { GcQuery, GcMutation, Context } from 'gocommerce.gc-utils'
import saveCarrier from './graphql/saveCarrier.gql'
import getCarrierDetail from './graphql/getCarrierDetail.gql'

interface IndexPageProps {
  intl?: any
  params: any
  query: any
}

interface IndexPageState {}

class IndexPageLogistics extends React.Component<IndexPageProps, IndexPageState> {
  render() {
    return (
      <RenderContextConsumer>
        {context => {
          const currentPath = context.pages[context.page].path

          return (
            <Context.AccountContext.Consumer>
              {({ accountData }) => {
                return (
                  <GcMutation mutation={saveCarrier}>
                    {(saveCarrier, dataSaveCarrier) => (
                      <GcQuery
                        ssr={false}
                        notifyOnNetworkStatusChange={true}
                        fetchPolicy="network-only"
                        errorPolicy="all"
                        query={getCarrierDetail}
                        skip={!this.props.params.carrier_id}
                        variables={{ id: this.props.params.carrier_id }}
                      >
                        {data => {
                          return (
                            <FormPage
                              account={accountData}
                              action={!this.props.params.carrier_id ? 'create' : 'edit'}
                              carrier={data}
                              isLoadingData={!this.props.params.carrier_id ? false : data.loading}
                              saveCarrier={saveCarrier}
                              errorSaveCarrier={dataSaveCarrier.data && dataSaveCarrier.data.saveCarrier.userErrors}
                              isLoadingSaveCarrier={dataSaveCarrier.loading}
                              intl={this.props.intl}
                            />
                          )
                        }}
                      </GcQuery>
                    )}
                  </GcMutation>
                )
              }}
            </Context.AccountContext.Consumer>
          )
        }}
      </RenderContextConsumer>
    )
  }
}

export default injectIntl(IndexPageLogistics)
