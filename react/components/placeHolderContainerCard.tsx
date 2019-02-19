import * as React from 'react'
import { PlaceholderContainer } from 'gocommerce.styleguide'

interface PlaceHolderContainerCardProps {
  children: any
  isPlaceholderActive: boolean
}

const PlaceHolderContainerCard: React.SFC<PlaceHolderContainerCardProps> = props => {
  return (
    <div className="w-100 ba br2 b--base-4 flex flex-column bg-base-1 g-ph7 g-pt5 c-on-base">
      <PlaceholderContainer
        isPlaceholderActive={props.isPlaceholderActive}
        classNameArray={[
          ['g-h8 w-30 g-mb7'],
          ['g-h4 w-30 g-mb5'],
          ['g-h10 w-80 g-mb5'],
          ['g-h4 w-30 g-mb5'],
          ['g-h10 w-80 g-mb5'],
          ['g-h4 w-30 g-mb5'],
          ['g-h10 w-80 g-mb5']
        ]}
      >
        {() => props.children()}
      </PlaceholderContainer>
    </div>
  )
}

export default PlaceHolderContainerCard
