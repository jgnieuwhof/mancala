
export const randomInRange = ({ min, max }) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomInCircle = () => {
  let x = randomInRange({ min: -100, max: 100 }) / 100
  let yRange = Math.sqrt(1 - Math.pow(x,2))
  let y = randomInRange({ min: yRange * -100, max: yRange * 100 }) / 100
  return { x, y }
}
