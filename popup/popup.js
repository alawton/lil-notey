// Instantiate wysiwyg editor
var quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		toolbar: "#toolbar"
	}
}); 

// Track when the last save was
// Don't save immediately, just save after 5 seconds
var lastSave = new Date();
var content = {
	currentFile: null,
	files:{

	}
}

// Update storage, biut only every 5 seconds
quill.on('text-change', function(delta, oldDelta, source) {
	if (source == 'user') {
		var currentTime = new Date();

		if(((currentTime.getTime() - lastSave.getTime()) / 1000) >= 5) {
			var content = quill.getContents(); // get full content
			lastSave = currentTime;
			chrome.storage.sync.set({ content });	
		}
	}
});

// Get content from last save on open
chrome.storage.sync.get("content", ({ content }) => {
	quill.setContents(content);
});

// Force save before close
window.addEventListener('blur', function(){
	var content = quill.getContents();
	chrome.storage.sync.set({ content });
});