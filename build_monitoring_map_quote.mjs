import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";
const rows=[
["数据权限与视角","账号视角识别","根据登录账号层级自动进入集团视角或厂矿视角。集团账号展示集团及授权下属单位，厂矿账号展示本单位。"],
["数据权限与视角","组织数据权限","地图、统计、列表按当前单位及授权下级过滤；末级单位只展示本单位数据。"],
["数据权限与视角","单位切换","顶部选择器切换集团、厂矿或分公司，地图、统计卡片、图表和列表同步刷新。"],
["数据权限与视角","集团到厂矿下钻","点击集团地图单位点位进入厂矿视角，并携带单位参数加载区域、设备、作业和报警。"],
["数据权限与视角","厂矿返回集团","从集团下钻时显示返回按钮；以厂矿账号直接登录时不显示。"],
["顶部公共区域","日期时间","展示当前日期、星期和时间，时间按秒刷新。"],
["顶部公共区域","全屏展示","支持进入和退出全屏，适用于调度中心及监控大屏。"],
["集团视角","集团GIS地图","展示授权范围内厂矿、分公司及业务单位地理点位。"],
["集团视角","单位风险着色","点位颜色取单位最高风险等级：重大红、较大橙、一般黄、低风险蓝。"],
["集团视角","单位悬浮信息","展示单位名称、最高风险等级、摄像头数量、在线率、当前作业数和报警数。"],
["集团视角","风险区域统计","按重大、较大、一般、低风险统计区域数量和占比。"],
["集团视角","集团作业态势","统计当前作业总数，并按作业一级分类展示数量及占比。"],
["集团视角","危险作业统计","按高处、动火、爆破、吊装、受限空间、临时用电等类型统计数量及占比。"],
["集团视角","危险作业单位TOP5","按当前危险作业数量排序前5个单位，点击进入对应厂矿视角。"],
["集团视角","固定摄像头统计","统计固定摄像头总数、在线数、离线数和在线率。在线率=在线数÷总数×100%。"],
["集团视角","移动摄像头统计","统计移动摄像头总数、在线数、离线数和在线率。在线率=在线数÷总数×100%。"],
["集团视角","单位摄像头排行","按单位摄像头总量排序，同时展示在线数量和在线率。"],
["集团视角","单位报警排行","按当前周期去重报警数量排序，并展示数量及集团占比。"],
["集团视角","危险作业摄像头列表","展示正在执行危险作业且在线的摄像头编号、单位、区域、作业类型和在线状态。"],
["集团视角","列表分页轮播","危险作业摄像头列表支持分页和自动轮播，点击设备下钻并定位。"],
["厂矿视角","电子地图加载","加载当前单位GIS地图、电子档案或影像底图；无底图时不影响其他业务数据展示。"],
["厂矿视角","作业区域边界","绘制作业区域边界和名称，按风险等级着色；点击区域打开详情弹窗。"],
["厂矿视角","风险区域统计","统计厂矿内各风险等级区域数量及占比，更多跳转作业区域管理。"],
["厂矿视角","作业情况统计","按作业一级分类统计当前进行中作业数量及占比，更多跳转作业计划管理。"],
["厂矿视角","危险作业统计","按危险作业类型统计数量及占比，点击分类跳转并带入筛选条件。"],
["地图点位","固定摄像头点位","使用专用图标展示固定摄像头，在线高亮、离线置灰。"],
["地图点位","移动摄像头点位","展示移动摄像头实时或最后上报位置，并区分在线、离线。"],
["地图点位","视频预览","点击摄像头打开视频预览或跳转实时巡检，自动定位并选中设备。"],
["地图点位","报警摄像头状态","存在未结束报警时摄像头图标变红并弹出提示，闭环后恢复。"],
["地图点位","作业点位","展示当前进行中作业点位，常规作业蓝色、危险作业红色。"],
["地图点位","作业详情","点击作业点位展示名称、类型、负责人、时间和关联摄像头数量。"],
["地图点位","AI预警点位","展示AI违章或隐患预警点位及摄像头、时间、预警类型和位置。"],
["地图点位","人工违章隐患点位","人工标注事件使用独立点位，展示类型、等级、描述、时间和来源。"],
["地图点位","业务页面跳转","预警跳转AI预警核查，违章或隐患跳转相应查处页面并携带事件、单位和区域参数。"],
["地图点位","点位聚合","缩放层级较小时聚合相邻点位并显示数量，放大后展开具体点位。"],
["厂矿侧边统计","摄像头统计分析","分别统计固定、移动摄像头总数、在线数、离线数和在线率，更多跳转设备管理。"],
["厂矿侧边统计","当前报警信息","按时间倒序展示未闭环违章和隐患，包括时间、位置、类型、分类及内容。"],
["厂矿侧边统计","报警地图联动","点击报警列表，地图自动定位并高亮对应摄像头或事件点位。"],
["厂矿侧边统计","报警更多跳转","点击更多进入预警核查或查处列表，并带入当前单位和时间。"],
["厂矿侧边统计","危险作业摄像头","展示关联危险作业的在线摄像头，点击联动地图和视频预览。"],
["作业区域详情","区域基本信息","弹窗展示一级作业区域名称，关闭后保留单位、地图层级和位置。"],
["作业区域详情","区域视频资源","统计区域内固定和移动摄像头总数、在线数、离线数及在线率。"],
["作业区域详情","区域作业情况","统计区域内当前危险作业和常规作业数量。"],
["作业区域详情","区域AI风险预警","展示有效违章预警、隐患预警、违章人员数及较昨日变化。"],
["作业区域详情","区域告警列表","按时间倒序展示最近7条告警，包括时间、类型、内容和摄像头编号。"],
["作业区域详情","现场作业人员","展示姓名、工号、工种、作业类型、进入时间和作业状态。"],
["图例与状态","地图图例","说明摄像头、作业、预警、违章、隐患及风险等级的图标和颜色。"],
["图例与状态","状态规则","在线设备高亮、离线置灰；存在未结束预警时显示预警中，闭环后恢复。"],
["数据刷新","实时数据刷新","摄像头在线状态、AI预警和当前报警采用实时推送或准实时轮询。"],
["数据刷新","业务数据同步","作业计划、人员、风险区域和隐患整改状态随业务数据变化更新。"],
["数据刷新","刷新异常处理","接口失败时保留上次成功数据，并提示数据更新时间及失败原因。"],
["统计口径","作业数量口径","统计当前时间处于有效作业周期内的作业，按作业ID去重。"],
["统计口径","报警排重口径","重复识别、跨摄像头识别和多算法命中按统一事件ID排重。"],
["统计口径","有效违章隐患口径","违章以人工复核成立为准，隐患以核实审核通过为准；误报和撤销不计入。"],
["统计口径","分类占比","分类占比=分类数量÷同范围全部分类数量×100%；分母为0显示“--”。"],
["统计口径","较昨日变化","变化率=（今日数量-昨日同期数量）÷昨日同期数量×100%；昨日为0只展示数量差。"],
["通用能力","筛选状态保持","页面跳转、返回和弹窗关闭后保留单位、时间、地图层级和筛选条件。"],
["通用能力","权限控制","单位切换、点位、字段、跳转和导出受菜单、按钮、组织数据及字段权限控制。"],
["通用能力","操作审计","记录单位切换、地图下钻、视频查看、业务跳转、全屏和导出等关键日志。"],
["通用能力","空数据状态","无底图、区域、设备、作业或报警时展示对应空状态，不展示虚假数据。"],
["通用能力","大屏适配","支持常用桌面分辨率及大屏比例自适应，地图、卡片和列表不重叠、不截断。"]
];
const wb=Workbook.create();
const sh=wb.worksheets.add("功能清单"); sh.showGridLines=false;
sh.mergeCells("A2:D2"); sh.getRange("A2").values=[["监测一张图功能清单"]];
sh.getRange("A2:D2").format={font:{name:"Arial",size:16,bold:true,color:"#1F2937"},verticalAlignment:"center"};
sh.mergeCells("A3:D3"); sh.getRange("A3").values=[["适用场景：客户功能范围确认、项目报价及合同附件。可按一级分类汇总报价，也可按二级功能逐项核价。"]];
sh.getRange("A3:D3").format={font:{name:"Arial",size:10,italic:true,color:"#64748B"},wrapText:true};
const data=[["序号","一级分类","二级分类","功能说明"]].concat(rows.map((r,i)=>[i+1].concat(r)));
const end=5+rows.length; sh.getRange("A5:D"+end).values=data;
sh.getRange("A5:D5").format={fill:"#1F4E78",font:{name:"Arial",size:10,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center",borders:{preset:"all",style:"thin",color:"#D9E2F3"}};
sh.getRange("A6:D"+end).format={font:{name:"Arial",size:10,color:"#1F2937"},verticalAlignment:"top",wrapText:true,borders:{preset:"all",style:"thin",color:"#D9D9D9"}};
sh.getRange("A6:A"+end).format.horizontalAlignment="center";
for(let i=0;i<rows.length;i++) if(i%2===1) sh.getRange("A"+(6+i)+":D"+(6+i)).format.fill="#F6F9FC";
sh.getRange("A:A").format.columnWidth=7; sh.getRange("B:B").format.columnWidth=20; sh.getRange("C:C").format.columnWidth=25; sh.getRange("D:D").format.columnWidth=82;
sh.getRange("2:2").format.rowHeight=28; sh.getRange("3:3").format.rowHeight=34; sh.getRange("5:5").format.rowHeight=26; sh.getRange("6:"+end).format.rowHeight=42;
sh.freezePanes.freezeRows(5); sh.freezePanes.freezeColumns(1);
const tab=sh.tables.add("A5:D"+end,true,"MonitoringMapFunctions"); tab.style="TableStyleMedium2"; tab.showFilterButton=true; sh.tabColor="#1F4E78";
const sum=wb.worksheets.add("分类汇总"); sum.showGridLines=false;
sum.mergeCells("A2:C2"); sum.getRange("A2").values=[["监测一张图报价分类汇总"]];
sum.getRange("A2:C2").format={font:{name:"Arial",size:16,bold:true,color:"#1F2937"}};
const cats=[...new Set(rows.map(r=>r[0]))]; const send=5+cats.length;
sum.getRange("A5:C"+send).values=[["序号","一级分类","功能项数量"]].concat(cats.map((c,i)=>[i+1,c,null]));
sum.getRange("C6").formulas=[["=COUNTIF('功能清单'!$B$6:$B$200,B6)"]]; sum.getRange("C6:C"+send).fillDown();
sum.getRange("A5:C5").format={fill:"#1F4E78",font:{name:"Arial",size:10,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",borders:{preset:"all",style:"thin",color:"#D9E2F3"}};
sum.getRange("A6:C"+send).format={font:{name:"Arial",size:10,color:"#1F2937"},verticalAlignment:"center",borders:{preset:"all",style:"thin",color:"#D9D9D9"}};
sum.getRange("A:A").format.columnWidth=9; sum.getRange("B:B").format.columnWidth=28; sum.getRange("C:C").format.columnWidth=16; sum.freezePanes.freezeRows(5); sum.tabColor="#5B9BD5";
wb.recalculate();
const outDir="outputs/监测一张图功能清单"; await fs.mkdir(outDir,{recursive:true});
const preview=await wb.render({sheetName:"功能清单",range:"A1:D22",scale:1.5,format:"png"}); await fs.writeFile(outDir+"/preview.png",new Uint8Array(await preview.arrayBuffer()));
console.log((await wb.inspect({kind:"table",range:"功能清单!A2:D14",include:"values,formulas",tableMaxRows:20,tableMaxCols:6})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",options:{useRegex:true,maxResults:100},summary:"formula errors"})).ndjson);
const file=await SpreadsheetFile.exportXlsx(wb); await file.save(outDir+"/监测一张图功能清单.xlsx");
console.log(outDir+"/监测一张图功能清单.xlsx");
