import * as React from 'react'
import { Link } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { ListTableTemplate, IconPlusCircle, EmptyContent } from 'gocommerce.styleguide'
import { PageHeader, Layout, ButtonWithIcon } from 'vtex.styleguide'
import { TemplatePage } from 'gocommerce.gc-utils'
import { useRuntime } from 'vtex.render-runtime'

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
}

const ListPage = React.memo(({
  intl,
  pageUrl,
  carriersList,
  isLoadingData,
  refetchCarriersList,
  query,
}: ListPageProps) => {
  const { navigate, route: { blockId } } = useRuntime()
  const currentAppId = blockId.split(':')[0]

  const refetchCarriers = (
    interval: CollectionIntervalInput | null = null,
    sort: CollectionSortInput | null = null,
    search: string | null = null,
    filters: [CollectionFilterInput] | null = null,
  ): void => {
    refetchCarriersList({
      variables: { interval, sort, search, filters },
      updateQuery: (e, b) => {
        return b.fetchMoreResult
      }
    })
  }

  const renderListTable = (isLoadingPage: boolean) => {
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
      <>
        <ListTableTemplate.Filter
          isLoading={false}
          placeholder={intl.formatMessage({
            id: 'admin/shipping.search-by-name-or-shipping-zones'
          })}
        />
        <div className="flex flex-column w-100 mt4">
          <div className="w-100 center mv2">
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
      </>
    )
  }

  const handleBack = () => {
    return navigate({
      page: 'admin.app.apps.setup',
      params: { appId: currentAppId },
    })
  }

  const isLoadingPage: boolean = !carriersList
  return (
    <ListTableTemplate
      pageUrl={pageUrl}
      query={query}
      navigate={navigate}
      refecthData={refetchCarriers}
      forceRefetchData
    >
      <TemplatePage title={intl.formatMessage({ id: 'admin/shipping.shipping-page-title' })}>
        <Layout
          pageHeader={
            <PageHeader
              title={intl.formatMessage({ id: 'admin/shipping.custom-shipping' })}
              linkLabel={intl.formatMessage({ id: 'admin/shipping.settings' })}
              onLinkClick={handleBack}
            >
              <Link className="link" page="admin.logistics.carrierCreate" params={{
                "action": "create",
                "type": "default"
              }}>
                <div className="dn db-ns">
                  <ButtonWithIcon
                    size="large"
                    variation="primary"
                    icon={
                      <IconPlusCircle />
                    }
                  >
                    <FormattedMessage id="admin/shipping.add" />
                  </ButtonWithIcon>
                </div>
              </Link>
            </PageHeader>
          }
        >
          {renderListTable(isLoadingPage)}
        </Layout>
      </TemplatePage>
    </ListTableTemplate>
  )
})

export default ListPage
