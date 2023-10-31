import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #343541;
    color: white;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }

  // Add any other global styles here
`;


const MainContainer = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
    background-color: #343541;
`;

const HeaderContainer = styled.header`
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
`;

const ImgContainer = styled.img`
   width: 300px;
`;

const FormContainer = styled.form`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   row-gap: 10px;
`;

const YenSelect = styled.select`
   width: 300px;
   height: 40px;
   border-radius: 8px;
   border: 1px solid #f4f4f4;
   margin: 5px 0;
   padding: 10px;
`;

const YenTextArea = styled.textarea`
   width: 300px;
   height: 300px;
   border-radius: 8px;
   border: 1px solid #f4f4f4;
   margin: 5px 0;
   padding: 10px;
`;


const YenButton = styled.button`
   width: 300px;
   height: 40px;
   color: black;
   font-weight: bold;
   background-color: #FFFF00;
   border-radius: 20px;
   margin: 5px 0;
`;


const ResultContainer = styled.div`
   display: flex;
   width: 800px;
   flex-direction: row;
   flex-wrap: wrap;
   justify-content: center;
   align-items: center;
   align-content: center;

   img {
    width: 200px;
    margin: 5px;
   }

`;

export { GlobalStyle, MainContainer, HeaderContainer, ImgContainer, FormContainer, YenSelect, YenTextArea, YenButton, ResultContainer}