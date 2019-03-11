import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { Status, IconInfo, Tooltip } from 'gocommerce.styleguide'
import ButtonDeleteCarrier from './../components/ButtonDeleteCarrier'
import { Link } from 'vtex.render-runtime'

export const tableConfig = {
  options: {
    cellWrapperProps: item => ({
      page: 'admin.logistics.carrierEdit',
      params: { carrier_id: item.id }
    })
  },
  columns: [
    {
      cellWrapper: Link,
      label: <FormattedMessage id="admin.shipping.name" />,
      id: 'name',
      size: 85,
      row: item => {
        return <span className="c-on-base">{item.name}</span>
      }
    },

    {
      cellWrapper: Link,
      label: <FormattedMessage id="admin.shipping.status" />,
      id: 'status',
      size: 15,
      row: item => {
        const colorsStatus = {
          ready: 'success',
          pendingProcess: 'warning',
          processing: 'warning',
          error: 'danger',
          disable: 'danger'
        }
        const statusfreightTable = !item.freightTableValueError ? item.freightTableProcessStatus : 'error'
        let status = item.isActive ? 'ready' : 'disable'
        status = statusfreightTable === 'ready' ? status : statusfreightTable

        return (
          <>
            <Status type={colorsStatus[status]} />
            <span className="g-ml2 g-f1 hide-child">
              <FormattedMessage id={`admin.shipping.status-${status}`} />
            </span>
          </>
        )
      }
    },
    {
      label: '',
      id: 'delete',
      row: (item, { refetch }) => {
        return (
          <span>
            <ButtonDeleteCarrier item={item} refetch={refetch} />
          </span>
        )
      }
    }
  ]
}
