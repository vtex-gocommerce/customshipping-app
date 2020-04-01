import * as React from 'react'
import { PlaceholderContainer } from 'gocommerce.styleguide'

interface PlaceHolderContainerCardProps {
  children: any
  isPlaceholderActive: boolean
}

const PlaceHolderContainerCard: React.SFC<PlaceHolderContainerCardProps> = props => {
  return (
    <div className="w-100 ba br2 b--base-4 flex flex-column bg-base-1 ph7 pt5 c-on-base">
      <PlaceholderContainer
        isPlaceholderActive={props.isPlaceholderActive}
        classNameArray={[
          ["h-small w-30 mb7"],
          ["h1 w-30 mb5"],
          ["h-regular w-80 mb5"],
          ["h1 w-30 mb5"],
          ["h-regular w-80 mb5"],
          ["h1 w-30 mb5"],
          ["h-regular w-80 mb5"]
        ]}
      >
        {() => props.children()}
      </PlaceholderContainer>
    </div>
  )
}

export default PlaceHolderContainerCard
