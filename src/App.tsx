import React from 'react';
import styled from 'styled-components'
import { Canvas } from './components/Canvas/Canvas';

export const App = () => {
  return (
    <Container>
      <Canvas width="150" height="150" />
    </Container>
  );
}



const Container = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: black; */
  display: flex;
  justify-content: center;
  align-items: center;
`