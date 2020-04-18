
testcollage= function (opts) {
	var PAGE_DATA = {
		imgnum: 0,
		cimgnum: 0,
		paper: 0,
		selimage: 0,
		caseimage:0,
		selrect: 0,
		hres: 0,
		wres: 0,
		papheight: 0,
		papwidth: 0,
		seltext: 0,
		totalpage: 1,
		folder:null,
		folderobj:null,
		selfolderlink:null,
		savetype:null,
		library: {
			raphael: "js/library/raphael.js",
			jspdf: "js/library/jspdf.js"
		}
	}
	var PAGE_OPTIONS = {
		settings: {
			themePath: "/api/v4/core/common/page/collagemakercss__c",
			upcss:"/api/v4/core/common/page/fucss__c"
		},
		elemId: "itshere",
		loadError: null,
		loadSuccess: null
	};



	function createhtmlbody() {
		var htmlstr = "";
		htmlstr += "		<div id=maindiv>";
		htmlstr += "		 <div class=outerbox>";
		htmlstr += "			<div class=heading id=mainheading>";
		htmlstr += "				<button class=hbtn id=revealside \">|||<\/button>";
		htmlstr += "				<h3 id=headingbar>Collage Maker<\/h3>";
		htmlstr += "				<button class=hbtn id=revealmenu \">...<\/button>";
		htmlstr += "			<\/div>";
		htmlstr += "			<div class=optionbar>";
		htmlstr += "				<button class=optbtn type=\"button\" id=saveimgbtn >save image<\/button>";
		htmlstr += "				<button class=optbtn type=\"button\" id=savepdfbtn >save pdf<\/button>";
		htmlstr += "				<button class=optbtn id=addpagebtn type=\"button\" >add new page<\/button>";
		htmlstr += "				<button class=optbtn id=addtext type=\"button\"  >insert text<\/button>";
		htmlstr += "				<input type=file name=\"file\" accept=\"image\/*\" id=localinput multiple>";
		htmlstr += "				<button type=\"button\" class= optbtn id=fileopener>insert image<\/button>";
		htmlstr += "				<button type=\"button\" class=optbtn id=pagereset>reset all page<\/button>";
		htmlstr += "				";
		htmlstr += "			<\/div>";
		htmlstr += "			<div class=sidebar>";
		htmlstr += "			<\/div>";
		htmlstr += "			<div class=content id=contentid>";
		htmlstr += "			<\/div>";
		htmlstr += "		 <\/div>";
		htmlstr += "	<canvas id=\"canvas\"><\/canvas>";
		htmlstr += "	<div id=functionbox>";
		htmlstr += "		<button type=button id=itf>Bring Front<\/button>";
		htmlstr += "		<button type=button id=itb>Send Back<\/button>";
		htmlstr += "		<button type=button id=mpc>Toggle Phone Case<\/button>";
		htmlstr += "		<h4>Opacity<\/h4>";
		htmlstr += "		<input id=imageopacity type=\"number\" step=1 min=0 max=100 >";
		htmlstr += "		<h4>Rotate<\/h4>";
		htmlstr += "		<div id=rotationbox>";
		htmlstr += "			<button class=rtb type=\"button\" id=leftrotate>Left<\/button>";
		htmlstr += "			<button class=rtb type=\"button\" id=rightrotate>Right<\/button>";
		htmlstr += "		<\/div>";
		htmlstr += "	<\/div>";
		htmlstr += "	<div id=textfunctionbox>";
		htmlstr += "		<button class=funbtn type=button id=ttf>bring front<\/button>";
		htmlstr += "		<button class=funbtn type=button id=ttb>send back<\/button>";
		htmlstr += "		<h4>font size<\/h4>";
		htmlstr += "		<input id=textfontsize type=\"number\" step=1 min=0 max=100 >";
		htmlstr += "		<h4>opacity<\/h4>";
		htmlstr += "		<input id=textopacity type=\"number\" step=1 min=0 max=100 >";
		htmlstr += "		<h4>font color<\/h4>";
		htmlstr += "		<input id=textcolor type=\"color\" >";
		htmlstr += "		<h4>rotate<\/h4>";
		htmlstr += "		<input id=rotationslider type=range step=5 min=0 max=360>";
		htmlstr += "";
		htmlstr += "	<\/div>";
		htmlstr += "	<div id=\"textboxeditor\">";
		htmlstr += "		<input type=\"text\" id=seltexteditor >";
		//file upload html
		htmlstr += "	<\/div>";
		htmlstr += "	<\/div>";
		htmlstr += "<div id=folder_tree_main>";
		htmlstr += "<div id=folder_tree><\/div>";
		htmlstr += "<span>";
		htmlstr += "<b>file name<\/b>";
		htmlstr += "<input type=text id=filenamebox>";
		htmlstr += "<button type=button id=selectiondone>upload<\/button>";
		htmlstr += "<\/span>";
		htmlstr += "<\/div>";

		$("#" + PAGE_OPTIONS.elemId).html(htmlstr);
		console.log("html added", PAGE_OPTIONS.elemId);
	}

	function bind() {
		$("#" + PAGE_OPTIONS.elemId).on('click', function (event) {
			var target = event.target;
			console.log(target.id);
			if (target.id == "revealside") { revealsidebar(); }
			else if (target.id == "revealmenu") { revealmenu(); }
			else if (target.id == "fileopener") { $("#" + PAGE_OPTIONS.elemId).find("#localinput").click(); }
			else if (target.id == "saveimgbtn") {
				PAGE_DATA.savetype = "image";
				multipleimagesaver();
			}
			else if (target.id == "savepdfbtn") {
				PAGE_DATA.savetype = "pdf";
				multipagepdf();
				//fileupload();
			}
			else if (target.id == "leftrotate") { imagerotate(-90); }
			else if (target.id == "rightrotate") { imagerotate(90); }
			else if (target.id == "addpagebtn") { createpage(); }
			else if (target.id == "addtext") { addtexttosvg(); }
			else if (target.id.substring(0, 3) == "img") { addtoican(target); }
			else if (target.id == "pagereset") { resetpage(true); }
			else if (target.id == "contentid" || target.id == "headingbar" || target.id == "mainheading") { $(PAGE_DATA.paper.canvas).click(); }
			else if (target.id == "selectiondone") {
				if(PAGE_DATA.savetype=="pdf"){ 
					multipagepdf();
				}
				if(PAGE_DATA.savetype=="image"){
					multipleimagesaver("image");
				} 
			}
		});
		$("#localinput").on('change', function () {
			addimg();
		});
		$("#rotationslider").on("input change", function () { textrotate(); });

	}

	function oninit() {
		try {
			createhtmlbody();
			$("text").removeProp("font-size", "");
			$.extend(true, PAGE_OPTIONS, opts);
			//loadCSSFile(PAGE_OPTIONS.settings.themePath);
			

			
			setTimeout(function () {
				if ($.isFunction(PAGE_OPTIONS.loadSuccess)) { }
				//PAGE_OPTIONS.loadSuccess.call();
			});
			bind();
			loadlibrary();
			funpro();
			textfunpro();
			showfilebox(false);
		}
		catch (Ex) {
			console.log(Ex);
		}
	};

	function loadlibrary() {
		$.getScript(PAGE_DATA.library.raphael, function () {
			createpage();
		});
		$.getScript(PAGE_DATA.library.jspdf);

	}

	function revealmenu() {
		var initial = $(".optionbar").css("margin-right");
		if (initial == "0px") {
			$(".optionbar").css("margin-right", "-200px");
			$("#functionbox").css({
				"z-index": "10"
			});

		}
		else {
			$(".optionbar").css("margin-right", "0px");
		}
	}


	function revealsidebar() {
		//var z=$("#revealside")[0];
		var initial = $("#" + PAGE_OPTIONS.elemId).find(".sidebar").css("margin-left");
		if (initial == "0px") {
			$("#" + PAGE_OPTIONS.elemId).find(".sidebar").addClass("sidebarhide");
			$("#" + PAGE_OPTIONS.elemId).find(".content").addClass("contentfull");
			//z.innerHTML="show image panel";
		}
		else {
			$("#" + PAGE_OPTIONS.elemId).find(".sidebar").removeClass("sidebarhide");
			$("#" + PAGE_OPTIONS.elemId).find(".content").removeClass("contentfull");
			//z.innerHTML="hide image panal";
		}

	}
	function addimg() {
		$.each($("#" + PAGE_OPTIONS.elemId).find("#localinput")[0].files, function (k, file) {
			addthumbimage(file);
		});
	}


	function addthumbimage(imagefile) {
		var preimg = "";
		preimg += "<div class=\"sidebarimage\" draggable=\"true\"><img class=\"pimg\"></img><\/div>";
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();
			reader.onload = function (e) {
				$("#" + PAGE_OPTIONS.elemId).find(".sidebar").prepend(preimg);
				var topimage = $("#" + PAGE_OPTIONS.elemId).find(".pimg").eq(0);
				$("#" + PAGE_OPTIONS.elemId).find(topimage).attr("src", e.target.result);
				addsidepro(topimage);
			}
			reader.readAsDataURL(imagefile);
		} else {
			alert("This browser does not support FileReader.");
		}
	}

	function addsidepro(element) {
		$("#" + PAGE_OPTIONS.elemId).find(element).attr({
			"id": "img" + PAGE_DATA.imgnum,
		});
		PAGE_DATA.imgnum += 1;
		console.log(element);
		//element.onclick=function(e){addtoican(e);}
	}

	function addtoican(target) {
		height = $("#" + PAGE_OPTIONS.elemId).find(target).css("height");
		width = $("#" + PAGE_OPTIONS.elemId).find(target).css("width");
		cimgid = "c" + target.id + "" + PAGE_DATA.cimgnum;
		PAGE_DATA.cimgnum += 1;
		$("#" + PAGE_OPTIONS.elemId).find(target).animate({
			opacity: '0.5',
			height: height * 0.5,
			width: width * 0.5
		});
		$("#" + PAGE_OPTIONS.elemId).find(target).animate({
			opacity: '1',
			height: height,
			width: width
		});
		var adimg = PAGE_DATA.paper.image(target.src, 10, 10, width, height);
		adimg.attr("transformOrigin", "center")
		adddragpro(adimg);
	}


	//saving image
	function saveimage(tsvg,count) {
		//remove unwanted item
		showselrect(false);
		var svgData = tsvg;
		//var svgData = $("svg")[0].outerHTML;
		var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		var svgUrl = URL.createObjectURL(svgBlob);
		var image = new Image;
		image.onload = function (e) {
			var canvas = $("#" + PAGE_OPTIONS.elemId).find("#canvas")[0];
			canvas.width = image.width;
			canvas.height = image.height;
			var context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			
			var a = document.createElement("a");
			a.download = "mycollage.jpeg";
			a.href = canvas.toDataURL("image/jpef");
			downloadimg = a.href;
			a.click();
			
			
		}
		image.src = svgUrl;
	};

	//drag property to image in svg tag
	function adddragpro(image) {
		x1 = 0;
		y1 = 0;
		rta = 0;
		sx = 0; sy = 0;
		move = function cimgmove(dx, dy, x, y, event) {
			sx = PAGE_DATA.selimage.attrs.x;
			sy = PAGE_DATA.selimage.attrs.y;
			dxt = x - x1;
			dyt = y - y1;
			x1 = x;
			y1 = y;

			this.transform("...T" + dxt + "," + dyt);


		};

		start = function cimgonstart(x, y, event) {
			PAGE_DATA.selimage = this;
			x1 = x;
			y1 = y;
			showselrect(false);
			showeditbox(false);
			showtextfunctionbox(false);
		}
		end = function cimgonend(event) {
			showselrect(false);
			PAGE_DATA.selimage = this;

			showfb(true);
			showselrect(true);
			//selimage.toFront();
			event.stopPropagation();

		};
		image.drag(move, start, end);
	}



	function removeimage(ev) {
		PAGE_DATA.selimage.remove();
		showselrect(false);
		showfb(false);
	}


	//init of functionality
	function funpro() {
		$("#" + PAGE_OPTIONS.elemId).find("#removebtn").attr('onclick', 'removeimage()');
		$("#" + PAGE_OPTIONS.elemId).find("#resizebtn").attr('onclick', 'resizeimage()');
		$("#" + PAGE_OPTIONS.elemId).find("#clearback").attr('onclick', 'clearback()');
		$("#" + PAGE_OPTIONS.elemId).find("#itf").on('click', function (e) {
			PAGE_DATA.selimage.toFront();
		});
		$("#" + PAGE_OPTIONS.elemId).find("#itb").on('click', function (e) {
			PAGE_DATA.selimage.toBack();

		});
		$("#" + PAGE_OPTIONS.elemId).find("#mpc").on('click', function (e) {
			if(PAGE_DATA.caseimage!=0){
				PAGE_DATA.caseimage.node.setAttribute("pointer-events","all");
				PAGE_DATA.caseimage=0;
			}
			else{
				PAGE_DATA.selimage.node.setAttribute("pointer-events","none");
				PAGE_DATA.caseimage=PAGE_DATA.selimage;
			}
			

		});
		$("#" + PAGE_OPTIONS.elemId).find("#imageopacity").on('click keyup', function (e) {
			PAGE_DATA.selimage.attr("opacity", parseInt($(e.target).val()) * 0.01);
		});


	}
	function addselrect() {
		var ib = PAGE_DATA.selimage.node.getBoundingClientRect();
		var bb = PAGE_DATA.paper.canvas.getBoundingClientRect();
		xp = ib.left - bb.left;
		yp = ib.top - bb.top;
		w = ib.width;
		h = ib.height;
		var rect = PAGE_DATA.paper.rect(xp - 5, yp - 5, w + 10, h + 10).attr({ "stroke-dasharray": "--" });


		wx = xp + w + 5;
		wy = yp + Math.floor(h * 0.5);
		hx = xp + Math.floor(w * 0.5);
		hy = yp + h + 5;

		PAGE_DATA.hres = PAGE_DATA.paper.ellipse(hx, hy, w * 0.54, 6).attr({ "fill": "#001a1a", "opacity": 0.5 });
		//PAGE_DATA.hres.opacity()
		PAGE_DATA.hres.toFront();
		PAGE_DATA.wres = PAGE_DATA.paper.ellipse(wx, wy, 6, h * 0.54).attr({ "fill": "#001a1a", "opacity": 0.5 });
		PAGE_DATA.wres.toFront();
		resizepro();
		//remove btn
		remb = PAGE_DATA.paper.circle(xp + w + 5, yp - 2, 10).attr("fill", "red");
		rembtnpro(remb);
		//selection set
		PAGE_DATA.selrect = PAGE_DATA.paper.set();
		PAGE_DATA.selrect.push(
			rect, rect.glow(), PAGE_DATA.hres, PAGE_DATA.wres, remb
		);

	}

	function resizepro() {
		x1 = 0;
		y1 = 0;
		var imageangle = 0;
		wstart = function (x, y, event) {
			x1 = x;
			y1 = y;
			imageangle = PAGE_DATA.selimage.matrix.split().rotate;
			showfb(false);
		};
		wmove = function (dx, dy, x, y, event) {

			dxt = x - x1;
			x1 = x;
			dyt = y - y1;
			y1 = y;
			if (imageangle == 0 || imageangle == 180) {
				PAGE_DATA.selimage.attr("width", Math.max(parseInt(PAGE_DATA.selimage.attrs.width) + dxt, 10));
				if (imageangle == 180) {
					PAGE_DATA.selimage.transform("...T" + dxt + "," + 0);

				}
			}
			else {
				PAGE_DATA.selimage.attr("height", Math.max(parseInt(PAGE_DATA.selimage.attrs.height) + dxt, 10));
				if (imageangle == 90) {
					PAGE_DATA.selimage.transform("...T" + dxt + "," + 0);
				}
			}

			PAGE_DATA.wres.attr("cx", parseInt(PAGE_DATA.wres.attrs.cx) + dxt);
			PAGE_DATA.wres.attr("cy", parseInt(PAGE_DATA.wres.attrs.cy) + dyt);

		};
		wend = function (event) {
			showselrect(false);
			showselrect(true);
			showfb(true);
		};
		hstart = function () { };
		hmove = function (dx, dy, x, y, event) {
			dxt = x - x1;
			x1 = x;
			dyt = y - y1;
			y1 = y;
			if (imageangle == 0 || imageangle == 180) {
				PAGE_DATA.selimage.attr("height", Math.max(parseInt(PAGE_DATA.selimage.attrs.height) + dyt, 10));
				if (imageangle == 180) {
					PAGE_DATA.selimage.transform("...T" + 0 + "," + dyt);

				}
			}
			else {
				PAGE_DATA.selimage.attr("width", Math.max(parseInt(PAGE_DATA.selimage.attrs.width) + dyt, 10));
				if (imageangle == -90) {
					PAGE_DATA.selimage.transform("...T" + 0 + "," + dyt);
				}
			}
			PAGE_DATA.hres.attr("cx", parseInt(PAGE_DATA.hres.attrs.cx) + dxt);
			PAGE_DATA.hres.attr("cy", parseInt(PAGE_DATA.hres.attrs.cy) + dyt);
		};
		hend = function () { };
		PAGE_DATA.wres.drag(wmove, wstart, wend);
		PAGE_DATA.hres.drag(hmove, wstart, wend);
		PAGE_DATA.wres.hover(function () {
			this.attr("cursor", "e-resize");
		});

		PAGE_DATA.hres.hover(function () {
			this.attr("cursor", "s-resize");
		});

	}


	//to show  and hide function bar
	function showfb(flag) {
		if (flag) {
			$("#" + PAGE_OPTIONS.elemId).find(".optionbar").css("margin-right", "-200px");
			$("#" + PAGE_OPTIONS.elemId).find("#functionbox").css({
				display: 'block',
				"z-index": "40"
			});
			$("#" + PAGE_OPTIONS.elemId).find("#imageopacity").val(PAGE_DATA.selimage.attr("opacity") * 100);
		}
		else {
			$("#" + PAGE_OPTIONS.elemId).find("#functionbox").css({
				display: 'none',
				"z-index": ""
			});
		}
	}

	function showselrect(flag) {
		if (flag) {
			addselrect();
		}
		else {
			if (PAGE_DATA.selrect != 0) {
				PAGE_DATA.selrect.remove();
				PAGE_DATA.selrect = 0;
			}
		}
	}

	function rembtnpro(rembtn) {
		rembtn.hover(function () {
			this.g = rembtn.glow();
		},
			function () {
				this.g.remove();
			});

		remb.click(function (event) {
			this.g.remove()
			removeimage();
		});
	}
	function addtexttosvg() {
		var x = Math.floor(PAGE_DATA.papwidth * 0.5);
		var y = Math.floor(PAGE_DATA.papheight * 0.5);
		text = PAGE_DATA.paper.text(x, y, "double click to edit the text").attr("font-size", 32);
		console.log(text);
		text.dblclick(function (event) {
			textdblclick(event, this);
			event.stopPropagation();
		});
		text.hover(function () {
			this.attr("cursor", "move");
		});
		addtextdragpro(text);
	}
	//chnagng text of svg text element
	function changesvgtext(event) {
		var nt = $("#" + PAGE_OPTIONS.elemId).find("#textboxeditor input").val();
		if (PAGE_DATA.seltext != 0) {
			PAGE_DATA.seltext.attr("text", nt);
		}
	}

	function textdblclick(event, element) {
		PAGE_DATA.seltext = element;
		showeditbox(true);
		$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor input").val(PAGE_DATA.seltext.attr("text"));
		$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor input").focus();
		$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor input").select();
		$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor input").on("keyup", function (e) {
			changesvgtext(e);
		});
	}

	function showeditbox(flag, element) {
		if (flag) {
			$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor").css({
				"position": "absolute",
				"top": event.pageY + 5,
				"left": event.pageX,
				"display": "block"
			});
		}
		else {
			$("#" + PAGE_OPTIONS.elemId).find("#textboxeditor").css({
				"display": "none"
			});
			//PAGE_DATA.seltext=0;
		}
	}
	function showtextfunctionbox(flag) {
		if (flag) {
			$("#" + PAGE_OPTIONS.elemId).find(".optionbar").css("margin-right", "-200px");
			$("#" + PAGE_OPTIONS.elemId).find("#textfunctionbox").css({
				"display": "block",
				"z-index": "40"
			});
			$("#" + PAGE_OPTIONS.elemId).find("#textfontsize").val(PAGE_DATA.seltext.attr("font-size"));
			$("#" + PAGE_OPTIONS.elemId).find("#textopacity").val(PAGE_DATA.seltext.attr("opacity") * 100);
			$("#" + PAGE_OPTIONS.elemId).find("#rotationslider").val(PAGE_DATA.seltext.matrix.split().rotate);
		}
		else {
			$("#" + PAGE_OPTIONS.elemId).find("#textfunctionbox").css({
				"display": "none"
			});
			var z = $("#" + PAGE_OPTIONS.elemId).find("contentid").css("right");
			if (z != '0px') {
				//$(".optionbar").css("margin-right","0px");
			}
		}
	}
	//work to be done
	function textfunpro() {
		$("#" + PAGE_OPTIONS.elemId).find("#textfontsize").on('click keyup', function (e) {
			PAGE_DATA.seltext.attr("font-size", +$(e.target).val());

		});
		$("#" + PAGE_OPTIONS.elemId).find("#textopacity").on('click keyup', function (e) {
			PAGE_DATA.seltext.attr("opacity", parseInt($(e.target).val()) * 0.01);
		});
		$("#" + PAGE_OPTIONS.elemId).find("#ttf").on('click', function (e) {
			PAGE_DATA.seltext.toFront();
		});
		$("#" + PAGE_OPTIONS.elemId).find("#ttb").on('click', function (e) {
			PAGE_DATA.seltext.toBack();
		});
		$("#" + PAGE_OPTIONS.elemId).find("#textcolor").on('change', function (e) {
			PAGE_DATA.seltext.attr("fill", $("#textcolor").val())
		});

	}

	function addtextdragpro(text) {
		x1 = 0;
		y1 = 0;
		move = function (dx, dy, x, y, event) {
			event.stopPropagation();
			dxt = x - x1;
			dyt = y - y1;
			x1 = x;
			y1 = y;
			this.transform("...T" + dxt + "," + dyt);
		};

		start = function (x, y, event) {
			event.stopPropagation();

			PAGE_DATA.seltext = this;
			//this.toFront();
			x1 = x;
			y1 = y;
			showselrect(false);
			showfb(false);
			showeditbox(false);
			showtextfunctionbox(false);


		}
		end = function (event) {
			event.stopPropagation();
			//PAGE_DATA.seltext.toFront();
			showtextfunctionbox(true);
			PAGE_DATA.seltext.glow();

		};
		text.drag(move, start, end);
	}
	



	function textrotate() {
		if (PAGE_DATA.seltext != 0) {
			var cv = PAGE_DATA.seltext.matrix.split().rotate;
			PAGE_DATA.seltext.rotate($("#" + PAGE_OPTIONS.elemId).find("#rotationslider").val() - cv);
		}
	}

	function imagerotate(value) {
		if (PAGE_DATA.selimage != 0) {
			var z = PAGE_DATA.selimage.node.getBBox();
			var y = PAGE_DATA.selimage.node.getBoundingClientRect();
			var x = $(PAGE_DATA.selimage.node).position();
			PAGE_DATA.selimage.rotate(value, z.x + z.width / 2, z.y + z.height / 2);
			showselrect(false);
			showselrect(true);
		}
	}

	function createpage() {
		var nd = "<div id=pageno" + PAGE_DATA.totalpage + "></div>"
		$("#" + PAGE_OPTIONS.elemId).find("#contentid").append(nd);
		var container = $("#" + PAGE_OPTIONS.elemId).find("#pageno" + PAGE_DATA.totalpage);
		if (PAGE_DATA.papwidth == 0) {
			PAGE_DATA.papwidth = parseInt(container.css("width"));
			var x = document.querySelectorAll("#pageno" + PAGE_DATA.totalpage);
			console.log(x);
			z = x[0].getBoundingClientRect();
			PAGE_DATA.papwidth = z.width;
			PAGE_DATA.papheight = PAGE_DATA.papwidth * 1.414;
		}
		container.css({
			"width": PAGE_DATA.papwidth,
			"height": PAGE_DATA.papheight
		});
		var page = new Raphael(container[0], PAGE_DATA.papwidth, PAGE_DATA.papheight);
		page.canvas.style.backgroundColor = '#FFF';
		PAGE_DATA.totalpage += 1;
		var c = 0;
		page.canvas.onclick = function () {
			//hiding side bar 
			///////////////////////////////
			console.log($("#contentid").length, c++);
			var l = $("#" + PAGE_OPTIONS.elemId).find("#contentid").css("left");
			if (l == '0px') {
				$("#" + PAGE_OPTIONS.elemId).find(".sidebar").addClass("sidebarhide");
				$("#" + PAGE_OPTIONS.elemId).find(".optionbar").css("margin-right", "-200px");
			}

			////////////////////////////////
			$(PAGE_DATA.paper.canvas).parent().css({
				"-webkit-box-shadow": "",
				"-moz-box-shadow": "",
				"box-shadow": ""
			});
			$("#" + PAGE_OPTIONS.elemId).find(page.canvas).parent().css({
				"-webkit-box-shadow": "0px 1px 20px 0px #eee",
				"-moz-box-shadow": "0px 1px 20px 0px #eee",
				"box-shadow": "0px 1px 20px 0px #eee"
			});
			PAGE_DATA.paper = page;
			topelement = page.getElementByPoint(event.pageX, event.pageY);
			if (topelement == null) {
				showfb(false);
				PAGE_DATA.selimage = 0;
				showselrect(false);
				showeditbox(false);
				showtextfunctionbox(false);
			}
		};
		$(page.canvas).click();
		PAGE_DATA.paper = page;
	}

	function multipleimagesaver() {
		showselrect(false);
		///setting online upload
		///////
		var count=0;
		$("#" + PAGE_OPTIONS.elemId).find("#contentid div").each(function () {
			var tsvgdata = $(this)[0].innerHTML;
			saveimage(tsvgdata,count);
			count+=1;
		});

	}

	function multipagepdf() {
		console.log("pdf saver called");
		//fileupload();
		var imageloaded = 0;
		var totalimage = $("#" + PAGE_OPTIONS.elemId).find("#contentid").children().length;
		var svgurlcoll = []
		showselrect(false);

		$("#" + PAGE_OPTIONS.elemId).find("#contentid div").each(function () {
			var svgData = $(this)[0].innerHTML;
			var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
			var svgUrl = URL.createObjectURL(svgBlob);
			svgurlcoll.push(svgUrl);
		});
		var doc = new jsPDF('p', 'px', 'a4', true);
		function imageadder(index) {
			var image = new Image;
			image.onload = function (e) {
				image.width = doc.internal.pageSize.width;
				image.height = doc.internal.pageSize.height;
				var context = canvas.getContext("2d");
				doc.addImage(image, 'JPEG', 0, 0, image.width, image.height);
				index += 1;
				if (index == totalimage) {
					doc.save('collage.pdf');
					//var fil=doc.output('arraybuffer');
					//console.log("blob",fil);
					//realflup(fil,"pdf",0);
				}
				else {
					doc.addPage();
					imageadder(index);
				}
			}
			image.src = svgurlcoll[index];
		}
		imageadder(0);

	}



	function resetpage(ask) {
		if (ask) {
			var z = confirm("Are you sure?\nthis will reset all changes");
		}
		if (z || true) {
			$("#" + PAGE_OPTIONS.elemId).find("#contentid")[0].innerHTML = "";
			PAGE_DATA.totalpage = 1;
			PAGE_DATA.papwidth = 0;
			PAGE_DATA.papheight = 0;
			createpage();
		}
	}

	//////////real file upload after folder selection done/////
	////////latest file saver

	function realflup(blob,type,count){
		var filename="test.pdf";
		var file;
		if (type == "pdf") {
			filename = $("#filenamebox").val() || "testfile.pdf";
			//console.log(filename,"or ",$("#filenamebox").val());
			file = new File([blob], filename, { type: "application/pdf" });
			console.log("file", file);
		}
		if(type=="image"){
			var filename = ""+count+$("#filenamebox").val() || "testfile.jpeg";
			//console.log(filename,"or ",$("#filenamebox").val());
			var file = new File([blob], filename, { type: "image/JPEG" });
			console.log("file", file);
		}
		var fid=PAGE_DATA.folderobj.getSelectedFolder().id;
		console.log("id=",fid);
		if(fid==""){alert("please select a folder");}
		else{
			var props= {
				'name': filename,
				'folderId': fid,
			 }
			 var opt={}
			var url=a2z.api.drive.getFileUploadURL(props,opt);
			console.log(url);
			//uploading
			var fd=new FormData();
			fd.append('file',file);
			xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			
			//xhr.setRequestHeader('X-File-Size', file.size);
			//xhr.setRequestHeader('Content-Type', file.type);
			console.log(fd);
			xhr.send(fd);
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					console.log(xhr.responseText,"done");
					alert("file successfully saved to selected folder");
				}
			};
		}
	}
	////////////////////file ipload viewer
	function fileupload(){
		console.log("folder structure");
		a2z.changePage("a2z.component.drive.folder.treebox.TreeBox",
			{
			context:{},
			settings:
				{
					showVirtualFolders:false,
					showPersonalFolders:true,
					showSetting:true, 
					virtualFolderSelectable:false,
					noBox:true,
					onHide:null  
				},
				elemId:"folder_tree",
				onSelect:function(opt)
				{
					console.log("a folder is selected",PAGE_DATA.folderobj.getSelectedFolder());
					$("#filenamebox").prop("readonly",false);
				}
			},
			{
				success:function(obj)
				{
					a2z.loader('hide');
					obj.object.show();
					console.log("drive successfully created",obj);
					PAGE_DATA.folderobj=obj.object;
					showfilebox(true);
				},
				error:function(options)
				{
					a2z.loader('hide');
					a2z.error('Chitchat - '+options.msg);
				}
			});
			console.log("file upload complete");
	}

	function showfilebox(flag){

		if(flag){
			a2z.ui.box(
				{
				title:"select folder", 
				width:$(window).width()*0.9,
				height:$(window).height()*0.9,
				content:'',
				left:'center', 
				top:50, 
				showCloseBtn:true,
				closeOnClick:false,
				onClose:function(){
					console.log("folder selector closed");
					$("#filenamebox").prop("readonly",true);
					PAGE_DATA.folder=null;
				}
				},"folder_tree_main");

				$("#folder_tree_main").css({
					"display":"block",
				});
				$("#folder_tree").css({
					height:$(window).height()*0.6
				});

		}else{
			$("#folder_tree_main").css("display","none");
		}

	}
	///////////initializer
	oninit();
}