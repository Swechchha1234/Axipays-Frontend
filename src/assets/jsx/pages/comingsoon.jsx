import React, { Component } from "react";
import AxipaysLogo from "../../media/imgpsh_fullsize_anim__1_-removebg-preview.png";
import Box from "../../media/box.png";
import line from "../../media/Untitleddesign.png";
import highelighter from "../../media/highlighter.png";

import skype from "../../media/skype.png";
import linkedin from "../../media/linkedin.png";
import gmail from "../../media/gmail.png";
import telegram from "../../media/telegram.png";
import close from "../../media/close.png";
import bell from "../../media/bell.png";

export class comingsoon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: false,
      showMiniHeading: false,
      showFooter: false,
      showComingSoonModal: false,
      modalAnimating: false,
      currentWordIndex: 0,
      startCycling: false,
      animatingOut: false,
      firstCycle: true ,
      copied: "",
      showGetNotifiedModal: false,
    };
    this.footerTimeout = null;
    this.headerTimeout = null;
    this.miniheadingTimeout = null;
    this.delayTimeout = null;
    this.words = ["Payment", "Monitoring", "Settlement"];
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ startCycling: true });
      this.intervalId = setInterval(() => {
        this.setState(
          (prevState) => ({
            animatingOut: true,
          }),
          () => {
            setTimeout(() => {
              this.setState((prevState) => ({
                currentWordIndex:
                  (prevState.currentWordIndex + 1) % this.words.length,
                animatingOut: false,
              }));
            }, 1000); // Duration of slideOut animation
          }
        );
      }, 4000); // Change the word every 4 seconds
    }, 2000);

    this.footerTimeout = setTimeout(() => {
      this.setState({ showHeader: true });
    }, 1200);
    this.footerTimeout = setTimeout(() => {
      this.setState({ showMiniHeading: true });
    }, 1500);
    this.footerTimeout = setTimeout(() => {
      this.setState({ showFooter: true });
    }, 4000);

    window.addEventListener("wheel", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("wheel", this.handleScroll);
    clearInterval(this.intervalId);
    clearInterval(this.footerTimeout);
    clearInterval(this.headerTimeout);
    clearInterval(this.miniheadingTimeout);
  }

  handleScroll = (event) => {
    const scrollDirection = event.deltaY > 0 ? "down" : "up";
    if (scrollDirection === "down" && !this.state.showComingSoonModal) {
      this.openModal("comingSoon");
    } else if (scrollDirection === "up" && this.state.showComingSoonModal) {
      this.closeModal("comingSoon");
    }
  };

  closeModal = (modal) => {
    this.setState({ modalAnimating: true });
    if (modal === "comingSoon") {
      setTimeout(() => {
        this.setState({
          showComingSoonModal: false,
          modalAnimating: false,
        });
      }, 300);
    } else {
      setTimeout(() => {
        this.setState({
          showGetNotifiedModal: false,
          modalAnimating: false,
        });
      }, 300);
    }
  };

  openModal = (modal) => {
    if (modal === "comingSoon") {
      this.setState({
        showComingSoonModal: true,
        modalAnimating: true,
        showGetNotifiedModal: false,
      });
    } else {
      this.setState({
        showComingSoonModal: false,
        showGetNotifiedModal: true,
      });
    }
    setTimeout(() => {
      this.setState({ modalAnimating: false });
    }, 100);
  };

  handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      this.setState({ copied: link });
      setTimeout(() => this.setState({ copied: "" }), 2000); // Hide tooltip after 2 seconds
    });
  };

  render() {
    const {
      showComingSoonModal,
      modalAnimating,
      showFooter,
      showHeader,
      showMiniHeading,
      copied,
      showGetNotifiedModal,
      startCycling,
      animatingOut,
    } = this.state;
    const wordClass = animatingOut
      ? "animateWord slide-out"
      : "animateWord slide-in";
    return (
      <>
        <div id="comingSoon-Page">
          <div className="comingSoon-Page">
            <div className="animation-box box1">
            <span class="hover-text">Payment</span>
            </div>
            <div className="animation-box box2">
            <span class="hover-text">Integration</span>
            </div>
            <div className="animation-box box3">
            <span class="hover-text">Global</span>
            </div>
            <div className="animation-box box4">
            <span class="hover-text">Transaction</span>
            </div>
            <div className="animation-box box5">
            <span class="hover-text">Card</span>
            </div>
            <div className="animation-box box6">
            <span class="hover-text">APMs</span>
            </div>
            <div className="animation-box box7">
            <span class="hover-text">Reporting</span>
            </div>
            <div className="animation-box box8">
            <span class="hover-text">Settlements</span>
            </div>
            <div className="animation-box box9">
            <span class="hover-text">Routing</span>
            </div>
            <div className="animation-box box10">
            <span class="hover-text">Analytics</span>
            </div>
            <div className="animation-box box11">
            <span class="hover-text">Monitoring</span>
            </div>
            {showHeader && (
              <>
                <div className="header">
                  <span>
                    <img src={AxipaysLogo} alt="Axipays Company logo" />
                    <div className="nav">
                      <p>Who are we?</p>
                      {/* <p>Promo</p> */}
                    </div>
                    <button
                      className="button-3 notify-btn"
                      onClick={() => {
                        this.openModal("notify");
                      }}
                    >
                      <img src={bell} alt="notify"></img>
                      <p>Notify Me</p>
                    </button>
                  </span>
                </div>
                <img
                  className="header-bottomline"
                  src={line}
                  alt="bottom line"
                />
              </>
            )}

            <div className="body">
              <span>
                {/* <div className="body-media">
                  <div className="box boxSize1">
                    <img src={Box} alt="box image" />
                  </div>
                  <div className="box boxSize2">
                    <img src={Box} alt="box image" />
                  </div>
                  <div className="box boxSize3">
                    <img src={Box} alt="box image" />
                  </div>
                  <div className="box boxSize4">
                    <img src={Box} alt="box image" />
                  </div>
                  <div className="box boxSize5">
                    <img src={Box} alt="box image" />
                  </div>
                </div> */}
                <div
                  className={`body-content ${
                    showComingSoonModal ? "hide-body-content" : ""
                  }`}
                >
                  {showMiniHeading && (
                    <p className="miniHeading">
                      Empowering Your Business With Global Payments And Beyond.
                    </p>
                  )}
                  <div className="comingSoon-content">
                    <p>
                      Effortless{" "}
                      <div className="modifiedPayments">
                        <img src={highelighter} alt="highlighter" />
                        <p className={wordClass}>
                          {startCycling
                            ? this.words[this.state.currentWordIndex]
                            : "Payment"}
                        </p>
                      </div>
                      <br /> for Businesses
                    </p>
                  </div>
                  {showMiniHeading && (
                    <button
                      className="button-3 get-started-btn"
                      onClick={() => this.openModal("comingSoon")}
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </span>
            </div>
            {showFooter && (
              <div className="footer">
                {!showComingSoonModal && (
                  <span>
                    <div
                      className={`footer-BG ${
                        showComingSoonModal ? "hide" : "show"
                      }`}
                    >
                      <p className="scroll-text">Scroll to Explore</p>
                      <div className="vertical-line"></div>
                    </div>
                  </span>
                )}
              </div>
            )}
            {showComingSoonModal && (
              <>
                <div
                  className={`modal-background ${
                    modalAnimating ? "hide" : "show"
                  }`}
                >
                  <div className="modal-companyName">
                    <span>AXIPAYS</span>
                    <span>AXIPAYS</span>
                    <span>AXIPAYS</span>
                    <span>AXIPAYS</span>
                    <span>AXIPAYS</span>
                    <span>AXIPAYS</span>
                  </div>
                  <div className="modal-blur"></div>
                  <div className={`coming-soon-modal`}>
                    <div className="coming-soon-modal-content">
                      <div className="coming-soon-text">
                        <div className="comingText">
                          <p>C</p> <div className="comingText-o"></div>
                          <p className="comingText-m">M</p>
                          <div className="comingText-i"></div>
                          <p>NG</p>
                        </div>
                      </div>
                      <div className="coming-soon-text">
                        <div className="soonText">
                          <p>S</p> <div className="soonText-first-o"></div>
                          <div className="soonText-second-o"></div>
                          <p>N</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="social-handle">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={linkedin} alt="linkedin"></img>
                    </a>
                    <div
                      onClick={() => this.handleCopy("skype:your.skype.id")}
                      className="social-icon"
                    >
                      <img src={skype} alt="skype" />
                      {copied === "skype:your.skype.id" && (
                        <div className="tooltip">Skype Id copied!</div>
                      )}
                    </div>
                    <a
                      href="https://t.me/Cent908"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={telegram} alt="telegram"></img>
                    </a>
                    <a
                      href="mailto:nandanipaliwal127@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={gmail} alt="gmail"></img>
                    </a>
                  </div>
                </div>
              </>
            )}
            {showGetNotifiedModal && (
              <div
                className={`get-notified-modal-bg ${
                  modalAnimating ? "hide" : "show"
                }`}
              >
                <img
                  src={close}
                  alt="close"
                  className="close-icon"
                  onClick={() => {
                    this.closeModal("notify");
                  }}
                ></img>
                <p>Get notified when we launch!</p>
                <div className="get-notified">
                  <input type="email" placeholder="Enter your email"></input>
                  <button>Notify</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default comingsoon;
