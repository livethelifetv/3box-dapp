import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VaultRow from './VaultRow';
import VaultRowMobile from './VaultRowMobile';
import PublicRow from './PublicRow';
import PublicRowMobile from './PublicRowMobile';
import FavoriteCollectiblesRow from './FavoriteCollectiblesRow';
import FavoriteCollectiblesRowMobile from './FavoriteCollectiblesRowMobile';
import '../styles/Spaces.css';

const AllView = ({
  openSpace,
  spacesOpened,
  sortedSpace,
  isLoadingVault,
  vaultToOpen,
  width,
  fadeIn,
  fadeOut,
  spaceNameOpened,
  itemToDelete,
  spaceNameToDelete,
}) => (
    <React.Fragment>
      {sortedSpace.length > 0 && sortedSpace.map((row) => {
        if (row.name !== 'collectiblesFavoritesToRender'
          && row.name !== 'private_space_data' && width >= 600) {
          return (
            <PublicRow
              dataKey={row.name}
              dataValue={row.content}
              spaceName={row.space}
              privacy={row.privacy}
              rowType={row.type}
              fadeIn={fadeIn}
              spaceNameOpened={spaceNameOpened}
              itemToDelete={itemToDelete}
              spaceNameToDelete={spaceNameToDelete}
            />);
        }

        if (row.name !== 'collectiblesFavoritesToRender'
          && row.name !== 'private_space_data' && width <= 600) {
          return (
            <PublicRowMobile
              dataKey={row.name}
              dataValue={row.content}
              spaceName={row.space}
              privacy={row.privacy}
              rowType={row.type}
              fadeIn={fadeIn}
              spaceNameOpened={spaceNameOpened}
              itemToDelete={itemToDelete}
              spaceNameToDelete={spaceNameToDelete}
            />);
        }

        if (row.name === 'private_space_data' && width >= 600) {
          return (
            <VaultRow
              openSpace={openSpace}
              spaceName={row.space}
              fadeOut={fadeOut}
              isLoadingVault={isLoadingVault}
              vaultToOpen={vaultToOpen}
            />);
        }

        if (row.name === 'private_space_data' && width <= 600) {
          return (
            <VaultRowMobile
              openSpace={openSpace}
              spaceName={row.space}
              fadeOut={fadeOut}
              isLoadingVault={isLoadingVault}
              vaultToOpen={vaultToOpen}
            />);
        }

        if (row.name === 'collectiblesFavoritesToRender' && width >= 600) {
          return (
            <FavoriteCollectiblesRow
              dataKey={row.name}
              dataValue={row.content}
              spaceName={row.space}
              privacy={row.privacy}
              rowType={row.type}
              spaceNameOpened={spaceNameOpened}
              itemToDelete={itemToDelete}
              spaceNameToDelete={spaceNameToDelete}
            />);
        }

        if (row.name === 'collectiblesFavoritesToRender' && width <= 600) {
          return (
            <FavoriteCollectiblesRowMobile
              dataKey={row.name}
              dataValue={row.content}
              spaceName={row.space}
              privacy={row.privacy}
              rowType={row.type}
              itemToDelete={itemToDelete}
              spaceNameToDelete={spaceNameToDelete}
            />);
        }
      })}
    </React.Fragment>
  );

AllView.propTypes = {
  spacesOpened: PropTypes.object.isRequired,
  isLoadingVault: PropTypes.bool.isRequired,
  openSpace: PropTypes.func.isRequired,
  vaultToOpen: PropTypes.string.isRequired,
  itemToDelete: PropTypes.string.isRequired,
  spaceNameToDelete: PropTypes.string.isRequired,
  fadeIn: PropTypes.bool.isRequired,
  fadeOut: PropTypes.bool.isRequired,
  spaceNameOpened: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  sortedSpace: PropTypes.array,
};

AllView.defaultProps = {
  sortedSpace: [],
};

function mapState(state) {
  return {
    sortedSpace: state.spaces.sortedSpace,
  };
}

export default connect(mapState)(AllView);