// ==UserScript==
// @name         GdePosylka_PackageRadar_Advanced
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Advanced Check my track number packageradar | Раширенные возможности для отслеживания трек-кода на сайт gdeposylka
// @author       AlekPet 2017 (alexepetrof@gmail.com)
// @license     MIT;
// @match        http*://gdeposylka.ru/tracks*
// @match       http*://packageradar.com/tracks*
// @updateURL    https://github.com/AlekPet/GdePosylka_PackageRadar_Advanced/raw/master/GdePosylka_PackageRadar_Advanced.user.js
// @downloadURL  https://github.com/AlekPet/GdePosylka_PackageRadar_Advanced/raw/master/GdePosylka_PackageRadar_Advanced.user.js
// @icon          https://raw.githubusercontent.com/AlekPet/GdePosylka_PackageRadar_Advanced/master/assets/images/icon.png
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_addValueChangeListener
// @require https://code.jquery.com/jquery-3.1.0.min.js
// ==/UserScript==

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
             li.li_style {float: left;}\
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
            .ab_styles:after{    content: \" Получил\";    color: white;    background: linear-gradient(#ff8100,#ffb714);    margin-left: 10px;    padding: 0 2px 0 2px;    font-size: 10px; line-height: 1.5;}\
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
            \
            .i_setting {position: relative;    top: 15px;    cursor: pointer;font: normal normal normal 35px FontAwesome;  display: inline-block;  }\
            .i_setting-set:before{content:\"\\f013\";    color: #ff8f00;}\
            .i_setting:hover{animation:my 2s infinite;}\
            .i_setting_div{position: fixed;    border: 1px solid silver;    width: 420px; top: 20%;    left: 50%;    margin-left: -200px; display: none;background: linear-gradient(#ffffff,silver);z-index:9999999;box-shadow: 5px 5px 5px rgba(192, 192, 192, 0.26);}\
            .i_setting_div input, select {    background: linear-gradient(#eeffee,#9bfffa);    font: 8pt monospace;    width: 100%;text-align: right;     border-radius: 4px;}\
            .i_setting_el_zoom{    position: absolute;    width: 300px !important;    left: 50px;    font-size: 16px !important;    border: 4px solid yellow; padding: 10px;}\
            .i_setting_div_caption{background: linear-gradient(silver,#efebeb);    width: 100%;    height: 30px;    text-align: center;padding:5px;}\
            .i_setting_div_caption span{user-select: none;    cursor: default;    color: grey;    font: bold 12pt/10pt monospace;}\
            .i_setting_div_body{overflow-y: scroll;  width: 100%;    max-height: 400px; clear: both; }\
            \
            .PoleElTable{display:table;}\
            .PoleElTableCapt {font-weight: bold;text-align: center;}\
            .PoleElTableCapt > div {background: linear-gradient(#107bf9,#57d5fb);color: white;vertical-align: middle;font: 10pt monospace;    font-weight: bold;}\
            .PoleElTable > div:not([class='PoleElTableLoad']) {display:table-row;}\
            .PoleElTable > div > div{display:table-cell; padding: 2px;}\
            \
            .i_setting_div_foot{width: 100%;    height: 50px;    background: linear-gradient(silver,white);    padding: 10px;text-align: center;}\
            .i_setting_div_button{user-select: none;width: 105px;    height: 25px;    margin: 0 auto;    text-align: center;    border: 1px solid white;    color: white; line-height: 20px;    cursor: pointer;transition:1s all;display: inline-block;    margin: 0 2px;}\
            .i_setting_div_save_button, .i_setting_div_add_button{background: linear-gradient(#8d8d92,#888a8a);}\
            .i_setting_div_del_button{display:none;background: -webkit-linear-gradient(top,#e02b34 0,#94044d 100%) ; opacity: 0;}\
            .i_setting_div_del_button:hover{-webkit-linear-gradient(top,#b9030c 0,#ff51a9 100%); font-size: 10pt;}\
            .i_setting_div_save_button:hover, .i_setting_div_add_button:hover{background: linear-gradient(#8d8d92,#c3c7c7); font-size: 10pt;}\
            \
            .i_input_focus_close{position: absolute; display:none; cursor:pointer; transition: 1s all; border: 2px solid white;    padding: 3px;    width: 20px;    height: 20px;    text-align: center;    background: linear-gradient(silver,red);    color: white;    border-radius: 8px;    font: 10px bold monospace;}\
            .i_input_focus_close:hover{background: linear-gradient(#fd9b9b,orange); transform: rotateZ(359deg);}\
            @keyframes my{from{transform:rotate(0deg)}to{transform:rotate(359deg)}}\
            .i_smoke_div_fog{position: fixed;    display: none;    top: 0;    left: 0;    width: 100%;    height: 100%;    background: rgba(0,0,0,0.8);  z-index: 9999999;}\
            #i_pop_menu p{text-align: left;    margin-left: 40px;}\
            .error_icon_input:after{content:\"\\f057\";    color: orange;}\
            .error_span_input{font-family:FontAwesome;font-size: 1.9em;    vertical-align: middle; padding: 3px;display: none;}\
");
// Styles

(function() {
//  GM_setValue('gp_set', null);  
var gp_value = GM_getValue('gp_set');
var gp_set = (gp_value)?JSON.parse(gp_value):{};

function saveStorage(){
try{ 
var save_data = JSON.stringify(gp_set);
GM_setValue('gp_set', save_data);  
if(false)GM_setValue('gp_set_bak', save_data);     
console.log("Save: "+GM_getValue('gp_set'));
} catch(e){
alert(e);   
}
}       
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
    ["17track","http://www.17track.net/ru/track?nums=",1,0],
    ["Cainiao","https://global.cainiao.com/detail.htm?mailNoList=",1,0],
    ["ESTAR65","http://221.206.157.212/cgi-bin/GInfo.dll?EmmisTrack?w=xiangfeng56&cmodel=cmodel:estar56&cno=",1,0],
    ["СДЭК","http://www.edostavka.ru/track.html?order_id=",1,1],
    ["TRACK24","https://track24.ru/?code=", 1,1],
    ["POST-Track","http://post-tracker.ru/track/",1,1],
    ["Почта России","https://www.pochta.ru/tracking#",1,0],
    ["Post2go","https://post2go.ru",0,2],
    ["Postal.ninja","http://postal.ninja/ru/tracks",0,2],
    ["Flytexpress","http://flytexpress.com/Tracking/NewTracking.aspx?trackNumber=",1,1],
    ["Gsconto","http://www.gsconto.com/ru/tracker/show/",1,1],
    ["DHL Global Mail","https://webtrack.dhlglobalmail.com/?trackingnumber=",1,0]    
    ]; 

function resetDefaultServices(){
    gp_set.services = []; 

    for(var slu in elem){
    gp_set.services.push(elem[slu]);    
    }
    saveStorage();  
    upperPanel("clear");
    updateDataNaprotivKashdogo(); 
    update_setting_val("clear");  
    alert("Службы восстановленны!");
}
    
    
if(gp_set.services === undefined || !gp_set.services){
    gp_set.services = []; 

    for(var slu in elem){
    gp_set.services.push(elem[slu]);    
    }
    //elem = gp_set.services = ;
    saveStorage();
    }    
  
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
       gen_no_code: "Нет треков для генерации для данной категории!",
       chem_razdelit_code:"Чем разделить коды?",
       kod_gotov:"Код готов!",
      // Проверка статуса       
       check_posil_dost: "Посылка доставлена",
       check_prib_v_pubkt: "Прибыла в пункт назначения",
       check_ustan_srok_hran: "Хранение - Установленный срок хранения",
       check_info_poka_net: "Информации о посылке пока нет",
       // Правка и добавление служб
       setting: "Настройки",
       serv_name: "Название",
       serv_link: "Ссылка",
       otobr_niz: "Отобр. снизу",
       raz_perex: "Переходы",
       serv_del: "Удалить",
       add_serv: "Создать",
       save_serv: "Сохранить",
       reser_serv: "Сброс",
       q_reset_serv: "Восстановить службы по умолчанию?",
       type_per: ["Все","Один код и сайт","Только сайт"],
       // add serv
       menu_add: "Меню добавления службы",
       button_add: "Добавить службу",
       q_del: "Вы хотите удалить эту(и) службу(ы)?",
       danie_edit : "Данные служб отредактированны!",
       q_save: "Сохранить изменения?",
       error_serv_name: "Ошибка в названии службы!\nНазвание службы отслеживания, не задано, в строке №",
       error_serv_link: "Ошибка ссылки!\nСсылка службы отслеживания, задана неверно, в строке №",
       return_prev_val: "Вернуть прежнее значение?",
       error_update_danix: "Ошибка обновления данных...",
       services_del_comp: "Служба(ы) успешно удалена(ы)!",
       error_create_buttons: "Ошибка создания кнопок напротив каждого трека!",
       service_add_comp: "Служба для отслеживания, была успешно добавлена!",
       textfield_empty_name: "Введенное название пустое!",
       textfield_empty_link: "Введенная ссылка пуста!",
       textfield_invalid_link: "Ссылка введена неккоректно!",
       text_Error: "Ошибка!",
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
      gen_no_code: "No tracks to generate for this category!",
      chem_razdelit_code:"To share the codes?",
      kod_gotov:"Code complete!",
      // Check status ! not edit !
      check_posil_dost: "Package delivered",
      check_prib_v_pubkt: "Arrived at the office of destination",
      check_ustan_srok_hran: "Storage - Fixed storage time",
      check_info_poka_net: "No information about the package yet",
       // Add service
      setting: "Settings",
      serv_name: "Name",
      serv_link: "Link",
      otobr_niz: "Services bottom track",
      raz_perex: "Transitions",
      serv_del: "Delete",
      add_serv: "New",
      save_serv: "Save",
      reser_serv: "Reset",
      q_reset_serv: "Do you want to restore the default services?",       
      type_per: ["All","One code and website","Site"],
      // add serv
      menu_add: "Menu add service",
      button_add: "Add service",
      q_del: "You want to remove this(and) service(s)?",
      danie_edit : "Service data is modified!",
      q_save: "Save changes?",
      error_serv_name: "Error in service name!\nazvanie tracking service, is not set in line#",
      error_serv_link: "reference Error!\psylla tracking service, is incorrect, in line#",
      return_prev_val: "restore the previous value?",
      error_update_danix: "Error updating data...",
      services_del_comp: "Service(s) Delete(s)!",
      error_create_buttons: "Error creating buttons opposite each track!",
      service_add_comp: "The tracking service has been successfully added!",
      textfield_empty_name: "The entered name is empty!",
      textfield_empty_link: "The entered link is empty!",
      textfield_invalid_link: "The link is entered incorrectly!",
      text_Error: "Error!",

   }
};

var sel_lang = lang_str.ru;    
if(window.location.hostname.search("gdeposylka.ru")<0){
sel_lang = lang_str.en;    
} else {
sel_lang = lang_str.ru;        
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
    if(!gp_set.setting || gp_set.setting === undefined){
    gp_set.setting={};    
    }
    gp_set.setting.tolko_ne_poluch = !cur_el.parentElement.children[1].checked;
    saveStorage();
}

// start abs menu function       
function make_abs(){
    codes_names = [dannie_o_trekax[0].split(","),dannie_o_trekax[1].split("|"),dannie_o_trekax[3].split("|")];

    if(gp_set.markers === undefined || gp_set.markers === null){
     gp_set.markers = {};   
    }
    
    var abs_div=document.getElementById("abs_div");
    if(abs_div){
        abs_div.innerHTML="";
    }else{
        abs_div=document.createElement("div");
        abs_div.id="abs_div";  
        }
    var rn_el=document.getElementsByClassName("track-container");    
    
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
    
    var checkbox_input = document.getElementById("checkbox");
  
    
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
        if((checkbox_input.checked && dannie_o_trekax[4].length<=0) || (!checkbox_input.checked && dannie_o_trekax[0].length<=0)){
            alert(sel_lang.gen_no_code+"\n"+sel_lang.tolko_ne_poluch+checkbox_input.checked);
            return;
        }
    var t = prompt(sel_lang.kod_gotov,",");
        var check_ok=((checkbox_input.checked)?dannie_o_trekax[4]:dannie_o_trekax[0]);
        if(t)prompt(sel_lang.kod_gotov,check_ok.replace(/,/g,t));

    });
 
    var text_abs = ["","","",""];
    var otsl = [0,0,0,0];
    for(var g=0;g<dannie_o_trekax[0].split(",").length;g++){
        
        var other_mag ="";
        if(/^A.*$/i.test(codes_names[0][g]) || /\[BG\]/i.test(codes_names[1][g])){
        other_mag = "style=\"background: linear-gradient(#22a79a, #00ffdc)\"";       
        } else {
        other_mag ="";    
        }
        
       var code_vis_tag = ["<div pos=\""+g+"\" name=\"my_opt\" class=\"ab_style\""+other_mag+"\" title=\""+codes_names[1][g]+
                           "\" onmouseover=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']='linear-gradient(",")';document.body.scrollTop=document.getElementsByClassName('track')[c].offsetTop-300\" onmouseout=\"var c=this.getAttribute('pos');document.getElementsByClassName('track')[c].style['background']=''\">"+codes_names[0][g]+"</div>"]; 
       var vis_menu = {
           dost                : code_vis_tag[0]+"white,orange"+code_vis_tag[1],
           priv_v_puntk_i_xran : code_vis_tag[0]+"white,#1099af"+code_vis_tag[1],
           no_info             : code_vis_tag[0]+"white,#ff07d5"+code_vis_tag[1],
           otsleshiv           : code_vis_tag[0]+"white,cyan"+code_vis_tag[1]
       };
        
       if(codes_names[2][g].search(sel_lang.check_posil_dost)===0 ||gp_set.markers[codes_names[0][g]] === true){
      text_abs[0] += vis_menu.dost;
            otsl[0]+=rn_el.length>0 ? 1 : 0;
        }  else if(codes_names[2][g].search(sel_lang.check_prib_v_pubkt)===0 || codes_names[2][g].search("Хранение - Установленный срок хранения")===0){
      text_abs[1] += vis_menu.priv_v_puntk_i_xran;
            otsl[1]+=rn_el.length>0 ? 1 : 0;
            dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
        } else if(codes_names[2][g].search(sel_lang.check_info_poka_net)===0){
      text_abs[3] += vis_menu.no_info;
            otsl[3]+=rn_el.length>0 ? 1 : 0;
            dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
            } else {
      text_abs[2] += vis_menu.otsleshiv;
            otsl[2]+=rn_el.length>0 ? 1 : 0;
            dannie_o_trekax[4]+=codes_names[0][g]+((g< rn_el.length-1)?",":"");
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
                if(codes_names[0][tek_z] === k && gp_set.markers[codes_names[0][tek_z]] || codes_names[2][tek_z].search(sel_lang.check_posil_dost)===0){ // add> codes_names[2][tek_z].search(sel_lang.check_posil_dost)===0
                if(rn_el.length>0) rn_el[tek_z].children[0].className="track ab_style_complete";
                } else if(!gp_set.markers[codes_names[0][tek_z]]){
                 if(rn_el.length>0)  rn_el[tek_z].children[0].className=rn_el[tek_z].children[0].className.replace(/\s+ab_style_complete/i,"");
                }
                //
                }
           }   
// Marker load end  
    }
       abs_div.children[0].innerHTML+="<p style=\"margin: 0;font-size: 10px;font-weight: bold;\"><span style=\"color:lime;\" title=\""+sel_lang.polucheno+"!\">"+
           sel_lang.polucheno+": "+count_pol+"</span><span style=\"color:orange;\" title=\""+sel_lang.vsego_posil+"\"> "+sel_lang.iz+" "+((rn_el.length>0) ? dannie_o_trekax[0].split(",").length:0)+
           "</span></p><p style=\"font-size: 10px;margin: 0;font-weight: bold;\"><span style=\"color:cyan;\" title=\""+sel_lang.ne_poluch+"!\"> "+sel_lang.ostalos+": "+((rn_el.length>0) ? (dannie_o_trekax[0].split(",").length-count_pol):0)+"</span></p>";
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
var checkbox_input = document.getElementById("checkbox");
    
       if(this.innerText.search(options[2]) === 0) {
       var site = gp_set.services[tek_el][1];
           site = site.match(/^https?:\/\/[a-zA-z0-9.-]+/i)[0];
           console.log(site);    
       window.open(site); 
       } else if(this.innerText.search(options[0]) === 0){
       var req=prompt(sel_lang.enter_code_dlya+gp_set.services[tek_el][0]+":",""); 
       if(req.length>0 && !/^\s+$/.test(req)){ 
          window.open(gp_set.services[tek_el][1]+req);
       } else {
           alert("Поле пустое!");
           return;               
       }
       } else if(this.innerText.search(options[1]) === 0){
               if((checkbox_input.checked && dannie_o_trekax[4].length<=0) || (!checkbox_input.checked && dannie_o_trekax[0].length<=0)){
                   alert(sel_lang.gen_no_code+"\n"+sel_lang.tolko_ne_poluch+checkbox_input.checked);
                   return;
               }
       var past_codes_all_ili_net = ((checkbox_input.checked)?dannie_o_trekax[4]:dannie_o_trekax[0]);
       window.open(gp_set.services[tek_el][1]+past_codes_all_ili_net);    
       }
}    
function pop_v2(my_i){
    var my_el = gp_set.services[my_i];
    
    var ul = document.createElement("ul");
        ul.className="ul_menu";
    for(var i=0;i<options.length;i++){
    if(my_el[3] === 2){ 
        if(i<2) continue;
    } else if(my_el[3] === 1){
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
    
// Start - Верхняя панель со службами отслеживания
function upperPanel(){
    var liel= document.getElementsByClassName("nav navbar-center")[0] || null;
    if(liel){

    if(arguments[0] === "clear") $(liel).empty();
        
        
    for( i=0;i<gp_set.services.length;i++){

var li = document.createElement("li");
    li.innerHTML=((gp_set.services[i][0].search("17track")<0)?"<div>"+gp_set.services[i][0]+
                  "</div>":'<img src="http://www.17track.net/res/global/img/logo/png/logo_full_en_dark.png?v=635809337379969252" style="width: 80px; background: linear-gradient('+getColorRND()+');">');        
//
var pop_div_menu = pop_v2(i);
    li.appendChild(pop_div_menu);
       
//        
    rcol = getColorRND();
    li.setAttribute("style",((gp_set.services[i][0].search("17track")<0))?"border: 1px solid;    margin: 5px 5px;    padding: 2px;    background: linear-gradient("+
                    rcol+");    color: #e7dcdc;   text-shadow: 1px 1px 0px black;    cursor: pointer;":"margin: 5px 5px;    padding: 2px;cursor: pointer;");
    li.className="li_style";
    li.title=sel_lang.otsl_na+gp_set.services[i][0];
    li.setAttribute("elem",i);        
    liel.appendChild(li);
    }
}
}// End - Верхняя панель со службами отслеживания
    
// Update naprotiv kashdogo start
function updateDataNaprotivKashdogo(){
var title_wrapper =  document.getElementsByClassName("title-wrapper");
var naprotivKBody = document.getElementsByClassName("li_body_naprotiv_kashdogo");

if(title_wrapper && naprotivKBody){
    var li;
for(var i = 0; i < naprotivKBody.length; i++){
    var el_a=title_wrapper[i].getElementsByClassName("tracking-number")[0].innerText;
    
    if(arguments[0] !== "one"){
        naprotivKBody[i].innerHTML="";
        for(var j=0;j<gp_set.services.length;j++){
            if(gp_set.services[j][2]){
                li = document.createElement("div");
                li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+el_a+'&quot;);">'+gp_set.services[j][0]+'</span>';
                rcol = getColorRND();
                li.setAttribute("style","background: linear-gradient("+rcol+");");
                li.className="track_service";
                li.title=sel_lang.otsl_na+gp_set.services[j][0];
                naprotivKBody[i].appendChild(li);
            }            
        }
    } else if(arguments[0] === "one" && gp_set.services[gp_set.services.length-1][2]){
        var tek_service = gp_set.services[gp_set.services.length-1];
                li = document.createElement("div");
                li.innerHTML='<span onclick="window.open(&quot;'+tek_service[1]+el_a+'&quot;);">'+tek_service[0]+'</span>';
                rcol = getColorRND();
                li.setAttribute("style","background: linear-gradient("+rcol+");");
                li.className="track_service";
                li.title=sel_lang.otsl_na+tek_service[0];
                naprotivKBody[i].appendChild(li);        
    } else {break;}
}
} else {
    alert(sel_lang.error_update_danix);
}   
}
// Update naprotiv kashdogo end
    
function check_other_checks(){
if($(".i_setting_div_body").find("input:checked").length <= 0){
    $(".i_setting_div_del_button").text("Delete");
    $(".i_setting_div_del_button").fadeOut(1000,function(){$(this).css("opacity","0");});
}
}    
// --- Start Setting edit, add, delete services   
function update_setting_val(){
if(arguments[0] === "clear")$(".i_setting_div_body").empty();
    
var PoleElTable = document.createElement("div");
    PoleElTable.className = "PoleElTable";

var PoleElTableCapt = document.createElement("div");
    PoleElTableCapt.className ="PoleElTableCapt";

    $(PoleElTableCapt).html("<div>№</div><div>"+sel_lang.serv_name+"</div><div>"+sel_lang.serv_link+"</div><div>"+sel_lang.otobr_niz+"</div><div>"+sel_lang.raz_perex+"</div><div>"+sel_lang.serv_del+"</div>");
    PoleElTable.append(PoleElTableCapt);
    
/*var PoleElTableLoad= document.createElement("div");  
    PoleElTableLoad.className = "PoleElTableLoad";
    PoleElTableLoad.setAttribute("style","border: 10px solid #ded9d9;    border-radius: 60px;    width: 100px;    height: 100px;    border-bottom-color: #99ff53; animation: my 1s infinite;    position: relative;  left: 160px;");
    PoleElTable.append(PoleElTableLoad);*/
    
for(var i=0;i<gp_set.services.length;i++){ // array 0
var PoleEl = document.createElement("div");
    for(var j=0;j<gp_set.services[i].length;j++){
        var input_el_cel = document.createElement("div");
        var input_el = "";
        
        if(j === 2){
        input_el = document.createElement("select");
        input_el.innerHTML = "<option value='0'>false</option><option value='1'>true</option>";
        input_el.value =  gp_set.services[i][j];
        
        if(JSON.parse(gp_set.services[i][j])){input_el.setAttribute("style","background: linear-gradient(#d9ff5a,#16ff73)");} else{ input_el.setAttribute("style","background: linear-gradient(#eeffee,#ff9bb7)");}
            
        input_el.addEventListener("change", function(){
        if(JSON.parse(this.value)){this.setAttribute("style","background: linear-gradient(#d9ff5a,#16ff73)");} else{ this.setAttribute("style","background: linear-gradient(#eeffee,#ff9bb7)");}
        }); 
            
        } else {
        
        input_el = document.createElement("input");
        input_el.id = (j === 0)?"name_services_otsl":"link_services_otsl";    
        input_el.addEventListener("focus",function(event){focusInp(event);});
        input_el.addEventListener("blur",function(event){blurInp(event);}); 
            
        if(j === 3){
        input_el = document.createElement("select");
        input_el.innerHTML = "<option value='0'>"+sel_lang.type_per[0]+"</option><option value='1'>"+sel_lang.type_per[1]+"</option><option value='2'>"+sel_lang.type_per[2]+"</option>";
        input_el.value =  gp_set.services[i][j];
            
        }else{
        input_el.type = "text";
        }
    
        input_el.value = gp_set.services[i][j];
        }
        input_el_cel.append(input_el);
        
        if(j === 0) $(PoleEl).append("<div><div style='text-align: center;'><div style='font: bold 0.8em sans-serif;    border: 1px solid lime;    border-radius: 16px;    background: white;    line-height: 1.7; width:20px;heigth:20px;'>"+(i+1)+"</div></div></div>");
        PoleEl.append(input_el_cel);
        if(j === 3) $(PoleEl).append("<div><div style='text-align: center;'><input style='width: 20px;height: 20px;vertical-align: middle;' type='checkbox'></div></div>");
        
    }
    PoleElTable.append(PoleEl);
    $(".i_setting_div_body").append(PoleElTable);
}
    // CheckBox checked
    $(".i_setting_div_body").find("input[type=checkbox]").each(function(index,eleme){
    $(eleme).on("click",function(){
  
    if($(this).is(':checked')){
    $(".i_setting_div_del_button").css({"display":"inline-block"}).animate({opacity:"+=1.0"});
    $(".i_setting_div_del_button").text(sel_lang.serv_del+" ("+$(".i_setting_div_body").find("input:checked").length+")");    
    } else {
    $(".i_setting_div_del_button").text(sel_lang.serv_del+" ("+$(".i_setting_div_body").find("input:checked").length+")");         
    }
    check_other_checks();    

    });
    });
     // CLose button
    var i_input_focus_close = document.createElement("div");
    i_input_focus_close.innerText = "X";
    i_input_focus_close.className = "i_input_focus_close";
    i_input_focus_close.title = "Close";
    $(".i_setting_div_body").append(i_input_focus_close);    
}
    
function setting_save_value(){
$(".i_input_focus_close").fadeOut(500);
var temp_zapis = []; 
var temp_zapis1 = []; 
var save_value = true;
var z =0;
$(".PoleElTable").find("input[type!=checkbox], select").each(function(index, eleme){
    var self = $(this).val();

    if($(this).get(0).tagName.toLowerCase() === "input"){
    var stroke_error = $(this).parent().parent().index();    
        
        if($(this).val().length < 1 || /^\s+$/.test($(this).val())){
            alert(sel_lang.error_serv_name+stroke_error);
            $(this).val(gp_set.services[stroke_error-1][0]);
            save_value = false;
            return;
        }
        
        if($(this).attr("id") === "link_services_otsl" && !/^https?\:\/\/.*/i.test($(this).val())){
            alert(sel_lang.error_serv_link+stroke_error);
            if(confirm(sel_lang.return_prev_val))$(this).val(gp_set.services[stroke_error-1][1]);
            save_value = false;            
            return;
        }     
        
    }
    z++;
    
    if(z>2) temp_zapis1.push($(this).val()*1);
    else temp_zapis1.push($(this).val());

    if(z > 3){
        temp_zapis.push(temp_zapis1);
        temp_zapis1 = [];
        z=0;
    } 


});
    if(confirm(sel_lang.q_save)){
    if(temp_zapis.length > 0 && save_value){
    gp_set.services = temp_zapis;
    saveStorage();
    alert(sel_lang.danie_edit);        
    upperPanel("clear");
    updateDataNaprotivKashdogo();          
    }
    }
    
}

function setting_add_value(){
$(".i_smoke_div_fog").fadeIn(1000, function(){
if(!$("#i_pop_menu").length){
var $pop_meuni = $("<div id='i_pop_menu' style='display:none;position: fixed;width: 300px;height: 200px;left: 50%;top: 50%;border: 1px solid silver;background: linear-gradient(#c1c1c1,white);z-index: 9999999;margin-left: -150px;margin-top: -100px;border-radius: 8px;'>\
                   \<div style='width: 100%;background: linear-gradient(silver,#808686);text-align: center;border-radius: 8px 8px 0 0;color: white;padding: 3px;border-bottom: 2px dotted white;'><div style='float:right;float: right;cursor: pointer; margin-right: 5px; font-size: 10pt;' id='i_pop_menu_close_b'>X</div>"+sel_lang.menu_add+"</div>\
                   \<div style='padding: 5px;    color: #5f5d5d;    font: normal 12px/14px monospace;text-align:center;'>\
                   \<p>"+sel_lang.serv_name+": <input id='i_pop_menu_input_name' type='text' value /><span title='"+sel_lang.text_Error+"'></span></p>\
                   \<p>"+sel_lang.serv_link+": <input id='i_pop_menu_input_link' type='text' value='http://' /><span title='"+sel_lang.text_Error+"'></span></p>\
                   \<p>"+sel_lang.otobr_niz+": <select id='i_pop_menu_select' style='width:81px;'><option value='0'>false</option><option value='1'>true</option></select></p>\
                   \<p>"+sel_lang.raz_perex+": <select id='i_pop_menu_typeview' style='width:115px;'><option value='0'>"+sel_lang.type_per[0]+"</option><option value='1'>"+sel_lang.type_per[1]+"</option><option value='2'>"+sel_lang.type_per[2]+"</option></select></p>\
                   \<div disabled id='i_pop_menu_button_add' style='width: 150px;margin: 0 auto;height: 30px;line-height: 30px;background: linear-gradient(#75f575,#16bf02);color: white;border-radius: 8px;box-shadow: 2px 2px 5px silver;cursor:pointer;'>"+sel_lang.button_add+"</div></div></div>");
    
$("body").append($pop_meuni);
    
// Close button
$("#i_pop_menu_close_b").click(function(){
    $pop_meuni.fadeOut(1000,function(){
        $(".i_smoke_div_fog").fadeOut(1000,function(){
        $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").removeClass("error_icon_input");                       
        $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");         
            
        $("#i_pop_menu_input_name").val("");
        $("#i_pop_menu_input_link").val("http://");
        $("#i_pop_menu_typeview,#i_pop_menu_select").val("0");
        
        });
    });
});
// Close button end
    
// Add service button 
$("#i_pop_menu_button_add").hover(function(e){
    $(this).css("background",e.type === "mouseenter" ? "linear-gradient(rgb(26, 107, 26), rgb(48, 253, 21))":"linear-gradient(#75f575,#16bf02)");
});
    
$("#i_pop_menu_button_add").click(function(){
   
    var newServicesArrayInput = [];
    var i_pop_menu_input_link = $("#i_pop_menu_input_link").val();
    var i_pop_menu_input_name = $("#i_pop_menu_input_name").val();
    var i_pop_menu_select = $("#i_pop_menu_select").val();
    var i_pop_menu_typeview = $("#i_pop_menu_typeview").val();

    
    // Text empty!
    if(i_pop_menu_input_name.length < 1 || /^\s+$/.test(i_pop_menu_input_name)){
        alert(sel_lang.textfield_empty_name);
        $("#i_pop_menu_input_name").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
        $("#i_pop_menu_input_name").css("border-color","red");
        return;
    }
    
    if(i_pop_menu_input_link.length < 1 || /^\s+$/.test(i_pop_menu_input_link)){
        alert(sel_lang.textfield_empty_link);
        $("#i_pop_menu_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
        $("#i_pop_menu_input_link").css("border-color","red");
        return;
    }
    
    // Link text invalid!
    if(!/^https?\:\/\/.*/i.test(i_pop_menu_input_link)){
        alert(sel_lang.textfield_invalid_link);
        $("#i_pop_menu_input_link").parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
        $("#i_pop_menu_input_link").css("border-color","red");        
        return;
    }
    
    $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});                       
    $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");     
    
    if(gp_set.services === undefined){return;}
    
    newServicesArrayInput = [i_pop_menu_input_name,i_pop_menu_input_link,parseInt(i_pop_menu_select),parseInt(i_pop_menu_typeview)];
    
    console.log(newServicesArrayInput);
    /*
    for(var ser in gp_set.services){
        if(ser.toLowerCase() === newServicesArrayInput[0].toLowerCase()){
            return;
        }
    }*/
    
    gp_set.services.push(newServicesArrayInput); 
    saveStorage();
    alert(sel_lang.service_add_comp);
    
    $("#i_pop_menu").fadeOut(500,function(){
        $(".i_smoke_div_fog").fadeOut(1000,function(){
            
        $("#i_pop_menu_input_link, #i_pop_menu_input_name").parent().find("span").removeClass("error_icon_input");                       
        $("#i_pop_menu_input_link, #i_pop_menu_input_name").css("border-color","");         
            
        $("#i_pop_menu_input_name").val("");
        $("#i_pop_menu_input_link").val("http://");
        $("#i_pop_menu_typeview,#i_pop_menu_select").val("0");
        update_setting_val("clear");
        upperPanel("clear");
        updateDataNaprotivKashdogo("one");           
        });
    });
    
});
    
// Add service button end    
$("#i_pop_menu").children(":nth-child(2)").find("input").each(function(index, eleme){
    $(eleme).on("input", function(){
        var minlengt = /^\s+$/.test($(this).val());
        var empty_input = $(this).val().length < 1;
        var link_check = ($(this).attr("id")==="i_pop_menu_input_link" && !/https?\:\/\/.*/i.test($(this).val()));

        if(minlengt || empty_input || link_check){
            $(this).parent().find("span").addClass("error_span_input error_icon_input").fadeIn(1000);
            $(this).css("border-color","red");
        } else {
            $(this).parent().find("span").fadeOut(1000,function(){$(this).removeClass("error_icon_input");});                       
            $(this).css("border-color","");                     
        }
    });
    
});
    
$pop_meuni.fadeIn(1000);
} else {
$("#i_pop_menu").fadeIn(1000);    
}
});  
}
    
function setting_del_value(){
    if(confirm(sel_lang.q_del)){
       var arr_del = []; 
       $(".i_setting_div_body").find("input[type=checkbox]").each(function(index,eleme){
           if($(this).is(':checked')){
               arr_del.push(index);
           }
       });
        arr_del = arr_del.reverse();
        for(var k in arr_del){
        gp_set.services.splice(arr_del[k],1);
        }
    saveStorage();
    alert(sel_lang.services_del_comp);        
    upperPanel("clear");
    updateDataNaprotivKashdogo();
    update_setting_val("clear");        
    }
}
    
function focusInp(event){
var el = event;
var elementClick = $(event.target);
var offset = elementClick.offset(); 

$(".i_input_focus_close").css({"left": "330px", "top":(event.target.offsetTop-25)+"px", "display": "block"});
$(".i_input_focus_close").click(function() {
  $( this ).css({"display": "none"});
});

    el.target.className = "i_setting_el_zoom";
    el.target.focus();    
}

function blurInp(event){
var el = event.target;
    
$(".i_input_focus_close").css({"display": "block"});
    el.removeAttribute("class");    
}

// Show window setting services    
function setting_window(){
$(".i_setting_div").fadeToggle(1000, function(){
    
if(!document.getElementsByClassName("PoleElTable")[0]){
update_setting_val();
}
});

}  // show setting end  
//--- End Setting edit, add, delete services 

// Start - Проверка трека напротив каждого трека    
var dannie_o_trekax=["","","","",""];
var codes_names = []; 
    
function NaprotuvKashdogo(){    
var rn_el=document.getElementsByClassName("track-container");
var title_wrapper =  document.getElementsByClassName("title-wrapper");
var tek_pol=document.getElementsByClassName("checkpoint-status");

if(rn_el && title_wrapper && tek_pol){    
for(var i=0;i< rn_el.length;i++){

    var el_a=title_wrapper[i].getElementsByClassName("tracking-number")[0].innerText; 
    //var el_a=rn_el[i].getElementsByTagName("a")[0].innerText;
    //var el_div=(rn_el.className !="tracking-number")?rn_el[i].getElementsByTagName("a")[1].innerText:rn_el[i].getElementsByTagName("div")[0].innerText;
    //
    dannie_o_trekax[0]+=el_a+((i<rn_el.length-1)?",":""); // Track Number
    dannie_o_trekax[1]+=(title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":""); // Name order
    dannie_o_trekax[2]+= el_a+" - "+(title_wrapper[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?",":""); // Track Number + Name order
    dannie_o_trekax[3]+=(tek_pol[i].firstChild.data).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')+((i< rn_el.length-1)?"|":""); // Status order
    title_wrapper[i].setAttribute("title", (title_wrapper[i].firstChild.data).replace(/\s+(.*)/i,"$1")+((i< rn_el.length-1)?"|":""));
   //
    var li_body = document.createElement("div");
    var li_body1 = document.createElement("div");    
    li_body.setAttribute("style", "margin-bottom: 25px;background: #f9f9f9;");
    li_body1.setAttribute("style", "position:absolute;");
    li_body1.className = "li_body_naprotiv_kashdogo";
    document.getElementsByClassName("track-list")[0].insertBefore(li_body,rn_el[i].nextSibling);
    document.getElementsByClassName("track-list")[0].insertBefore(li_body1,rn_el[i].nextSibling);
    
    for(var j=0;j<gp_set.services.length;j++){
    if(gp_set.services[j][2]){
var li = document.createElement("div");
    li.innerHTML='<span onclick="window.open(&quot;'+gp_set.services[j][1]+el_a+'&quot;);">'+gp_set.services[j][0]+'</span>';
    rcol = getColorRND();
    li.setAttribute("style","background: linear-gradient("+rcol+");");
    li.className="track_service";
    li.title=sel_lang.otsl_na+gp_set.services[j][0];
    li_body1.appendChild(li);
    }
    }
}
} else {
    alert(sel_lang.error_create_buttons);
}
}
// End - Проверка трека напротив каждого трека     
    
function init(){
try{
// -------------------------------- Init -----------------------------
var i_setting_div = document.createElement("div"); 
var i_setting_div_caption = document.createElement("div");
var i_setting_div_body = document.createElement("div"); 
var i_setting_div_foot = document.createElement("div");
    
var i_setting_div_resetservices = document.createElement("div"); 
    i_setting_div_resetservices.innerText = sel_lang.reser_serv;
    $(i_setting_div_resetservices).css({"float": "left",    "font-size": "0.8em",    "margin-top": "20px",    "cursor": "pointer"});
    $(i_setting_div_resetservices).click(function(){
    if(confirm(sel_lang.q_reset_serv)) {
        resetDefaultServices();
    }
    });
    
var i_setting_div_add_button = document.createElement("div"); 
    i_setting_div_add_button.innerText = sel_lang.add_serv;    
var i_setting_div_save_button = document.createElement("div");
    i_setting_div_save_button.innerText = sel_lang.save_serv;
    
var i_setting_div_del_button = document.createElement("div");
    i_setting_div_del_button.innerText = sel_lang.serv_del;    
   
    i_setting_div.className = "i_setting_div";
    i_setting_div_caption.className = "i_setting_div_caption";
    i_setting_div_caption.innerHTML = "<span>"+sel_lang.setting+"</span>";
    $(i_setting_div_caption).find("span").append("<div style='float:right; cursor:pointer;margin-right: 5px;'>X</div>").click(function(){$(".i_setting_div").fadeOut(1000);});
    i_setting_div_body.className = "i_setting_div_body";     
    i_setting_div_foot.className = "i_setting_div_foot";
    i_setting_div_add_button.className = "i_setting_div_button i_setting_div_save_button";       
    i_setting_div_save_button.className = "i_setting_div_button i_setting_div_add_button"; 
    i_setting_div_del_button.className = "i_setting_div_button i_setting_div_del_button";     
    
var i_setting = document.createElement("i");
    i_setting.className = "i_setting i_setting-set";
    
var i_smoke_div_fog = document.createElement("div");
    i_smoke_div_fog.className = "i_smoke_div_fog";
    document.body.appendChild(i_smoke_div_fog);
    
var divli = document.createElement("ul");
    divli.className = "nav navbar-center";
var liel= document.getElementsByClassName("navbar navbar-inverse")[0].getElementsByClassName("container")[0] || null;
    if(liel){
    liel.insertBefore(divli,document.getElementsByClassName("nav navbar-nav navbar-right")[0]);
    }
    
    i_setting.addEventListener("click", setting_window);
    i_setting_div_add_button.addEventListener("click", setting_add_value);    
    i_setting_div_save_button.addEventListener("click", setting_save_value);
    i_setting_div_del_button.addEventListener("click", setting_del_value);
    
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
    checkbox_div.appendChild(i_setting);  
    
    i_setting_div.appendChild(i_setting_div_caption);  
    i_setting_div.appendChild(i_setting_div_body);
    i_setting_div_foot.appendChild(i_setting_div_resetservices);     
    i_setting_div_foot.appendChild(i_setting_div_add_button);       
    i_setting_div_foot.appendChild(i_setting_div_save_button);
    i_setting_div_foot.appendChild(i_setting_div_del_button);    
    i_setting_div.appendChild(i_setting_div_foot);    
    
    checkbox_div.appendChild(i_setting_div);
    //document.getElementsByClassName("container")[1].lastChild.appendChild(checkbox_div);
    document.getElementsByClassName("container")[2].parentNode.insertBefore(checkbox_div, document.getElementsByClassName("container")[2]);
//--------------------

    NaprotuvKashdogo();  // Naprotiv kashdogo treka slushba ontsleshivaniya
    make_abs(); // Make absolute window left     
    upperPanel(); // Verxnya panel so slushbami otsleshivaniya
} catch (e){console.log(e);}
}
    
    
init();    

})();
