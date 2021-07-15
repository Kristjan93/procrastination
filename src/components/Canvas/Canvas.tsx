import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CanvasFallback } from './CanvasFallback'
import { drawMouseMove, DrawMouseMoveOperations } from "./utils/draw";


export const Canvas = (props: React.CanvasHTMLAttributes<HTMLCanvasElement>) => {
  const refCanvas = useRef<HTMLCanvasElement>(null)
  const refDraw = useRef<DrawMouseMoveOperations>()

  useEffect(() => {
    if (!refCanvas.current) { return }

    const draw = drawMouseMove(refCanvas.current)
    if (!draw) { return }
    refDraw.current = draw
    handleCanvasStart()
    
    return () => {
      draw.clear()
    }
  }, [])

  const handleCanvasClear = () => {
    refDraw.current && refDraw.current.clear()
  }

  const [canvasPlayState, setCanvasPlayState] = useState<'started' | 'stopped'>('started')
  const handleCanvasStart = () => {
    if(!refDraw.current) { return }

    setCanvasPlayState('started')
    document.addEventListener('mouseover', refDraw.current.start)
    document.addEventListener('mouseleave', refDraw.current.stop)
  }
  const handleCanvasStop = () => {
    if(!refDraw.current) { return }

    setCanvasPlayState('stopped')
    document.removeEventListener('mouseover', refDraw.current.start)
    document.removeEventListener('mouseleave', refDraw.current.stop)
    refDraw.current && refDraw.current.stop()
  }

  return (
    <>
      <StyledCanvas ref={refCanvas} {...props}>
        <CanvasFallback />
      </StyledCanvas>

      <ButtonContainer>
        <Button onClick={handleCanvasClear}>Clear</Button>
        {canvasPlayState === 'stopped' && <Button onClick={handleCanvasStart}>Start</Button>}
        {canvasPlayState === 'started' && <Button onClick={handleCanvasStop}>Stop</Button>}
      </ButtonContainer>
    </>
  )
}

const Button = styled.button`
  margin: 0;
  padding: 10px 20px;
  background: rgb(37, 35, 36);
  color: white;
  border-radius: 20px;
  border: 0;
  font-size: 18px;
`

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;

  button {
    margin-left: 10px;
  } 
`

const StyledCanvas = styled.canvas`
  /* background: green; */
`