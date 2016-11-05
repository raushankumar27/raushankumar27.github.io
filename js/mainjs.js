var imgnum=0;
var cimgnum=0;
var paper=0;
var optionselector;
var selimage=0;
var selrect=0;
var background=0;
var hres=0;
var wres=0;
var papheight=0;
var papwidth=0
var seltext=0;
var totalpage=1;
var papercollection=[];

function oninit(){
	$("body").on('click',function(event){
		var target=event.target;
		console.log(target.id);
		if(target.id=="revealside"){revealsidebar();}
		else if(target.id=="revealmenu"){revealmenu();}
		else if(target.id=="fileopener"){$("#localinput").click();}
		else if(target.id=="saveimgbtn"){multipleimagesaver("image");}
		else if(target.id=="savepdfbtn"){multipagepdf();}
		else if(target.id=="leftrotate"){imagerotate(-90);}
		else if(target.id=="rightrotate"){imagerotate(90);}
		else if(target.id=="pagereset"){resetpage();}
		else if(target.id.substring(0,3)=="img"){addtoican(target);}
		else if(target.id=="contentid" || target.id=="headingbar" ||target.id=="mainheading"){$(paper.canvas).click();}
	});
	$("#localinput").on('change', function () {
			addimg();
	});
	$("#rotationslider").on("input change",function(){textrotate();});
	createpage();
	funpro();
	textfunpro();
};


function revealmenu(){
	var initial=$(".optionbar").css("margin-right");
	if(initial=="0px"){
		$(".optionbar").css("margin-right","-200px");
	}
	else{
		$(".optionbar").css("margin-right","0px");
	}
}


function revealsidebar() {
	//var z=$("#revealside")[0];
	var initial=$(".sidebar").css("margin-left");
	if(initial=="0px"){
		$(".sidebar").addClass("sidebarhide");
		$(".content").addClass("contentfull");
		//z.innerHTML="show image panel";
	}
	else{
		$(".sidebar").removeClass("sidebarhide");
		$(".content").removeClass("contentfull");
		//z.innerHTML="hide image panal";
	}

}
function addimg(){
	$.each($("#localinput")[0].files,function(k,file){
			addthumbimage(file);
	});
}


function addthumbimage(imagefile){
	var preimg="";
	preimg += "<div class=\"sidebarimage\" draggable=\"true\"><img class=\"pimg\"></img><\/div>";
	if (typeof (FileReader) != "undefined") {
		var reader = new FileReader();
			reader.onload = function (e) {
				$(".sidebar").prepend(preimg);
				var topimage= $(".pimg").eq(0);
				$(topimage).attr("src",e.target.result);
				addsidepro(topimage);
			}
			reader.readAsDataURL(imagefile);
	} else {
		alert("This browser does not support FileReader.");
	}
}

function addsidepro(element){
	$(element).attr({
		"id":"img"+imgnum,
		"onclick":"addtoican(event)"
		});
		imgnum+=1;
}

function addtoican(event){
	height=$(event.target).css("height");
	width=$(event.target).css("width");
	cimgid="c"+event.target.id+""+cimgnum;
	cimgnum+=1;
	 $(event.target).animate({
            opacity: '0.5',
            height: height*0.5,
            width: width*0.5
        });
   $(event.target).animate({
            opacity: '1',
            height: height,
            width: width
        });
		var adimg=paper.image(event.target.src,10,10,width,height);
		adimg.attr("transformOrigin", "center")
	adddragpro(adimg);
	//addclickpro(adimg);
}


//saving image
function saveimage(tsvg){
	//remove unwanted item
	showselrect(false);
	var svgData = tsvg;
	//var svgData = $("svg")[0].outerHTML;
	var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	var svgUrl = URL.createObjectURL(svgBlob);
	var image=new Image;
	image.onload= function(e){
		var canvas=$("#canvas")[0];
		canvas.width=image.width;
		canvas.height=image.height;
		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0);
		var a = document.createElement("a");
		a.download = "mycollage.jpeg";
		a.href = canvas.toDataURL("image/jpef");
		downloadimg=a.href;
		a.click();
	}
	image.src=svgUrl;
};

//drag property to image in svg tag
function adddragpro(image){
	x1=0;
	y1=0;
	rta=0;
	sx=0;sy=0;
	move=function cimgmove(dx,dy,x,y,event){
		sx=selimage.attrs.x;
		sy=selimage.attrs.y;
		dxt=x-x1;
		dyt=y-y1;
		x1=x;
		y1=y;

		this.transform("...T" + dxt  + "," + dyt);
		//selimage.attr("x", sx+dxt);
		//selimage.attr("y", sy+dyt);
		 
	};

	start=function cimgonstart(x,y,event){
		selimage=this;
		x1=x;
		y1=y;
		showselrect(false);
		showeditbox(false);
		showtextfunctionbox(false);
	}
	end=function cimgonend(event){
		showselrect(false);
		selimage=this;
		
		showfb(true);
		showselrect(true);
		//selimage.toFront();
		event.stopPropagation();
		
	};
	image.drag(move, start, end);
}



function removeimage(ev){
	selimage.remove();
	showselrect(false);
	showfb(false);
}


//init of functionality
function funpro(){
	$("#removebtn").attr('onclick','removeimage()');
	$("#resizebtn").attr('onclick','resizeimage()');
	$("#backgroundbtn").attr('onclick','setsvgbackground()');
	$("#clearback").attr('onclick','clearback()');
	$("#itf").on('click',function(e){
		selimage.toFront();
	});
	$("#itb").on('click',function(e){
		selimage.toBack();
		if(background!=0){background.toBack();}
		
	});
	$("#imageopacity").on('click keyup',function(e){
		selimage.attr("opacity",parseInt($(e.target).val())*0.01);
	});
	

}
function addselrect(){
	var ib=selimage.node.getBoundingClientRect();
	var bb=paper.canvas.getBoundingClientRect();
	xp=ib.left-bb.left;
	yp=ib.top-bb.top;
	w=ib.width;
	h=ib.height;
	var rect=paper.rect(xp-5,yp-5,w+10,h+10).attr({"stroke-dasharray":"--"});


	wx=xp+w+5;
	wy=yp+Math.floor(h*0.5);
	hx=xp+Math.floor(w*0.5);
	hy=yp+h+5;

	hres=paper.ellipse(hx,hy,w*0.54,6).attr({"fill":"#001a1a","opacity":0.5});
	//hres.opacity()
	hres.toFront();
	wres=paper.ellipse(wx,wy,6,h*0.54).attr({"fill":"#001a1a","opacity":0.5});
	wres.toFront();
	resizepro();
	//remove btn
	remb=paper.circle(xp+w+5,yp-2,10).attr("fill","red");
	rembtnpro(remb);
	//selection set
	selrect=paper.set();
	selrect.push(
		rect,rect.glow(),hres,wres,remb
	);

}

function setsvgbackground(){
	if (selimage!=0){
		if(background!=0){
			background.remove();
			background=0;
		}
		background=paper.image(selimage.attrs.src,0,0,paper.width,paper.height).toBack();
		
	}

}

function clearback(){
	if(background!=0){
		background.remove();
		background=0;
	}
}


function resizepro(){
	x1=0;
	y1=0;
	var imageangle=0;
	wstart=function(x,y,event){
		x1=x;
		y1=y;
		imageangle=selimage.matrix.split().rotate;
		showfb(false);
	};
	wmove=function(dx,dy,x,y,event){

		dxt=x-x1;
		x1=x;
		dyt=y-y1;
		y1=y;
		if(imageangle==0 || imageangle==180){
			selimage.attr("width",Math.max(parseInt(selimage.attrs.width)+dxt,10));
			if(imageangle==180){
				selimage.transform("...T" + dxt  + "," + 0);

			}
		}
		else{
			selimage.attr("height",Math.max(parseInt(selimage.attrs.height)+dxt,10));
			if(imageangle==90){
				selimage.transform("...T" + dxt  + "," + 0);
			}
		}
		
		wres.attr("cx",parseInt(wres.attrs.cx)+dxt);
		wres.attr("cy",parseInt(wres.attrs.cy)+dyt);
		
	};
	wend=function(event){
		showselrect(false);
		showselrect(true);
		showfb(true);
	};
	hstart=function(){};
	hmove=function(dx,dy,x,y,event){
		dxt=x-x1;
		x1=x;
		dyt=y-y1;
		y1=y;
		if(imageangle==0 || imageangle==180){
			selimage.attr("height",Math.max(parseInt(selimage.attrs.height)+dyt,10));
			if(imageangle==180){
				selimage.transform("...T" + 0  + "," + dyt);

			}
		}
		else{
			selimage.attr("width",Math.max(parseInt(selimage.attrs.width)+dyt,10));
			if(imageangle==-90){
				selimage.transform("...T" + 0  + "," + dyt);
			}
		}
		hres.attr("cx",parseInt(hres.attrs.cx)+dxt);
		hres.attr("cy",parseInt(hres.attrs.cy)+dyt);
	};
	hend=function(){};
	wres.drag(wmove,wstart,wend);
	hres.drag(hmove,wstart,wend);
	wres.hover(function(){
		this.attr("cursor","e-resize");
	});

	hres.hover(function(){
		this.attr("cursor","s-resize");
	});

}


//to show  and hide function bar
function showfb(flag){
	if(flag){
		$(".optionbar").css("margin-right","-200px");
		$("#functionbox").css({
			display:'block',
			"z-index":"40"
		});
		$("#imageopacity").val(selimage.attr("opacity")*100);
	}
	else{
		$("#functionbox").css({
			display:'none',
			"z-index":""
		});
	}
}

function showselrect(flag){
	if(flag){
		addselrect();
	}
	else{
		if(selrect!=0){
			selrect.remove();
			selrect=0;
		}
	}
}

function rembtnpro(rembtn){
	rembtn.hover(function(){
		this.g=rembtn.glow();
	},
	function(){
		this.g.remove();
	});

	remb.click(function(event){
		this.g.remove()
		removeimage();
	});
}

function addtexttosvg(){
	var x=Math.floor(papwidth*0.5);
	var y=Math.floor(papheight*0.5);
	text=paper.text(x,y,"double click to edit the text").attr("font-size",22);
	text.dblclick(function(event){
		textdblclick(event,this);
		event.stopPropagation();
	});
	text.hover(function(){
		this.attr("cursor","move");
	});
	addtextdragpro(text);
}
//chnagng text of svg text element
function changesvgtext(event){
	var nt=$("#textboxeditor input").val();
	if(seltext!=0){
		seltext.attr("text",nt);
	}
}

function textdblclick(event,element){
	seltext=element;
	showeditbox(true);
	$("#textboxeditor input").val(seltext.attr("text"));
	$("#textboxeditor input").focus();
	$("#textboxeditor input").select();
	$("#textboxeditor input").on("keyup",function(e){
		changesvgtext(e);
	});
}

function showeditbox(flag,element){
	if(flag){
		$("#textboxeditor").css({
			"position":"absolute",
			"top":event.pageY+5,
			"left":event.pageX,
			"display":"block"
		});
	}
	else{
		$("#textboxeditor").css({
			"display":"none"
		});
		//seltext=0;
	}	
} 
function showtextfunctionbox(flag){
	if(flag){
		$(".optionbar").css("margin-right","-200px");
		$("#textfunctionbox").css({
			"display":"block",
			"z-index":"40"
		});
		$("#textfontsize").val(seltext.attr("font-size"));
		$("#textopacity").val(seltext.attr("opacity")*100);
		$("#rotationslider").val(seltext.matrix.split().rotate);
	}
	else{
		$("#textfunctionbox").css({
			"display":"none"
		});
		var z=$("contentid").css("right");
		if(z!='0px'){
			//$(".optionbar").css("margin-right","0px");
		}
	}
}
//work to be done
function textfunpro(){
	$("#textfontsize").on('click keyup',function(e){
		seltext.attr("font-size",$(e.target).val())
	});
	$("#textopacity").on('click keyup',function(e){
		seltext.attr("opacity",parseInt($(e.target).val())*0.01);
	});
	$("#ttf").on('click',function(e){
		seltext.toFront();
	});
	$("#ttb").on('click',function(e){
		seltext.toBack();
		background.toBack();
	});
	$("#textcolor").on('change',function(e){
		seltext.attr("fill",$("#textcolor").val())
	});
	
}

function addtextdragpro(text){
	x1=0;
	y1=0;
	move=function (dx,dy,x,y,event){
		event.stopPropagation();
		dxt=x-x1;
		dyt=y-y1;
		x1=x;
		y1=y;
		this.transform("...T" + dxt  + "," + dyt);
	};

	start=function (x,y,event){
		event.stopPropagation();
		
		seltext=this;
		//this.toFront();
		x1=x;
		y1=y;
		showselrect(false);
		showfb(false);
		showeditbox(false);
		showtextfunctionbox(false);

		
	}
	end=function (event){
		event.stopPropagation();
		//seltext.toFront();
		showtextfunctionbox(true);
		seltext.glow();
		
	};
	text.drag(move, start, end);
}
function imagesaver(type){
	//remove unwanted item
	showselrect(false);
	var svgData = $("svg")[0].outerHTML;
	var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	var svgUrl = URL.createObjectURL(svgBlob);
	var image=new Image;
	image.onload= function(e){
		var canvas=$("#canvas")[0];
		canvas.width=image.width;
		canvas.height=image.height;
		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0);
		var final= canvas.toDataURL("image/png");
		if(type=="pdf"){
			saveaspdf(final);
		}
		if(type=="image"){
			saveasimage(final);
		}
	}
	image.src=svgUrl;

}

function saveasimage(img){
	var a = document.createElement("a");
		a.download = "mycollage.png";
		a.href = img;
		downloadimg=a.href;
		a.click();
}

function textrotate(){
	if(seltext!=0){
		var cv=seltext.matrix.split().rotate;
		seltext.rotate($("#rotationslider").val()-cv);
	}
}

function imagerotate(value){
	if(selimage!=0){
		var z=selimage.node.getBBox();
		var y=selimage.node.getBoundingClientRect();
		var x=$(selimage.node).position();
		selimage.rotate(value,z.x+z.width/2,z.y+z.height/2);
		showselrect(false);
		showselrect(true);
}
}

function createpage(){
	var nd="<div id=pageno"+totalpage+"></div>"
	$("#contentid").append(nd);
	var container=$("#pageno"+totalpage);
	if(papwidth==0){
		papwidth=parseInt(container.css("width")) ;
		z=container[0].getBoundingClientRect();
		papwidth=z.width;
		papheight=papwidth*1.414;
	}
	container.css({
		"width":papwidth,
		"height":papheight
	});
	var page=new Raphael(container[0],papwidth,papheight);
	page.canvas.style.backgroundColor = '#FFF';
	totalpage+=1;
	page.canvas.onclick=function(){
		//hiding side bar 
		///////////////////////////////
		var l=$("#contentid").css("left");
		if(l=='0px'){
			$(".sidebar").addClass("sidebarhide");
			$(".optionbar").css("margin-right","-200px");
		}
		
		////////////////////////////////
		$(paper.canvas).parent().css({
			"-webkit-box-shadow": "", 
			"-moz-box-shadow":    "",
			"box-shadow":         "" 
		});
		$(page.canvas).parent().css({
			"-webkit-box-shadow": "0px 1px 20px 0px #eee", 
			"-moz-box-shadow":    "0px 1px 20px 0px #eee",
			"box-shadow":         "0px 1px 20px 0px #eee" 
		});
		paper=page;
		topelement=page.getElementByPoint(event.pageX,event.pageY);
		if(topelement==null || topelement==background){
			showfb(false);
			selimage=0;
			showselrect(false);
			showeditbox(false);
			showtextfunctionbox(false);
		}
	};
	$(page.canvas).click();
		paper=page;
}

function multipleimagesaver(type){
	showselrect(false);
	$("#contentid div").each(function(){
		var tsvgdata=$(this)[0].innerHTML;
		saveimage(tsvgdata);
		
	});

}


function multipagepdf(){
	var imageloaded=0;
	var totalimage=$("#contentid").children().length;
	showselrect(false);
		var doc = new jsPDF('p', 'px','a4',true);
		$("#contentid div").each(function(){
			var svgData=$(this)[0].innerHTML;
			var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
			var svgUrl = URL.createObjectURL(svgBlob);
			var image=new Image;
			image.onload= function(e){
				image.width=doc.internal.pageSize.width;
				image.height=doc.internal.pageSize.height;
				var context = canvas.getContext("2d");
				doc.addImage(image, 'JPEG', 0, 0,image.width,image.height);
				imageloaded+=1;
				if(imageloaded==totalimage){
					doc.save('collage.pdf');
				}
				doc.addPage();
			}
		image.src=svgUrl;
	});
}



function resetpage(){
	var z=confirm("Are you sure?\nthis will reset all changes");
	if(z){
		$("#contentid")[0].innerHTML="";
		totalpage=1;
		papwidth=0;
		papheight=0;
		createpage();
	}
}