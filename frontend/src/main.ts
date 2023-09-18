import './styles/main.css'
import App from './App.svelte'

const appContainer = document.getElementById('app')

if (appContainer === null) {
  throw new Error('No app container available')
}

const app = new App({
  target: appContainer
})

export default app
