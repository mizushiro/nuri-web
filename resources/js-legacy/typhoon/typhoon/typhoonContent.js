var urlPrefix = window.appBase ? window.appBase : '/';
//컨텐츠 매니져
var ContentManager = function(mapManager_) {    
	var fid = 0; 
	
	this.createFeatureId = function() {  
		return ++fid;
	};
	
	this.loadCnt = 0;
	this.typhoons = {};			//현재진행중인 태풍목록
	this.depressions = {};		//현재진행중인 TD목록
	this.mapManager = mapManager_;
	this.onlySelected = true;	//선택된 태풍만 예보값 표출(디폴트)
	this.loadTlb(); //태풍, TD 현재진행 중인 목록 조회
	
	/**
	 * 2019-04-04 추가
	 * 위험반경
	 */
	this.dangerCnt = 0;
		
};

//태풍 스타일
ContentManager.typhoonStyles = {

	// 태풍 진로 스타일
	track: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(0, 0, 0, 0.3)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 1)',
			width: 1
		})
		//, zIndex: Infinity
	})
	,forecast: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.3)'
		}),
		stroke: new ol.style.Stroke({
			color: '#75328e',
			width: 1
		})
		//, zIndex: Infinity
	}) 
	,area70: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 0, 93, 0.3)'
		})
	})
	,area15: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(0, 130, 200, 0.4)'
		})
	})
	,area25: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(20, 28, 184, 0.5)'
		})
	})

	/**
	 * 2019-04-24
	 * 실황 강풍영역 스타일 및 코드 추가
	 * 2019-04-30
	 * fill 투명도 변경 (0.4)
	 */
	,real15_1: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(29,219,22,0.7)',
			width: 1    
		}),
		fill: new ol.style.Fill({
			color: 'rgba(171,242,0,0.4)'
		})
	})
	,real15_2: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(29,219,22,0.7)',
			width: 1    
		}),
		fill: new ol.style.Fill({
			color: 'rgba(171,242,0,0.4)'
		})
	})
	,real15_3: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'rgba(29,219,22,0.7)',
			width: 1    
		}),
		fill: new ol.style.Fill({
			color: 'rgba(171,242,0,0.4)'
		})
	})
	,real15_org: new ol.style.Style({
		stroke: new ol.style.Stroke({
		color: 'rgba(0,0,255,0.5)',
		width: 1    
		})
	})

	/**
	 * 2019-04-04
	 * 위험반경 스타일
	 * 2019-04-29
	 * 위험반경 20%, 40%, 60%, 80% 수정
	 * 2019-04-30
	 * 위험영역 33.3%, 66.6%, 100% 수정
	 * 2019-05-09
	 * 위험영역 30%, 50%, 70%, 100%(강풍반경) 수정
	 */
	,danger30: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(237,245,84,0.4)'
		})
	})
	,danger50: new ol.style.Style({
		fill: new ol.style.Fill({
			//color: 'rgba(248,160,88,0.4)'
			color: 'rgba(255,94,0,0.4)'
		})
	})
	,danger70: new ol.style.Style({
		fill: new ol.style.Fill({
			//color: 'rgba(174,101,218,0.4)'
		    color: 'rgba(95,0,255,0.4)'
		})
	})
	,danger100: new ol.style.Style({
		fill: new ol.style.Fill({
			//color: 'rgba(36, 252, 255, 0.4)'
			color: 'rgba(0, 216, 255, 0.4)'
		})
	})

	,trackTd: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(0, 0, 0, 0.3)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 1)',
			width: 1
		})
	})  

	,forecastTd: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(0, 0, 0, 0.3)'
		}),
		stroke: new ol.style.Stroke({
			color: '#75328e',
			width: 1,
			lineDash: [3,3]
		})
	})

	,icon1: { //현재, 과거 태풍/TD 중심 아이콘
		
		active: { 
			
			startTd: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/start_td.png'
                }) 
			}),  
			
			low: new ol.style.Style({ 
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/td.png'
                })
			}), 
			
			td: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/td.png'
                })
			}),	
			
			weak: new ol.style.Style({
				image: new ol.style.Icon({
					scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/weak.png'
                })
			}),	
			
			normal: new ol.style.Style({
				image: new ol.style.Icon({
					scale: 1,  
					opacity: 1,
					src: urlPrefix + 'resources/image/typoon/gis/normal.png'
                })
			}),
			
			strong: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/strong.png'
                })
			}),
			
			very: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/very.png'
                })
			}),
			
			superStrong: new ol.style.Style({   //20200513 초강력 추가, 손태림
				image: new ol.style.Icon({
		            scale: 1,  
		            opacity: 1,
		            src: urlPrefix + 'resources/image/typoon/gis/super.png'
		        })
			})
		},
		
		noneActive: {
			
			startTd: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/start_td_gray.png'
                }) 
			}),

			low: new ol.style.Style({ 
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/td_gray.png'
                })
			}),
				
			td: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/td_gray.png'
                })
			}),	
				
			weak: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/weak_gray.png'
                })
			}),	
				
			normal: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/normal_gray.png'
                })
			}),	
				
			strong: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/strong_gray.png'
                })
			}),	
				
			very: new ol.style.Style({
				image: new ol.style.Icon({
                    scale: 1,  
                    opacity: 1,
                    src: urlPrefix + 'resources/image/typoon/gis/very_gray.png'
                })
			}),
			
			superStrong: new ol.style.Style({   //20200513 초강력 추가, 손태림
				image: new ol.style.Icon({
		            scale: 1,  
		            opacity: 1,
		            src: urlPrefix + 'resources/image/typoon/gis/super_gray.png'
		        })
			})
		}
	}
	,icon2: { //미래(예보) 태풍/TD 중심 아이콘
		
		forecastTd: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                //src: urlPrefix + 'resources/image/typoon/gis/td_red.png'
                src: urlPrefix + 'resources/image/typoon/gis/td2.png' //20210506 TD아이콘도 태풍처럼 보라색으로 통일
            })
		}),
		
		forecastWeak: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/weak_red.png'
            })
		}),
		
		low: new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5,0.8],
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/red_td_low.png'
			}) 
		}),
		
		td: new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5,0.8],
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/red_td.png'
            })
		}),	
			
		weak: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/weak2.png'
            })
		}),	
		
		normal: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/normal2.png'
            })
		}),
		
		strong: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/strong2.png'
            })
		}),
		
		very: new ol.style.Style({
			image: new ol.style.Icon({
                scale: 1,  
                opacity: 1,
                src: urlPrefix + 'resources/image/typoon/gis/very2.png'
            })
		}),
		
		superStrong: new ol.style.Style({   //20200513 초강력 추가, 손태림
			image: new ol.style.Icon({
	            scale: 1,  
	            opacity: 1,
	            src: urlPrefix + 'resources/image/typoon/gis/super2.png'
	        })
		}) 
	}
};

//아이콘 사이즈 조정하기
ContentManager.typhoonStyles.resizeIcon = function(suffix){ 
	
	function getStyle(sub){ 
		 
		 var image = undefined;
		 var text = sub.getText();
		 
		 if(typeof sub.getImage()!=="undefined" && sub.getImage()!=null){
			 
			 /**
			  * 2019-02-22 수정
			  * 로컬 테스트용 경로 변경
			  * 
			  * 내용
			  * ] -> %5D 로 변경
			  * 
			  * 원본
			  * var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("]");
			  * 
			  * 수정본
			  * var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("%5D");
			  * var temp = pathArr[0] +  suffix + '.png';
			  * temp = temp.replace(']','%5D');
			  * 
			  */
			 // 서버용 경로
			 var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("]");
			 
			 // 로컬용 경로
			 /*
			 var pathArr = sub.getImage().getSrc().replace("big_","").replace(".png","").split("%5D");
			 var temp = pathArr[0] +  suffix + '.png';
			 temp = temp.replace(']','%5D');
			 */
			 
			 var imageSrcName = sub.getImage().getSrc();
			 
			 if(imageSrcName.indexOf("red_td")>-1){
				 image = new ol.style.Icon({
					 anchor :[0.5,0.8],
					 scale: 1,  
					 opacity: 1,
					 
					 /**
					  * 2019-02-22
					  * 로컬 테스트용 경로 변경
					  * src: pathArr[0] +  suffix + '.png'
					  * src: temp
					  */
					 src: pathArr[0] + suffix + '.png' // 서버용 경로
					 //src: temp // 로컬용 경로
				 });
				 
			 }else{
				 image = new ol.style.Icon({
					 scale: 1,  
					 opacity: 1,
					 
					 /**
					  * 2019-02-22
					  * 로컬 테스트용 경로 변경
					  * src: pathArr[0] +  suffix + '.png'
					  * src: temp
					  */
					 src: pathArr[0] + suffix + '.png' // 서버용 경로
					 //src: temp // 로컬용 경로
				 });
			 }
		 }
		 	
		 var style = new ol.style.Style({
			 text: text,
			 image: image
		 });
		 
		 return style;
	}
	
	//image , text
	for(var mainKey in this.icon1){
		 for(var subKey in this.icon1[mainKey]){
			 var sub = this.icon1[mainKey][subKey];
			 if(sub!=null && typeof sub !== "undefined"){
				 this.icon1[mainKey][subKey] = getStyle(sub);
			 }
		 }
	 }
	
	for(var subKey in this.icon2){
		 var sub = this.icon2[subKey];
		 if(sub!=null && typeof sub !== "undefined"){
			 this.icon2[subKey] = getStyle(sub);
		 }
	}
};

ContentManager.prototype.refreshIcons = function(suf){
	
	//아이콘 스타일 재조정
	ContentManager.typhoonStyles.resizeIcon(suf); 
	 
	/**
	 * 2019-04-04
	 * true -> 선택태풍만 보기
	 * false -> 모두보기
	 */
	var onlySelected = this.onlySelected;
	
	if(onlySelected === false){
		for(var i in this.typhoons){ 
			var typhoon = this.typhoons[i];
			typhoon.refreshIcons(true);
		}
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			depression.refreshIcons(true);
		}
		
	}else{
		
		var selectedKey = this.mapManager.getSelectedKey();
		for(var i in this.typhoons){
			var typhoon = this.typhoons[i];
			if(typhoon.getKey() == selectedKey){
				typhoon.refreshIcons(true);
			}else{
				typhoon.refreshIcons(false);
			} 
		} 
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			if(depression.getKey() == selectedKey){
				depression.refreshIcons(true);
			}else{
				depression.refreshIcons(false);
			} 
		}
	}
	
};

//아이템 키값으로 조회
ContentManager.prototype.getItem = function(key){ 
	
	if(key.indexOf("TY") > -1){
		return this.typhoons[key];
	}else if(key.indexOf("TD") > -1){
		return this.depressions[key];
	} 
};

//현재 선택된 태풍에 대한 예보만 보기/모든 태풍에 대한 예보 보기 토클 이벤트 핸들러
ContentManager.prototype.toggleOnlySelected = function(){
	
	if(this.onlySelected === true){
		
		this.onlySelected = false;
		
	}else{
		
		this.onlySelected = true;
	}
	
	this.refreshContents();
	
	return this.onlySelected;
};


//태풍(열대저압부) 다시 그리기 - 현재 onlySelected값에 따라 다시 그려짐
ContentManager.prototype.refreshContents = function(){ 
	
	var onlySelected = this.onlySelected;
	
	/**
	 * 2019-03-19
	 * 위험반경 인덱스 추가
	 */
	var isNearlest = false;
	if(this.mapManager.getCurrentTapIdx() == 2){
		isNearlest = true;
	}
	
	if(onlySelected === false){//복수
		
		for(var i in this.typhoons){ 
			var typhoon = this.typhoons[i]; 
			typhoon.redraw(this,true,isNearlest);
		}
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			depression.redraw(this,true,isNearlest);
		}
		
	}else{//단수
		
		var selectedKey = this.mapManager.getSelectedKey();
		
		for(var i in this.typhoons){
			var typhoon = this.typhoons[i];
			
			if(typhoon.getKey() == selectedKey){
				typhoon.redraw(this,true,isNearlest);
			}else{
				typhoon.redraw(this,false,isNearlest);
			}
		} 
		
		for(var i in this.depressions){ 
			var depression = this.depressions[i]; 
			
			if(depression.getKey() == selectedKey){
				depression.redraw(this,true, isNearlest);
			}else{
				depression.redraw(this,false, isNearlest);
			} 
		}
		
	}
	
	var contentManager = this;
	
	/**
	 * 2019-04-04
	 * 위험반경
	 */
	if(this.mapManager.getCurrentTapIdx() == 3){
		contentManager.AddDanger();
	}
	
};  

//상세정보 설정 
ContentManager.prototype.setDetailInfo = function(item){
	
	var tit = ""; 
	var body = ""; 
	var tableIdx = -1;	//태풍과 TD 정보 표출 테이블 결정하는 인덱스
	var titFormat = typhoonLang.msg('conte.0002'); 
	var tmFc = item.tmFc;	//kst발표시각
	
	if(typhoonLang.currentLang === "en"){ 
		var tmFcDate = typhoonUtils.addHours(tmFc.toDate(),-9); 
		tmFc = tmFcDate.yyyymmddhhmi(); 
	}
	
	tit = titFormat.format(tmFc.substring(0,4)
			,tmFc.substring(4,6)
			,tmFc.substring(6,8)
			,tmFc.substring(8,10)
			,tmFc.substring(10,12));
	
	// 태풍, TD 예보 정보 Grid 생성
	if(item instanceof ContentManager.Typhoon){ 
		// 태풍 Grid 정보
		
		tableIdx = 0; 
		var timeStringC = typhoonLang.msg('conte.0003');
		var timeStringF = typhoonLang.msg('conte.0004');
		var rad15Format = typhoonLang.msg('conte.0005'); //강풍반경
		var rad25Format = typhoonLang.msg('conte.0005'); //폭풍반경
		var trFormat =   ' <tr>'
						+'     <td>{0}</td>'
						+'     <td>{1}</td>'
						+'     <td>{2}</td>'
						+'     <td>{3}</td>'
						+'     <td>{4}</td>'
						+'     <td>{5}</td>'
						+'     <td>{6}</td>'
						+'     <td>{7}</td>' //폭풍반경
						+'     <td>{8}</td>'
						+'     <td>{9}</td>'
						+'     <td>{10}</td>'
						+'     <td>{11}</td>'
						+'   </tr>';
		
		for(var i = 0 ; item.centers && i < item.centers.length ; i++){

			var info = item.centers[i].get("info");
			
			if(info.tmTp.indexOf("P")<0){	//현재 부터 표출 
				
				var timeStr = "";
				
				if(info.tmTp=="C"){
					
					if(typhoonLang.currentLang === "en"){
						var tm = info.utcTmDate.yyyymmddhhmi();
						timeStr = timeStringC.format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));
					}else{
						var tm = info.tmDate.yyyymmddhhmi();
						timeStr = timeStringC.format(tm.substring(6,8),tm.substring(8,10));
					} 
					
				}else{

					if(typhoonLang.currentLang === "en"){
						var tm = info.utcTmDate.yyyymmddhhmi();
						timeStr = timeStringF.format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));
					}else{
						var tm = info.tmDate.yyyymmddhhmi();
						timeStr = timeStringF.format(tm.substring(6,8),tm.substring(8,10));
					}
				}
				
				var rad15Msg = info.rad15.length < 1 ? "-": rad15Format.format(info.rad15
																						,typhoonUtils.transValToDir(info.ed15)
																						,typhoonUtils.zeroToBlank(info.er15));
				
				if(typhoonUtils.transValToDir(info.ed15)=="" || typhoonUtils.zeroToBlank(info.er15,'-')=='-'){
					rad15Msg = info.rad15;
					rad15Msg = info.rad15.length < 1 ? "-": info.rad15;
				}
				
				//폭풍반경 추가 손태림 20200507
				var rad25Msg = info.rad25.length < 1 ? "-": rad25Format.format(info.rad25
																						,typhoonUtils.transValToDir(info.ed25)
																						,typhoonUtils.zeroToBlank(info.er25));
					
				if(typhoonUtils.transValToDir(info.ed25)=="" || typhoonUtils.zeroToBlank(info.er25,'-')=='-'){
					rad25Msg = info.rad25;
					rad25Msg = info.rad25.length < 1 ? "-": info.rad25;
				}
				
				body += trFormat.format(timeStr
									,(Math.round(info.lat * 10)/10).toFixed(1)
									,(Math.round(info.lon * 10)/10).toFixed(1)
									,typhoonUtils.zeroToBlank(info.ps)
									,typhoonUtils.zeroToBlank(info.ws)
									,typhoonUtils.zeroToBlank(Math.round(info.ws * 3.6))    //시속
									,typhoonUtils.zeroToBlank(rad15Msg)					    //강풍반경
									,typhoonUtils.zeroToBlank(rad25Msg)					    //폭풍반경으로 변경 typhoonUtils.transValToStrengthTdLow(info.ws, info.tp)
									,typhoonUtils.transValToStrengthTdLow(info.ws, info.tp) //강도로 변경typhoonUtils.transValToSize(info.tp, info.rad15)
									,typhoonUtils.zeroToBlank(info.dir)
									,typhoonUtils.zeroToBlankSp(info.sp)
									,typhoonUtils.zeroToBlank(info.rad));
			}
		} 
	}else if(item instanceof ContentManager.Depression){ 
		// TD Grid 정보
		
		tableIdx = 1; 
		var timeStringC = typhoonLang.msg('conte.0003');
		var timeStringF = typhoonLang.msg('conte.0004');
		var rad15Format = typhoonLang.msg('conte.0005'); //강풍반경
		var rad25Format = typhoonLang.msg('conte.0005'); //폭풍반경
/*		var trFormat = ' <tr>'
					+'       <td>{0}</td>'
					+'       <td>{1}</td>'
					+'       <td>{2}</td>'
					+'       <td>{3}</td>'
					+'       <td>{4}</td>'
					+'       <td>{5}</td>'
					+'       <td>{6}</td>'
					+'       <td>{7}</td>'
					+'   </tr>'; */
		var trFormat =   ' <tr>'
						+'     <td>{0}</td>'
						+'     <td>{1}</td>'
						+'     <td>{2}</td>'
						+'     <td>{3}</td>'
						+'     <td>{4}</td>'
						+'     <td>{5}</td>'
						+'     <td>{6}</td>'
						+'     <td>{7}</td>' //폭풍반경
						+'     <td>{8}</td>'
						+'     <td>{9}</td>'
						+'     <td>{10}</td>'
						+'     <td>{11}</td>'
						+'   </tr>';			//20210426 TD도 TY와 같은 정보 표출, 손태림
		 
		for(var i = 0 ; item.centers && i < item.centers.length ; i++){
			var info = item.centers[i].get("info");  
			
			if(info.tmTp.indexOf("P")<0){	//현재 부터 표출 
				
				var timeStr = "";
				
				if(info.tmTp=="C"){
					
					if(typhoonLang.currentLang === "en"){
						var tm = info.utcTmDate.yyyymmddhhmi();
						timeStr = timeStringC.format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));
					}else{
						var tm = info.tmDate.yyyymmddhhmi();
						timeStr = timeStringC.format(tm.substring(6,8),tm.substring(8,10));
					}
					
				}else{
					
					if(typhoonLang.currentLang === "en"){
						var tm = info.utcTmDate.yyyymmddhhmi();
						timeStr = timeStringF.format(tm.substring(4,6),tm.substring(6,8),tm.substring(8,10));
					}else{
						var tm = info.tmDate.yyyymmddhhmi();
						timeStr = timeStringF.format(tm.substring(6,8),tm.substring(8,10));
					}
				}
				 /*  //20210503 상세보기 TD 테이블 TY처럼 표시
				body += trFormat.format(timeStr
										,Math.round(info.lat * 10)/10
										,Math.round(info.lon * 10)/10
										,typhoonUtils.zeroToBlank(info.ps)
										,typhoonUtils.zeroToBlank(info.ws)
										,typhoonUtils.zeroToBlank(Math.round(info.ws * 3.6))
										,typhoonUtils.zeroToBlank(info.dir)
										,typhoonUtils.zeroToBlankSp(info.sp));			
				*/
										
				var rad15Msg = info.rad15.length < 1 ? "-": rad15Format.format(info.rad15
																						,typhoonUtils.transValToDir(info.ed15)
																						,typhoonUtils.zeroToBlank(info.er15));
				
				if(typhoonUtils.transValToDir(info.ed15)=="" || typhoonUtils.zeroToBlank(info.er15,'-')=='-'){
					rad15Msg = info.rad15;
					rad15Msg = info.rad15.length < 1 ? "-": info.rad15;
				}
				
				//폭풍반경 추가 손태림 20210426
				var rad25Msg = info.rad25.length < 1 ? "-": rad25Format.format(info.rad25
																						,typhoonUtils.transValToDir(info.ed25)
																						,typhoonUtils.zeroToBlank(info.er25));
					
				if(typhoonUtils.transValToDir(info.ed25)=="" || typhoonUtils.zeroToBlank(info.er25,'-')=='-'){
					rad25Msg = info.rad25;
					rad25Msg = info.rad25.length < 1 ? "-": info.rad25;
				}
										
										
			body += trFormat.format(timeStr
									,(Math.round(info.lat * 10)/10).toFixed(1)
									,(Math.round(info.lon * 10)/10).toFixed(1)
									,typhoonUtils.zeroToBlank(info.ps)
									,typhoonUtils.zeroToBlank(info.ws)
									,typhoonUtils.zeroToBlank(Math.round(info.ws * 3.6))    //시속
									,typhoonUtils.zeroToBlank(rad15Msg)					    //강풍반경
									,typhoonUtils.zeroToBlank(rad25Msg)					    //폭풍반경으로 변경 typhoonUtils.transValToStrengthTdLow(info.ws, info.tp)
									,typhoonUtils.transValToStrengthTdLow(info.ws, info.tp) //강도로 변경typhoonUtils.transValToSize(info.tp, info.rad15)
									,typhoonUtils.zeroToBlank(info.dir)
									,typhoonUtils.zeroToBlankSp(info.sp)
									,typhoonUtils.zeroToBlank(info.rad));										
										//20210426 TD도 태풍처럼 정보 표출
										
										
			}
			
		}//for(var i in item.centers) { 
	} else {
		
	}
	
	var detailId  = this.mapManager.config.detail;
	$("#" + detailId + " > .tit > h1").html(tit);
	$("#" + detailId + " > .body > table").hide().eq(tableIdx).show().find("tbody").html(body);

}; 

//최근접 정보 표출  제거
ContentManager.prototype.removeNearlest = function(){   
	var onlySelected = this.onlySelected;	//선택된 태풍만 보기
	var selectedKey = this.mapManager.getSelectedKey();
	var source = this.mapManager.layers.typhoon.getSource();
	var depressions = this.depressions; 
	for(var i in this.typhoons){

		var typhoon = this.typhoons[i];
		
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			
			//removeFeature
			if(typeof typhoon.nearlest !== "undefined" && source.getFeatureById(typhoon.nearlest.getId())!=null){ 
				typhoon.unShowNearlestLine(this);
			}
			
			if(typeof typhoon.forecastSp !== "undefined" && source.getFeatureById(typhoon.forecastSp.getId())!=null){
				source.removeFeature(typhoon.forecastSp); 
			}
			
			if(typeof typhoon.areaSp70 !== "undefined" && source.getFeatureById(typhoon.areaSp70.getId())!=null){
				source.removeFeature(typhoon.areaSp70); 
			}
			
			if(typeof typhoon.areaSp25 !== "undefined" && source.getFeatureById(typhoon.areaSp25.getId())!=null){
				source.removeFeature(typhoon.areaSp25); 
			}
			
			if(typeof typhoon.areaSp15 !== "undefined" && source.getFeatureById(typhoon.areaSp15.getId())!=null){
				source.removeFeature(typhoon.areaSp15); 
			}
			
			if(typeof typhoon.real15_1 !== "undefined" && source.getFeatureById(typhoon.real15_1.getId())!=null){
				source.removeFeature(typhoon.real15_1); 
			}
			if(typeof typhoon.real15_2 !== "undefined" && source.getFeatureById(typhoon.real15_2.getId())!=null){
				source.removeFeature(typhoon.real15_2); 
			}
			if(typeof typhoon.real15_3 !== "undefined" && source.getFeatureById(typhoon.real15_3.getId())!=null){
				source.removeFeature(typhoon.real15_3); 
			}
			if(typeof typhoon.real15_org !== "undefined" && source.getFeatureById(typhoon.real15_org.getId())!=null){
				source.removeFeature(typhoon.real15_org); 
			}
			
			//addFeature
			if(typeof typhoon.forecast !== "undefined" && source.getFeatureById(typhoon.forecast.getId())==null){
				source.addFeature(typhoon.forecast);  
			} 
			
			if(typeof typhoon.area70 !== "undefined" && source.getFeatureById(typhoon.area70.getId())==null){
				source.addFeature(typhoon.area70);  
			} 
			
			if(typeof typhoon.area25 !== "undefined" && source.getFeatureById(typhoon.area25.getId())==null){
				source.addFeature(typhoon.area25);  
			} 
			
			if(typeof typhoon.area15 !== "undefined" && source.getFeatureById(typhoon.area15.getId())==null){
				source.addFeature(typhoon.area15);  
			}
			
			if(typeof typhoon.real15_1 !== "undefined" && source.getFeatureById(typhoon.real15_1.getId())==null){
				source.addFeature(typhoon.real15_1);  
			}
			if(typeof typhoon.real15_2 !== "undefined" && source.getFeatureById(typhoon.real15_2.getId())==null){
				source.addFeature(typhoon.real15_2);  
			}
			if(typeof typhoon.real15_3 !== "undefined" && source.getFeatureById(typhoon.real15_3.getId())==null){
				source.addFeature(typhoon.real15_3);  
			}
			if(typeof typhoon.real15_org !== "undefined" && source.getFeatureById(typhoon.real15_org.getId())==null){
				source.addFeature(typhoon.real15_org);  
			}
		}
		
	} 
	
	for(var i in depressions){
		
		var depression = this.depressions[i];
		
		if(onlySelected === false || selectedKey == depression.getKey()){
			
			//removeFeature
			if(typeof depression.nearlest !== "undefined" && source.getFeatureById(depression.nearlest.getId())!=null){ 
				depression.unShowNearlestLine(this);
			}
			
			if(typeof depression.forecastSp !== "undefined" && source.getFeatureById(depression.forecastSp.getId())!=null){
				source.removeFeature(depression.forecastSp); 
			}
			
			if(typeof depression.areaSp70 !== "undefined" && source.getFeatureById(depression.areaSp70.getId())!=null){
				source.removeFeature(depression.areaSp70); 
			}
			
			if(typeof depression.areaSp25 !== "undefined" && source.getFeatureById(depression.areaSp25.getId())!=null){
				source.removeFeature(depression.areaSp25); 
			}
			
			if(typeof depression.areaSp15 !== "undefined" && source.getFeatureById(depression.areaSp15.getId())!=null){
				source.removeFeature(depression.areaSp15); 
			}
			
			if(typeof depression.real15_1 !== "undefined" && source.getFeatureById(depression.real15_1.getId())!=null){
				source.removeFeature(depression.real15_1); 
			}
			if(typeof depression.real15_2 !== "undefined" && source.getFeatureById(depression.real15_2.getId())!=null){
				source.removeFeature(depression.real15_2); 
			}
			if(typeof depression.real15_3 !== "undefined" && source.getFeatureById(depression.real15_3.getId())!=null){
				source.removeFeature(depression.real15_3); 
			}
			if(typeof depression.real15_org !== "undefined" && source.getFeatureById(depression.real15_org.getId())!=null){
				source.removeFeature(depression.real15_org); 
			}
			
			if(typeof depression.forecast !== "undefined" && source.getFeatureById(depression.forecast.getId())==null){
				source.addFeature(depression.forecast);  
			} 
			
			if(typeof depression.area70 !== "undefined" && source.getFeatureById(depression.area70.getId())==null){
				source.addFeature(depression.area70);  
			} 
			
			if(typeof depression.area25 !== "undefined" && source.getFeatureById(depression.area25.getId())==null){
				source.addFeature(depression.area25);  
			}
			
			if(typeof depression.area15 !== "undefined" && source.getFeatureById(depression.area15.getId())==null){
				source.addFeature(depression.area15);  
			}
			
			if(typeof depression.real15_1 !== "undefined" && source.getFeatureById(depression.real15_1.getId())==null){
				source.addFeature(depression.real15_1);  
			}
			if(typeof depression.real15_2 !== "undefined" && source.getFeatureById(depression.real15_2.getId())==null){
				source.addFeature(depression.real15_2);  
			}
			if(typeof depression.real15_3 !== "undefined" && source.getFeatureById(depression.real15_3.getId())==null){
				source.addFeature(depression.real15_3);  
			}
			if(typeof depression.real15_org !== "undefined" && source.getFeatureById(depression.real15_org.getId())==null){
				source.addFeature(depression.real15_org);  
			}
		}
	} 
}; 

//최근접 정보 표출 선 제거
ContentManager.prototype.removeNearlestLines = function(){  
	for(var i in this.typhoons){
		this.typhoons[i].unShowNearlestLine(this);
	}
	for(var i in this.depressions){
		this.depressions[i].unShowNearlestLine(this);
	}
}; 

//최근접 정보 표출 기능 추가
ContentManager.prototype.addNearlest = function(feature){
	var onlySelected = this.onlySelected;
	var selectedKey = this.mapManager.getSelectedKey();  
	var typhoons = this.typhoons;
	var depressions = this.depressions; 
	var source = this.mapManager.layers.typhoon.getSource();
	for(var k in typhoons){
		var typhoon = typhoons[k]; 
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			
			if(typeof typhoon.forecast !=="undefined" && source.getFeatureById(typhoon.forecast.getId()) != null ){
				source.removeFeature(typhoon.forecast);
			}  
			if(typeof typhoon.area70 !=="undefined" && source.getFeatureById(typhoon.area70.getId()) != null ){
				source.removeFeature(typhoon.area70);
			} 
			if(typeof typhoon.area15 !=="undefined" &&  source.getFeatureById(typhoon.area15.getId()) != null ){
				source.removeFeature(typhoon.area15);
			}
			if(typeof typhoon.area25 !=="undefined" &&  source.getFeatureById(typhoon.area25.getId()) != null ){
				source.removeFeature(typhoon.area25);
			}
			
			if(typeof typhoon.real15_1 !=="undefined" &&  source.getFeatureById(typhoon.real15_1.getId()) != null ){
				source.removeFeature(typhoon.real15_1);
			}
			if(typeof typhoon.real15_2 !=="undefined" &&  source.getFeatureById(typhoon.real15_2.getId()) != null ){
				source.removeFeature(typhoon.real15_2);
			}
			if(typeof typhoon.real15_3 !=="undefined" &&  source.getFeatureById(typhoon.real15_3.getId()) != null ){
				source.removeFeature(typhoon.real15_3);
			}
			if(typeof typhoon.real15_org !=="undefined" &&  source.getFeatureById(typhoon.real15_org.getId()) != null ){
				source.removeFeature(typhoon.real15_org);
			}
			
			if(typeof typhoon.forecastSp !=="undefined" && source.getFeatureById(typhoon.forecastSp.getId()) == null ){
				source.addFeature(typhoon.forecastSp);
			} 
			if(typeof typhoon.areaSp70 !=="undefined" && source.getFeatureById(typhoon.areaSp70.getId()) == null ){
				source.addFeature(typhoon.areaSp70);
			} 
			if(typeof typhoon.areaSp25 !=="undefined" && source.getFeatureById(typhoon.areaSp25.getId()) == null ){
				source.addFeature(typhoon.areaSp25);
			} 
			if(typeof typhoon.areaSp15 !=="undefined" && source.getFeatureById(typhoon.areaSp15.getId()) == null ){
				source.addFeature(typhoon.areaSp15);
			}
			
			if(typeof typhoon.real15_1 !=="undefined" && source.getFeatureById(typhoon.real15_1.getId()) == null ){
				source.addFeature(typhoon.real15_1);
			}
			if(typeof typhoon.real15_2 !=="undefined" && source.getFeatureById(typhoon.real15_2.getId()) == null ){
				source.addFeature(typhoon.real15_2);
			}
			if(typeof typhoon.real15_3 !=="undefined" && source.getFeatureById(typhoon.real15_3.getId()) == null ){
				source.addFeature(typhoon.real15_3);
			}
			if(typeof typhoon.real15_org !=="undefined" && source.getFeatureById(typhoon.real15_org.getId()) == null ){
				source.addFeature(typhoon.real15_org);
			}
			
		} 
	} 
	for(var k in depressions){
		var depression = depressions[k]; 
		if(onlySelected === false || selectedKey == depression.getKey()){
			
			if(typeof depression.forecast !=="undefined" && source.getFeatureById(depression.forecast.getId()) != null ){
				source.removeFeature(depression.forecast);
			}  
			if(typeof depression.area70 !=="undefined" && source.getFeatureById(depression.area70.getId()) != null ){
				source.removeFeature(depression.area70);
			} 
			if(typeof depression.area25 !=="undefined" && source.getFeatureById(depression.area25.getId()) != null ){
				source.removeFeature(depression.area25);
			} 
			if(typeof depression.area15 !=="undefined" &&  source.getFeatureById(depression.area15.getId()) != null ){
				source.removeFeature(depression.area15);
			}
			
			if(typeof depression.real15_1 !=="undefined" &&  source.getFeatureById(depression.real15_1.getId()) != null ){
				source.removeFeature(depression.real15_1);
			}
			if(typeof depression.real15_2 !=="undefined" &&  source.getFeatureById(depression.real15_2.getId()) != null ){
				source.removeFeature(depression.real15_2);
			}
			if(typeof depression.real15_3 !=="undefined" &&  source.getFeatureById(depression.real15_3.getId()) != null ){
				source.removeFeature(depression.real15_3);
			}
			if(typeof depression.real15_org !=="undefined" &&  source.getFeatureById(depression.real15_org.getId()) != null ){
				source.removeFeature(depression.real15_org);
			}
			
			if(typeof depression.forecastSp !=="undefined" && source.getFeatureById(depression.forecastSp.getId()) == null ){
				source.addFeature(depression.forecastSp);
			} 
			if(typeof depression.areaSp70 !=="undefined" && source.getFeatureById(depression.areaSp70.getId()) == null ){
				source.addFeature(depression.areaSp70);
			} 
			if(typeof depression.areaSp25 !=="undefined" && source.getFeatureById(depression.areaSp25.getId()) == null ){
				source.addFeature(depression.areaSp25);
			} 
			if(typeof depression.areaSp15 !=="undefined" && source.getFeatureById(depression.areaSp15.getId()) == null ){
				source.addFeature(depression.areaSp15);
			}
			
			if(typeof depression.real15_1 !=="undefined" && source.getFeatureById(depression.real15_1.getId()) == null ){
				source.addFeature(depression.real15_1);
			}
			if(typeof depression.real15_2 !=="undefined" && source.getFeatureById(depression.real15_2.getId()) == null ){
				source.addFeature(depression.real15_2);
			}
			if(typeof depression.real15_3 !=="undefined" && source.getFeatureById(depression.real15_3.getId()) == null ){
				source.addFeature(depression.real15_3);
			}
			if(typeof depression.real15_org !=="undefined" && source.getFeatureById(depression.real15_org.getId()) == null ){
				source.addFeature(depression.real15_org);
			}
		} 
	} 
};

//최근접 정보 표출 기능 추가 
ContentManager.prototype.showNearlestLine = function(feature){
	
	var onlySelected = this.onlySelected;
	var selectedKey = this.mapManager.getSelectedKey();  
	var typhoons = this.typhoons;
	for(var k in typhoons){
		
		var typhoon = typhoons[k];
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			typhoon.showNearlestLine(this,feature, typhoon);
		} 
	}
	
	var depressions = this.depressions; 
	for(var k in depressions){
		
		var depression = depressions[k]; 
		if(onlySelected === false || selectedKey == depression.getKey()){
			depression.showNearlestLine(this,feature);
		} 
	}
};

//최근접 정보 표출 기능 추가  
ContentManager.prototype.showArea = function(feature){
	
	var onlySelected = this.onlySelected;
	var selectedKey = this.mapManager.getSelectedKey();  
	var typhoons = this.typhoons;
	
	for(var k in typhoons){
		var typhoon = typhoons[k];
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			
			/**
			 * 2019-02-19 수정
			 * 마우스 클릭으로 변경
			 */
			//typhoon.showArea(this,feature, typhoon);
		} 
	}
	
	var depressions = this.depressions; 
	
	for(var k in depressions){
		var depression = depressions[k]; 
		if(onlySelected === false || selectedKey == depression.getKey()){
			//depression.showArea(this,feature);
		} 
	}
};


//선택된 태풍/TD 만 보이게 한다.
ContentManager.prototype.showSelected = function(keys){
	var source = this.mapManager.layers.typhoon.getSource();
	source.clear(); //모든 feature 제거
	
	var typhoons = this.typhoons; 
	var depressions = this.depressions; 
	
	for(var i in keys){
		var key = keys[i];  
		if(typeof typhoons[key] !== "undefined"){
			typhoons[key].setVisible(source,true); 
		}else if(typeof depressions[key] !== "undefined"){
			
		} 
	}
};


/**
 * 태풍/TD 중심 아이콘 스타일 결정
 */
ContentManager.getCenterIcon = function(info, isActive) {
	
	// TD 중심 아이콘 스타일
	function getTdStyle(info, isActive) {

/*
console.log("INFO ==================================================");
console.log("isActive :: " + isActive);
console.log("info.tm :: " + info.tm);					//일시(년월일시분)
console.log("info.tmDate :: " + info.tmDate);			//시간객체(kst)
console.log("info.utcTmDate :: " + info.utcTmDate);		//utc tm date
console.log("info.lat :: " + info.lat);					//위도(deg)
console.log("info.lon :: " + info.lon);					//경도(deg)
console.log("info.loc :: " + info.loc);					//위치설명
console.log("info.dir :: " + info.dir);					//방향
console.log("info.sp :: " + info.sp);					//진행속도(km/h)
console.log("info.ps :: " + info.ps);					//중심기압(hPa)
console.log("info.ws :: " + info.ws);					//중심풍속(m/s)
console.log("info.tp :: " + info.tp);					//TD, TS, LOW
*/

/*
console.log("info.rad25 :: " + info.rad25);				//25m/s 반경(km)
console.log("info.ed25 :: " + info.ed25);				//25m/s 예외방향(16방위)
console.log("info.er25 :: " + info.er25);				//25m/s 예외반경(km)
console.log("info.rad15 :: " + info.rad15);				//15m/s 반경(강풍반경)(km)
console.log("info.ed15 :: " + info.ed15);				//예외반경 방위
console.log("info.er15 :: " + info.er15);				//예외반경 (km)
console.log("info.rad :: " + info.rad);					//70%확률반경 (km)
console.log("info.rYear :: " + info.rYear);				//연관개체 발생년도
console.log("info.rSeq :: " + info.rSeq);				//연관개체 번호 
console.log("info.rTp :: " + info.rTp);					//연관개체 타입(TD/TY)
console.log("info.rTyphoonName :: " + info.rTyphoonName);	//연관태풍인 경우 태풍명
console.log("info.rDesc :: " + info.rDesc);				//이전 중심점이 연관개체인 경우 메세지
console.log("info.tmTp :: " + info.tmTp);				//예보값인지, 현재, 과거 값인지 여부(F0,C,P0)
*/

/**
 * info.tmTp = F0
 * info.tp = TD
 * info.rad25 = 3
 * info.rTp = TD-END, LOW-END
 */		

		/**
		 * 중심점의 시제 및 상태에 따른 아이콘 변경
		 *     1. 현재 + TD예보 종료 + LOW => icon.low
		 *     1. 현재 + TD예보 종료 + TD => icon.td
		 *     
		 *     2. 과거 + Active => icon.td (Active)
		 *     2. 과거 + noneActive => icon.td (noneActive)
		 *     
		 *     3. 현재 + Active => icon.td (Active)
		 *     3. 현재 + noneActive => icon.td (noneActive)
		 *     
		 *     4. 미래 + 풍속 17 이상 => icon.forecastWeak
		 *     4. 미래 + 풍속 17 미만 => icon.forecastTd
		 *     
		 * - icon1 : 현재, 과거 태풍/TD 중심 아이콘
		 *   - active : 검정색 아이콘
		 *   - noneActive : 회색 아이콘
		 * - icon2 : 미래(예보) 태풍/TD 중심 아이콘
		 *   - 붉은색 아이콘
		 *   
		 * - icon2.forecastTd 	: td_red.png (글자없는 TD 아이콘)
		 * - icon2.forecastWeak : weak_red.png (붉은 색 태풍 아이콘)
		 * - icon2.low 			: red_td_low.png (글자있는 LOW 아이콘)
		 * - icon2.td 			: red_td.png (글자있는 TD 아이콘)
		 */
		if(info.tmTp == "C" && info.ref.tmEnd === "Y" ) {
			// 현재이며, TD가 종료라면..
			
			var icon = ContentManager.typhoonStyles.icon2;
			return info.tp == "LOW" ? icon.low : icon.td;
			
		} else {
			
			if(info.tmTp == "P1") { //P - 과거
				var icon = (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive);
				return icon.td;
			} else if(info.tmTp.indexOf("P") > -1 || info.tmTp == "C") { //C - 현재
				var icon = (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive);
				return icon.td;
			} else if(info.tmTp.indexOf("F") > -1) { //F - 미래 
				var icon = ContentManager.typhoonStyles.icon2;

				// [2020-08-06 장근희] 국가태풍센터(강동인 연구원 - "2020-08-06 (목) 14:17" 네이버 메일) 요청으로 풍속과 관계없이 표시		
/*				if(info.rPin == "3") {
					if(info.rTp == "TD-END") {
						return icon.td;
					} else if(info.rTp == "LOW-END") {
						return icon.low;
					} else {
						return icon.forecastTd;
					}
				} else {
					return icon.forecastTd;
				}*/
				
				// [2021-05-04 손태림] 태풍과 같도록 아이콘 표시
				// TD 아이콘
				if(info.rTp == "TD-END") {
					return icon.td;
				} else if(info.rTp == "LOW-END") {
					return icon.low;
				} else if(info.ws >= 54) { 	   
					return icon.superStrong;
				} else if(info.ws >= 44) { //매우 강
					return icon.very;
				} else if(info.ws >= 33) { //강
					return icon.strong;
				} else if(info.ws >= 25) { //중
					return icon.normal;
				} else if(info.ws >= 17) { //약
					return icon.weak;
				} else if(info.ws < 17) { //열대저압부
					return icon.forecastTd;
				}

			}
			
		}

	};
	
	// 태풍 중심 아이콘 스타일
	function getTypStyle(info, isActive) {
		
		// L(온대저기압) 현재 또는 미래에는 빨간 아이콘
		if(info.tp == "LOW") { //20210505 무엇으로 종료되었는지 osp파일에서 확인.
			var icon = info.tmTp.indexOf("P") > -1 ? (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive ) : ContentManager.typhoonStyles.icon2;
			if(info.rTp == "LOW-END") {
				return icon.low;
			} else {
				return icon.forecastTd;
			}
		} else if(info.tp == "TD") {
			var icon = info.tmTp.indexOf("F") > -1 || (info.tmTp === "C") ? ContentManager.typhoonStyles.icon2 : (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive);
			if(info.rTp == "TD-END") {
				return icon.td;
			} else {
				return icon.forecastTd;
			}
		} else {
			//현재 또는 미래의 TD는 빨간 아이콘
			var icon = info.tmTp.indexOf("F") > -1 || (info.tmTp === "C") ? ContentManager.typhoonStyles.icon2 : (isActive === true ? ContentManager.typhoonStyles.icon1.active : ContentManager.typhoonStyles.icon1.noneActive);

			//풍속값이 0 일때는 종료 TD
			if(info.ws <= 0) {
				if(info.rTp == "TD-END") {
					return icon.td;
				} else if(info.rTp == "LOW-END") {
					return icon.low;
				}
			} else {
				//태풍 아이콘
				if(info.rTp == "TD-END") {
					return icon.td;
				} else if(info.rTp == "LOW-END") {
					return icon.low;
				} else if(info.ws >= 54) { 	   
					return icon.superStrong;
				} else if(info.ws >= 44) { //매우 강
					return icon.very;
				} else if(info.ws >= 33) { //강
					return icon.strong;
				} else if(info.ws >= 25) { //중
					return icon.normal;
				} else if(info.ws >= 17) { //약
					return icon.weak;
				} else if(info.ws < 17) { //열대저압부
					return icon.forecastTd;
				}
				
			}
		} 
	};
	
	if(typeof isActive !== "boolean") {
		isActive = false;
	}  
	
	// 연관개체 타입(TD/TY)에 따른 중심 스타일 함수 지정
	if(info.rTp === "TD" || info.ref instanceof ContentManager.Depression && info.rTp !== "TY") {
		return getTdStyle(info, isActive);
	} else {
		return getTypStyle(info, isActive);
	}
	
};

/**
 * 현재 진행 중인 태풍/열대저압부(TD) 목록 조회
 *     - RTKO63.tbl : 태풍 정보
 *     - RTKO64.tbl : 열대저압부(TD) 정보
 */
ContentManager.prototype.loadTlb = function(){
	
	var contentManager = this;
	var mapManager = this.mapManager;
	
	function loadTlb2(data63Arr) {

		// 현재진행중인 TD 정보 조회
		
		$.get(urlPrefix + 'repositary/xml/typ/raw/DAOU/RTKO64/RTKO64.tbl', function(data64) {
			   
			var data64Arr = data64 ? data64.split("\n") : [];
			
			for(var i = 0 ; i < data64Arr.length ; i++) {
				data64Arr[i] = data64Arr[i].replace(/\/repositary\/xml\/typ\/raw\/DAOU/g, urlPrefix + 'repositary/xml/typ/raw/DAOU');
				if($.trim(data64Arr[i]).length > 1) {
					contentManager.loadCnt++;
				}
			}
			if(contentManager.loadCnt === 0) {
				mapManager.addNoItemMsgControl();	//현재 진행 중인 태풍 또는 열대저압부가 없습니다.
			} else {
				// 태풍, TD 정보 표출
				contentManager.loadTyphoons(data63Arr);
				contentManager.loadDepressions(data64Arr);
			}
			  
		}).fail(function(e) {
			if(console) console.log(e);
			if(contentManager.loadCnt === 0) {
				mapManager.addNoItemMsgControl();	//현재 진행 중인 태풍 또는 열대저압부가 없습니다.
			} else {
				contentManager.loadTyphoons(data63Arr); 
			}
			
		});

	}
	
	// 현재진행중인 태풍 정보 조회
	$.get(urlPrefix + 'repositary/xml/typ/raw/DAOU/RTKO63/RTKO63.tbl', function(data63) {
		   
		var data63Arr = data63 ? data63.split("\n") : [];
		
		for(var i = 0 ; i < data63Arr.length ; i++) {
			data63Arr[i] = data63Arr[i].replace(/\/repositary\/xml\/typ\/raw\/DAOU/g, urlPrefix + 'repositary/xml/typ/raw/DAOU');
			if($.trim(data63Arr[i]).length>1) {
				contentManager.loadCnt++;
			}
		} 
		loadTlb2(data63Arr);
		
	}).fail(function(e) {
		if(console) console.log(e);
		loadTlb2([]);
	});
	
};

/**
 * 태풍 관련 osp, ini 파일 정보
 */
ContentManager.prototype.loadTyphoons = function(dataArr) {
	
	var contentManager = this;
	
	//현재 진행중인 태풍이 없는 경우
	if(typeof dataArr === "undefined" || dataArr.length < 1) {
		return;
	}
	
	for(var i = 0 ; i < dataArr.length ; i++) {
		var tmpArr = dataArr[i].split(",");	//osp,ini
		
		if(tmpArr.length < 2) {
			continue;
		} 
		
		var ospPath = tmpArr[0];
		var iniPath = tmpArr[1];
		
		contentManager.loadTyphoon(ospPath, iniPath);
	}
	
};

/**
 * TD 관련 osp, ini 파일 정보
 */
ContentManager.prototype.loadDepressions = function(dataArr) {
	
	var contentManager = this;
	
	//현재 진행중인 TD가 없는 경우
	if(typeof dataArr === "undefined" || dataArr.length < 1) {
		return;
	}
	
	for(var i = 0 ; i < dataArr.length ; i++) {
		var tmpArr = dataArr[i].split(",");	//osp,ini
		
		if(tmpArr.length < 2) {
			continue;
		} 
		
		var ospPath = tmpArr[0];
		var iniPath = tmpArr[1];
		
		contentManager.loadDepression(ospPath, iniPath);
	}
	
}; 

/**
 * 현재진행중인 태풍 관련 정보 로딩
 */
ContentManager.prototype.loadTyphoon = function(osp, ini) {
	
	var contentManager = this;
	var mapManager = contentManager.mapManager;
	var typhoon = new ContentManager.Typhoon();
	
	function checkValidationRow(tempArr) {
		if(tempArr.length < 19 || tempArr[0].length < 1 || tempArr[1].length < 1 || tempArr[2].length < 1 || tempArr[1].toNumber() <= -999 || tempArr[2].toNumber() <= -999) {
			return false;
		}
		return true;
	}
	
	// Load OSP file
	$.get(osp, function(data) { 
		var trackCnt = 0;			// 과거 ~ 현재지점 포인트 갯수
		var tracks = [];			// 과거경로 목록
		var trackArr = [];			// 과거 ~ 현재지점 위경도 정보 
		var forecastArr = [];  		// 현재지점 ~ 예보 위경도 정보 
		var centerArr = [];			// 중심점 features 
		var ospFile = osp.split("/");
		var dataArr = data.split("\n");
		var infoArr = dataArr[0].split(",");
		
		/**
		 * osp 			-> /TYPHOON/DAOU/RTKO63/2019/RTKO63_201902201600_2_3.osp?ver=20190220173301
		 * ospFile 		-> ,TYPHOON,DAOU,RTKO63,2019,RTKO63_201902201600_2_3.osp?ver=20190220173301
		 * dataArr[0] 	-> 2019,2,우딥,WUTIP
		 * infoArr 		-> 2019,2,우딥,WUTIP
		 */
		
		/**
		 * OSP 파일 내용 샘플 :
		 	 dataArr[0] : 2019,2,우딥,WUTIP
			 dataArr[1] : 201902190900,4.8,160.6,괌 동남동쪽 약 1980 km 부근 해상,W,41,1004,15,TD,0,,0,0,,0,0,2019,1,TD
			 dataArr[2] : 201902191500,5.0,158.6,괌 동남동쪽 약 1780 km 부근 해상,W,37,1004,15,TD,0,,0,0,,0,0,2019,1,TD
			 dataArr[3] : 201902192100,5.1,156.2,괌 남동쪽 약 1560 km 부근 해상,W,44,1002,15,TD,0,,0,0,,0,0,2019,1,TD
			 dataArr[4] : 201902200300,5.1,155.2,괌 남동쪽 약 1470 km 부근 해상,W,18,1000,18,TS,,,,250,SW,200,0,,,
			 dataArr[5] : 201902200900,4.8,154.7,괌 남동쪽 약 1450 km 부근 해상,WSW,11,996,20,TS,,,,250,SW,200,0,,,
			 dataArr[6] : 201902201500,4.9,153.8,괌 남동쪽 약 1370 km 부근 해상,W,17,990,24,TS,,,,280,SW,230,0,,,
			 dataArr[7] : 201902211500,6.5,150.0,괌 남동쪽 약 960 km 부근 해상,WNW,19,975,32,0,0,0,0,300,SW,250,110,,,
			 dataArr[8] : 201902221500,8.9,146.0,괌 남남동쪽 약 520 km 부근 해상,WNW,22,960,39,0,0,0,0,330,SW,280,170,,,
			 dataArr[9] : 201902231500,11.2,142.9,괌 남서쪽 약 330 km 부근 해상,NW,18,955,40,0,0,0,0,350,SW,300,260,,,
			 dataArr[10] : 201902241500,12.9,141.2,괌 서쪽 약 390 km 부근 해상,NW,11,950,43,0,0,0,0,370,SW,320,370,,,
			 dataArr[11] : 201902251500,14.6,140.0,괌 서북서쪽 약 530 km 부근 해상,NW,9,955,40,0,0,0,0,350,WSW,300,480,,,
			 dataArr[12] : ,,,,,,,0,,0,0,0,0,,,,,,
			 dataArr[13] : ,,,,,,,0,,0,0,0,0,,,,,,
			 dataArr[14] : ,,,,,,,0,,0,0,0,0,,,,,,
			 dataArr[15] : ,,,,,,,0,,0,0,0,0,,,,,,
			 dataArr[16] : ,,,,,,,0,,0,0,0,0,,,,,,
			 dataArr[17] :
			
			 dataArr.length : 18
		 */

		if(infoArr.length < 4) {
			contentManager.appendSelectboxOption(undefined);
			return false;
		}

	    /**
		 * typhoon.tmFc		-> 201902201600
		 * typhoon.year		-> 2019
		 * typhoon.no		-> 2
		 * typhoon.name		-> 우딥
		 * typhoon.enName	-> WUTIP
		 */
		typhoon.tmFc = ospFile[ospFile.length-1].substr(7, 12);
		typhoon.year = parseInt(infoArr[0]);
		typhoon.no = parseInt(infoArr[1]);
	    typhoon.name = infoArr[2];
	    typhoon.enName = infoArr[3];
	    
		var currentTmDate = undefined;
		var sameTime = "";
		
		for(var i = 1; i < dataArr.length; i++) {
			
			var isCut = false;
			
			// OSP 한 줄에서 각각 하나의 정보 추출
			var tempArr = dataArr[i].split(",");
			
			//현재 index와 다음 index 비교
			if(dataArr.length - 1 > i) {
				var jj = i + 1;
				var tempArr2 = dataArr[jj].split(",");
				sameTime = tempArr2[0];
			}
			
			if(sameTime != "") {
				if(tempArr[0] == sameTime) {
					++i;
					tempArr = dataArr[i].split(",");
				}
			}
			
			console.log("태풍 loadTyphoon() OSP 한 줄 dataArr[i] :: " + i + " : " + dataArr[i]);
			
			if(!checkValidationRow(tempArr)) {
				continue;
			}
			
			// dataArr 다음 데이터
			var nextTempArr = i < dataArr.length - 1 ? dataArr[i + 1].split(",") : undefined;
			
			if(typeof nextTempArr !== "undefined" && checkValidationRow(nextTempArr)) {
				
				/**
				 * [2020.06.16] 이것은 원래 소스 입니다.
				 *
				//현재가 태풍이면서 다음번이 연관TD예보 이거나 현재가 연관예보이면서 다음번이 태풍예보일때,
				if((tempArr[18].length < 1 && nextTempArr[18].length > 0 || tempArr[18].length > 0 && nextTempArr[18].length < 1)) {
					
					//이번과 다음번의 시간이 동일하지 않는다면 -> 예보가 끊어진 것이다.
					//if(tempArr[0]!==nextTempArr[0]){
						//isCut = true;	
					//}else{
						//continue;	//예보가 끊기지 않은 경우는 현재 예보는 패스하고 나중에 예보된 내용을 표출한다.
					//}
					
				}
			 	*/
				

				/**
				 * 현재와 다음의 연관개체를 비교..
				 *    1. 현재 연관개체 == "" and 다음 연관개체 != ""
				 *    2. 현재 연관개체 != "" and 다음 연관개체 == ""
				 */
				if(tempArr[18].length < 1 && nextTempArr[18].length > 0 
					|| tempArr[18].length > 0 && nextTempArr[18].length < 1) {

					console.log("현재 연관개체 tempArr[18] :: " + tempArr[18]);
					console.log("다음 연관개체 nextTempArr[18] :: " + nextTempArr[18]);
					console.log("현재 분석일시 tempArr[0] :: " + tempArr[0]);
					console.log("다음 분석일시 nextTempArr[0] :: " + nextTempArr[0]);
					console.log("isCut :: " + isCut);

				}
			}
			
			var dirName = typhoonUtils.transValToDir(tempArr[4]);
			
			// 태풍 정보
			var info = {  
					ref: typhoon,
					tm: tempArr[0], 				//orginal text datestring
					tmDate: tempArr[0].toDate(),	//kst tm date
					utcTmDate: typhoonUtils.addHours(tempArr[0].toDate(), -9),	//utc tm date
					lat: tempArr[1],				//위도
					lon: tempArr[2],				//경도
					loc: tempArr[3],				//위치설명
					dir: dirName,					//방향
					sp: tempArr[5].toNumber(),		//진행속도
					ps: tempArr[6].toNumber(),		//중심기압
					ws: tempArr[7].toNumber(),		//중심풍속			//2019-03-06 최대풍속
					tp: tempArr[8],					//TD,TS,LOW
					rad25: tempArr[9],				//25m/s 반경(km)
					ed25: tempArr[10],				//25m/s 예외방향(16방위)
					er25: tempArr[11],				//25m/s 예외반경(km)
					rad15: tempArr[12],				//15m/s 반경(강풍반경)(km)
					ed15: tempArr[13],				//예외반경 방위
					er15: tempArr[14],				//예외반경 (km)
					rad: tempArr[15],				//70%확률반경 (km)
					rYear: tempArr[16],				//연관TD발생년도
					rSeq: tempArr[17],				//연관TD번호	
					rTp: tempArr[18],				//연관개체 타입(TD)	
					rDesc: "",						//이전 중심점이 연관개체인 경우 메세지
				    tmTp: undefined					//예보값인지, 현재, 과거 값인지 여부(F0,C,P)
			};
			var pos = [parseFloat(info.lon), parseFloat(info.lat)]; 
			var center = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform(pos, 'EPSG:4326', 'EPSG:111111')),
				info: info
			});
			
			center.setId(contentManager.createFeatureId()); 
			
			if(info.rad.length < 1 || parseFloat(info.rad) > 0) { //미래
				var futureInterval = "";
			   
				if(typeof currentTmDate !== "undefined") {
					futureInterval = typhoonUtils.getIntervalHours(currentTmDate,info.tmDate); //미래 예보 시간 간격
				}
				
				info.tmTp = 'F' + futureInterval;
			   
				/**
				 * 3일예보 수정 필요 
				 *   - 수정 목적 : 예보중심선은 3일예보까지만 표출한다. 
				 *   - 수정 완료 20170412
				 */
				var diffDay = info.tmDate - currentTmDate;
				var currHH = 60 * 60 * 1000;
				var forcastDay = parseInt(diffDay / currHH);
				
				forecastArr.push(pos);
			
			} else if(typeof nextTempArr !== "undefined" && (nextTempArr[15].length < 1 || parseFloat(nextTempArr[15]) > 0)) { //현재
				info.tmTp = 'C';	 
				trackArr.push(pos);
				forecastArr.push(pos);
				currentTmDate = info.tmDate;
		    } else { //과거
		    	info.tmTp = 'P' + ++trackCnt;
		    	trackArr.push(pos);
		    }
			
			//rDesc 설정
			if(centerArr.length > 0) {
				var perInfo = centerArr[centerArr.length - 1].get("info");
				
				if(info.rTp.length < 1 && perInfo.rTp.length > 0) {
					
					if(perInfo.rYear === perInfo.tm.substring(0, 4)) {
						var resultMsg = typhoonLang.msg('conte.0006');
						info.rDesc = resultMsg.format(perInfo.rSeq);
					} else {
						var resultMsg = typhoonLang.msg('conte.0007');
						info.rDesc = resultMsg.format(perInfo.rYear, perInfo.rSeq);
					}
					
				} else if(info.rTp.length > 0 && perInfo.rTp.length < 1) {  //TD나 Low에서 소멸될때
					
					//var typhoonNameStr = typhoonLang.currentLang === "en" ? typhoon.enName: typhoon.name;
					//info.rDesc = typhoonLang.msg('conte.0010').format(typhoon.no, typhoonNameStr);  
					
				/*	if(info.tp === "LOW") {    //20210506 
						info.rDesc = typhoonLang.msg('conte.0011');
					} else if(info.tp === "TD" && perInfo.tp != "TD") {  
						info.rDesc = typhoonLang.msg('conte.0012');
					} */
					
					if(info.rTp === "TD-END") {  //20210506 TD로 소멸시
						info.rDesc = typhoonLang.msg('conte.0012');
					} else if(info.rTp === "LOW-END") {   //20210506 LOW로 소멸시
						info.rDesc = typhoonLang.msg('conte.0011');
					}
					
				
				} else if(info.rTp.length < 1) {
					
					if(info.tp === "LOW") {    //20210506 태풍에서 TD로 변할때, 열대, 온대로 툴팁표시에서 태풍에서 약화로 변경
						//info.rDesc = typhoonLang.msg('conte.0011');
						var typhoonNameStr = typhoonLang.currentLang === "en" ? typhoon.enName: typhoon.name;  //20210506
						info.rDesc = typhoonLang.msg('conte.0010').format(typhoon.no, typhoonNameStr);  
				//	} else if(info.ws < 17) {
					} else if(info.tp === "TD" && perInfo.tp != "TD") {  //20210506그전의 데이터가 TD였다면 표시 안돼게.
						//info.rDesc = typhoonLang.msg('conte.0012');
						var typhoonNameStr = typhoonLang.currentLang === "en" ? typhoon.enName: typhoon.name;  //2021056
						info.rDesc = typhoonLang.msg('conte.0010').format(typhoon.no, typhoonNameStr);  
					} 
				}
			}
			
			if(info.rTp === "TD-END") {  //20210506 TD로 소멸시
						info.rDesc = typhoonLang.msg('conte.0012');
			} else if(info.rTp === "LOW-END") {   //20210506 LOW로 소멸시
						info.rDesc = typhoonLang.msg('conte.0011');
			}
			
			if(isCut) {
				tracks.push(trackArr);
				trackArr = [];	//초기화
			}
			
			// 태풍 중심 스타일 
			var s = ContentManager.getCenterIcon(info);
			center.setStyle(s);  
			centerArr.push(center);

		}//for(var i = 1; i < dataArr.length; i++) {
		
		/**
		 * tracks : 과거경로 목록
		 * trackArr : 과거~현재지점 위경도 정보 
		 * forecastArr : 현재지점~예보 위경도 정보 
		 */
		tracks.push(trackArr);//과거경로 목록
		typhoon.track = [];
		
		for(var i = 0 ; tracks && i < tracks.length ; i++) {   
			if(tracks[i].length < 2 ) {	
				//선은 두점 이상 존재할 때 가능하므로 패스
				continue;
			}
			
			var tLineString = new ol.geom.LineString(tracks[i]);//tracks[0] : 160.6,4.8,158.6,5,156.2,5.1,155.2,5.1,154.7,4.8,153.8,4.9
			tLineString.transform('EPSG:4326', 'EPSG:111111');
			
			var track = new ol.Feature({
			    geometry: tLineString
			});
			
			track.setId(contentManager.createFeatureId());
			track.setStyle(ContentManager.typhoonStyles.track);  
			typhoon.track.push(track);
		}
		
		var fLineString = new ol.geom.LineString(forecastArr);
		fLineString.transform('EPSG:4326', 'EPSG:111111');
		
		var forecast = new ol.Feature({
		    geometry: fLineString
		}); 
		forecast.setId(contentManager.createFeatureId());
		forecast.setStyle(ContentManager.typhoonStyles.forecast);
		
		/**
		 * 2019-02-22
		 * 태풍 중심 및 경로
		 */
		typhoon.centers = centerArr;//중심
		typhoon.forecast = forecast;//경로
		
		//지도에 실측정보만 반영(예보 미반영)
	    var source = mapManager.layers.typhoon.getSource();
		source.addFeatures(typhoon.track);
		
		//과거 ~ 현재까지의 중심점만 표시
		for(var i = 0 ; centerArr &&  i < centerArr.length ; i++) {   
			var info = centerArr[i].get("info");
			
			if(info.tmTp.indexOf("F") < 0) {
				source.addFeature(centerArr[i]);
			}
		}

		//태풍 최근접예상 스플라인
		//스플라인 정보(미래진로 및 외곽선) 표출
		$.get(ini, function(doc) {   
			 
		   var docArr = doc.split("\n");
		   
		   var multiLineArray = {
			   "line25": [],
			   "line70": [],
			   "line15": [],
			   "lineSp70": [],
			   "lineSp15": [],
			   "lineSp25": [],
			   "lineSp00": [],
	   		   "dir": [],
	   		   "real15_1": [],
	   		   "real15_2": [],
	   		   "real15_3": [],
	   		   "real15_org": []
		   };
		   
		   var infoArr = docArr[0].split(',');
		   
		   /**
		    * 2019-04-17
		    * 복수개 태풍 위험반경 키 추가
		    */
		   typhoon.dangerKey = docArr[0].trim();
		   
		   var infoArr0 = doc.split('dir start');
		   var infoArr1 = doc.split('dir start');
		   
		   if(infoArr.length != 3){
			   return false;
		   }
		   
		   var arrayKey = "";
		   var reStart = /^\d{2}/;
		   var reStartNormal = /^normal \d{2}/;
		   var reStartSp = /^rtko66 \d{2}/;
		   
		   for(var i = 1; i < docArr.length; i++) {
			  var tempArr1 = docArr[i].split(",");//docArr[1] : rtko66 00 start
			  
			  if(tempArr1.length < 2) {
				  if(docArr[i].indexOf("rtko66") > -1) {
					  if(docArr[i].lastIndexOf("start") > -1) {
						  var resultArray = reStartSp.exec(docArr[i]);//rtko66 00 start -> rtko66 00
						  arrayKey = "lineSp" + resultArray[0].replace("rtko66 ", "");//lineSp00
					  } else if(docArr[i].lastIndexOf("end") > -1) {
						  arrayKey = "";  
					  }
				  } else {
					  if(docArr[i].lastIndexOf("start") > -1) {
						  var resultArray = reStart.exec(docArr[i]);//70 normal
						  
						  if(docArr[i].trim().indexOf("normal start" ) > -1) {
							  arrayKey = "line" + resultArray[0];//line70, line15, line25
						  }
						  else if(docArr[i].trim().indexOf("15 real 1 start") > -1) {
							  arrayKey = "real15_1";
						  }
						  else if(docArr[i].trim().indexOf("15 real 2 start") > -1) {
							  arrayKey = "real15_2";
						  }
						  else if(docArr[i].trim().indexOf("15 real 3 start") > -1) {
							  arrayKey = "real15_3";
						  }
						  else if(docArr[i].trim().indexOf("15 org start") > -1) {
							  arrayKey = "real15_org";
						  }
						  else if(docArr[i].trim().indexOf("dir start") > -1) {
							  arrayKey = "dir";
						  } else {
							  arrayKey = "lineSp" + resultArray[0];//lineSp70, lineSp15, lineSp25
						  }
						  
					  } else if(arrayKey == "dir") {
						  multiLineArray[arrayKey].push(docArr[i]);//약
					  } else if(docArr[i].lastIndexOf("end") > -1) {
						  arrayKey = "";  
					  }
				  }
				 
				  continue;
				  
			  } else if(arrayKey.length > 0) {
				  if(arrayKey == "dir") {
					  multiLineArray[arrayKey].push(tempArr1[0]);
				  } else {
					  var even = docArr.length%2;
					  var point1 = [parseFloat(tempArr1[1]),parseFloat(tempArr1[0])];//경도, 위도 
					  multiLineArray[arrayKey].push(point1);
				  }
			  }
		   }//for(var i = 1; i < docArr.length; i++)
		   
		   /**
		    * 2019-03-27 추가
		    * 2019-04-24 수정
		    * 실황 강풍영역
		    */
		   if(multiLineArray.real15_1.length > 0) {
			   var _pPoint = multiLineArray.real15_1;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
			   
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_1);
		       typhoon.real15_1 = feature;
		   }
		   
		   if(multiLineArray.real15_2.length > 0) {
			   var _pPoint = multiLineArray.real15_2;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
			   
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_2);
		       typhoon.real15_2 = feature;
		   }
		   
		   if(multiLineArray.real15_3.length > 0){
			   var _pPoint = multiLineArray.real15_3;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
			   
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_3);
		       typhoon.real15_3 = feature;
		   }
		   
		   if(multiLineArray.real15_org.length > 0){
			   var _pPoint = multiLineArray.real15_org;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
			   
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_org);
		       typhoon.real15_org = feature;
		   }
		   
		   //70%확률반경
		   if(multiLineArray.line70.length > 0){
			   var polygon70 = new ol.geom.Polygon([multiLineArray.line70]);  
			   polygon70.transform('EPSG:4326', 'EPSG:111111');
		    	
		       var feature70 = new ol.Feature({
		    	   geometry: polygon70
			   }); 
		       feature70.setId(contentManager.createFeatureId()); 
		       feature70.setStyle(ContentManager.typhoonStyles.area70);
		       typhoon.area70 = feature70;
		   }
		   
		   //강풍반경(15)
		   if(multiLineArray.line15.length > 0){
			   var polygon15 = new ol.geom.Polygon([multiLineArray.line15]);  
			   polygon15.transform('EPSG:4326', 'EPSG:111111');
		    	
			   var feature15 = new ol.Feature({
				   geometry: polygon15
			   }); 
			   
			   feature15.setId(contentManager.createFeatureId()); 
			   feature15.setStyle(ContentManager.typhoonStyles.area15);
			   typhoon.area15 = feature15;
		   }  
		   
		   //푹풍반경(25)
		   if(multiLineArray.line25.length > 0){
			   var polygon25 = new ol.geom.Polygon([multiLineArray.line25]);  
			   polygon25.transform('EPSG:4326', 'EPSG:111111');
		    	
			   var feature25 = new ol.Feature({
				   geometry: polygon25
			   }); 
			   feature25.setId(contentManager.createFeatureId()); 
			   feature25.setStyle(ContentManager.typhoonStyles.area25);
			   typhoon.area25 = feature25;
		   }
		   
		   if(multiLineArray.lineSp00.length > 0){ //시간내삽 중심 이동선
			   var startDate = infoArr[0].toDate(); //현재시각
			   var interval = parseInt(infoArr[2]); //내삽시간(1시간 단위)	
			   var fLineString = new ol.geom.LineString(multiLineArray.lineSp00);
			   fLineString.transform('EPSG:4326', 'EPSG:111111');
			   var featureSp = new ol.Feature({
				   geometry: fLineString
				   ,info: {
					   tmDate: startDate,
					   utcTmDate: typhoonUtils.addHours(startDate,-9),
					   interval: interval ,
					   dir: multiLineArray.dir 
				   }
			   }); 
			   featureSp.setId(contentManager.createFeatureId()); 
			   featureSp.setStyle(ContentManager.typhoonStyles.forecast);
			   typhoon.forecastSp = featureSp;
		   }
		   
		   if(multiLineArray.lineSp70.length > 0){
			   var polygonSp70 = new ol.geom.Polygon([multiLineArray.lineSp70]);  
			   polygonSp70.transform('EPSG:4326', 'EPSG:111111');
		    	
			   var featureSp70 = new ol.Feature({
				   geometry: polygonSp70
			   });
		    	
			   featureSp70.setId(contentManager.createFeatureId()); 
			   featureSp70.setStyle(ContentManager.typhoonStyles.area70);
			   typhoon.areaSp70 = featureSp70;
		   }
		   
		   if(multiLineArray.lineSp15.length > 0){
			   var polygonSp15 = new ol.geom.Polygon([multiLineArray.lineSp15]);  
			   polygonSp15.transform('EPSG:4326', 'EPSG:111111');
		    	
			   var featureSp15 = new ol.Feature({
				   geometry: polygonSp15
			   }); 
			   featureSp15.setId(contentManager.createFeatureId()); 
			   featureSp15.setStyle(ContentManager.typhoonStyles.area15);
			   typhoon.areaSp15 = featureSp15;
		   }
		   
		   if(multiLineArray.lineSp25.length > 0){
			   var polygonSp25 = new ol.geom.Polygon([multiLineArray.lineSp25]);  
			   polygonSp25.transform('EPSG:4326', 'EPSG:111111');
		    	
			   var featureSp25 = new ol.Feature({
				   geometry: polygonSp25
			   }); 
			   featureSp25.setId(contentManager.createFeatureId()); 
			   featureSp25.setStyle(ContentManager.typhoonStyles.area25);
			   typhoon.areaSp25 = featureSp25;
		   }
		   
		   //위험반경
		   contentManager.loadDangerInit(typhoon);
		   
		   //콤보박스에 태풍 목록 추가 
		   contentManager.appendSelectboxOption(typhoon);

		   //center 잡기
		   var centersStandard = typhoon.centers.length/2;
		   mapManager.setCenter(typhoon.centers[parseInt(centersStandard)].C.info);
			   
		}).fail(function() { 
			contentManager.appendSelectboxOption(typhoon);
		});
		
	}).fail(function() { 
		contentManager.appendSelectboxOption(undefined);
	});
}; 


/**
 * 현재진행중인 열대저압부(TD) 관련 정보 로딩...
 */
ContentManager.prototype.loadDepression = function(osp, ini) {
	
	var contentManager = this;
	var mapManager = contentManager.mapManager; 
	
	function checkValidationRow(tempArr) {
		
		if(tempArr.length < 19 || tempArr[0].length < 1 || tempArr[1].length < 1 || tempArr[2].length < 1 || tempArr[1].toNumber() <= -999 || tempArr[2].toNumber() <= -999) {
			return false;
		}
		
		return true;
	}
	
	/**
	 * OSP 파일 내용 (예제)
	 * -----------------------------------------------------------------------------------------------------
	 * 2020,4,202005290300,N,2020,2,누리,NURI
	 * 202005270900[0], 13.6[1], 131.8[2], 팔라우 북북서쪽 약 740 km 부근 해상[3], NW[4], 10[5], 1002[6], 15[7], TD[8], 0[9], [10], 0[11], 0[12], [13], 0[14], 0[15], 2020[16], 3[17], TD[18]
	 * 
	 * 202005271500,14.5,131.0,팔라우 북북서쪽 약 870 km 부근 해상,NW,22,1002,15,TD,0,,0,0,,0,0,2020,3,TD
	 * 202005272100,15.2,130.2,필리핀 세부 북동쪽 약 870 km 부근 해상,NW,19,998,19,TS,,,,300,NE,120,0,2020,2,TY
	 * 202005280300,15.8,129.5,필리핀 세부 북동쪽 약 860 km 부근 해상,NW,17,990,24,TS,,,,320,NE,140,0,2020,2,TY
	 * 202005280900,16.6,128.6,필리핀 마닐라 동북동쪽 약 850 km 부근 해상,NW,22,980,29,STS,150,N,80,350,NE,160,0,2020,2,TY
	 * 202005281500,17.6,127.6,필리핀 마닐라 동북동쪽 약 780 km 부근 해상,NW,26,996,20,TD,,,,,,,0,2020,2,TY
	 * 202005290300,19.5,125.5,필리핀 마닐라 북동쪽 약 730 km 부근 해상,NW,33,1000,16,TD,0,,0,0,,0,0,,,
	 * [예보 정보 10개까지 등록..]
	 * -----------------------------------------------------------------------------------------------------
	 */
	$.get(osp, function(data) { 
		
		var trackCnt = 0;		//과거~현재지점 포인트 갯수
		var tracks = [];		//과거 이동 경로 목록
		var trackArr = [];		//과거~현재지점 위경도 정보 
		var forecastArr = [];  	//현재지점~예보 위경도 정보 
		var centerArr = [];		//중심점 features 
		var ospFile = osp.split("/");
		
		// OSP 파일 줄단위 정보 [OSP 파일 한줄 -> 202005270900,13.6,131.8,팔라우 북북서쪽 약 740 km 부근 해상,NW,10,1002,15,TD,0,,0,0,,0,0,2020,3,TD ]
		var dataArr = data.split("\n"); 
		// OSP 파일 첫 줄 정보 -> [ 2020,4,202005290300,N,2020,2,누리,NURI ]
		var infoArr = dataArr[0].split(","); 
		
		if(dataArr.length < 2) {
			contentManager.appendSelectboxOption(undefined);
			return false;
		}
		
		if(infoArr.length < 8 || infoArr[0].length < 1 || infoArr[1].length < 1) {
			contentManager.appendSelectboxOption(undefined);
			return false;
		}
		
		var depression = new ContentManager.Depression(); 
		depression.year = parseInt(infoArr[0]);
		depression.no = parseInt(infoArr[1]);
		depression.tmFc = ospFile[ospFile.length-1].substr(7, 12); // 발표시각은 파일명(kst)
		depression.tmEnd = infoArr[3]; // TD예보종료여부(Y/N)
			
		var currentTmDate = infoArr[2].toDate(); // 현재시각 
		var rTyphoonName = typhoonLang.currentLang !== "en" ? infoArr[6]: infoArr[7];
		
		// OSP 파일 정보 기준으로 반복문 실행
		for(var i = 1; i < dataArr.length; i++) {
			
			// 예보 종료 여부
			var isCut = false;
			
			// OSP 한 줄에서 각각 하나의 정보 추출
			var tempArr = dataArr[i].split(",");
			
			console.log("열대저압부(TD) loadDepression() OSP 한 줄 dataArr[i] :: " + i + " : " + dataArr[i]);
			
			if(!checkValidationRow(tempArr)) {
				continue;
			}
			
			var nextTempArr = i < dataArr.length - 1 ? dataArr[i + 1].split(","): undefined;
			
			if(typeof nextTempArr !== "undefined" && checkValidationRow(nextTempArr)) {
				
				/**
				 * [2020.06.16] 이것은 원래 소스 입니다.
				 *
				// tempArr[18] = 연관 개체 정보
				// 현재 TD, 다음 번이 연관태풍예보 이거나 현재가 연관예보이면서 다음번이 TD예보일때, 현재가 연관예보이고 다음번도 연관예보이면서 타입이 다른 경우
				if(tempArr[18].length < 1 && nextTempArr[18].length > 0
					|| tempArr[18].length > 0 && nextTempArr[18].length < 1
					|| tempArr[18].length > 0 && nextTempArr[18].length > 0 
					&& tempArr[18] !== nextTempArr[18]) {
					
					// 이번과 다음번의 시간이 동일하지 않는다면 -> 예보가 끊어진 것이다.
					if(tempArr[0] !== nextTempArr[0]) {
						//isCut = true;
					} else {
						continue; // 예보가 끊기지 않은 경우는 현재는 패스하고 나중에 예보된 내용을 표출한다.
					}
				}
				*/

				/**
				 * 현재와 다음의 연관개체를 비교..
				 * 	  0. 현재 연관개체 != 다음 연관개체
				 *    1. 현재 연관개체 == "" and 다음 연관개체 != ""
				 *    2. 현재 연관개체 != "" and 다음 연관개체 == ""
				 *    3. 현재 연관개체 != "" and 다음 연관개체 != ""
				 */
				if(tempArr[18].length < 1 && nextTempArr[18].length > 0
					|| tempArr[18].length > 0 && nextTempArr[18].length < 1
					|| tempArr[18].length > 0 && nextTempArr[18].length > 0 
					&& tempArr[18] !== nextTempArr[18]) {
					
					/**
					 * 태풍 종료 -> TD 시작 시점 찾기
					 *     - tempArr[0]=분석시간, tempArr[1]=중심위치-위도, tempArr[2]=중심위치-경도
					 *     1. 분석시간이 같은 경우
					 *     2. 중심위치 위도, 경도가 같은 경우
					 */
					/*
					if(tempArr[0] == nextTempArr[0]) {
						continue;
					} else {
						isCut = true;
					}
					*/
					
					// 이번과 다음번의 시간이 동일하지 않는다면 -> 예보가 끊어진 것이다.
					if(tempArr[0] !== nextTempArr[0]) {
						//isCut = true;
					} else {
						continue; // 예보가 끊기지 않은 경우는 현재는 패스하고 나중에 예보된 내용을 표출한다.
					}
					
					console.log("현재 연관개체 tempArr[18] :: " + tempArr[19]);
					console.log("다음 연관개체 nextTempArr[18] :: " + nextTempArr[19]);
					console.log("현재 분석일시 tempArr[0] :: " + tempArr[0]);
					console.log("다음 분석일시 nextTempArr[0] :: " + nextTempArr[0]);
					console.log("isCut :: " + isCut);
					
				}
				
			}
			
			var dirName = typhoonUtils.transValToDir(tempArr[4]);
			
			// TD 정보
			var info = {  
				ref: depression,
				tm: tempArr[0], 				//일시(년월일시분)
				tmDate: tempArr[0].toDate(),	//시간객체(kst)
				utcTmDate: typhoonUtils.addHours(tempArr[0].toDate(),-9),	//utc tm date
				lat: tempArr[1],				//위도(deg)
				lon: tempArr[2],				//경도(deg)
				loc: tempArr[3],				//위치설명
				dir: dirName,					//방향
				sp: tempArr[5].toNumber(),		//진행속도(km/h)
				ps: tempArr[6].toNumber(),		//중심기압(hPa)
				ws: tempArr[7].toNumber(),		//중심풍속(m/s)  
				tp: tempArr[8],					//TD, TS, LOW            
				rad25: tempArr[9],				//25m/s 반경(km)
				ed25: tempArr[10],				//25m/s 예외방향(16방위)
				er25: tempArr[11],				//25m/s 예외반경(km)
				rad15: tempArr[12],				//15m/s 반경(강풍반경)(km)
				ed15: tempArr[13],				//예외반경 방위
				er15: tempArr[14],				//예외반경 (km)
				rad: tempArr[15],				//70%확률반경 (km)
				//rPin : tempArr[16],				//20210503 확인필요.
				rYear: tempArr[16],				//연관개체 발생년도
				rSeq: tempArr[17],				//연관개체 번호	
				rTp: tempArr[18],				//연관개체 타입(TD/TY)
				rTyphoonName: rTyphoonName,		//연관태풍인 경우 태풍명
				rDesc: "",						//이전 중심점이 연관개체인 경우 메세지
				tmTp: undefined					//예보값인지, 현재, 과거 값인지 여부(F0,C,P0)
			};
			
			var pos = [parseFloat(info.lon), parseFloat(info.lat)]; // 위경도
			var center = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.transform(pos, 'EPSG:4326', 'EPSG:111111')),
				info: info
			});
			
			center.setId(contentManager.createFeatureId()); 
			
			var timeInterval = typhoonUtils.getIntervalHours(currentTmDate, info.tmDate);
			
			// 현재 시간을 기준으로 예보시간의 시제 판단
			if(timeInterval > 0) { // 미래 
			    info.tmTp = 'F' + timeInterval;
			    forecastArr.push(pos);
			} else if(timeInterval == 0) { // 현재
			    info.tmTp = 'C';	 
			    trackArr.push(pos);
			    forecastArr.push(pos); 
		    } else { // 과거 
		        info.tmTp = 'P' + ++trackCnt;
			    trackArr.push(pos);
		    }
			
			// rDesc 설정 - 연관개체에 대한 설명
			if(rTyphoonName.length > 0 && centerArr.length > 0) {
				
				var perInfo = centerArr[centerArr.length - 1].get("info");
				
				if(info.rTp === "TY") {
					
					if(perInfo.rTp.length < 1 || perInfo.rTp === "TD") { // 이전이 TD 정보였고 현재가 TY인 경우 (제 {0}호 열대저압부에서 발달)
						
						if(perInfo.rTp.length < 1 || perInfo.rYear === currentTmDate.getFullYear().toString()) {
							var resultMsg = typhoonLang.msg('conte.0006'); // Developed from No. {0} tropical depression
							info.rDesc = resultMsg.format(perInfo.rSeq);
						} else {
							var resultMsg = typhoonLang.msg('conte.0007'); // Developed from {0} No. {1} tropical depression
							info.rDesc = resultMsg.format(perInfo.rYear, perInfo.rSeq);
						}
						
					} /*else if(perInfo.rTp === "TY" && (info.tp === "TD" || info.tp === "LOW")) { //이전이 TY 였고, 현재 TD나 LOW일때
						//20210508 이부분 타는거 확인못함
						var resultMsg = info.tp === "TD" ? typhoonLang.msg('conte.0012'): typhoonLang.msg('conte.0011');		
						info.rDesc = resultMsg;//'conte.0012': '열대저압부로 약화', //'conte.0011': '온대저기압으로 변질',
					}*/
					
				} else if((info.rTp.length < 1 || info.rTp === "TD-END" || info.rTp === "LOW-END" || info.rTp === "LOW" || info.rTp === "TD") && perInfo.rTp === "TY") {  //20210506 이전 태풍이 TD로 변경되었을때 열대저압부 상세보기 조회시 관련
					if(perInfo.rYear === currentTmDate.getFullYear().toString()) {
						info.rDesc = typhoonLang.msg('conte.0010').format(perInfo.rSeq, rTyphoonName); //'conte.0010': '제{0}호 태풍 {1}에서 약화',
					} else {
						info.rDesc = typhoonLang.msg('conte.0013').format(perInfo.rYear, perInfo.rSeq, rTyphoonName); //'conte.0013': '{0}년 제 {1}호 태풍 {2}에서 약화',
					}
					
				} else {
					 if(info.rTp === "TD-END") {  //20210507 TD로 소멸시
						info.rDesc = typhoonLang.msg('conte.0012');
					} else if(info.rTp === "LOW-END") {   //20210508 LOW로 소멸시
						info.rDesc = typhoonLang.msg('conte.0011');
					}
				}
			} else { //열대기압으로만 진행했을때
				if(info.rTp === "TD-END") {  //20210507 TD로 소멸시
				   info.rDesc = typhoonLang.msg('conte.0012');
				} else if(info.rTp === "LOW-END") {   //20210508 LOW로 소멸시
					info.rDesc = typhoonLang.msg('conte.0011');
				}
				
			}

			// 기존 경로와 연결하지않고 새로운 경로를 그린다.
			if(isCut) {
				tracks.push(trackArr);
				trackArr = []; // 경로 초기화
			}
			
			// TD 중심 스타일
			var s = ContentManager.getCenterIcon(info);
			center.setStyle(s);  
			centerArr.push(center);

		}//for(var i = 1; i<dataArr.length; i++){
		
		//중심 이동 진로
		tracks.push(trackArr);
		depression.track = [];
		
		for(var i = 0 ; tracks && i < tracks.length ; i++) {
			var tLineString = new ol.geom.LineString(tracks[i]);
			tLineString.transform('EPSG:4326', 'EPSG:111111');
			
			var track = new ol.Feature({
			    geometry: tLineString
			});
			
			track.setId(contentManager.createFeatureId());
			track.setStyle(ContentManager.typhoonStyles.trackTd);
			
			depression.track.push(track);
		}

		var fLineString = new ol.geom.LineString(forecastArr);
		fLineString.transform('EPSG:4326', 'EPSG:111111');
		
		var forecast = new ol.Feature({
		    geometry: fLineString
		});
		
		forecast.setId(contentManager.createFeatureId());
		forecast.setStyle(ContentManager.typhoonStyles.forecastTd);
		
		depression.centers = centerArr;
		depression.forecast = forecast;   
		 
		//지도에 반영
	    var source = mapManager.layers.typhoon.getSource();
		source.addFeature(depression.forecast);
		source.addFeatures(depression.track);
		source.addFeatures(depression.centers); 
		
	 	//스플라인 정보(미래진로 및 외곽선) 표출
		$.get(ini, function(doc) {
		   var docArr = doc.split("\n");
		   var multiLineArray = { 
			   "line70": [],
			   "line25": [],
	   		   "line15": [],
			   "lineSp70": [],		//시간내삽 - 70%확률 반경 외곽선
			   "lineSp15": [],		//시간내삽 - 15m/s 반경 외곽선
			   "lineSp25": [],
			   "lineSp00": [],		//시간내삽 - 예보 중심이동 경로
	   		   "real15_1": [],		//2019-04-24
	   		   "real15_2": [],
	   		   "real15_3": [],
	   		   "real15_org": []
		   }; 
		   
		   var infoArr = docArr[0].split(',');
		   if(infoArr.length != 3) {
			   return false;
		   }


 			depression.dangerKey = docArr[0].trim();
		   
		   var infoArr0 = doc.split('dir start');
		   var infoArr1 = doc.split('dir start');
		   
		   if(infoArr.length != 3){
			   return false;
		   }
		   
		   var arrayKey = "";
		   var reStart = /^\d{2}/;
		   var reStartNormal = /^normal \d{2}/;
		   var reStartSp = /^rtko66 \d{2}/;
		   
		   for(var i = 1; i < docArr.length; i++) {
			  
			   var tempArr1 = docArr[i].split(",");
			  
			   if(tempArr1.length < 2) {
				   if(docArr[i].indexOf("rtko66") > -1) {
					   if(docArr[i].lastIndexOf("start") > -1) {
						   var resultArray = reStartSp.exec(docArr[i]);    
						   arrayKey = "lineSp" + resultArray[0].replace("rtko66 ", "");  
					   } else if(docArr[i].lastIndexOf("end")>-1) {
						   arrayKey = "";  
					   }
				   } else {
					   if(docArr[i].lastIndexOf("start") > -1) {
						   var resultArray = reStart.exec(docArr[i]);
						  
						   if(docArr[i].trim().indexOf("normal start") > -1) {
							   arrayKey = "line" + resultArray[0];
						   }
						   else if(docArr[i].trim().indexOf("15 real 1 start") > -1) {
							   arrayKey = "real15_1";
						   }
						   else if(docArr[i].trim().indexOf("15 real 2 start") > -1) {
							   arrayKey = "real15_2";
						   }
						   else if(docArr[i].trim().indexOf("15 real 3 start") > -1) {
							   arrayKey = "real15_3";
						   }
						   else if(docArr[i].trim().indexOf("15 org start") >-1) {
							   arrayKey = "real15_org";
						   }
						   else{
							   arrayKey = "lineSp" + resultArray[0];
						   }
						  
					   } else if(docArr[i].lastIndexOf("end") >-1) {
						   arrayKey = "";  
					   }
				   }
				 
				   continue;
				  
			   } else if(arrayKey.length > 0) {
				   var even = docArr.length%2;
				   var point1 = [parseFloat(tempArr1[1]),parseFloat(tempArr1[0])];	//경도, 위도 
				   multiLineArray[arrayKey].push(point1);
				  
			   } 
			  
		   } //for(var i = 1; i < docArr.length; i++)
		   
		   /**
		    * 2019-03-27 추가
		    * 2019-04-24 수정
		    * 실황 강풍영역
		    */
		   if(multiLineArray.real15_1.length > 0) {
			   var _pPoint = multiLineArray.real15_1;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_1);
		       depression.real15_1 = feature;
		   }
		   
		   if(multiLineArray.real15_2.length > 0) {
			   var _pPoint = multiLineArray.real15_2;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_2);
		       depression.real15_2 = feature;
		   }
		   
		   if(multiLineArray.real15_3.length > 0) {
			   var _pPoint = multiLineArray.real15_3;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_3);
		       depression.real15_3 = feature;
		   }
		   
		   if(multiLineArray.real15_org.length > 0) {
			   var _pPoint = multiLineArray.real15_org;
			   var _arr = [];
			   _arr = contentManager.CurvePoint(_pPoint, 30, true);
			   
			   var polygon = new ol.geom.Polygon([_arr]);
			   polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
		       var feature = new ol.Feature({
		    	   geometry: polygon
			   }); 
		       feature.setId(contentManager.createFeatureId()); 
		       feature.setStyle(ContentManager.typhoonStyles.real15_org);
		       depression.real15_org = feature;
		   }
		   
		   if(multiLineArray.line70.length > 0) {
		    	var polygon70 = new ol.geom.Polygon([multiLineArray.line70]);  
		    	polygon70.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var feature70 = new ol.Feature({
				    geometry: polygon70
				}); 
		    	feature70.setId(contentManager.createFeatureId()); 
		    	feature70.setStyle(ContentManager.typhoonStyles.area70);
		    	depression.area70 = feature70;
		    }
		   
		    if(multiLineArray.line15.length > 0) {
		    	var polygon15 = new ol.geom.Polygon([multiLineArray.line15]);  
		    	polygon15.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var feature15 = new ol.Feature({
				    geometry: polygon15
				}); 
		    	feature15.setId(contentManager.createFeatureId()); 
		    	feature15.setStyle(ContentManager.typhoonStyles.area15);
		    	depression.area15 = feature15;
		    }  
		    
		    if(multiLineArray.line25.length > 0) {
		    	var polygon25 = new ol.geom.Polygon([multiLineArray.line25]);  
		    	polygon25.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var feature25 = new ol.Feature({
				    geometry: polygon25
				}); 
		    	feature25.setId(contentManager.createFeatureId()); 
		    	feature25.setStyle(ContentManager.typhoonStyles.area25);
		    	depression.area25 = feature25;
		    }
		    
		    if(multiLineArray.lineSp00.length > 0) {	//시간내삽 중심 이동선
		    	var startDate = infoArr[0].toDate();	//현재시각
		    	//var typSeq = infoArr[1];				//태풍번호
		    	var interval = parseInt(infoArr[2]);	//내삽시간(1시간 단위)	
		    	var fLineString = new ol.geom.LineString(multiLineArray.lineSp00);
		    	fLineString.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var featureSp = new ol.Feature({
				    geometry: fLineString
				    ,info: {
				    	tmDate: startDate,
				    	utcTmDate: typhoonUtils.addHours(startDate,-9),
				    	interval: interval 
				    }
				}); 
		    	featureSp.setId(contentManager.createFeatureId()); 
		    	featureSp.setStyle(ContentManager.typhoonStyles.forecast);
		    	depression.forecastSp = featureSp; 
		    } 
		    
		    // 스플라인된 외곽선 표출 주석(사용안함)
		    
		    if(multiLineArray.lineSp70.length > 0) {
		    	var polygonSp70 = new ol.geom.Polygon([multiLineArray.lineSp70]);  
		    	polygonSp70.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var featureSp70 = new ol.Feature({
				    geometry: polygonSp70
				});
		    	
		    	featureSp70.setId(contentManager.createFeatureId()); 
		    	featureSp70.setStyle(ContentManager.typhoonStyles.area70);
		    	depression.areaSp70 = featureSp70;
		    }
		    
		    if(multiLineArray.lineSp15.length > 0) {
		    	var polygonSp15 = new ol.geom.Polygon([multiLineArray.lineSp15]);  
		    	polygonSp15.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var featureSp15 = new ol.Feature({
				    geometry: polygonSp15
				}); 
		    	featureSp15.setId(contentManager.createFeatureId()); 
		    	featureSp15.setStyle(ContentManager.typhoonStyles.area15);
		    	depression.areaSp15 = featureSp15;
		    }
		    
		    if(multiLineArray.lineSp25.length > 0) {
		    	var polygonSp25 = new ol.geom.Polygon([multiLineArray.lineSp25]);  
		    	polygonSp25.transform('EPSG:4326', 'EPSG:111111');
		    	
		    	var featureSp25 = new ol.Feature({
		    		geometry: polygonSp25
		    	}); 
		    	featureSp25.setId(contentManager.createFeatureId()); 
		    	featureSp25.setStyle(ContentManager.typhoonStyles.area25);
		    	depression.areaSp25 = featureSp25;
		    }			    
		    
		    //위험반경
		   contentManager.loadDangerInit(depression);		
		    //콤보박스에 TD 목록 추가
		    contentManager.appendSelectboxOption(depression); 
				
		}).fail(function() { 
			contentManager.appendSelectboxOption(depression);
		});    
		
	}).fail(function() { 
		contentManager.appendSelectboxOption(undefined);
	});
	
}; 

// 태풍, TD 선택 콤보박스
ContentManager.prototype.appendSelectboxOption = function(item) {
	
	var contentManager = this;
	
	contentManager.loadCnt--;	//로드 완료 의미
		
	if(item instanceof ContentManager.Typhoon) {
		//태풍목록에 추가
		contentManager.typhoons[item.getKey()] = item;
		
	} else if(item instanceof ContentManager.Depression) {
		//TD목록에 추가
		contentManager.depressions[item.getKey()] = item; 
	}
	
	//옵션 총 건수 
	if(contentManager.loadCnt < 1) {
		
		var realCnt = 0;
		
		for(var key in contentManager.typhoons) {  
			realCnt++;
		}
	
		for(var key in contentManager.depressions) { 
			realCnt++;
		} 
		
		//마지막 아이템이 추가된 경우
		if(realCnt > 0) {
			
			function asc(a, b) { // 번호순: 4, 33, 222, 1111
				return a-b;
		    }
			 
			var optionTyArray = []; //오름차순 정렬
			var optionTdArray = []; //오름차순 정렬
			
			// 태풍
			for(var key in contentManager.typhoons) { 
				optionTyArray.push(parseInt(contentManager.typhoons[key].getKey().replace("TY",""))); 
			}
			
			// TD
			for(var key in contentManager.depressions) {
				optionTdArray.push(parseInt(contentManager.depressions[key].getKey().replace("TD",""))); 
			} 
			
			optionTyArray.sort(asc);
			optionTdArray.sort(asc);
			
			var selectbox = $("#"+mapManager.config.selectbox);    
			var strHtml = ""; 
			var currentDate = new Date();
			var currentYear = currentDate.getFullYear();
			
			for(var i = optionTyArray.length - 1; i >= 0; i--) {	
				var typhoon = contentManager.typhoons["TY" + optionTyArray[i]];
				var td = contentManager.depressions["TD" + optionTyArray[i]]; //20210429 TD 위험영역 추가 손태림
				
				// select 박스의 val 값은 최근접예상 지역정보 클릭시 표출되는 레이어 제목을 수정함
				var optionText = typhoonLang.currentLang === "en" ? typhoonLang.msg('conte.0016').format(typhoon.year, typhoon.no, typhoon.enName): typhoonLang.msg('conte.0016').format(typhoon.year, typhoon.no, typhoon.name, typhoon.enName);
				
				strHtml += "<option value='"+ typhoon.getKey() + "'>" + optionText + "</option>";
			}
			
			for(var i = 0 ; optionTdArray && i < optionTdArray.length ; i++) {
				var depression = contentManager.depressions["TD" + optionTdArray[i]];
				var optionText = "";
				
				if(currentYear != depression.year) {
					optionText = typhoonLang.msg('conte.0017').format(depression.year, depression.no); 
				} else {
					optionText = typhoonLang.msg('conte.0015').format(depression.no);
				}
				
				strHtml += "<option value='"+ depression.getKey() +"'>"+ optionText +"</option>";
			}
			
			selectbox.append(strHtml);
			
			//디폴트 옵션 제거
			selectbox.find("option").filter(function() {
				return (this.value.length < 1 ? true : false);
			}).remove(); 
			
			// OR option 순서값으로 선택
			selectbox.find("option:eq(0)").prop("selected", true); 
			$(".graph_detail").show(); //그래프 상세보기 팝업버튼(컨텐츠가 있는 경우만 표출)
			$('.btn_custom').show(); //표 상세보기 팝업버튼(컨텐츠가 있는 경우만 표출)
			$('.tbl_top.sub-select-wrap').show();
			//selectbox.trigger("change");
			$('button[data-role="select-item"]').trigger('click');
			
			/**
			 * 2019-05-30 추가 - 첫 번째 Option이 '열대저압부'의 경우 '위험영역' 버튼 비활성화
			 * 장근희 (jjanga@gisoft.co.kr)
			 */
			var selectItemsVal = $("#selectItems option:eq(0)").val();
			var selectItemsText = $("#selectItems option:eq(0)").text();
			
			if(selectItemsText.indexOf('열대저압부') !== -1) {
				// '열대저압부'
				//$("#btnDangerArea").hide();
				$("#btnDangerArea").show();//20210426 열대저압부도 위험영역 표출
			} else {
				// '태풍'
				$("#btnDangerArea").show();
			}
			
		} else {
			mapManager.addNoItemMsgControl();	//현재 진행 중인 태풍 또는 열대저압부가 없습니다.
		}   
		
		if(typhoon != undefined) {
			var centers = typhoon.centers;
			if(typeof(centers) != undefined) {
				var centerLength = centers.length;
				var centersStandard;
				if(centerLength > 1) {
					centersStandard = Number(centers.length / 2);
				} else {
					centersStandard = centers.length;
				}
				
				//mapManager.setCenter([ 155, 17 ]);
			}
		}
	} 
	
};

//Typhoon 객체
ContentManager.Typhoon = function() {
	this.tmFc;			//예보시각	
	this.year;			//태풍발생년도
	this.no;			//태풍번호
	this.name;			//태풍명
	this.enName;		//태풍영문명
	this.track;			//과거 ~ 현재까지 경로
	this.forecast;		//현재 ~ 예측 경로(직선)
	this.area70;		//태풍 중심위치의 70% 확률영역
	this.area15;		//3일 예보 구간까지의 초속 15m 강풍영역
	this.area25;		//현재 위치에서의 초속 25 m 폭풍영역 
	this.centers;		//태풍 중심
	this.forecastSp;	//현재 ~ 예측 경로(spline)
	this.areaSp70;		//태풍 중심위치의 70% 확률영역(spline)
	this.areaSp15;		//3일 예보 구간까지의 초속 15m 강풍영역(spline)
	this.nearlest;		//최근접선 
	this.real15_1;
	this.real15_2;
	this.real15_3;
	this.real15_org;
	
	/**
	 * 2019-04-04
	 * 위험반경 스타일
	 * 2019-04-29
	 * 위험반경 20%, 40%, 60%, 80% 수정
	 * 2019-04-30
	 * 위험영역 33.3%, 66.6%, 100% 수정
	 * 2019-05-09
	 * 위험영역 30%, 50%, 70%, 100%(강풍반경) 수정
	 */
	this.danger30;
	this.danger50;
	this.danger70;
	this.danger100;
	
	/**
	 * 2019-04-17
	 * 위험반경 키
	 */
	this.dangerKey;
};

ContentManager.Typhoon.prototype.getKey = function() {
	return "TY" + this.year + this.no;
};

ContentManager.Typhoon.prototype.getFeatures = function() {
	var arr = []; 
	var keys = Object.keys(this);
	
	for(var i = 0 ; keys && i < keys.length ; i++) {
		if(this[keys[i]] instanceof ol.Feature) {
			arr.push(this[keys[i]]);
		} else if(this[keys[i]] instanceof Array) { 
			var tempArr = this[keys[i]];
			
			for(var j in tempArr) { 
				if(tempArr[j] instanceof ol.Feature) {
					arr.push(tempArr[j]);
				}
			}
		} 
	}
	
	return arr;
};

//val 가 true 이면 예보정보까지 보이고, false 이면 현재까지 정보만 표출
/**
 * 태풍이 그려진 레이어의 벡터 소스 : source
 * 태풍예보정보를 표출하는 옵션 : all (true 이면 예보 정보 보이게한다.)
 * 태풍예보 표출시 옵션 : nearlest (true 이면 spine 처리된 예보정보로 표출한다.)
 */
ContentManager.Typhoon.prototype.redraw = function(contentManager, all, nearlest){
	//this.forecast;	//현재 ~ 예측 경로(직선)
	//this.area70;		//태풍 중심위치의 70% 확률영역
	//this.area15;		//3일 예보 구간까지의 초속 15m 강풍영역
	//this.area25;		//현재 위치에서의 초속 25 m 폭풍영역 
	//this.centers;		//태풍 중심
	//this.forecastSp;	//현재 ~ 예측 경로(spline)
	//this.areaSp70;	//태풍 중심위치의 70% 확률영역(spline)
	//this.areaSp15;	//3일 예보 구간까지의 초속 15m 강풍영역(spline)
	//this.nearlest;	//최근접선 
	var source = contentManager.mapManager.layers.typhoon.getSource();
	
	/**
	 * 2019-04-18 추가
	 * 복수개 태풍 미선택 과거경로 출력 방지 (태풍)
	 */
	if(typeof this.centers !== "undefined"){
		for(var i = 0 ; this.centers && i < this.centers.length ; i++) {
			source.addFeature(this.centers[i]);
		}
	}
	
	if(typeof this.track !== "undefined"){
		this.track.forEach(function(element) {
			source.addFeature(element);
		})
	}
	
	if(all == true){
		
		if(nearlest == true){
			
			if(typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) == null){
				source.addFeature(this.forecastSp);
			}
			
			if(typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) == null){
				source.addFeature(this.areaSp70);
			}
			
			if(typeof this.areaSp25 !== "undefined" && source.getFeatureById(this.areaSp25.getId()) == null){
				source.addFeature(this.areaSp25);
			}
			if(typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) == null){
				source.addFeature(this.areaSp15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) == null){
				source.addFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) == null){
				source.addFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) == null){
				source.addFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) == null){
				source.addFeature(this.real15_org);
			}
			
			this.unShowNearlestLine(contentManager);
			
		}else{
			
			if(typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) == null){
				source.addFeature(this.forecast);
			}
			if(typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) == null){
				source.addFeature(this.area70);
			}
			
			if(typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) == null){
				source.addFeature(this.area15);
			} 
			
			if(typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) == null){
				source.addFeature(this.area25);
			} 
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) == null){
				source.addFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) == null){
				source.addFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) == null){
				source.addFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) == null){
				source.addFeature(this.real15_org);
			}
			
		}
		
		if(typeof this.centers !== "undefined"){
			for(var i in this.centers){

			}
		}
		
		/**
		 * 2019-04-18 추가
		 * 복수개 태풍 미선택 과거경로 출력 방지
		 */
		if(typeof this.track !== "undefined"){
			this.track.forEach(function(element) {

			});
		}
		
	}else{
		
		if(nearlest == true){
			
			if(typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) != null){
				source.removeFeature(this.forecastSp);
			}
			if(typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) != null){
				source.removeFeature(this.areaSp70);
			}
			if(typeof this.areaSp25 !== "undefined" && source.getFeatureById(this.areaSp25.getId()) != null){
				source.removeFeature(this.areaSp25);
			}
			
			if(typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) != null){
				source.removeFeature(this.areaSp15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) != null){
				source.removeFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) != null){
				source.removeFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) != null){
				source.removeFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) != null){
				source.removeFeature(this.real15_org);
			}
			
			this.unShowNearlestLine(contentManager);
			
		}else{
			
			if(typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) != null){
				source.removeFeature(this.forecast);
			}
			if(typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) != null){
				source.removeFeature(this.area70);
			}
			
			if(typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) != null){
				source.removeFeature(this.area25);
			}
			if(typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) != null){
				source.removeFeature(this.area15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) != null){
				source.removeFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) != null){
				source.removeFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) != null){
				source.removeFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) != null){
				source.removeFeature(this.real15_org);
			}
			
		}  
		
		if(typeof this.centers !== "undefined"){
			
			for(var i = 0 ; this.centers && i < this.centers.length ; i++) {
				/**
				 * 2019-04-18 추가
				 * 복수개 태풍 미선택 과거경로 출력 방지
				 */
				source.removeFeature(this.centers[i]);
			}
		}
		
		/**
		 * 2019-04-18 추가
		 * 복수개 태풍 미선택 과거경로 출력 방지
		 */
		if(typeof this.track !== "undefined"){
			this.track.forEach(function(element) {
				source.removeFeature(element);
			});
		}
		
	}
};

/**
 * 태풍 위성영상 표출
 */
ContentManager.Typhoon.prototype.refreshIcons = function(isActive){

	console.log("위성영상 표출 시작");
	
	if(typeof this.centers !== "undefined"){
		
		for(var i = 0 ; this.centers && i < this.centers.length ; i++) {
			var info = this.centers[i].get("info");
			var statisticsResult = $("#statistics_id").attr("class");
			
			if(statisticsResult == "active" && idx == i){
				var s = mapManager.imageSources[idx];
				var source = new ol.source.ImageStatic({  
					url: s.fileName,
					projection: mapManager.projection,
					imageExtent: mapManager.extents.satellite
				});
				
				var newStyle = undefined;
				
				if(typeof s.center !== "undefined"){
					var originStyle = s.center.getStyle();    
					var suf = mapManager.getZoomLvlSuffix(); 
					var imgPath = originStyle.getImage().getSrc();
					var imgPathIdx = imgPath.lastIndexOf("/")+1;
					var imgFileArr = imgPath.substr(imgPathIdx).split("]"); 
					var bigImgPath = imgPath.substring(0,imgPathIdx) + imgFileArr[0].replace(".png", "") + suf + ".png";
					newStyle = new ol.style.Style({
						image: new ol.style.Icon({
		                    scale: 1,  
		                    opacity: 1,
		                    src: bigImgPath
						}) 
					}); 
					s.center.setStyle(newStyle);
					mapManager.layers.satellite.setSource(source); 
				}
			}else{
				this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));  
			}
		}
	}
	
	console.log("위성영상 표출 끝");
	
};

ContentManager.Typhoon.prototype.getCenter = function(){
	var centers = this.centers;
	for(var i = 0 ; centers && i < centers.length ; i++) {
		var info = centers[i].get("info");
		if(info.tmTp === "C"){
			return centers[i].getGeometry().getLastCoordinate();
		}
	} 
};

//태풍의 최근접선 표출
ContentManager.Typhoon.prototype.showNearlestLine = function(contentManager, feature, typhoon){
	if(typeof this.forecastSp === "undefined"  ){
		return false;
	}
	var source = contentManager.mapManager.layers.typhoon.getSource();
	var featurePos = [parseFloat(feature.get("x")),parseFloat(feature.get("y"))];
	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){
		this.unShowNearlestLine(contentManager);
	}
	
	var info = this.forecastSp.get("info");
	var yearSeq = this.year + "" + this.no;
	var selectItemsVal = $("#selectItems option:selected").val();
	var tdTyGubun = selectItemsVal.substring(0,2);
	
	if(selectItemsVal.substring(2,selectItemsVal.length) != yearSeq) {
		return;
	}
	var selectItemsText = $("#selectItems option:selected").text();
	
	var message0 = selectItemsText.substr(6,selectItemsText.legnth);
	
	/*** 현재부터 예보 위경도 정보 ***/
	var coordinates = this.forecastSp.getGeometry().getCoordinates();

	var posArr = [];  
	
	var dmin = 99999.9;  //taps client 로직
	var minDistance = Number.MAX_VALUE;
	var minIdx = coordinates.length;
	for(var i in coordinates){ 
		var centerPos = ol.proj.transform(coordinates[i], 'EPSG:111111', 'EPSG:4326');	//경도, 위도
		var distance = typhoonUtils.getDistance(featurePos,centerPos);
		posArr.push(centerPos);

		if(minDistance > distance){
			minDistance = distance;
			minIdx = i;
		}
	}
	if(minIdx < posArr.length && minDistance < dmin){
		var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate: info.tmDate;
			tmDate = typhoonUtils.addHours(tmDate, minIdx * info.interval);	//index 가 0일때, 내삽시점의 시각이다.
		var centerPos = posArr[minIdx];
		var dirSP  = typhoonUtils.zeroToBlank(info.dir[minIdx]);
		var textFormat = typhoonLang.msg('conte.0001');
		var overlaytextFormat = typhoonLang.msg('conte.0018');

		var mm = (tmDate.getMonth()+1).toString(); // getMonth() is zero-based
		var dd = tmDate.getDate().toString();
		var hh = tmDate.getHours().toString();
		var ds = Math.round(minDistance/10)*10;
		var text = textFormat.format(mm,dd,hh,ds+"");
		
		//div로 구성된 feature
		var city = typhoonUtils.getCityName(feature);
		var overlaytext = overlaytextFormat.format(city,mm,dd,hh,ds+"", dirSP);
		
		var tLineString = new ol.geom.LineString([featurePos,centerPos]);
		tLineString.transform('EPSG:4326', 'EPSG:111111');
		
		/*** 이부분 수정하면 될듯 ***/
		var overlayId = contentManager.mapManager.addOverlaySe(message0, city, overlaytext, tLineString.getFirstCoordinate());
		var nearlest = new ol.Feature({
		    geometry: tLineString,
		    overlayId: overlayId

		}); 
		
		nearlest.setId(contentManager.createFeatureId());
		/** 지역 아이콘 크기 조정 **/
		var style = new ol.style.Style({
							stroke: new ol.style.Stroke({
							  color: 'rgba(255, 80, 80, 0.5)',
							  width: 3,
							  lineCap:'square' 
							  
							})
		});
		
		nearlest.setStyle(style);  
		
		this.nearlest = nearlest;  
		source.addFeature(this.nearlest);
	} 
};  

// 지역명 표
ContentManager.Typhoon.prototype.showArea = function(contentManager, feature, typhoon){
	if(typeof this.forecastSp === "undefined"  ){
		return false;
	}
	var source = contentManager.mapManager.layers.typhoon.getSource();
	var featurePos = [parseFloat(feature.get("x")),parseFloat(feature.get("y"))];
	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){
		this.unShowNearlestLine(contentManager);
	}
	
	var info = this.forecastSp.get("info");
	var yearSeq = this.year + "" + this.no;
	var selectItemsVal = $("#selectItems option:selected").val();
	var tdTyGubun = selectItemsVal.substring(0,2);
	
	if(selectItemsVal.substring(2, selectItemsVal.length) != yearSeq) {
		return;
	}
	var selectItemsText = $("#selectItems option:selected").text();
	
	var message0 = selectItemsText.substr(6, selectItemsText.legnth);
	

	
	/*** 현재부터 예보 위경도 정보 ***/
	var coordinates = this.forecastSp.getGeometry().getCoordinates();

	var posArr = [];  
	
	var dmin = 99999.9;  //taps client 로직
	var minDistance = Number.MAX_VALUE;
	var minIdx = coordinates.length;
	for(var i in coordinates){ 
		var centerPos = ol.proj.transform(coordinates[i],'EPSG:111111','EPSG:4326');	//경도, 위도
		var distance = typhoonUtils.getDistance(featurePos,centerPos);
		posArr.push(centerPos);
		
		if(minDistance > distance){
			minDistance = distance;
			minIdx = i;
		}
	}
	if(minIdx < posArr.length && minDistance < dmin){
		var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate: info.tmDate;
		tmDate = typhoonUtils.addHours(tmDate, minIdx * info.interval);	//index 가 0일때, 내삽시점의 시각이다.
		var centerPos = posArr[minIdx];
		var dirSP  = typhoonUtils.zeroToBlank(info.dir[minIdx]);

		var textFormat = typhoonLang.msg('conte.0001');
		var overlaytextFormat = typhoonLang.msg('conte.0018');
		
		var mm = (tmDate.getMonth()+1).toString(); // getMonth() is zero-based
		var dd = tmDate.getDate().toString();
		var hh = tmDate.getHours().toString();
		var ds = Math.round(minDistance/10)*10;
		var text = textFormat.format(mm,dd,hh,ds+"");
		
		//div로 구성된 feature
		var city = typhoonUtils.getCityName(feature);
		var overlaytext = overlaytextFormat.format(city,mm,dd,hh,ds+"", dirSP);
		
		var tLineString = new ol.geom.LineString([featurePos,centerPos]);
		tLineString.transform('EPSG:4326', 'EPSG:111111');
		
		/*** 이부분 수정하면 될듯 ***/
		var overlayId = contentManager.mapManager.addOverlaySeArea(message0, city, overlaytext, tLineString.getFirstCoordinate());
		var nearlest = new ol.Feature({
			geometry: tLineString,
			overlayId: overlayId
			
		}); 
		
		nearlest.setId(contentManager.createFeatureId());
		/** 지역 아이콘 크기 조정 **/
		var style = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'rgba(255, 80, 80, 0.5)',
				width: 3,
				lineCap:'square'
				
			})
		});
		
		nearlest.setStyle(style);  
		
		this.nearlest = nearlest;  
		source.addFeature(this.nearlest);
	} 
};  

//태풍의 최근접 선 표출
ContentManager.Typhoon.prototype.unShowNearlestLine = function(contentManager){ 
	
	var source = contentManager.mapManager.layers.typhoon.getSource();
	
	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){ 
		var overlayId = this.nearlest.get("overlayId");
		source.removeFeature(this.nearlest);  
		this.nearlest = undefined;
		
		if( typeof overlayId !== "undefined" ){
			contentManager.mapManager.removeOverlay(overlayId);
		}
		
	}
	if(typeof this.nearlestBox !== "undefined" && source.getFeatureById(this.nearlestBox.getId())){ 
		var overlayId = this.nearlestBox.get("overlayId");
		source.removeFeature(this.nearlestBox);  
		this.nearlestBox = undefined;
		
		if( typeof overlayId !== "undefined" ){
			contentManager.mapManager.removeOverlay(overlayId);
		}
		
	}
}; 

ContentManager.Depression = function(){
/*	this.tmFc;			//예보시각	
	this.year;			//TD발생년도
	this.no;			//TD번호
	this.tmEnd;			//TD예보종료여부(Y/N)
	this.track;			//과거 ~ 현재까지 경로
	this.forecast;		//현재 ~ 예측 경로 
	this.centers;		//TD 중심
	this.area70;		//TD 70%확률반경
*/
	//20210430 
	this.tmFc;			//예보시각	
	this.year;			//태풍발생년도
	this.no;			//태풍번호
	this.name;			//태풍명
	this.enName;		//태풍영문명
	this.track;			//과거 ~ 현재까지 경로
	this.forecast;		//현재 ~ 예측 경로(직선)
	this.area70;		//태풍 중심위치의 70% 확률영역
	this.area15;		//3일 예보 구간까지의 초속 15m 강풍영역
	this.area25;		//현재 위치에서의 초속 25 m 폭풍영역 
	this.centers;		//태풍 중심
	this.forecastSp;	//현재 ~ 예측 경로(spline)
	this.areaSp70;		//태풍 중심위치의 70% 확률영역(spline)
	this.areaSp15;		//3일 예보 구간까지의 초속 15m 강풍영역(spline)
	this.nearlest;		//최근접선 
	this.real15_1;
	this.real15_2;
	this.real15_3;
	this.real15_org;
	
	this.danger30;
	this.danger50;
	this.danger70;
	this.danger100;

	this.dangerKey;
	
}; 

ContentManager.Depression.prototype.getKey = function(){
	return "TD"+ this.year + this.no ;
};

ContentManager.Depression.prototype.getFeatures = function(){
	var arr = []; 
	var keys = Object.keys(this);
	
	for(var i in keys){  
		if(this[keys[i]] instanceof ol.Feature){
			arr.push(this[keys[i]]);
		}else if(this[keys[i]] instanceof Array){ 
			var tempArr = this[keys[i]];
			for(var j in tempArr){ 
				if(tempArr[j] instanceof ol.Feature){
					arr.push(tempArr[j]);
				}
			}
		} 
	}
	
	return arr;
};

ContentManager.Depression.prototype.setVisible = function(source, val){
	
	var fs = this.getFeatures(); 
	
	for(var i in fs){
		
		if(val === true){
			
			if(source.getFeatureById(fs[i].getId()) == null){
				source.addFeature(fs[i]);
			}
			
		}else{
			
			if(source.getFeatureById(fs[i].getId()) != null){
				source.removeFeature(fs[i]);
			}
		}
	}	
};

ContentManager.Depression.prototype.getCenter = function(){
	var centers = this.centers;
	for(var i in centers){
		var info = centers[i].get("info");
		if(info.tmTp === "C"){
			return centers[i].getGeometry().getLastCoordinate();
		}
	} 
};

/**
 * 열대저압부, 온대저기압 위성영상 표출
 */
ContentManager.Depression.prototype.refreshIcons = function(isActive){
	
	if(typeof this.centers !== "undefined"){
		
		for(var i = 0 ; this.centers && i < this.centers.length ; i++) {
			var info = this.centers[i].get("info");
			var statisticsResult = $("#statistics_id").attr("class");
			
			if(statisticsResult == "active" && idx == i){
				var s = mapManager.imageSources[idx];
				var source = new ol.source.ImageStatic({  
					url: s.fileName,
					projection: mapManager.projection,
					imageExtent: mapManager.extents.satellite
				});
				
				var newStyle = undefined;
				
				if(typeof s.center !== "undefined"){
					var originStyle = s.center.getStyle();    
					var suf = mapManager.getZoomLvlSuffix(); 
					var imgPath = originStyle.getImage().getSrc();
					var imgPathIdx = imgPath.lastIndexOf("/")+1;
					var imgFileArr = imgPath.substr(imgPathIdx).split("]"); 
					var bigImgPath = imgPath.substring(0,imgPathIdx) + imgFileArr[0].replace(".png","") + suf + ".png";
					newStyle = new ol.style.Style({
						image: new ol.style.Icon({
		                    scale: 1,  
		                    opacity: 1,
		                    src: bigImgPath
						}) 
					}); 
					s.center.setStyle(newStyle);
					mapManager.layers.satellite.setSource(source); 
				}
			}else{
				this.centers[i].setStyle(ContentManager.getCenterIcon(info, isActive));
			}
		}
	}
	
}; 

ContentManager.Depression.prototype.redraw = function(contentManager, isActive, nearlest){
	
	var source = contentManager.mapManager.layers.typhoon.getSource();
	
	/**
	 * 2019-04-18 추가
	 * 복수개 태풍 미선택 과거경로 출력 방지 (열대저압부)
	 */
	if(typeof this.centers !== "undefined"){
		for(var i in this.centers){
			source.addFeature(this.centers[i]);
		}
	}
	
	if(typeof this.track !== "undefined"){
		this.track.forEach(function(element) {
			source.addFeature(element);
		})
	}
	
	if(isActive){
		if(nearlest == true){ 
			if(typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) == null){
				source.addFeature(this.forecastSp);
			}
			
			if(typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) == null){
				source.addFeature(this.areaSp70);
			}
			if(typeof this.areaSp25 !== "undefined" && source.getFeatureById(this.areaSp25.getId()) == null){
				source.addFeature(this.areaSp25);
			}
			
			if(typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) == null){
				source.addFeature(this.areaSp15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) == null){
				source.addFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) == null){
				source.addFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) == null){
				source.addFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) == null){
				source.addFeature(this.real15_org);
			}
			
			this.unShowNearlestLine(contentManager);
			
		}else{
			
			if(typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) == null){
				source.addFeature(this.forecast);
			}
			if(typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) == null){
				source.addFeature(this.area70);
			}
			if(typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) == null){
				source.addFeature(this.area25);
			}
			if(typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) == null){
				source.addFeature(this.area15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) == null){
				source.addFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) == null){
				source.addFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) == null){
				source.addFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) == null){
				source.addFeature(this.real15_org);
			}
			
			
		}
		
		if(typeof this.centers !== "undefined"){
			for(var i in this.centers){

			}
		} 
		
		/**
		 * 2019-04-18 추가
		 * 복수개 태풍 미선택 과거경로 출력 방지
		 */
		if(typeof this.track !== "undefined"){
			this.track.forEach(function(element) {

			})
		}
		
	}else{
		if(nearlest == true){
			if(typeof this.forecastSp !== "undefined" && source.getFeatureById(this.forecastSp.getId()) != null){
				source.removeFeature(this.forecastSp);
			}
			if(typeof this.areaSp70 !== "undefined" && source.getFeatureById(this.areaSp70.getId()) != null){
				source.removeFeature(this.areaSp70);
			}
			if(typeof this.areaSp25 !== "undefined" && source.getFeatureById(this.areaSp25.getId()) != null){
				source.removeFeature(this.areaSp25);
			}
			if(typeof this.areaSp15 !== "undefined" && source.getFeatureById(this.areaSp15.getId()) != null){
				source.removeFeature(this.areaSp15);
			} 
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) != null){
				source.removeFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) != null){
				source.removeFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) != null){
				source.removeFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) != null){
				source.removeFeature(this.real15_org);
			}
			
			this.unShowNearlestLine(contentManager);
			
		}else{
			
			if(typeof this.forecast !== "undefined" && source.getFeatureById(this.forecast.getId()) != null){
				source.removeFeature(this.forecast);
			}
			if(typeof this.area70 !== "undefined" && source.getFeatureById(this.area70.getId()) != null){
				source.removeFeature(this.area70);
			}
			if(typeof this.area25 !== "undefined" && source.getFeatureById(this.area25.getId()) != null){
				source.removeFeature(this.area25);
			}
			if(typeof this.area15 !== "undefined" && source.getFeatureById(this.area15.getId()) != null){
				source.removeFeature(this.area15);
			}
			
			if(typeof this.real15_1 !== "undefined" && source.getFeatureById(this.real15_1.getId()) != null){
				source.removeFeature(this.real15_1);
			}
			if(typeof this.real15_2 !== "undefined" && source.getFeatureById(this.real15_2.getId()) != null){
				source.removeFeature(this.real15_2);
			}
			if(typeof this.real15_3 !== "undefined" && source.getFeatureById(this.real15_3.getId()) != null){
				source.removeFeature(this.real15_3);
			}
			if(typeof this.real15_org !== "undefined" && source.getFeatureById(this.real15_org.getId()) != null){
				source.removeFeature(this.real15_org);
			}

		}  
		
		if(typeof this.centers !== "undefined"){
			
			for(var i in this.centers){
				/**
				 * 2019-04-18 추가
				 * 복수개 태풍 미선택 과거경로 출력 방지
				 */
				source.removeFeature(this.centers[i]);
			}
		}
		
		/**
		 * 2019-04-18 추가
		 * 복수개 태풍 미선택 과거경로 출력 방지
		 */
		if(typeof this.track !== "undefined"){
			this.track.forEach(function(element) {
				source.removeFeature(element);
			})
		}
	} 
};

//태풍의 최근접선 표출
ContentManager.Depression.prototype.showNearlestLine = function(contentManager, feature){ 
	if(typeof this.forecastSp === "undefined"  ){
		return false;
	}
	
	var source = contentManager.mapManager.layers.typhoon.getSource();
	var featurePos = [parseFloat(feature.get("x")),parseFloat(feature.get("y"))];
	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){
		this.unShowNearlestLine(contentManager);
	}
	
	var info = this.forecastSp.get("info");
	var yearSeq = this.year + "" + this.no;
	var selectItemsVal = $("#selectItems option:selected").val();
	var tdTyGubun = selectItemsVal.substring(0,2);
	
	if(selectItemsVal.substring(2, selectItemsVal.length) != yearSeq) {
		return;
	}
	var selectItemsText = $("#selectItems option:selected").text();
	
	var message0 = selectItemsText.substr(4,selectItemsText.legnth);
	
	
	/*** 현재부터 예보 위경도 정보 ***/
	var coordinates = this.forecastSp.getGeometry().getCoordinates();

	var posArr = [];  
	
	var dmin = 99999.9; //taps client 로직
	var minDistance = Number.MAX_VALUE;
	var minIdx = coordinates.length;
	for(var i in coordinates){ 
		var centerPos = ol.proj.transform(coordinates[i],'EPSG:111111','EPSG:4326'); //경도, 위도
		var distance = typhoonUtils.getDistance(featurePos,centerPos);
		posArr.push(centerPos);

		if(minDistance > distance){
			minDistance = distance;
			minIdx = i;
		}
	}
	
	if(minIdx < posArr.length && minDistance < dmin){
		var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate: info.tmDate;
			tmDate = typhoonUtils.addHours(tmDate, minIdx * info.interval);	//index 가 0일때, 내삽시점의 시각이다.
		var centerPos = posArr[minIdx];

		var textFormat = typhoonLang.msg('conte.0001');
		var overlaytextFormat = typhoonLang.msg('conte.0019');

		var mm = (tmDate.getMonth()+1).toString(); // getMonth() is zero-based
		var dd = tmDate.getDate().toString();
		var hh = tmDate.getHours().toString();
		var ds = Math.round(minDistance/10)*10;
		var text = textFormat.format(mm,dd,hh,ds+"");
		
		//div로 구성된 feature
		var city = typhoonUtils.getCityName(feature);
		var overlaytext = overlaytextFormat.format(city,mm,dd,hh,ds+"");
		
		var tLineString = new ol.geom.LineString([featurePos,centerPos]);
		tLineString.transform('EPSG:4326', 'EPSG:111111');
		var overlayId = contentManager.mapManager.addOverlaySe(message0, city, overlaytext, tLineString.getFirstCoordinate());
		
		var nearlest = new ol.Feature({
		    geometry: tLineString,
		    overlayId: overlayId

		}); 
		nearlest.setId(contentManager.createFeatureId());
		/** 지역 아이콘 크기 조정 **/
		var style = new ol.style.Style({
							stroke: new ol.style.Stroke({
							  color: 'rgba(255, 80, 80, 0.5)',
							  width: 3
							  
							})
		});
		
		nearlest.setStyle(style);  
		
		this.nearlest = nearlest;  
		source.addFeature(this.nearlest);
	} 
};  


//태풍의 최근접선 표출
ContentManager.Depression.prototype.showArea = function(contentManager, feature){ 
	if(typeof this.forecastSp === "undefined"  ){
		return false;
	}
	var source = contentManager.mapManager.layers.typhoon.getSource();
	var featurePos = [parseFloat(feature.get("x")),parseFloat(feature.get("y"))];
	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){
		this.unShowNearlestLine(contentManager);
	}
	
	var info = this.forecastSp.get("info");
	var yearSeq = this.year+""+this.no;
	var selectItemsVal = $("#selectItems option:selected").val();
	var tdTyGubun = selectItemsVal.substring(0,2);
	
	if(selectItemsVal.substring(2,selectItemsVal.length) != yearSeq) {
		return;
	}
	var selectItemsText = $("#selectItems option:selected").text();
	
	var message0 = selectItemsText.substr(4, selectItemsText.legnth);
	
	
	/*** 현재부터 예보 위경도 정보 ***/
	var coordinates = this.forecastSp.getGeometry().getCoordinates();
	var posArr = [];  
	
	var dmin = 99999.9; //taps client 로직
	var minDistance = Number.MAX_VALUE;
	var minIdx = coordinates.length;
	for(var i in coordinates){ 
		var centerPos = ol.proj.transform(coordinates[i],'EPSG:111111','EPSG:4326'); //경도, 위도
		var distance = typhoonUtils.getDistance(featurePos,centerPos);
		posArr.push(centerPos);

		if(minDistance > distance){
			minDistance = distance;
			minIdx = i;
		}
	}
	
	if(minIdx < posArr.length && minDistance < dmin){
		var tmDate = typhoonLang.currentLang === "en" ? info.utcTmDate: info.tmDate;
			tmDate = typhoonUtils.addHours(tmDate, minIdx * info.interval);	//index 가 0일때, 내삽시점의 시각이다.
		var centerPos = posArr[minIdx];
		var textFormat = typhoonLang.msg('conte.0001');
		var overlaytextFormat = typhoonLang.msg('conte.0019');
		var mm = (tmDate.getMonth()+1).toString(); // getMonth() is zero-based
		var dd = tmDate.getDate().toString();
		var hh = tmDate.getHours().toString();
		var ds = Math.round(minDistance/10)*10;
		var text = textFormat.format(mm,dd,hh,ds+"");
		
		//div로 구성된 feature
		var city = typhoonUtils.getCityName(feature);
		var overlaytext = overlaytextFormat.format(city,mm,dd,hh,ds+"");
		
		var tLineString = new ol.geom.LineString([featurePos,centerPos]);
		tLineString.transform('EPSG:4326', 'EPSG:111111');
		var overlayId = contentManager.mapManager.addOverlaySeArea(message0, city, overlaytext, tLineString.getFirstCoordinate());
		
		var nearlest = new ol.Feature({
		    geometry: tLineString,
		    overlayId: overlayId

		}); 
		nearlest.setId(contentManager.createFeatureId());
		/** 지역 아이콘 크기 조정 **/
		var style = new ol.style.Style({
							stroke: new ol.style.Stroke({
							  color: 'rgba(255, 80, 80, 0.5)',
							  width: 3,
							  lineCap:'square'
							  
							})
		});
		
		nearlest.setStyle(style);  
		
		this.nearlest = nearlest;  
		source.addFeature(this.nearlest);
	} 
};  

//태풍의 최근접 선 표출
ContentManager.Depression.prototype.unShowNearlestLine = function(contentManager){ 
	
	var source = contentManager.mapManager.layers.typhoon.getSource();

	if(typeof this.nearlest !== "undefined" && source.getFeatureById(this.nearlest.getId())){ 
		var overlayId = this.nearlest.get("overlayId");
		source.removeFeature(this.nearlest);  
		this.nearlest = undefined;
		
		if( typeof overlayId !== "undefined" ){
			contentManager.mapManager.removeOverlay(overlayId);
		}
		
	}
	if(typeof this.nearlestBox !== "undefined" && source.getFeatureById(this.nearlestBox.getId())){ 
		var overlayId = this.nearlestBox.get("overlayId");
		source.removeFeature(this.nearlestBox);  
		this.nearlestBox = undefined;
		
		if( typeof overlayId !== "undefined" ){
			contentManager.mapManager.removeOverlay(overlayId);
		}
		
	}
};

/*****************************************************************************************************************************************/


/**
 * 2019-03-19 테스트
 */
ContentManager.prototype.AddCircle = function(){
	var source = this.mapManager.layers.danger.getSource();
	source.clear();
	
	var circle = new ol.geom.Circle([135.2, 25.3], 10);
	circle.transform('EPSG:4326', 'EPSG:111111');
	var feature = new ol.Feature(circle);
	source.addFeature(feature);
};


/**
 * 2019-05-02
 * 실황 강풍영역 (곡선화 함수)
 */
ContentManager.prototype.CurvePoint = function(points, numPoints, bClose){
	
	var curvePoints = [];
	
	var n = points.length;
	if(n < 3) {
		for(var i = 0; i < n; i++) {
			curvePoints.push(points[i])
		}
		return curvePoints;
	}
	
	var pointsTmp = [];
	
	// re array
	pointsTmp.push(points[n - 1]);
	for(var i = 0; i < n; i++) {
		pointsTmp.push(points[i]);
	}
	pointsTmp.push(points[0]);
	
	// close
	if(bClose == true) {
		pointsTmp.push(points[1]);
	}
	
	var nSize = pointsTmp.length;
	
	for(var i = 0; i < nSize - 3; i++) {
		var p0 = pointsTmp[i];
		var p1 = pointsTmp[i + 1];
		var p2 = pointsTmp[i + 2];
		var p3 = pointsTmp[i + 3];

		for(var j = 0; j < numPoints; j++) {
			var t = (1. / numPoints) * j;

            var t2 = t * t;
            var t3 = t2 * t;

            var px = 0.5 * ((2.0 * p1[1]) +
            (-p0[1] + p2[1]) * t +
            (2.0 * p0[1] - 5.0 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3.0 * p1[1] - 3.0 * p2[1] + p3[1]) * t3);

            var py = 0.5 * ((2.0 * p1[0]) +
            (-p0[0] + p2[0]) * t +
            (2.0 * p0[0] - 5.0 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3.0 * p1[0] - 3.0 * p2[0] + p3[0]) * t3);
            
            // push
            var ptDst = [py, px];
            curvePoints.push(ptDst);
        }
	}

	// push
	var p4 = pointsTmp[nSize - 2];
	curvePoints.push(p4);
	
	return curvePoints;
}


/**
 * 2019-04-04
 * 위험반경 데이터 추출
 */
ContentManager.prototype.loadDangerInit = function(typhoon){
	
	var contentManager = this;
	var mapManager = this.mapManager;
	
	/**
	 * 2019-04-29
	 * 위험반경 경로 변경
	 */
	$.get(urlPrefix + 'repositary/xml/typ/raw/DAOU/DANGER/DANGER.tbl', function(data) {
		var dataArr = data.split("\n");
		
		for(var i in dataArr){
			if(typeof dataArr[i] == "function") continue;
			dataArr[i] = dataArr[i].replace(/\/repositary\/xml\/typ\/raw\/DAOU/g, urlPrefix + 'repositary/xml/typ/raw/DAOU');
			if($.trim(dataArr[i]).length > 1){
				contentManager.dangerCnt++;
			}
		}
		
		if(contentManager.dangerCnt > 0){
			contentManager.loadDangers(typhoon, dataArr);
		}
		
	}).fail(function(e) {
		//오류처리
		if(console) console.log(e);
	});  
};

ContentManager.prototype.loadDangers = function(typhoon, dataArr){
	var contentManager = this;
	
	if(typeof dataArr === "undefined" || dataArr.length < 1){
		return;
	}
	
	for(var i in dataArr){
		contentManager.loadDanger(typhoon, dataArr[i]);
	}
};

ContentManager.prototype.loadDanger = function(typhoon, ini){
	
	var contentManager = this;
	var mapManager = contentManager.mapManager;
	
	$.get(ini, function(doc){
		var docArr = doc.split("\n");

		/**
		 * 2019-04-17
		 * 복수개 태풍 위험반경 키 매칭
		 */
		if(typhoon.dangerKey != docArr[0].trim()){
			return;
		}
		
		
		/**
		 * 2019-04-04
		 * 위험반경 스타일
		 * 2019-04-29
		 * 위험반경 20%, 40%, 60%, 80% 수정
		 * 2019-04-30
		 * 위험영역 33.3%, 66.6%, 100% 수정
		 * 2019-05-09
		 * 위험영역 30%, 50%, 70%, 100%(강풍반경) 수정
		 */
		var multiLineArray = {"danger30": [], "danger50": [], "danger70": [], "danger100": []};
		var infoArr = docArr[0].split(',');//201903090900,1,2
		
		if(infoArr.length != 3){
			return false;
		}
		   
		var arrayKey = "";
   
		for(var i = 1 ; i<docArr.length ; i++){
			var tempArr1 = docArr[i].split(",");//docArr[1] : 70 danger start
	  
			if(tempArr1.length<2){
				
				if(docArr[i].lastIndexOf("start")>-1){
					var resultArray = docArr[i].split(" ");//[70, danger, start]
					
					if(docArr[i].trim().indexOf("danger start")>-1){
						arrayKey = "danger" + resultArray[0];//danger30, danger50, danger70, danger100
					}
				}else if(docArr[i].lastIndexOf("end")>-1){
					arrayKey = "";  
				}
				continue;
			}else if(arrayKey.length > 0){
				
				var even =docArr.length%2;
				var point = [parseFloat(tempArr1[1]),parseFloat(tempArr1[0])];	//경도, 위도 
				multiLineArray[arrayKey].push(point);
			}
		}
		
		//30% 위험반경
		if(multiLineArray.danger30.length > 0){
			var polygon = new ol.geom.Polygon([multiLineArray.danger30]);
			polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
			var feature = new ol.Feature({
				geometry: polygon
			});
			   
			feature.setId(contentManager.createFeatureId()); 
			feature.setStyle(ContentManager.typhoonStyles.danger30);
			typhoon.danger30 = feature;
		}
		
		//50% 위험반경
		if(multiLineArray.danger50.length > 0){
			var polygon = new ol.geom.Polygon([multiLineArray.danger50]);  
			polygon.transform('EPSG:4326', 'EPSG:111111');
		    	
			var feature = new ol.Feature({
				geometry: polygon
			});
			   
			feature.setId(contentManager.createFeatureId()); 
			feature.setStyle(ContentManager.typhoonStyles.danger50);
			typhoon.danger50 = feature;
		}  
		
		//70% 위험반경
		if(multiLineArray.danger70.length > 0){
			var polygon = new ol.geom.Polygon([multiLineArray.danger70]);  
			polygon.transform('EPSG:4326', 'EPSG:111111');
	    	
			var feature = new ol.Feature({
				geometry: polygon
			});
	       
			feature.setId(contentManager.createFeatureId()); 
			feature.setStyle(ContentManager.typhoonStyles.danger70);
			typhoon.danger70 = feature;
		}
		
		//100% 위험반경(강풍반경)
		if(multiLineArray.danger100.length > 0){
			var polygon = new ol.geom.Polygon([multiLineArray.danger100]);  
			polygon.transform('EPSG:4326', 'EPSG:111111');
	    	
			var feature = new ol.Feature({
				geometry: polygon
			});
	       
			feature.setId(contentManager.createFeatureId()); 
			feature.setStyle(ContentManager.typhoonStyles.danger100);
			typhoon.danger100 = feature;
		}
		
	}).fail(function() {
		
	});     
};


/**
 * 2019-04-04 
 * 위험반경 표출
 */
ContentManager.prototype.AddDanger = function(){
	
	var onlySelected = this.onlySelected;
	var selectedKey = this.mapManager.getSelectedKey();
	var source = this.mapManager.layers.typhoon.getSource();

	
	for(var i in this.typhoons){
		var typhoon = this.typhoons[i];
		
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			
			if(typeof typhoon.forecast !=="undefined" && source.getFeatureById(typhoon.forecast.getId()) != null){
				source.removeFeature(typhoon.forecast);
			}
			if(typeof typhoon.area70 !=="undefined" && source.getFeatureById(typhoon.area70.getId()) != null){
				source.removeFeature(typhoon.area70);
			}
			if(typeof typhoon.area15 !=="undefined" &&  source.getFeatureById(typhoon.area15.getId()) != null){
				source.removeFeature(typhoon.area15);
			}
			if(typeof typhoon.area25 !=="undefined" &&  source.getFeatureById(typhoon.area25.getId()) != null){
				source.removeFeature(typhoon.area25);
			}
			if(typeof typhoon.real15_1 !=="undefined" &&  source.getFeatureById(typhoon.real15_1.getId()) != null){
				source.removeFeature(typhoon.real15_1);
			}
			if(typeof typhoon.real15_2 !=="undefined" &&  source.getFeatureById(typhoon.real15_2.getId()) != null){
				source.removeFeature(typhoon.real15_2);
			}
			if(typeof typhoon.real15_3 !=="undefined" &&  source.getFeatureById(typhoon.real15_3.getId()) != null){
				source.removeFeature(typhoon.real15_3);
			}
			if(typeof typhoon.real15_org !=="undefined" &&  source.getFeatureById(typhoon.real15_org.getId()) != null){
				source.removeFeature(typhoon.real15_org);
			}
			if(typeof typhoon.forecastSp !=="undefined" && source.getFeatureById(typhoon.forecastSp.getId()) == null){
				source.addFeature(typhoon.forecastSp);
			}
			
		}else{
			if(typeof typhoon.forecastSp !=="undefined" && source.getFeatureById(typhoon.forecastSp.getId()) != null){
				source.removeFeature(typhoon.forecastSp);
			}
		}
	}
	
	for(var i in this.depressions){
		var depression = this.depressions[i];
		
		if(onlySelected === false || selectedKey == depression.getKey()){
			
			if(typeof depression.forecast !== "undefined" && source.getFeatureById(depression.forecast.getId()) != null){
				source.removeFeature(depression.forecast);  
			}
			if(typeof depression.area70 !== "undefined" && source.getFeatureById(depression.area70.getId()) != null){
				source.removeFeature(depression.area70); 
			}
			if(typeof depression.area25 !== "undefined" && source.getFeatureById(depression.area25.getId()) != null){
				source.removeFeature(depression.area25);  
			} 
			if(typeof depression.area15 !== "undefined" && source.getFeatureById(depression.area15.getId()) != null){
				source.removeFeature(depression.area15);  
			}
			if(typeof depression.real15_1 !== "undefined" && source.getFeatureById(depression.real15_1.getId()) != null){
				source.removeFeature(depression.real15_1);  
			}
			if(typeof depression.real15_2 !== "undefined" && source.getFeatureById(depression.real15_2.getId()) != null){
				source.removeFeature(depression.real15_2);  
			}
			if(typeof depression.real15_3 !== "undefined" && source.getFeatureById(depression.real15_3.getId()) != null){
				source.removeFeature(depression.real15_3);  
			}
			if(typeof depression.real15_org !== "undefined" && source.getFeatureById(depression.real15_org.getId()) != null){
				source.removeFeature(depression.real15_org);  
			}
			if(typeof depression.forecastSp !=="undefined" && source.getFeatureById(depression.forecastSp.getId()) == null){
				source.addFeature(depression.forecastSp);
			}
			
		}else{
			if(typeof depression.forecastSp !== "undefined" && source.getFeatureById(depression.forecastSp.getId()) != null){
				source.removeFeature(depression.forecastSp);  
			}
		}
	}
	
	var source2 = this.mapManager.layers.danger.getSource();
	source2.clear();
	
        for(var i in this.typhoons){
		var typhoon = this.typhoons[i];
		
		if(onlySelected === false || selectedKey == typhoon.getKey()){
			
			/**
			 * 2019-04-04
			 * 위험반경 스타일
			 * 2019-04-29
			 * 위험반경 20%, 40%, 60%, 80% 수정
			 * 2019-04-30
			 * 위험영역 33.3%, 66.6%, 100% 수정
			 * 2019-05-09
			 * 위험영역 30%, 50%, 70%, 100%(강풍반경) 수정
			 */
			if(typeof typhoon.danger30 !=="undefined" && source2.getFeatureById(typhoon.danger30.getId()) == null){
				source2.addFeature(typhoon.danger30);  
			}
			if(typeof typhoon.danger50 !=="undefined" && source2.getFeatureById(typhoon.danger50.getId()) == null){
				source2.addFeature(typhoon.danger50);  
			}
			if(typeof typhoon.danger70 !=="undefined" && source2.getFeatureById(typhoon.danger70.getId()) == null){
				source2.addFeature(typhoon.danger70);  
			}
			if(typeof typhoon.danger100 !=="undefined" && source2.getFeatureById(typhoon.danger100.getId()) == null){
				source2.addFeature(typhoon.danger100);  
			}
			
		}
	}
	
	for(var i in this.depressions){
		var depression = this.depressions[i];

		if(onlySelected === false || selectedKey == depression.getKey()){
			
			/**
			 * 2019-04-04
			 * 위험반경 스타일
			 * 2019-04-29
			 * 위험반경 20%, 40%, 60%, 80% 수정
			 * 2019-04-30
			 * 위험영역 33.3%, 66.6%, 100% 수정
			 * 2019-05-09
			 * 위험영역 30%, 50%, 70%, 100%(강풍반경) 수정
			 */
			if(typeof depression.danger30 !=="undefined" && source2.getFeatureById(depression.danger30.getId()) == null){
				source2.addFeature(depression.danger30);  
			}
			if(typeof depression.danger50 !=="undefined" && source2.getFeatureById(depression.danger50.getId()) == null){
				source2.addFeature(depression.danger50);  
			}
			if(typeof depression.danger70 !=="undefined" && source2.getFeatureById(depression.danger70.getId()) == null){
				source2.addFeature(depression.danger70);  
			}
			if(typeof depression.danger100 !=="undefined" && source2.getFeatureById(depression.danger100.getId()) == null){
				source2.addFeature(depression.danger100);  
			}
			
		}
	}
	
};


/**
--------------------------------------------------
[2020.05.29] Modified by Geunhee Zhang
  - jjangadang@gmail.com
  - jjanga@gi-ens.co.kr
--------------------------------------------------
*/