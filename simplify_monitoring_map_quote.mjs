import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const rows=[
["监测一张图","公司级视角","面向集团或公司管理人员，基于GIS地图展示所属厂矿、分公司及业务单位的地理分布和综合运行态势。支持查看各单位风险等级、作业数量、危险作业、摄像头总量及在线率、预警和报警数量等汇总信息；支持单位排名、地图点位交互以及从公司级地图下钻进入对应厂矿视角。"],
["监测一张图","厂矿视角","面向厂矿管理人员，基于厂矿GIS地图或电子档案展示作业区域边界、固定及移动摄像头、当前作业、危险作业、AI预警、违章和隐患点位。支持查看厂矿风险区域、作业情况、设备在线情况和当前报警信息；点击区域、摄像头、作业或报警点位，可查看详情或联动进入实时监控、作业计划、预警核查及违章隐患查处页面。"],
["监测一张图","作业区视角","面向具体作业区域的现场管理和监控，展示当前作业区的视频资源、摄像头在线状态、正在进行的常规作业和危险作业、AI风险预警、近期告警及现场作业人员。支持查看区域内设备、作业、人员和风险事件明细，并可联动视频预览、预警核查及违章隐患处置。"]
];

const wb=Workbook.create();
const sh=wb.worksheets.add("功能清单");
sh.showGridLines=false;
sh.mergeCells("A2:C2");
sh.getRange("A2").values=[["监测一张图报价功能清单"]];
sh.getRange("A2:C2").format={font:{name:"Arial",size:16,bold:true,color:"#1F2937"},verticalAlignment:"center"};
sh.mergeCells("A3:C3");
sh.getRange("A3").values=[["报价范围按三个业务视角划分，具体页面交互和字段以产品需求及最终确认范围为准。"]];
sh.getRange("A3:C3").format={font:{name:"Arial",size:10,italic:true,color:"#64748B"},wrapText:true};
sh.getRange("A5:C8").values=[["一级分类","二级分类","功能说明"]].concat(rows);
sh.getRange("A5:C5").format={fill:"#1F4E78",font:{name:"Arial",size:10,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center",borders:{preset:"all",style:"thin",color:"#D9E2F3"}};
sh.getRange("A6:C8").format={font:{name:"Arial",size:10,color:"#1F2937"},verticalAlignment:"top",wrapText:true,borders:{preset:"all",style:"thin",color:"#D9D9D9"}};
sh.getRange("A6:A8").format={fill:"#D9EAF7",font:{name:"Arial",size:10,bold:true,color:"#1F2937"},horizontalAlignment:"center",verticalAlignment:"center",wrapText:true,borders:{preset:"all",style:"thin",color:"#D9D9D9"}};
sh.getRange("B6:B8").format={fill:"#EEF5FA",font:{name:"Arial",size:10,bold:true,color:"#1F4E78"},horizontalAlignment:"center",verticalAlignment:"center",wrapText:true,borders:{preset:"all",style:"thin",color:"#D9D9D9"}};
sh.getRange("A:A").format.columnWidth=20;
sh.getRange("B:B").format.columnWidth=22;
sh.getRange("C:C").format.columnWidth=90;
sh.getRange("2:2").format.rowHeight=28;
sh.getRange("3:3").format.rowHeight=30;
sh.getRange("5:5").format.rowHeight=26;
sh.getRange("6:8").format.rowHeight=86;
sh.freezePanes.freezeRows(5);
sh.tabColor="#1F4E78";
wb.recalculate();
const outDir="outputs/监测一张图功能清单";
await fs.mkdir(outDir,{recursive:true});
const preview=await wb.render({sheetName:"功能清单",range:"A1:C9",scale:1.6,format:"png"});
await fs.writeFile(outDir+"/preview-精简版.png",new Uint8Array(await preview.arrayBuffer()));
console.log((await wb.inspect({kind:"table",range:"功能清单!A2:C8",include:"values,formulas",tableMaxRows:10,tableMaxCols:5})).ndjson);
const file=await SpreadsheetFile.exportXlsx(wb);
await file.save(outDir+"/监测一张图功能清单.xlsx");
