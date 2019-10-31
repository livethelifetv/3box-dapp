import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PublicActivityHeader from './PublicActivityHeader';
import PublicActivityTiles from './PublicActivityTiles';
import Wall from '../Wall';
import Loading from '../../../assets/Loading.svg';
import '../styles/Feed.css';
import '../styles/Profile.css';
import '../../../components/styles/NetworkArray.css';

class PublicActivityOrWall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewTab: 'wall',
    };
  }

  handleView = (viewTab) => {
    this.setState({ viewTab });
  }

  render() {
    const {
      isFetchingOtherActivity,
      otherProfileActivity,
      otherCollectiblesFavorites,
      otherWallPosts,
      otherWallProfiles,
      handleSignInUp,
    } = this.props;
    const { viewTab } = this.state;

    return (
      <div id="feed" className={`${otherCollectiblesFavorites.length > 0 && 'noTopMargin'}`}>
        <div className="feed_content">
          <div className="feed_content_headers">
            <button
              type="button"
              className={`textButton feed_content_button ${viewTab === 'wall' ? 'feed_content_active' : ''}`}
              onClick={() => this.handleView('wall')}
            >
              <p className="header feed_content_headers_tab">Wall</p>
            </button>
            <button
              type="button"
              className={`textButton feed_content_button ${viewTab === 'activity' ? 'feed_content_active' : ''}`}
              onClick={() => this.handleView('activity')}
            >
              <p className="header feed_content_headers_tab">Activity</p>
            </button>
          </div>

          <Wall
            wallPosts={otherWallPosts}
            wallProfiles={otherWallProfiles}
            handleSignInUp={handleSignInUp}
            viewTab={viewTab}
            isOtherProfile
          />
          <PublicActivity
            isFetchingOtherActivity={isFetchingOtherActivity}
            otherProfileActivity={otherProfileActivity}
            viewTab={viewTab}
          />
        </div>
      </div>
    );
  }
}

PublicActivityOrWall.propTypes = {
  isFetchingOtherActivity: PropTypes.bool,
  otherCollectiblesFavorites: PropTypes.array,
  otherProfileActivity: PropTypes.array,
  otherWallPosts: PropTypes.array,
  otherWallProfiles: PropTypes.array,
  handleSignInUp: PropTypes.func.isRequired,
};

PublicActivityOrWall.defaultProps = {
  isFetchingOtherActivity: false,
  otherCollectiblesFavorites: [],
  otherProfileActivity: [],
  otherWallPosts: [],
  otherWallProfiles: [],
};

const mapState = (state) => ({
  isFetchingOtherActivity: state.uiState.isFetchingOtherActivity,

  otherProfileActivity: state.otherProfile.otherProfileActivity,
  otherProfileAddress: state.otherProfile.otherProfileAddress,
  otherName: state.otherProfile.otherName,
  otherCollectiblesFavorites: state.otherProfile.otherCollectiblesFavorites,
  otherWallPosts: state.otherProfile.otherWallPosts,
});

export default connect(mapState)(PublicActivityOrWall);

const PublicActivity = ({ isFetchingOtherActivity, otherProfileActivity, viewTab }) => (
  <div className={`feed__activity__header profileTab  ${viewTab === 'activity' ? 'viewTab' : ''}`}>
    {(isFetchingOtherActivity)
      && (
        <div className="feed__activity__load">
          <img src={Loading} alt="loading" id="activityLoad" />
        </div>
      )}

    {otherProfileActivity.length > 0
      ? otherProfileActivity.map((feedAddress, i) => (
        <div key={i} className="feed__activity__tile">
          <PublicActivityHeader i={i} feedAddress={feedAddress} />
          <PublicActivityTiles feedAddress={feedAddress} />
        </div>
      ))
      : (!isFetchingOtherActivity && otherProfileActivity.length === 0)
      && (
        <div className="feed__activity__load">
          <p>No activity at this address yet</p>
        </div>
      )}
    <div className="feed__footer">
      <div className="logo__icon--footer">
        <h2>3</h2>
      </div>
    </div>
  </div>
);