import * as React from 'react'
import { Link } from 'render'
import { FormattedMessage } from 'react-intl'
import { Button, ListTableTemplate, IconPlusCircle } from 'gocommerce.styleguide'
import { TemplatePage, WithNavigate } from 'gocommerce.gc-utils'

import { Intl, CollectionIntervalInput, CollectionSortInput, CollectionFilterInput } from './../../utils/types'
import { tableConfig } from './config/tableConfig'

interface ListPageProps {
  intl: Intl
  pageUrl: string
  account: any
  carriersList: any
  isLoadingData: boolean
  refetchCarriersList: Function
  query: any
  navigate?: Function
}
interface ListPageState {
  toQueryStringConfig: any[]
  search: string | null
}

@WithNavigate.HOC()
class ListPage extends React.Component<ListPageProps, ListPageState> {
  state: ListPageState = {
    search: null,
    toQueryStringConfig: [{ field: 'activeTab' }, { field: 'searchText', nameInUrl: 'q' }]
  }

  refetchCarriers = (
    interval: CollectionIntervalInput | null = null,
    sort: CollectionSortInput | null = null,
    search: string | null = null,
    filters: [CollectionFilterInput] | null = null,
  ): void => {
    this.props.refetchCarriersList({
      variables: { interval, sort, search, filters },
      updateQuery: (e, b) => {
        return b.fetchMoreResult
      }
    })
  }

  handleSearch = (value: { searchValue: string; optionValue: string }) => {}

  render() {
    const { isLoadingData, carriersList, account, query, navigate, pageUrl } = this.props
    const isLoadingPage: boolean = !carriersList
    const breadcrumbConfig = [
      {
        title: <FormattedMessage id="admin.shipping.shipping" />,
        to: '/admin/logistics'
      },

      {
        title: <FormattedMessage id={'admin.shipping.custom-shipping'} />
      }
    ]

    const tabsConfigs = [
      {
        id: 'default',
        label: <FormattedMessage id="admin.shipping.all-shippings" />
      }
    ]

    return (
      <ListTableTemplate
        pageUrl={pageUrl}
        query={query}
        navigate={navigate}
        refecthData={this.refetchCarriers}
        forceRefetchData
      >
        <TemplatePage title={this.props.intl.formatMessage({ id: 'admin.shipping.shipping-page-title' })}>
          <TemplatePage.Header
            breadcrumbConfig={breadcrumbConfig}
            tabsConfig={tabsConfigs}
            activeTab={'default'}
            handleChangeTab={() => {}}
            buttons={
              <Link className="link" to="/admin/logistics/carriers/create">
                <div className="dn db-ns">
                  <Button style="primary">
                    <FormattedMessage id="admin.shipping.add" />
                  </Button>
                </div>
                <IconPlusCircle className="db dn-ns c-primary" />
              </Link>
            }
          />

          <TemplatePage.Content>
            <ListTableTemplate.Filter
              isLoading={false}
              placeholder={this.props.intl.formatMessage({
                id: 'admin.shipping.search-by-name-or-shipping-zones'
              })}
            />
            <div className="flex flex-column w-100 g-mt4">
              <div className="w-100 center g-mv2">
                <ListTableTemplate.Consumer>
                  {({ searchText }) => (
                    <ListTableTemplate.Table
                      tableConfig={tableConfig}
                      data={
                        !isLoadingPage
                          ? carriersList.nodes.filter(item => {
                              if (!searchText) return true
                              return item.name.toLowerCase().search(searchText.toLowerCase()) !== -1
                            })
                          : []
                      }
                      isLoading={isLoadingData || isLoadingPage}
                    />
                  )}
                </ListTableTemplate.Consumer>
              </div>
            </div>
          </TemplatePage.Content>
        </TemplatePage>
      </ListTableTemplate>
    )
  }
}

export default ListPage
