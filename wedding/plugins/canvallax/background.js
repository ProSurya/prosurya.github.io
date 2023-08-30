var can = Canvallax({
	className: "bg-canvas",
	damping: 40,
});

// Clouds
(function () {
	////////////////////////////////////////

	var origWidth = (width = document.body.clientWidth),
		origHeight = (height = document.body.clientHeight);

	var gradient = Canvallax.Rectangle({
		width: width * 1.5,
		height: height * 1.1,
		zIndex: 1,
		fill: (function () {
			var canvas = document.createElement("canvas"),
				ctx = canvas.getContext("2d"),
				gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "#022235");
            gradient.addColorStop(1, "#1589d2");
			// gradient.addColorStop(0, "#07588A");
			// gradient.addColorStop(1, "#E1F6F4");
			return gradient;
		})(),
	});

	can.add(gradient);

	function randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	var stars = [],
		number = 300,
		i = 0,
		distance;

	for (; i < number; i++) {
		distance = randomRange(0.1, 0.3);
		stars.push(
			Canvallax.Circle({
				x: Math.random() * width,
				y: Math.random() * height * 0.9,
				distance: distance,
				size: 4,
				fill: "#FFF",
			})
		);
	}

	can.add(stars);

	window.addEventListener("resize", function () {
		height = document.body.clientHeight;

		var i = can.elements.length,
			max = document.body.clientWidth,
			heightScale = height / origHeight;

		console.log(height, origHeight, heightScale);

		while (i--) {
			can.elements[i].maxX = max; //document.body.clientWidth;
			can.elements[i].origY = can.elements[i].origY || can.elements[i].y;
			can.elements[i].y = can.elements[i].origY * heightScale;
		}
	});

	////////////////////////////////////////

	// Adapted from https://bost.ocks.org/mike/algorithms/
	function bestCandidateSampler(width, height, numCandidates) {
		var samples = [];

		function findDistance(a, b) {
			var dx = a[0] - b[0],
				dy = a[1] - b[1];
			return dx * dx + dy * dy;
		}

		function findClosest(c) {
			var i = samples.length,
				sample,
				closest,
				distance,
				closestDistance;

			while (i--) {
				sample = samples[i];
				distance = findDistance(sample, c);

				if (!closestDistance || distance < closestDistance) {
					closest = sample;
					closestDistance = distance;
				}
			}

			return closest;
		}

		function getSample() {
			var bestCandidate,
				bestDistance = 0,
				i = 0,
				c,
				d;

			c = [Math.random() * width, Math.random() * height];

			if (samples.length < 1) {
				bestCandidate = c;
			} else {
				for (; i < numCandidates; i++) {
					c = [Math.random() * width, Math.random() * height];
					d = findDistance(findClosest(c), c);

					if (d > bestDistance) {
						bestDistance = d;
						bestCandidate = c;
					}
				}
			}

			samples.push(bestCandidate);
			//console.log('bestCandidate',bestCandidate);
			return bestCandidate;
		}

		getSample.all = function () {
			return samples;
		};
		getSample.samples = samples;

		return getSample;
	}

	var getCandidate = bestCandidateSampler(width, height, 10);

	var CLOUD_COUNT = 40,
		CLOUD_WIDTH = 510,
		CLOUD_HEIGHT = 260;

	CLOUD_COUNT = Math.floor((width * height) / (CLOUD_WIDTH * CLOUD_HEIGHT));

	function randomRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	function randomizedCloud(image) {
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d"),
			width = (canvas.width = randomRange(400, 700)), //CLOUD_WIDTH,
			height = (canvas.height = randomRange(200, 260)), //CLOUD_HEIGHT,
			w = image.width,
			h = image.height,
			halfw = w / 2,
			halfh = h / 2,
			i = Math.ceil(randomRange(20, 90)), //60
			flip,
			randScale,
			randTex,
			maxScale = 2.5,
			fullPi = Math.PI / 2;

		while (i--) {
			randScale = randomRange(0.4, maxScale);
			ctx.globalAlpha = Math.random() - 0.2;
			ctx.translate(
				randomRange(halfw, width - w * maxScale * 1.3),
				randomRange(halfh + halfh / 4, height - h * maxScale)
			);
			ctx.scale(randScale, randomRange(randScale - 0.3, randScale));
			ctx.translate(halfw, halfh);
			ctx.rotate(randomRange(0, fullPi));
			ctx.drawImage(image, -halfw, -halfh); //, w, h, 0, 0, w, h);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}

		return canvas; //.toDataURL();
	}

	var cloudImg = new Image();

	cloudImg.addEventListener("load", function () {
		var i = CLOUD_COUNT, //Math.ceil(CLOUD_COUNT * 0.5),
			el,
			rand,
			pos,
			tex;

		while (i--) {
			rand = randomRange(0.4, 1.2);
			pos = getCandidate();
			tex = randomizedCloud(cloudImg);

			cloud = Canvallax.Image({
				image: tex,
				width: tex.width,
				height: tex.height,
				//init: function(){},

				zIndex: rand * 13,
				x: pos[0],
				y: pos[1],
				opacity: rand < 0.8 ? 0.8 : rand,
				distance: rand,

				maxX: width,
				speed: rand * randomRange(0.2, 0.4),
				postRender: function () {
					this.x =
						this.x * this.distance > -this.width
							? this.x - this.speed
							: this.maxX + this.width * 2;
				},
			});

			can.add(cloud);
		}

		can.render();
	});

	cloudImg.src =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAYFBMVEX///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8GYpHzAAAAIHRSTlMAAwcLDxIWGh8kKzI5QEhPVl9qc3uEi5Sdpa64wcrV4c6KdP8AAAOeSURBVHgBndQJkvM8DoNhS+nv/ieONBH8FIs1nb83ZLfF1wBFZ17vNMZ8fPz79/GY46Xre8F85kRzzhdk/A2TOpSARpF/g0mdaI8XZjg47leA32Jo3wbEooNE/SFGrPOAiPxC+xaDAxBTxQqFoW8wGGof89E4j8nQUceo621h/KY8GuXx4Mg10vRZlPd55JCEnXlIQX7cE8pNp8Dob4oY8LjZTny8QEMo2o2hSqT5YImxchVNbpgZ3oVR4xVUgOlGS5fFKCPSWDY4Yu1xIKyEEqLfE0UUKcoJ9MFVsAhnaOpEGW4gyxFyLitOeRhZO8NJur1hKpWWCV03oaG9yYcYXvD7UPbetVOMNwqlWH6/b7sp29G1Z5g6LFGaY9uYB2A6M7evtVco3U3M1CCopOlNY8Q7cdZahxIMTpv7meR2NghWDqdu8MTZzwMqN+RaBkmdUgf7wMfN1d1cNSAFMdhQ3tLXu2STuclylwYL5QYhsGyLz499bcgxK1F5SmumvaoRrIwSjYutaGbVZIgze6wegLO6i8MD2kJ1N1cYKAUXTLnRWxtnYrMONWRRD+EsA3utw4mnKxNCZRgplK5T05ycvaaZCmtAOEKl+p4ge70k06mcdrQoPgGpbY1EboNyY7/ZHVsfK1BLhBAdCA5MGd719b0gUOJmg9vc5hf3E+K2y1EQDnCjxoGs3t84WiA6zI253rVy6MRnSKNxJtQcRY3xL90MkN6DYGZHI3zBMaF1NcoUQ3Oll+9RBqHb1uIzSTmv9LtQOJbC7Ci/fRsivh0+sBrYwix3GKe8No5yHJTDaZqhqOp8KC6BdmXrFKFaXUUWk7uCLsRPbuAZrmsPjCANBKChIZj/97IBzSJq3pgpymiYRmnxMLG9YbinUGCk5rxbUhJDy/yH+C5U3wP1FQWDL5AtWpNQm0IRz/ys+psCTSKuCObTjY3KhLoCrbUY7ZgIqHRXrTSFHxwfFjcM1fWF8devtJPK2XtM6nAOpcrCXDlVR967qRi6XOY78NJsi95gcsJynMXF2k6gAFFhVFGLz0loz5u0HGoEGF6qOoVgC6cOB6iBb0Ixue66p+p8F+v17VkhUTqGXP6pVptC8JU07z0Ga5VqjmUpvBvuC8wpej4bJiXK+ZHnazfXyfUSipxPVJQvMTjppUKlFUVvv8PIVftrSIRD+Q6DQ7a47wzE9xjaYJk1Fty1v8CYauOLm+fv3Cikjv4lBqVCAP6n/gfZhdXQlm1mfwAAAABJRU5ErkJggg==";
})();
