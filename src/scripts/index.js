import App from './app'

const GUI = document.getElementById( 'controlKit' )
if ( ENV === 'PROD' ) GUI.style.display = 'none'
const container = document.getElementById( 'app' )

new App( container )
