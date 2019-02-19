import * as React from 'react'
import { injectIntl } from 'react-intl'
import ListCarriers from './ListCarriers'
import { RenderContextConsumer } from 'render'
import { GcQuery, Context } from 'gocommerce.gc-utils'
import getCarriers from './graphql/carriers.gql'
import { Intl } from './../../utils/types'

interface IndexPageProps {
  intl: Intl
  params: any
  query: any
}

interface IndexPageState {}

class IndexPageLogistics extends React.Component<IndexPageProps, IndexPageState> {
  render() {
    return (
      <RenderContextConsumer>
        {context => {
          const currentPath = context.route.path

          return (
            <Context.AccountContext.Consumer>
              {({ accountData }) => {
                return (
                  <GcQuery
                    ssr={false}
                    notifyOnNetworkStatusChange={true}
                    fetchPolicy="network-only"
                    errorPolicy="all"
                    query={getCarriers}
                  >
                    {({ data, loading, fetchMore }) => {
                      return (
                        <ListCarriers
                          intl={this.props.intl}
                          pageUrl={currentPath.substr(1)}
                          account={accountData}
                          carriersList={data.carriers}
                          refetchCarriersList={fetchMore}
                          isLoadingData={loading}
                          query={this.props.query}
                        />
                      )
                    }}
                  </GcQuery>
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
