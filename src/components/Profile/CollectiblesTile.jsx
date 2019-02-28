import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import HeartGrey from '../../assets/HeartGrey.svg';
import '../../views/styles/Profile.css';
import '../styles/Collectibles.css';

export const CollectiblesTile = ({
  image, description, name, addToGallery, padded, bgStyle, tokenId, id, favorite,
}) => (
    <div className="collectiblesTile">
      <div
        className="collectibles__image__wrapper"
        style={{ backgroundColor: `#${bgStyle}` }}
      >
        <img
          className={`collectibles__image ${padded === 'padded' && 'padded'}`}
          src={image}
          alt=""
        />
        {!favorite
          ? (
            <button
              type="button"
              className="collectibles__like"
              onClick={() => addToGallery(id)}
            >
              {/* <img src={HeartBlue} alt="" /> */}
              <img src={HeartGrey} alt="" className="collectibles__like__heart" />
              {/* <img src={HeartDarkGrey} alt="" /> */}
              {/* &#x2764; */}
            </button>
          )
          : (
            <button
              type="button"
              className="collectibles__like"
              onClick={() => addToGallery(id, 'remove')}
            >
              &#10005;
            </button>
          )
        }

      </div>

      <div className="collectibles__info">
        <h3>{name}</h3>
        <p>{`${description} ${tokenId}`}</p>
      </div>
    </div>
  );

CollectiblesTile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  padded: PropTypes.string,
  addToGallery: PropTypes.func.isRequired,
  favorite: PropTypes.bool.isRequired,
  tokenId: PropTypes.string,
  bgStyle: PropTypes.string,
};

CollectiblesTile.defaultProps = {
  image: '',
  name: '',
  description: '',
  padded: '',
  id: '',
  tokenId: '',
  bgStyle: '',
};

export const EmptyCollectiblesTile = () => (
  <div className="collectiblesTile">
    <div
      className="collectibles__image__wrapper"
      style={{ backgroundColor: '#efefef' }}
    >
      <h4>Add a collectible to your public gallery</h4>
    </div>

    <div className="collectibles__info" />
  </div>
);

EmptyCollectiblesTile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  padded: PropTypes.string,
  favoriteCollectible: PropTypes.func.isRequired,
  tokenId: PropTypes.string,
  bgStyle: PropTypes.string,
};

EmptyCollectiblesTile.defaultProps = {
  image: '',
  name: '',
  description: '',
  padded: '',
  tokenId: '',
  bgStyle: '',
};

export const EmptyGalleryCollectiblesTile = () => (
  <div className="collectiblesTile">
    <div
      className="collectibles__image__wrapper"
      style={{ backgroundColor: '#efefef' }}
    >
      <h4>Add a collectible to your public gallery</h4>
    </div>

    <div className="collectibles__info" />
  </div>
);

EmptyGalleryCollectiblesTile.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  padded: PropTypes.string,
  favoriteCollectible: PropTypes.func.isRequired,
  tokenId: PropTypes.string,
  bgStyle: PropTypes.string,
};

EmptyGalleryCollectiblesTile.defaultProps = {
  image: '',
  name: '',
  description: '',
  padded: '',
  tokenId: '',
  bgStyle: '',
};

function mapState(state) {
  return {
    // verifiedGithub: state.threeBox.verifiedGithub,
  };
}

export default withRouter(connect(mapState)(CollectiblesTile));
