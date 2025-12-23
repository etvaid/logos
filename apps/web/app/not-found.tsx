import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Search } from 'react-feather'; // Assuming you have Feather icons installed. If not, install with: npm install react-feather
import { eraColors, languageColors, contextLayerColors, evidenceReliability, theme } from './logosDesignSystem'; // Adjust path to your design system

// Define Logos' Colors
const { background, secondary, text, accentGold } = theme;

// --- ANIMATION ---
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// --- STYLED COMPONENTS ---
const NotFoundContainer = styled.div`
  background-color: ${background};
  color: ${text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  font-family: sans-serif;
`;

const IllustrationContainer = styled.div`
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  border-radius: 50%;
  background-color: ${secondary};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  svg {
    width: 80%;
    height: 80%;
    color: ${accentGold};
    animation: ${rotate} 10s linear infinite;
  }
`;

const LostScroll = styled.div`
  position: absolute;
  width: 120%;
  height: 120%;
  background: url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0L100 100L0 100L0 0Z" fill="%23${accentGold.substring(1)}20"/%3E%3C/svg%3E');
  opacity: 0.3;
  animation: ${rotate} 20s linear infinite reverse;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${accentGold};
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const SearchForm = styled.div`
  display: flex;
  width: 80%;
  max-width: 500px;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: ${secondary};
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 1rem;
  border: none;
  background-color: transparent;
  color: ${text};
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: ${accentGold};
  color: ${background};
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LinkButton = styled.a`
  background-color: ${secondary};
  color: ${text};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${accentGold};
    color: ${background};
  }
`;

const Fact = styled.p`
  font-style: italic;
  font-size: 0.9rem;
  color: #aaa;
`;

// --- REACT COMPONENT ---

const NotFoundPage: React.FC = () => {

  const popularLinks = [
    { text: "Home", href: "/" },
    { text: "Browse Texts", href: "/texts" },
    { text: "Tools", href: "/tools" },
    { text: "About", href: "/about" },
  ];

  const lostTextFacts = [
    "The original copies of many plays by Sophocles and Euripides are lost.",
    "Large portions of Livy's monumental history of Rome have vanished.",
    "The complete text of the Sibylline Oracles is no longer extant.",
    "Many Gnostic texts were deliberately destroyed by early Christians.",
    "Numerous works of ancient Egyptian literature and science are known only from fragments."
  ];

  const randomFact = lostTextFacts[Math.floor(Math.random() * lostTextFacts.length)];


  return (
    <NotFoundContainer>
      <IllustrationContainer>
          <LostScroll />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v16c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1z"></path>
            <path d="M4 9h16"></path>
            <path d="M4 14h16"></path>
        </svg>
      </IllustrationContainer>

      <Title>Lost to the Sands of Time...</Title>
      <Message>
        Alas, the text you seek seems to have vanished from our digital scrolls. Perhaps it was devoured by digital worms, or simply misplaced by a careless scribe. Fear not! You can still seek your quarry below.
      </Message>

      <SearchForm>
        <SearchInput type="text" placeholder="Search the Logos Corpus..." />
        <SearchButton><Search /></SearchButton>
      </SearchForm>

      <LinksContainer>
        {popularLinks.map(link => (
          <LinkButton key={link.href} href={link.href}>{link.text}</LinkButton>
        ))}
      </LinksContainer>

      <Fact>Did you know? {randomFact}</Fact>
    </NotFoundContainer>
  );
};

export default NotFoundPage;