var flupte__c=function(opts){

	var PAGE_DATA = {
		folder:null,
		folderobj:null
		
	}
	var PAGE_OPTIONS = {
		settings: {
			themePath: ""
		},
		elemId: "",
		loadError: null,
		loadSuccess: null
	};



	function createhtmlbody() {
		loadCSSFile("/api/v4/core/common/page/fucss__c");
		var strVar="";
			strVar += "<h1>This is a Heading<\/h1>";
			strVar += "<button type=button id=fileopener>show folder structure<\/button>";
			strVar += "<div id=folder_tree_main>";
			strVar += "<div id=folder_tree><\/div>";
			strVar += "<span>";
			strVar += "<b>file name<\/b>";
			strVar += "<input type=text id=filenamebox readonly>";
			strVar += "<button type=button id=selectiondone>upload<\/button>";
			strVar += "<\/span>";
			strVar += "<\/div>";


		
		$("#" + PAGE_OPTIONS.elemId).html(strVar);
		console.log("html added", PAGE_OPTIONS.elemId);
	}


//////////////////////////

	function bind() {
		$("#" + PAGE_OPTIONS.elemId).on('click', function (event) {
			var target = event.target;
			console.log(target.id);
			if(target.id=="fileopener"){fileupload();}
			if(target.id=="selectiondone"){realflup();}
		});
		console.log("binding complete");
	}

	//////////real file upload after folder selection done/////
	function realflup(){
		var fid=PAGE_DATA.folderobj.getSelectedFolder().id;
		console.log("id=",fid);
		if(fid==""){alert("please select a folder");}
		else{
			var props= {
				'name': 'TestFile',
				'folderId': 'fldr0000000101',
				'description': 'This is a test file'
			 }
			 var opt={}
			var url=a2z.api.drive.getFileUploadURL(props,opt);
			console.log(url);
			//uploading
			var file=new File([""],"z.txt");
			xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('X-File-Size', file.size);
			xhr.setRequestHeader('Content-Type', "text");
			xhr.send(file);
		}

	}
	function oninit() {
		console.log("start");
		$.extend(true, PAGE_OPTIONS, opts);
		console.log("extend");
		createhtmlbody();
		console.log("body created");
		bind();
		showfilebox(false);
		console.log("done");
		
	};
	function fileupload(){
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

	oninit();
}

