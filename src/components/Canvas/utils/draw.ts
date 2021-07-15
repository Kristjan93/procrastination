
type DrawState = 'started' | 'stopped'

export interface DrawMouseMoveOperations {
  clear: () => void
  start: (event?: MouseEvent) => void
  stop: () => void
  drawState: DrawState
}

type Coordinates = {
  x: number
  y: number
}

type DrawingHistory = { 
  to: Coordinates 
  from: Coordinates
}

export const drawMouseMove = (htmlCanvasElement: HTMLCanvasElement): DrawMouseMoveOperations | undefined => {
  // We don't want out code to break when canvas shenanigans are not supported.
  if(!htmlCanvasElement.getContext) { 
    return 
  }

  const ctx = htmlCanvasElement.getContext('2d');
  if(!ctx) {
    return 
  }

  let drawState: DrawState = 'stopped'

  let coordinates: Coordinates = { x: 0, y: 0 }
  const updateMouseCoordinates = (event: MouseEvent) => {
    coordinates = {
      x: event.clientX - htmlCanvasElement.offsetLeft,
      y: event.clientY - htmlCanvasElement.offsetTop
    }

    return coordinates
  }


  const drawingHistory: DrawingHistory[] = []
  const draw = (event: MouseEvent) => {
    const from = coordinates
    const to = updateMouseCoordinates(event)

    drawingHistory.push({ from, to })

    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "rgb(37, 35, 36)"
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  const start = (event?: MouseEvent) => {
    if(drawState !== 'started') {
      document.addEventListener('mousemove', draw)
      event && updateMouseCoordinates(event) // start with initial coordinates
      drawState = 'started'
    }
  }

  const stop = () => {
    if(drawState !== 'stopped') {
      document.removeEventListener('mousemove', draw)
      document.removeEventListener('resize', resize)
      drawState = 'stopped'
    }
  }

  const clear = () => {
    ctx.clearRect(0, 0, htmlCanvasElement.width, htmlCanvasElement.height);
  }

  const resize = () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }
  resize()
  document.addEventListener('resize', resize)

  return {
    clear,
    start,
    stop,
    drawState
  }
}