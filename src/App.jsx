import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as routes from './utils/routes';
import Landing from './views/Landing';
import Profile from './views/Profile';
import EditProfile from './views/EditProfile';
import Privacy from './views/Privacy';
import Terms from './views/Terms';
import history from './history';

import {
  SwitchedAddressModal,
  SwitchedNetworksModal,
  LoggedOutModal,
  OnBoardingModalDesktop,
  LoadingThreeBoxProfileModal,
  OnBoardingModalMobile,
  ProvideAccessModal,
  AccessDeniedModal,
  ErrorModal,
} from './components/Modals';

import {
  profileGetBox,
  requestAccess,
  getPublicName,
  getPublicGithub,
  getPublicImage,
  getPrivateEmail,
  getActivity,
  signInGetBox,
  checkWeb3Wallet,
  checkNetwork,
  handleSignOut,
} from './state/actions';

import {
  handleSignInModal,
  closeErrorModal,
  handleRequireWalletLoginModal,
  handleSwitchedNetworkModal,
  handleAccessModal,
  handleDeniedAccessModal,
  handleLoggedOutModal,
  handleSwitchedAddressModal,
  requireMetaMaskModal,
  handleMobileWalletModal,
  handleOnboardingModal,
} from './state/actions-modals';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onBoardingModalMobileOne: false,
      onBoardingModalMobileTwo: false,
      onBoardingModalMobileThree: false,
      width: window.innerWidth,
    };
    this.loadData = this.loadData.bind(this);
    this.handleSignInUp = this.handleSignInUp.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  async componentDidMount() {
    const { location } = this.props;
    const { pathname } = location;

    if (typeof window.web3 === 'undefined' && pathname !== '/') { // no wallet and lands on restricted page
      history.push(routes.LANDING);
      this.props.requireMetaMaskModal();
      this.props.handleMobileWalletModal();
    } else if (typeof window.web3 !== 'undefined' && pathname !== '/') { // has wallet and lands on restricted page
      this.loadData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  handleNextMobileModal = (thisModal, nextModal) => {
    this.setState({
      [`onBoardingModalMobile${thisModal}`]: false,
      [`onBoardingModalMobile${nextModal}`]: true,
    });
  }

  async loadData() {
    const { location } = this.props;
    const { pathname } = location;

    await this.props.checkWeb3Wallet();
    await this.props.requestAccess('directLogin');
    await this.props.checkNetwork();

    if (this.props.isSignedIntoWallet && this.props.isLoggedIn) {
      await this.props.profileGetBox();
      if (!this.props.showErrorModal) {
        await this.props.getActivity();
        await this.props.getPublicName();
        await this.props.getPublicGithub();
        await this.props.getPublicImage();
        await this.props.getPrivateEmail();
      }
    } else if (!this.props.isSignedIntoWallet) {
      history.push(routes.LANDING);
      this.props.handleRequireWalletLoginModal();
    } else if (this.props.isSignedIntoWallet && !this.props.isLoggedIn && (pathname === '/Profile' || pathname === '/EditProfile')) {
      history.push(routes.LANDING);
      this.props.handleSignInModal();
    }
  }

  async handleSignInUp() {
    if (typeof window.web3 !== 'undefined') {
      await this.props.checkWeb3Wallet();
      await this.props.requestAccess();
      await this.props.checkNetwork();

      if (this.props.isSignedIntoWallet) {
        await this.props.signInGetBox();
        if (!this.props.showErrorModal) {
          await this.props.getActivity('signIn');
          await this.props.getPublicName();
          await this.props.getPublicGithub();
          await this.props.getPublicImage();
          await this.props.getPrivateEmail();
        }
      } else if (!this.props.isSignedIntoWallet && !this.props.accessDeniedModal) {
        this.props.handleRequireWalletLoginModal();
      }
    } else if (typeof window.web3 === 'undefined') {
      this.props.requireMetaMaskModal();
      this.props.handleMobileWalletModal();
    }
  }

  render() {
    const {
      showDifferentNetworkModal,
      accessDeniedModal,
      allowAccessModal,
      directLogin,
      loggedOutModal,
      switchedAddressModal,
      prevNetwork,
      currentNetwork,
      onBoardingModal,
      onBoardingModalTwo,
      ifFetchingThreeBox,
      errorMessage,
      showErrorModal,
      isLoggedIn,
      isSignedIntoWallet,
    } = this.props;

    const mustConsentError = errorMessage && errorMessage.message && errorMessage.message.substring(0, 65) === 'Error: MetaMask Message Signature: User denied message signature.';

    const {
      onBoardingModalMobileOne,
      onBoardingModalMobileTwo,
      onBoardingModalMobileThree,
      width,
    } = this.state;

    const isMobile = width <= 600;

    return (
      <div className="App">
        <LoadingThreeBoxProfileModal show={ifFetchingThreeBox} />

        <ProvideAccessModal
          handleAccessModal={this.props.handleAccessModal}
          show={allowAccessModal}
          directLogin={directLogin}
          isMobile={isMobile}
        />

        <AccessDeniedModal
          handleDeniedAccessModal={this.props.handleDeniedAccessModal}
          show={accessDeniedModal}
          isMobile={isMobile}
        />

        <ErrorModal
          errorMessage={errorMessage}
          closeErrorModal={this.props.closeErrorModal}
          show={showErrorModal && !mustConsentError}
          isMobile={isMobile}
        />

        <SwitchedNetworksModal
          prevNetwork={prevNetwork}
          currentNetwork={currentNetwork}
          handleSwitchedNetworkModal={this.props.handleSwitchedNetworkModal}
          show={showDifferentNetworkModal}
        />

        <LoggedOutModal
          isMobile={isMobile}
          handleLoggedOutModal={this.props.handleLoggedOutModal}
          handleSignOut={this.props.handleSignOut}
          show={loggedOutModal}
        />

        <SwitchedAddressModal
          handleSwitchedAddressModal={this.props.handleSwitchedAddressModal}
          show={switchedAddressModal}
          isMobile={isMobile}
          handleSignOut={this.props.handleSignOut}
        />

        <OnBoardingModalDesktop
          isMobile={isMobile}
          showOne={onBoardingModal}
          showTwo={onBoardingModalTwo}
          handleOnboardingModal={this.props.handleOnboardingModal}
        />

        <OnBoardingModalMobile
          isMobile={isMobile}
          handleOnboardingModal={this.props.handleOnboardingModal}
          showOne={onBoardingModal}
          showTwo={onBoardingModalMobileOne}
          showThree={onBoardingModalMobileTwo}
          showFour={onBoardingModalMobileThree}
          handleNextMobileModal={this.handleNextMobileModal}
        />

        <Switch>
          <Route
            exact
            path={routes.LANDING}

            render={() => (
              <Landing
                handleSignInUp={this.handleSignInUp}
                isLoggedIn={isLoggedIn}
                errorMessage={errorMessage}
                showErrorModal={showErrorModal}
                isSignedIntoWallet={isSignedIntoWallet}
              />
            )}
          />

          <Route
            path={routes.PROFILE}
            component={Profile}
          />

          <Route
            path={routes.EDITPROFILE}
            component={EditProfile}
          />

          <Route
            path={routes.PRIVACY}
            component={() => (
              <Privacy
                isLoggedIn={isLoggedIn}
                handleSignInUp={this.handleSignInUp}
              />
            )}
          />

          <Route
            path={routes.TERMS}
            component={() => (
              <Terms
                isLoggedIn={isLoggedIn}
                handleSignInUp={this.handleSignInUp}
              />
            )}
          />

        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  profileGetBox: PropTypes.func.isRequired,
  requestAccess: PropTypes.func.isRequired,
  getPublicName: PropTypes.func.isRequired,
  getPublicGithub: PropTypes.func.isRequired,
  getPublicImage: PropTypes.func.isRequired,
  getPrivateEmail: PropTypes.func.isRequired,
  getActivity: PropTypes.func.isRequired,
  signInGetBox: PropTypes.func.isRequired,
  checkWeb3Wallet: PropTypes.func.isRequired,
  requireMetaMaskModal: PropTypes.func.isRequired,
  handleMobileWalletModal: PropTypes.func.isRequired,
  handleSwitchedNetworkModal: PropTypes.func.isRequired,
  handleAccessModal: PropTypes.func.isRequired,
  handleDeniedAccessModal: PropTypes.func.isRequired,
  handleSignOut: PropTypes.func.isRequired,
  checkNetwork: PropTypes.func.isRequired,
  handleSignInModal: PropTypes.func.isRequired,
  closeErrorModal: PropTypes.func.isRequired,
  handleRequireWalletLoginModal: PropTypes.func.isRequired,
  handleLoggedOutModal: PropTypes.func.isRequired,
  handleSwitchedAddressModal: PropTypes.func.isRequired,
  handleOnboardingModal: PropTypes.func.isRequired,

  showDifferentNetworkModal: PropTypes.bool,
  accessDeniedModal: PropTypes.bool,
  allowAccessModal: PropTypes.bool,
  directLogin: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  isSignedIntoWallet: PropTypes.bool,
  showErrorModal: PropTypes.bool,
  loggedOutModal: PropTypes.bool,
  switchedAddressModal: PropTypes.bool,
  onBoardingModal: PropTypes.bool,
  onBoardingModalTwo: PropTypes.bool,
  ifFetchingThreeBox: PropTypes.bool,
  prevNetwork: PropTypes.string,
  currentNetwork: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  errorMessage: PropTypes.string,
};

App.defaultProps = {
  showDifferentNetworkModal: false,
  accessDeniedModal: false,
  allowAccessModal: false,
  loggedOutModal: false,
  switchedAddressModal: false,
  onBoardingModal: false,
  onBoardingModalTwo: false,
  ifFetchingThreeBox: false,
  isLoggedIn: false,
  isSignedIntoWallet: false,
  showErrorModal: false,
  prevNetwork: '',
  currentNetwork: '',
  errorMessage: '',
  directLogin: '',
};

const mapState = state => ({
  showDifferentNetworkModal: state.threeBox.showDifferentNetworkModal,
  allowAccessModal: state.threeBox.allowAccessModal,
  directLogin: state.threeBox.directLogin,
  loggedOutModal: state.threeBox.loggedOutModal,
  switchedAddressModal: state.threeBox.switchedAddressModal,
  onBoardingModal: state.threeBox.onBoardingModal,
  onBoardingModalTwo: state.threeBox.onBoardingModalTwo,
  prevNetwork: state.threeBox.prevNetwork,
  currentNetwork: state.threeBox.currentNetwork,
  ifFetchingThreeBox: state.threeBox.ifFetchingThreeBox,
  errorMessage: state.threeBox.errorMessage,
  isLoggedIn: state.threeBox.isLoggedIn,
  showErrorModal: state.threeBox.showErrorModal,
  accessDeniedModal: state.threeBox.accessDeniedModal,
  isSignedIntoWallet: state.threeBox.isSignedIntoWallet,
});

export default withRouter(connect(mapState,
  {
    profileGetBox,
    requestAccess,
    getPublicName,
    getPublicGithub,
    getPublicImage,
    getPrivateEmail,
    getActivity,
    signInGetBox,
    checkWeb3Wallet,
    requireMetaMaskModal,
    handleMobileWalletModal,
    checkNetwork,
    handleSignInModal,
    closeErrorModal,
    handleRequireWalletLoginModal,
    handleSwitchedNetworkModal,
    handleAccessModal,
    handleDeniedAccessModal,
    handleLoggedOutModal,
    handleSignOut,
    handleSwitchedAddressModal,
    handleOnboardingModal,
  })(App));
