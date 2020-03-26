import * as React from 'react'
import { Link } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { ListTableTemplate, IconPlusCircle, EmptyContent } from 'gocommerce.styleguide'
import { Button } from 'vtex.styleguide'
import { TemplatePage, WithNavigate } from 'gocommerce.gc-utils'

import { Intl, CollectionIntervalInput, CollectionSortInput, CollectionFilterInput } from './../../utils/types'
import { tableConfig } from './config/tableConfig'

import EmptyImage from '../../assets/images/empty-shipping-list.svg'

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

  handleSearch = (value: { searchValue: string, optionValue: string }) => {}

  renderListTable = (isLoadingPage: boolean) => {
    const { isLoadingData, carriersList, intl } = this.props

    if (!isLoadingPage && !carriersList.nodes.length) {
      return (
        <EmptyContent
          title={'You don\'t have any custom shipping yet'}
          description={'Set and manage your customized shipping rates'}
          image={EmptyImage}
        />
      )
    }

    return (
      <TemplatePage.Content>
        <ListTableTemplate.Filter
          isLoading={false}
          placeholder={intl.formatMessage({
            id: 'admin/shipping.search-by-name-or-shipping-zones'
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
    )
  }

  render() {
    const { carriersList, query, navigate, pageUrl, intl } = this.props
    const isLoadingPage: boolean = !carriersList
    const breadcrumbConfig = [
      {
        title: <FormattedMessage id="admin/shipping.shipping-page-title" />,
        page: 'admin.logistics.shippings'
      },

      {
        title: <FormattedMessage id={'admin/shipping.custom-shipping'} />
      }
    ]

    const tabsConfigs = [
      {
        id: 'default',
        label: <FormattedMessage id="admin/shipping.all-shippings" />
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
        <TemplatePage title={intl.formatMessage({ id: 'admin/shipping.shipping-page-title' })}>
          <TemplatePage.Header
            breadcrumbConfig={breadcrumbConfig}
            tabsConfig={tabsConfigs}
            activeTab={'default'}
            handleChangeTab={() => {}}
            buttons={
              <Link className="link" page="admin.logistics.carrierCreate" params={{
                "action": "create",
                "type": "default"
              }}>
                <div className="dn db-ns">
                  <Button size="large" variation="primary">
                    <FormattedMessage id="admin/shipping.add" />
                  </Button>
                </div>
                <IconPlusCircle className="db dn-ns c-primary" />
              </Link>
            }
          />

          {this.renderListTable(isLoadingPage)}
        </TemplatePage>
      </ListTableTemplate>
    )
  }
}

export default WithNavigate.HOC()(ListPage)
