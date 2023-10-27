/*
VeniceBells.com
@author: Madalyn Coryea
@modified: 12/11/2012
*/
function play(audiofile, id){
	document.getElementById(id).innerHTML=/*document.getElementById(id).innerHTML +*/
	"<embed src=\""+audiofile+"\" hidden=\"true\"  />"; //autostart=\"true\" loop=\"false\"
}