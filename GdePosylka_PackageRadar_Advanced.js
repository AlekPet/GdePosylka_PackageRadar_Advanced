// ==UserScript==
// @name         GdePosylka_PackageRadar_Advanced
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Advanced Check my track number packageradar | Раширенные возможности для отслеживания трек-кода на сайт gdeposylka
// @author       AlekPet 2017 (alexepetrof@gmail.com)
// @match        https://gdeposylka.ru/tracks*
// @match       https://packageradar.com/tracks*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @require https://code.jquery.com/jquery-3.1.0.min.js
// ==/UserScript==

/*
 * GdePosylka_PackageRadar_Advanced v1.2 Copyright (c) 2017, AlekPet
 * Available via the MIT license.
 * For details see: https://github.com/AlekPet/GdePosylka_PackageRadar_Advanced
 */

// Вспомогательные функции
function hex(r,g,b){
var hexv="0123456789ABCDEF";
var valhex="";
var ff=[r,g,b];
for(var i=0;i<3;i++){
var del= ff[i] % 16;
var di=Math.floor(ff[i]/16);
if(ff[i]>=255){ 
valhex+="FF";
} else if(ff[i]<=0){
valhex+="00";
} else {
valhex+=hexv.charAt(di)+hexv.charAt(del);
}
}
return valhex;
}
    
function getColorRND(){
return (arguments.length ===0)?"#"+hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255))+", #"+ hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)):"#"+hex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));    
}

// Вспомогательные функции
var colors_style=getColorRND();
// Styles
GM_addStyle("\
            .track_service{border: 1px solid;    margin: 5px 5px;    padding: 2px; color: #e7dcdc;   text-shadow: 1px 1px 0px black;    cursor: pointer;    display: inline;}\
            .track_service:hover{color:yellow;} \
            .li_style:hover>ul {display: block;}\
            .li_style ul{-webkit-transition: all 0.3s ease-in;    -moz-transition: all 0.3s ease-in;    -o-transition: all 0.3s ease-in;}\
            .ul_menu{position:absolute;z-index:99999999999999;border:1px solid;width:250px;top:23px;display:none;padding: 0;background-color: #1d2125;}\
            .li_menu{list-style: none;    padding: 0 10px;    min-width: 200px;    float: none;    background-color: rgba(46,73,89,.5);    font-family: Roboto,Helvetica,Arial,sans-serif;}\
            .li_menu:hover{background-color: rgba(46,73,89,.5);}\
            .a_menu{text-decoration: none;    color: #77def7;    display: inline-block;    font-size: 16px;    line-height: 33px;    padding-left: 5px;    width: 100%;}\
            .a_menu:hover{text-decoration: none;color: #ffffff;}\
            .li_menu:hover {background: #01ffc2;}\
            .ul_menu li{-webkit-transition: all 0.3s ease-in;    -moz-transition: all 0.3s ease-in;    -o-transition: all 0.3s ease-in;}\
            \
            .ab_style:hover{background: linear-gradient("+colors_style+");color:white !important;} \
            .ab_style_complete{background: linear-gradient(white,#12ff45);} \
            .ab_styles:hover{background: linear-gradient("+colors_style+");color:white !important;} \
            .ab_styles:after{    content: \" Получил\";    color: white;    background: linear-gradient(#ff8100,#ffb714);    margin-left: 10px;    padding: 0 2px 0 2px;    font-size: 10px;}\
            .pop_options{border:1px solid;background: linear-gradient(silver,black);color:white;cursor:pointer;}\
            .pop_options:hover{color:yellow;}\
            .abs_div_cat{border: 1px solid;padding: 5px;margin-bottom:10px;}\
            .abs_punkti{text-align:center; color: white; user-select: none; padding: 3px;}\
            \
            .all_box_scroll{    max-height: 500px;overflow-y: auto;}\
            .all_box_scroll::-webkit-scrollbar {   width: 12px;margin-left:20px;	float: left;}\
            .all_box_scroll::-webkit-scrollbar-track {background-color: #eaeaea; border-left: 1px solid #ccc;}\
            .all_box_scroll::-webkit-scrollbar-thumb {background-color: #c7587c;background-clip: padding-box;}\
            .all_box_scroll::-webkit-scrollbar-thumb:hover {  background-color: #823b69;}\
            \
            .checkbox_div{position: relative;    left: 400px;    top: -45px;    }\
            .checkbox{  vertical-align: top;  margin: 0 3px 0 0;  width: 17px;  height: 17px;}\
            .checkbox + label {  cursor: pointer;}\
            .checkbox:not(checked) {  position: absolute; opacity: 0;}\
            .checkbox:not(checked) + label {  position: relative; padding: 0 0 0 60px; }\
            .checkbox:not(checked) + label:before {  content: '';  position: absolute;  top: -4px;  left: 0;  width: 50px;  height: 26px;  border-radius: 13px;  background: #CDD1DA;  box-shadow: inset 0 2px 3px rgba(0,0,0,.2);}\
            .checkbox:not(checked) + label:after {  content: '';  position: absolute;  top: -2px;  left: 2px;  width: 22px;  height: 22px;  border-radius: 10px;  background: #FFF;  box-shadow: 0 2px 5px rgba(0,0,0,.3);  transition: all .2s;}\
            .checkbox:checked + label:before {background: #9FD468;}\
            .checkbox:checked + label:after {left: 26px;}\
            .checkbox:focus + label:before { box-shadow: 0 0 0 3px rgba(255,255,0,.5);}\
           ");

// Styles

(function() {
//  GM_setValue('gp_set', null);  
var gp_value = GM_getValue('gp_set');
var gp_set = (gp_value)?JSON.parse(gp_value):{"markers":{},"setting":{}};

/* Описание элементов
0 - Ссылка отслеживания, 
1 - Название службы, 
2 - Значение по умолчанию, 
3 - Добавить кнопку отслеживания под трек-кодом, 
4 - Тип отслеживания у кнопок в шапке: 
      [0] Поддержка отслеживание нескольких кодов;
      [1] Одного кода и сайт;
      [2] Только перейти на сайт
*/
var elem = [
    ["http://www.17track.net/ru/track?nums=","17track","",true,0],
    ["https://global.cainiao.com/detail.htm?mailNoList=","Cainiao","",true,0],
    ["http://221.206.157.212/cgi-bin/GInfo.dll?EmmisTrack?w=xiangfeng56&cmodel=cmodel:estar56&cno=","ESTAR65","",true,0],
    ["http://www.edostavka.ru/track.html?order_id=","СДЭК","",true,1],
    ["https://track24.ru/?code=", "TRACK24","",true,1],
    ["http://post-tracker.ru/track/","POST-Track","",true,1],
    ["https://www.pochta.ru/tracking#","Почта России","",true,0],
    ["https://post2go.ru","Post2go","",false,2],
    ["http://postal.ninja/ru/tracks","Postal.ninja","",false,2],
    ["http://flytexpress.com/Tracking/NewTracking.aspx?trackNumber=","Flytexpress","",true,1],
    ["http://www.gsconto.com/ru/tracker/show/","Gsconto","",true,1]
    ]; 
    
var lang_str = {
   ru:{
       gosite:"Перейти на сайт",
       otsl_one:"Отследить один код",
       otsl_nesk:"Отследить несколько кодов",
       
       otsl_na:"Отследить на: ",
       
       tolko_ne_poluch:"Только не полученные: ",
       
       enter_code_dlya:"Введите код для ",
       
       polucheno:"Получено",
       poluchil:"Получил",
       ostalos:"Осталось",
       iz:"из",
       vse_codi:"Все коды:",
       ne_poluch:"Не получено",
       vsego_posil:"Всего посылок",
       
       box_poluch_posilki: "Полученные посылки",
       box_pribuli_na_pochtu:"Прибыли на почту",       
       box_otsleshivautsa:"Отслеживаются",
       box_ne_otsleshivautsa:"Не отслеживаются",  
       
       generirovat_code:"Генерировать код",
       chem_razdelit_code:"Чем разделить коды?",
       kod_gotov:"Код готов!",
      // Проверка статуса       
       check_posil_dost: "Посылка доставлена",
       check_prib_v_pubkt: "Прибыла в пункт назначения",
       check_ustan_srok_hran: "Хранение - Установленный срок хранения",
       check_info_poka_net: "Информации о посылке пока нет",
   },
   en:{
      gosite:"Go to Site",
      otsl_one:"Track one code",
      otsl_nesk:"Track multiple codes",
       
      otsl_na:"Track on: ",
       
      tolko_ne_poluch:"Just do not received: ",
       
      enter_code_dlya: "Enter the code for ",
      
      polucheno: "Received",
      poluchil: "Got",
      ostalos: "Remaining",
      iz: "from",
      vse_codi: "All codes:",
      ne_poluch: "Not received",
      vsego_posil: "Total Package",

      box_poluch_posilki: "Received",
      box_pribuli_na_pochtu:"Arrived in the mail", 
      box_otsleshivautsa:"Tracked",
      box_ne_otsleshivautsa:"Not tracked",     
       
      generirovat_code:"Generate code",      
      chem_razdelit_code:"To share the codes?",
      kod_gotov:"Code complete!",
      // Check status ! not edit !
      check_posil_dost: "Package delivered",
      check_prib_v_pubkt: "Arrived at the office of destination",
      check_ustan_srok_hran: "Storage - Fixed storage time",
      check_info_poka_net: "No information about the package yet"
   }
};

var sel_lang = lang_str.ru;    
if(window.location.hostname.search("gdeposylka.ru")<0){
sel_lang = lang_str.en;    
} else {
sel_lang = lang_str.ru;        
}
    
function saveStorage(){
try{ 
var save_data = JSON.stringify(gp_set);
GM_setValue('gp_set', save_data);  
console.log("Save: "+GM_getValue('gp_set'));
} catch(e){
alert(e);   
}
}

function Objcount(obj){
var keys=0;
for (var propvalue in obj) {
    if (obj.hasOwnProperty(propvalue)) {
        keys++;
    }
  }
  return keys;
} 

function searchinObj(obj, reqex){
var keys=[];
for (var propvalue in obj) {
    if (obj.hasOwnProperty(propvalue) && reqex.test(propvalue)) {
        keys.push(propvalue);  
    }
  }
  return keys;
} 
    
// Проверить только не полученные
function only_ne_poluch_button(){
var cur_el=arguments[0].target;
    if(!gp_set.setting){
    gp_set.setting={};    
    }
    gp_set.setting.tolko_ne_poluch = !cur_el.parentElement.children[1].checked;
    saveStorage();
}

// start abs menu function       
function make_abs(){ 
    var abs_div=document.getElementById("abs_div");
    if(abs_div){
        abs_div.innerHTML="";
    }else{
        abs_div=document.createElement("div");
        abs_div.id="abs_div";  
        }
    
    var all_box_scroll = document.createElement("div");
        all_box_scroll.className="all_box_scroll";
    
    var abs_div_normal=document.createElement("div");
        abs_div_normal.id="normal_abs_div";    

    var abs_div_prishla=document.createElement("div");
        abs_div_prishla.id="prishla_abs_div";
    
    var abs_div_poluch=document.createElement("div");
        abs_div_poluch.id="poluch_abs_div"; 
    
    var abs_div_nenormal=document.createElement("div");
        abs_div_nenormal.id="nenormal_abs_div";    
  
    
    abs_div_normal.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#0790c5,#1be0ff);\">"+sel_lang.box_otsleshivautsa+" </div>";
    abs_div_nenormal.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#ff07d5,#921313);\">"+sel_lang.box_ne_otsleshivautsa+" </div>";
    abs_div_prishla.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#0037ff,#1099af);\">"+sel_lang.box_pribuli_na_pochtu+" </div>";   
    abs_div_poluch.innerHTML="<div class=\"abs_punkti\" style=\"background: linear-gradient(#ff6f08,orange);\">"+sel_lang.box_poluch_posilki+" </div>";       
    
    var gen_div=document.createElement("div");
    var size_ob = (window.screen.height/2)-300;//(window.screen.height/2)-(17*rn_el.length-1);
    
    abs_div.setAttribute("style","position:fixed;top:"+size_ob+"px;left:30px;border:1px solid;border-style: dashed;padding: 5px;overflow:auto;background-color: white;");
    abs_div_normal.className = "abs_div_cat";
    abs_div_prishla.className = "abs_div_cat";
    abs_div_poluch.className = "abs_div_cat";   
    abs_div_nenormal.className = "abs_div_cat";
    gen_div.setAttribute("style","text-align:center;cursor:pointer;background:blue;color:white;margin-top:10px;padding:3px;");
    gen_div.innerText=sel_lang.generirovat_code;  
    
    gen_div.addEventListener("click", function(){
    var t = prompt(sel_lang.kod_gotov,",");
        var check_ok=((checkbox_input.checked)?d[4]:d[0]);
        if(t)prompt(sel_lang.kod_gotov,check_ok.replace(/,/g,t));
    });
 
    var text_abs = ["","","",""];
    var otsl = [0,0,0,0];
    for(g=0;g<d[0].split(",").length;g++){
        
        var other_mag ="";
        if(/^A\d+$/i.test(codes_names[0][g]) || /\[BG\]/i.test(codes_names[1][g])){
        other_mag = "style=\"background: linear-gradient(#22a79a, #00ffdc)\"";       
        } else {
        other_mag ="";    
        }
        
       var code_vis_tag = ["<div pos=\""+g+"\" name=\"my_opt\" class=\"ab_style\""+other_mag+"\" title=\""+codes_names[1][g]+"\" onmouseover=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']='linear-gradient(",")';document.body.scrollTop=document.getElementsByClassName('track')[c].offsetTop-300\" onmouseout=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']=''\">"+codes_names[0][g]+"</div>"]; 
       var vis_menu = {
           dost                : code_vis_tag[0]+"white,orange"+code_vis_tag[1],
           priv_v_puntk_i_xran : code_vis_tag[0]+"white,#1099af"+code_vis_tag[1],
           no_info             : code_vis_tag[0]+"white,#ff07d5"+code_vis_tag[1],
           otsleshiv           : code_vis_tag[0]+"white,cyan"+code_vis_tag[1]
       };
        
       if(codes_names[2][g].search(sel_lang.check_posil_dost)===0 ||gp_set.markers[codes_names[0][g]] === true){
      text_abs[0] += vis_menu.dost;
            otsl[0]+=1;             
        }  else if(codes_names[2][g].search(sel_lang.check_prib_v_pubkt)===0 || codes_names[2][g].search("Хранение - Установленный срок хранения")===0){
      text_abs[1] += vis_menu.priv_v_puntk_i_xran;
            otsl[1]+=1; 
            d[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
        } else if(codes_names[2][g].search(sel_lang.check_info_poka_net)===0){
      text_abs[3] += vis_menu.no_info;
            otsl[3]+=1;
            d[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            } else {
      text_abs[2] += vis_menu.otsleshiv;
            otsl[2]+=1;
            d[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            }
    }
    abs_div.innerHTML="<div style=\"text-align:center;background: linear-gradient(#6D3263,#DF6283);color: white;font-weight: bold;\">"+sel_lang.vse_codi+"</div>";
    abs_div_poluch.innerHTML+= text_abs[0];     
    abs_div_prishla.innerHTML+= text_abs[1];     
    abs_div_normal.innerHTML+= text_abs[2];
    abs_div_nenormal.innerHTML+= text_abs[3];

    abs_div.appendChild(all_box_scroll);
    
    all_box_scroll.appendChild(abs_div_poluch);    
    all_box_scroll.appendChild(abs_div_prishla);    
    all_box_scroll.appendChild(abs_div_normal);
    all_box_scroll.appendChild(abs_div_nenormal);
    
    abs_div.appendChild(gen_div);
    document.body.appendChild(abs_div);

    abs_div_poluch.firstChild.innerHTML+= "("+otsl[0]+"):";    
    abs_div_prishla.firstChild.innerHTML+= "("+otsl[1]+"):";
    abs_div_normal.firstChild.innerHTML+="("+otsl[2]+"):";    
    abs_div_nenormal.firstChild.innerHTML+= "("+otsl[3]+"):";  
    
// Markers    
    var c_ab = document.getElementsByName("my_opt");
    var count_pol=0;
    for(z=0;z<c_ab.length;z++){ 
    // Event    
    c_ab[z].addEventListener("click", clickabs);   
        
   // Marker load 
       var tek_z = z;
            for(var k in gp_set.markers){
                if (gp_set.markers.hasOwnProperty(k)){
                    if(c_ab[tek_z].innerText === k){
                        if(gp_set.markers[k]) {
                            gp_set.markers[k] = true;
                            c_ab[z].setAttribute("class", "ab_styles");
                            count_pol++;
                        } else {
                            gp_set.markers[k] = false;
                            c_ab[z].setAttribute("class", "ab_style");
                        }
                    }
                 // Main pole visible
                if(codes_names[0][tek_z] === k && gp_set.markers[codes_names[0][tek_z]]){
                rn_el[tek_z].children[0].className+=" ab_style_complete";
                } else if(!gp_set.markers[codes_names[0][tek_z]]){
                rn_el[tek_z].children[0].className=rn_el[tek_z].children[0].className.replace(/\s+ab_style_complete/i,"");    
                }
                //
                }
           }   
// Marker load end  
    }
       abs_div.children[0].innerHTML+="<p style=\"margin: 0;font-size: 10px;font-weight: bold;\"><span style=\"color:lime;\" title=\""+sel_lang.polucheno+"!\">"+sel_lang.polucheno+": "+count_pol+"</span><span style=\"color:orange;\" title=\""+sel_lang.vsego_posil+"\"> "+sel_lang.iz+" "+d[0].split(",").length+"</span></p><p style=\"font-size: 10px;margin: 0;font-weight: bold;\"><span style=\"color:cyan;\" title=\""+sel_lang.ne_poluch+"!\"> "+sel_lang.ostalos+": "+(d[0].split(",").length-count_pol)+"</span></p>";        
// Markers end 
}
// end abs menu function    
    
function clickabs(){
  var el = arguments[0].target;
  var el_name = el.getAttribute("pos")*1;
  var el_value = codes_names[0][el_name];  
        if(gp_set.markers[el_value]){
        //gp_set.markers[el_value] = false;
        gp_set.markers[el_value]=false;
        el.setAttribute("class", "ab_style");
        // snimaem marker    
        } else {
        // stavim marker
        gp_set.markers[el_value]=true;
        el.setAttribute("class", "ab_styles");
        }
        saveStorage();
        make_abs();
}

// Pop up menu  
var options = [sel_lang.otsl_one,sel_lang.otsl_nesk,sel_lang.gosite];
    
function pop_menu_click(){
var tek_el=this.parentElement.parentElement.parentElement.getAttribute("elem")*1;
    
       if(this.innerText.search(options[2]) === 0) {
       var site = elem[tek_el][0];
           site = site.match(/^https?:\/\/[a-zA-z0-9.-]+/i)[0];
           console.log(site);    
       window.open(site); 
       } else if(this.innerText.search(options[0]) === 0){
       var req=prompt(sel_lang.enter_code_dlya+elem[tek_el][1]+":",""); 
       if(req.length>0 && !/^\s+$/.test(req)){ 
          window.open(elem[tek_el][0]+req);
       } else {
           alert("Поле пустое!");
           return;               
       }
       } else if(this.innerText.search(options[1]) === 0){
       var past_codes_all_ili_net = ((checkbox_input.checked)?d[4]:d[0]);
       window.open(elem[tek_el][0]+past_codes_all_ili_net);    
       }
}    
function pop_v2(my_i){
    var my_el = elem[my_i];
    
    var ul = document.createElement("ul");
        ul.className="ul_menu";
    for(var i=0;i<options.length;i++){
    if(my_el[4] === 2){ 
        if(i<2) continue;
    } else if(my_el[4] === 1){
        if(i===1) continue;    
    }
    var li = document.createElement("li"); 
        li.className="li_menu";
        
    var a = document.createElement("a"); 
        a.className="a_menu";
        a.href="#";
        a.innerText=options[i];        
        a.addEventListener("click", pop_menu_click);

        li.appendChild(a);  
        ul.appendChild(li);
    }
    return ul;
} 
// Pop up menu  end    
    
// -------------------------------- Init -----------------------------
var checkbox_div = document.createElement("div");     
var checkbox_input = document.createElement("input"); 
var checkbox_label = document.createElement("label");
    
    checkbox_div.className="checkbox_div";
    checkbox_div.innerHTML="<span style=\"position: relative;top: 10px;    padding-right: 10px;\">"+ sel_lang.tolko_ne_poluch +"</span>";
    
    checkbox_input.type="checkbox";
    checkbox_input.className="checkbox";
    checkbox_input.id="checkbox";
    checkbox_input.checked = gp_set.setting.tolko_ne_poluch;
    
    checkbox_label.setAttribute("for","checkbox");
    
    checkbox_label.addEventListener("click", only_ne_poluch_button);
    
    checkbox_div.appendChild(checkbox_input);
    checkbox_div.appendChild(checkbox_label);   
    //document.getElementsByClassName("container")[1].lastChild.appendChild(checkbox_div);
    document.getElementsByClassName("container")[2].parentNode.insertBefore(checkbox_div, document.getElementsByClassName("container")[2]);
   
    
// Start - Проверка трека напротив каждого трека     
var liel= document.getElementsByClassName("nav navbar-nav navbar-left")[0] || null;
if(liel) {
var d=["","","","",""];

var rn_el=document.getElementsByClassName("track-container");
var title_wrapper =  document.getElementsByClassName("title-wrapper");
var tek_pol=document.getElementsByClassName("checkpoint-status");

for(var i=0;i< rn_el.length;i++){

    var el_a=rn_el[i].getElementsByTagName("a")[0].innerText;
    var el_div=(rn_el.className !="tracking-number")?rn_el[i].getElementsByTagName("a")[1].innerText:rn_el[i].getElementsByTagName("div")[0].innerText;
    d[0]+=el_a+((i<rn_el.length-1)?",":"");
    d[1]+=(title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":"");
    d[2]+= el_a+" - "+(title_wrapper[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?",":"");
    d[3]+=(tek_pol[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?"|":"");
    title_wrapper[i].setAttribute("title", (title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":""));
   //
    var li_body = document.createElement("div");
    var li_body1 = document.createElement("div");    
    li_body.setAttribute("style", "margin-bottom: 25px;background: #f9f9f9;");
    li_body1.setAttribute("style", "position:absolute;");    
    document.getElementsByClassName("track-list")[0].insertBefore(li_body,rn_el[i].nextSibling);
    document.getElementsByClassName("track-list")[0].insertBefore(li_body1,rn_el[i].nextSibling);
    
    for(var j=0;j<elem.length;j++){
    if(elem[j][3]){
var li = document.createElement("div");
    li.innerHTML='<span onclick="window.open(&quot;'+elem[j][0]+el_a+'&quot;);">'+elem[j][1]+'</span>';
    rcol = getColorRND();
    li.setAttribute("style","background: linear-gradient("+rcol+");");
    li.className="track_service";
    li.title=sel_lang.otsl_na+elem[j][1];
    li_body1.appendChild(li);
    }
    }
}
// End - Проверка трека напротив каждого трека 
    
// Start - absolute window left    
var codes_names = [d[0].split(","),d[1].split("|"),d[3].split("|")];       
    make_abs();
//End - absolute window left
 

// Start - Верхняя панель со службами отслеживания    
    for( i=0;i<elem.length;i++){

var li = document.createElement("li");
    li.innerHTML=((elem[i][1].search("17track")<0)?"<div>"+elem[i][1]+"</div>":'<img src="http://www.17track.net/res/global/img/logo/png/logo_full_en_dark.png?v=635809337379969252" style="width: 80px; background: linear-gradient('+getColorRND()+');">');        
//
var pop_div_menu = pop_v2(i);
    li.appendChild(pop_div_menu);
       
//        
    rcol = getColorRND();
    li.setAttribute("style",((elem[i][1].search("17track")<0))?"border: 1px solid;    margin: 5px 5px;    padding: 2px;    background: linear-gradient("+rcol+");    color: #e7dcdc;   text-shadow: 1px 1px 0px black;    cursor: pointer;":"margin: 5px 5px;    padding: 2px;cursor: pointer;");
    li.className="li_style";
    li.title=sel_lang.otsl_na+elem[i][1];
    li.setAttribute("elem",i);        
    liel.appendChild(li);
}
}
// Start - Верхняя панель со службами отслеживания
})();
