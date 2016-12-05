import React, { PropTypes } from 'react'
import PlacedCards from '../PlacedCards'

export default class Player extends React.Component {
  static propTypes = {
    player: PropTypes.object.isRequired
  }

  render () {
    const { player } = this.props

    return (
      <div>
        <PlacedCards cards={player.placedCards} />
      </div>
    )
  }
}

