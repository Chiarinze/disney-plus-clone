import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import { doc, getDoc } from "../firebase";

function Detail() {
  const { id } = useParams();
  const [detailData, setDetailData] = useState({});
  const [popupMessage, setPopupMessage] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);

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
    console.log("hello");
    const fetchData = async () => {
      const docRef = doc(db, "movies", id); // create a reference to the document
      const docSnap = await getDoc(docRef); // fetch the document
      if (docSnap.exists()) {
        setDetailData(docSnap.data()); // set the data in state
      }
    };
    fetchData();
  }, [id]);

  return (
    <Container>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>
      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <PlayButton onClick={handleClick}>
            <img src="/images/play-icon-black.png" alt="" />
            <span>Play</span>
          </PlayButton>
          <TrailerButton onClick={handleClick}>
            <img src="/images/play-icon-white.png" />
            <span>Trailer</span>
          </TrailerButton>
          <AddButton onClick={handleClick}>
            <span />
            <span />
          </AddButton>
          <GroupWatchButton onClick={handleClick}>
            <img src="/images/group-icon.png" />
          </GroupWatchButton>

          {showPopup && (
            <PopupMessage
              style={{ top: popupPosition.top, left: popupPosition.left }}
            >
              <CloseButton onClick={handleClose}>X</CloseButton>
              <p>{popupMessage}</p>
            </PopupMessage>
          )}
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
    </Container>
  );
}

export default Detail;

const Container = styled.div`
  min-height: calc(100vh - 70px);
  padding: 0 calc(3.5vw + 5px);
  position: relative;
  overflow-x: hidden;
  display: block;
  top: 72px;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  opacity: 0.8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
    // object-fit: contain;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const PlayButton = styled.button`
  border-radius: 4px;
  font-size: 15px;
  display: flex;
  align-items: center;
  height: 56px;
  background-color: rgb(249, 249, 249);
  border: none;
  padding: 0px 24px;
  margin-right: 22px;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;

  img {
    width: 32px;
  }

  &:hover {
    background-color: rgb(198, 198, 198);
  }

  @media (max-width: 768px) {
    height: 45px;
    padding: 0px 12px;
    font-size: 12px;
    margin: 0px 10px 0px 0px;

    img {
      width: 25px;
    }
  }
`;

const TrailerButton = styled(PlayButton)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(249, 249, 249);
`;

const AddButton = styled.button`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  margin-right: 16px;

  span {
    background-color: rgb(249, 249, 249);
    display: inline-block;

    &:first-child {
      height: 2px;
      transform: translate(1px, 0px) rotate(0deg);
      width: 16px;
    }

    &:nth-child(2) {
      height: 16px;
      transform: translateX(-8px) rotate(0deg);
      width: 2px;
    }
  }
`;

const GroupWatchButton = styled(AddButton)`
  background-color: rgb(0, 0, 0);
`;

const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;
  margin-top: 26px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  color: rgb(249, 249, 249);
  font-size: 20px;
  padding: 16px 0px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PopupMessage = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
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
