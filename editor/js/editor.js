
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
		canvas.calcOffset()
});

$("#fab_delete").on("click", function(e) {
		canvas.getActiveObject().remove();
});

$("#fab_text").on("click", function(e) {
		text = 'THE SUBLIME';

		canvas.add(new fabric.IText(text, {
      left: 50,
      top: 100,
      fontFamily: 'Roboto',
      fill: '#333',
	    fontSize: 35,
			//shadow: 'rgba(0,0,0,0.3) 5px 5px 5px',
			textBackgroundColor : '#fff',
			padding : '9',
			fontWeight: 'bold'
		}));

		//canvas.calcOffset();
		//see https://jsfiddle.net/gislef/Lvfpq57h/ for more options
		//documentation http://fabricjs.com/fabric-intro-part-2#text
});

//BACKGROUND CHANGING STUFF

$("#back_tri").on("click", function(e) {
		var pattern = Trianglify({
  		height: 600,
  		width: 360,
  		cell_size: 40
		});
		//pattern.canvas(document.getElementById('c'));
		canvas.setBackgroundImage(pattern.png(), canvas.renderAll.bind(canvas));
		canvas.renderAll();
});

$("#back_grad").on("click", function(e) {
			var c2=document.getElementById("c2");
			var ctx=c2.getContext("2d");

			function gradient(r,g,b){
				tint_factor = 0.8;
				r2 = Math.floor(r + (255 - r) * tint_factor);
				g2 = Math.floor(g + (255 - g) * tint_factor);
				b2 = Math.floor(b + (255 - b) * tint_factor);

				var color1 = `rgb(${r},${g},${b})`;
				var color2 = `rgb(${r2},${g2},${b2})`;
				fillColor = ctx.createLinearGradient(0, 0, 360, 600);
				fillColor.addColorStop(0, color2);
				fillColor.addColorStop(1, color1);
				ctx.fillStyle=fillColor;
			}

			function gradient2(color0, color2){
				fillColor = ctx.createLinearGradient(0, 0, 360, 600);
				fillColor.addColorStop(0, color0);	//starting corner
				fillColor.addColorStop(1, color2);	//ending Corner
				ctx.fillStyle=fillColor;
			}

			var colors = ['red', 'orange', 'yellow', 'lime', 'green', 'teal', 'blue', 'purple'];

			//chose a number between 0 and 7
			var randomNumber = Math.floor(Math.random()*colors.length);
			var randomNumber2 = Math.floor(Math.random()*colors.length);

			//when the 2 random Numbers equal the same it creates another randomNumber2
			if (randomNumber === randomNumber2) {
				randomNumber2 = randomNumber+1;
			}else if(randomNumber === 7 && randomNumber2 === 7){
				console.log("seven");
				randomNumber2 = randomNumber-1;
			};

			//diagonal
			//gradient(colors[randomNumber], colors[randomNumber2]);
			//gradient('rgb(255,0,0)', 'rgb(0,255,0)');
			random_r = Math.floor(Math.random() * 255) + 1;
			random_g = Math.floor(Math.random() * 255) + 1;
			random_b = Math.floor(Math.random() * 255) + 1;

			gradient(random_r,random_b,random_g);

			ctx.fillRect(0,0,360,600);
			var img    = c2.toDataURL("image/png");
			canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
			canvas.renderAll();

});

$("#back_patt").on("click", function(e) {
			var random_number = Math.floor(Math.random() * 23) + 1;
			var img = `patterns/bold/${random_number}.jpg`;

			canvas.setBackgroundColor({source: img, repeat: 'repeat'}, function () {
  			canvas.renderAll();
			});


});

$("#back_patt_2").on("click", function(e) {
			var random_number = Math.floor(Math.random() * 359) + 1;
			var img = `patterns/modest/${random_number}.png`;

			canvas.setBackgroundColor({source: img, repeat: 'repeat'}, function () {
  			canvas.renderAll();
			});


});
