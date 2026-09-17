'use strict';

(function() {
	
	MAIN_FRAME_WINDOW = document.getElementById('main-frame').contentWindow; 
	window.addEventListener('message', messageHandler);

})();
