//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

pui.layout.helpTextTemplatesProperties = function(defVal, descVal) {
  return '<hr><b>Default Value:</b> <code>' + defVal + '</code>' + '<hr><b>Description: </b>' + descVal + '<hr><br>';
};

pui.layout["templates"] = {};

/**
 * Enqueue fetching of a custom layout template from an IFS file or URL. A user's script would cause this function to be called.
 * This must be called before pui.render runs; e.g. by a script loaded automatically in userdata/custom/js/.
 * @param {String} templateName   URL or name of the template. Name is expected to be part of an IFS file name. See issues 3548, 5999.
 */
pui["retrieveCustomLayoutTemplate"] = function (templateName) {
  if (typeof templateName === 'string' && templateName.length > 0){
    pui.customLayoutTemplateQueue = pui.customLayoutTemplateQueue || [];
    
    var url = templateName;
    if (templateName.substr(0, 1) != "/" &&
      templateName.substr(0, 5).toLowerCase() != "http:" &&
      templateName.substr(0, 6).toLowerCase() != "https:") {
      url = "/profoundui/userdata/layouts/" + templateName + ".html";
    }

    pui.customLayoutTemplateQueue.push({
      templateName: templateName,
      url: pui.normalizeURL(url)
    });
  }
};


pui["maximizeLayout"] = function (e) {
  var itemDom = getTarget(e).parentNode;
  var designer = toolbar.designer;
  var item = designer.getDesignItemByDomObj(itemDom);
  designer.undo.start("Maximize Layout");
  designer.undo.add(item, "left");
  designer.undo.add(item, "top");
  designer.undo.add(item, "width");
  designer.undo.add(item, "height");
  itemDom.style.left = "0px";
  item.properties["left"] = "0px";
  item.propertiesChanged["left"] = true;
  itemDom.style.top = "0px";
  item.properties["top"] = "0px";
  item.propertiesChanged["top"] = true;
  itemDom.style.width = "100%";
  item.properties["width"] = "100%";
  item.propertiesChanged["width"] = true;
  itemDom.style.height = "100%";
  item.properties["height"] = "100%";
  item.propertiesChanged["height"] = true;
  designer.changedScreens[designer.currentScreen.screenId] = true;
  designer.makeDirty();
  designer.selection.clear();
  itemDom.layout.stretch();
  designer.selection.add(item);
  designer.propWindow.refresh();
  preventEvent(e);
};

pui.layout.maximizeIcon = "<div condition=\"{ designValue: 'true', runtimeValue: 'false', proxyValue: 'false' }\" title=\"Maximize\" style=\"position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; cursor: pointer; background-image: url(/profoundui/proddata/images/icons/maximize.png)\" onmousedown=\"pui.maximizeLayout(event)\" />";

pui.layout["templates"]["simple container"] = "<div style=\"position: relative; width: 100%; height: 100%; overflow: hidden; overflow-x: { property: 'overflow x', help: '" + pui.layout.helpTextTemplatesProperties("hidden","Determines whether a horizontal scrollbar should be displayed.") + "', choices: ['visible', 'hidden', 'scroll', 'auto'] }; overflow-y: { property: 'overflow y', help: '" + pui.layout.helpTextTemplatesProperties("hidden","Determines whether a vertical scrollbar should be displayed.") + "', choices: ['visible', 'hidden', 'scroll', 'auto'] };\"><div stretch=\"true\" container=\"true\" style=\"overflow: hidden; { designValue: 'border: 2px dashed #666666;' } { proxyValue: 'width: 97px; height: 97px;' } \"></div></div>";

pui.layout["templates"]["table"] = "<table style=\"empty-cells: show; overflow: hidden;\" width=\"100%\" height=\"100%\"><tr repeat=\"{ property: 'rows', help: '" + pui.layout.helpTextTemplatesProperties("2","Specifies the number of table rows for this layout.") + "' }\"><td style=\"border: { designValue: '1', runtimeValue: 0 }px dashed #666666;\" repeat=\"{ property: 'columns', help: '" + pui.layout.helpTextTemplatesProperties("2","Specifies the number of table columns for this layout.") + "' }\"><div stretch=\"true\" container=\"true\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr></table>";
pui.layout["templates"]["table"] += pui.layout.maximizeIcon;

pui.layout["templates"]["mobile device"] = "<table cellpadding=\"0\" cellspacing=\"0\">";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'top bar', choices: ['true','false'], help: '" + pui.layout.helpTextTemplatesProperties("true","Determines whether the mobile layout should have a top bar.") + "' }\"><td class=\"top-bar\"><div container=\"true\" class=\"top-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr><td class=\"content-section\"><div class=\"content-section\" stretch=\"true\" container=\"true\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'bottom bar', choices: ['true','false'], help: '" + pui.layout.helpTextTemplatesProperties("true","Determines whether the mobile layout should have a bottom bar.") + "' }\"><td class=\"bottom-bar\"><div container=\"true\" class=\"bottom-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "</table>";
pui.layout["templates"]["mobile device"] += pui.layout.maximizeIcon;

pui.layout["templates"]["css panel"] = pui.layout.template.cssPanelTemplate;

pui.layout["templates"]["accordion"] = pui.layout.template.accordionTemplate;

pui.layout["templates"]["fieldset"] = "<fieldset style=\"width:100%; height:100%; position:relative;" +
  " border-style:{property:'border style', choices:['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'], defaultValue:'solid', help:'" + pui.layout.helpTextTemplatesProperties("solid","The style of the element&apos;s border.") + "'};" +
  " border-width:{property:'border width', choices:['1px','2px','3px','Other...'], defaultValue:'1px', help:'" + pui.layout.helpTextTemplatesProperties("1px","The width of the element&apos;s border.") + "'};" +
  " border-color:{property:'border color', type:'color', defaultValue:'black', help:'" + pui.layout.helpTextTemplatesProperties("black","The color of the element&apos;s border.") + "'};"
  //Note: legend align has been deprecated in HTML5. The equivalent in CSS requires a bunch of style rules that aren't easily done in a plain HTML template.
  //In the future, this template may need to be implemented in JavaScript.
  +
  '"><legend align="{property: \'legend align\', choices:[\'left\',\'right\',\'center\'], help:\'' + pui.layout.helpTextTemplatesProperties("left","The width of the element&apos;s border.") + '\'}"' +
  ' style="{property:\'legend style\', help:\''+ pui.layout.helpTextTemplatesProperties("", "Styling for the legend text.") +'\', type:\'long\'}">' +
  '{property: "legend", help:\'' + pui.layout.helpTextTemplatesProperties("Field Set","Text to display in the field set&apos;s legend.") + '\', "translate": true}</legend>' +
  '<div container="true" style="width:100%; height:100%; position:absolute; overflow:hidden;"></div>' +
  '</fieldset>';

pui.layout["templates"]["responsive layout"] = pui.layout.template.responsiveLayoutTemplate;
pui.layout["templates"]["tab panel"] = pui.layout.template.tabTemplate;

/**
 * Returns an array of template name strings. pui.layout.getPropertiesModel calls this,
 * allowing Designer to show the list of templates in the "template" property.
 * @returns {Array}
 */
pui.layout.getTemplateList = function () {
  var templates = pui.layout["templates"];
  var list = [];
  for (var x in templates) {
    list.push(x);
  }
  return list;
};


pui.layout.mergeProps = function (templateProps) {
  var props = [];
  var layoutProps = pui.layout.getPropertiesModel();
  for (var i = 0; i < layoutProps.length; i++) {
    if (layoutProps[i].templateProperties == true) {
      for (var j = 0; j < templateProps.length; j++) {
        props.push(templateProps[j]);
      }
    } else {
      props.push(layoutProps[i]);
    }
  }
  return props;
};

/**
 * Adopt everything from a standard widget property, excluding the "controls" list, allowing a layout to use the same text, bindings, etc.
 * Note: if a layout uses this function and "controls" was set on the property, then DataFields.js::getPostData() and Designer.js::getJSON()
 * need exceptions for the property and template.
 * @param {String} propName
 * @returns {Object}
 */
pui.layout.adoptNamedProperty = function (propName) {
  if (pui.layout.adoptedProperty === null || typeof pui.layout.adoptedProperty != "object") {
    pui.layout.adoptedProperty = {};
  }

  if (pui.layout.adoptedProperty[propName] == null) {
    // Create another cached copy of the global property for use by templates.
    pui.layout.adoptedProperty[propName] = {
      name: propName
    };
    var nmodel = getPropertiesNamedModel();
    if (nmodel[propName] != null && typeof nmodel[propName] == "object") {
      try {
        // Add references to the global property in the new object.
        for (var key in nmodel[propName]) {
          pui.layout.adoptedProperty[propName][key] = nmodel[propName][key];
        }
        delete pui.layout.adoptedProperty[propName]["controls"];
        //This may be added after property definitions are setup and has cyclic references and isn't needed.
        delete pui.layout.adoptedProperty[propName].selection;
      } catch (exc) {
        console.log("error adopting property:", exc.message);
      }
    }
  }
  return pui.layout.adoptedProperty[propName];
};
