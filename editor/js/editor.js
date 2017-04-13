
//WAVESURFER STUFF

var wavesurfer = WaveSurfer.create({
			container: '#waveform',
			barWidth: 3,
			waveColor: 'gray',
			progressColor: 'red'
});

wavesurfer.load('https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');


//CANVAS STUFF

var canvas = new fabric.Canvas('c');
canvas.on("after:render", function(){ canvas.calcOffset() });

$("#fab_img").on("click", function(e) {
		img_url = $('#fab_img_input').val() || "http://chestream.com/img/logo_transparent.png";
		fabric.Image.fromURL(img_url, function(oImg) {
			canvas.add(oImg);
		});
});

$("#fab_delete").on("click", function(e) {
		canvas.getActiveObject().remove();
});

$("#fab_text").on("click", function(e) {
		text = $('#fab_text_input').val() || 'sample text';

		canvas.add(new fabric.IText(text, {
      left: 50,
      top: 100,
      fontFamily: 'Monaco',
      fill: '#333',
	    fontSize: 25,
			shadow: 'rgba(0,0,0,0.3) 5px 5px 5px',
			fontWeight: 'bold'
		}));

		//see https://jsfiddle.net/gislef/Lvfpq57h/ for more options
		//documentation http://fabricjs.com/fabric-intro-part-2#text
});
