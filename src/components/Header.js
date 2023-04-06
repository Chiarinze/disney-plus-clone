import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserHistory } from "history";
import { auth, signOut, provider, signInWithPopup } from "../firebase";
import {
  selectUserName,
  selectUserPhoto,
  setUserLoginDetails,
  setSignOutState,
} from "../features/user/userSlice";
import { Link } from "react-router-dom";

const Header = (props) => {
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  // const [detailData, setDetailData] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const handleClick = (event) => {
    const buttonRect = event.target.getBoundingClientRect();
    const popupTop = buttonRect.top - buttonRect.height - 8;
    const popupLeft = buttonRect.left + buttonRect.width / 2;
    setPopupPosition({ top: popupTop, left: popupLeft });
    setPopupMessage("Currently Unavailable!");
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, update state and redirect to home page
        setUser(user);
        history.push("/home");
      } else {
        // User is signed out, clear state and redirect to login page
        setUser(null);
        history.push("/login");
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [auth, history]);

  const handleauth = () => {
    if (!userName) {
      signInWithPopup(auth, provider)
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => {
          alert(error.message);
        });
    } else if (userName) {
      signOut(auth)
        .then(() => {
          dispatch(setSignOutState());
          history.push("/");
        })
        .catch((error) => alert(error.message));
    }
  };

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );
  };

  return (
    <Nav extendNavbar={showLinks}>
      <NavInnerContainer>
        <Logo href="/home">
          <img src="/images/logo.svg" alt="Disney+" />
        </Logo>

        {!userName ? (
          <Login onClick={handleauth}>Login</Login>
        ) : (
          <>
            <NavMenu>
              <a href="/home">
                <img src="/images/home-icon.svg" alt="HOME" />
                <span>HOME</span>
              </a>
              <a onClick={handleClick}>
                <img src="/images/search-icon.svg" alt="SEARCH" />
                <span>SEARCH</span>
              </a>
              <a onClick={handleClick}>
                <img src="/images/watchlist-icon.svg" alt="WATCHLIST" />
                <span>WATCHLIST</span>
              </a>
              <a onClick={handleClick}>
                <img src="/images/original-icon.svg" alt="ORIGINALS" />
                <span>ORIGINALS</span>
              </a>
              <a onClick={handleClick}>
                <img src="/images/movie-icon.svg" alt="MOVIES" />
                <span>MOVIES</span>
              </a>
              <a onClick={handleClick}>
                <img src="/images/series-icon.svg" alt="SERIES" />
                <span>SERIES</span>
              </a>

              {showPopup && (
                <PopupMessage
                  style={{ top: popupPosition.top, left: popupPosition.left }}
                >
                  <CloseButton onClick={handleClose}>X</CloseButton>
                  <p>{popupMessage}</p>
                </PopupMessage>
              )}
            </NavMenu>
            <Sandwich
              onClick={() => {
                setShowLinks((curr) => !curr);
              }}
            >
              {showLinks ? <> &#10005; </> : <> &#8801;</>}
            </Sandwich>
            <SignOut>
              <UserImg src={userPhoto} alt={userName} />
              <DropDown>
                <span onClick={handleauth}>Sign out</span>
              </DropDown>
            </SignOut>
          </>
        )}
      </NavInnerContainer>
      {showLinks && (
        <NavExtendedContainer>
          <NavMenu>
            <NavExtendedLink href="/home">
              <img src="/images/home-icon.svg" alt="HOME" />
              <span>HOME</span>
            </NavExtendedLink>
            <NavExtendedLink>
              <img src="/images/search-icon.svg" alt="SEaRCH" />
              <span>SEARCH</span>
            </NavExtendedLink>
            <NavExtendedLink>
              <img src="/images/watchlist-icon.svg" alt="WaTCHLIST" />
              <span>WATCHLIST</span>
            </NavExtendedLink>
            <NavExtendedLink>
              <img src="/images/original-icon.svg" alt="ORIGINaLS" />
              <span>ORIGINALS</span>
            </NavExtendedLink>
            <NavExtendedLink>
              <img src="/images/movie-icon.svg" alt="MOVIES" />
              <span>MOVIES</span>
            </NavExtendedLink>
            <NavExtendedLink>
              <img src="/images/series-icon.svg" alt="SERIES" />
              <span>SERIES</span>
            </NavExtendedLink>
          </NavMenu>
        </NavExtendedContainer>
      )}
    </Nav>
  );
};

export default Header;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${(props) => (props.extendNavbar ? "100vh" : "70px")};
  width: 100%;
  background-color: #090b13;
  display: flex;
  flex-direction: column;
  z-index: 4;
`;

const Logo = styled.a`
  padding: 0;
  width: 80px;
  margin-top: 4px;
  max-height: 70px;
  font-size: 0;
  display: inline-block;
  cursor: pointer;

  img {
    display: block;
    width: 100%;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  flex: 1;
  margin-left: 25px;
  align-items: center;
  justify-content: flex-start;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;

    img {
      height: 20px;
      min-width: 20px;
      width: 20px;
    }

    span {
      color: rgb(249, 249, 249);
      font-size: 13px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 0px;
      white-space: nowrap;
      position: relative;

      &:after {
        content: "";
        height: 2px;
        background: white;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        opacity: 0;
        transform-origin: left center;
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        transform: scaleX(0);
      }
    }

    &:hover {
      span:after {
        transform: scaleX(1);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

const UserImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
`;

const DropDown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

const Sandwich = styled.button`
  display: none;
  width: 0;
  height: 0;
  background: none;
  border: none;
  color: white;
  font-size: 45px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavInnerContainer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
`;

const NavExtendedContainer = styled.div`
  background-color: #090b13;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  align-items: center;
  /* padding: 0 36px; */
  /* letter-spacing: 16px; */

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavExtendedLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  z-index: 5;

  img {
    height: 20px;
    min-width: 20px;
    width: 20px;
  }

  span {
    color: rgb(249, 249, 249);
    font-size: 13px;
    letter-spacing: 1.42px;
    line-height: 1.08;
    padding: 2px 0px;
    white-space: nowrap;
    position: relative;
  }
`;

const PopupMessage = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  letter-spacing: 1.42px;
  background-color: #090b13;
  color: rgb(249, 249, 249);
  border: 1px solid gray;
  border-radius: 10px;
  padding: 16px;
  font-size: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
  box-sizing: border-box;

  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 50%;
    font-size: 15px;
    transform: translate(20px, -50%);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: transparent;
  color: rgb(249, 249, 249);
  border: none;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
