/**
 * @author admin
 */
var script = document.getElementsByTagName("script")[0];
var src = script.src;
src = src.replace(/js\/.+\.js/, "");
console.info("src:"+src);
var style = src.split("bootui")[0]+"bootui/";
console.info("style:"+style);

document.write('<link href="'+ src +'css/boot.css" rel="stylesheet" type="text/css">');
document.write('<link href="'+ style +'themes/css/style.css" rel="stylesheet" type="text/css">');
document.write('<link href="'+ src +'/themes/pink/pink.css" rel="stylesheet" type="text/css">');
document.write('<script type="text/javascript" src="' + src + 'js/root/jquery.min.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/root/boot.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.layout.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.validate.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.binding.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.panel.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.dataform.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.textbox.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.search.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.number.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.hidden.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.password.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.textarea.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.popupedit.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.popupwin.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.listbox.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.combobox.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.checkbox.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.radiobox.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.toolbar.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.button.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.treeservice.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.tree.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.window.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.pager.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.datagrid.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.autocomplete.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.date.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.contextmenu.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.navigator.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.tab.js"></script>');
document.write('<script type="text/javascript" src="' + src + 'js/plugin/boot.datepicker.js"></script>');