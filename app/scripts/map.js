/* no jquery - for sharing with all CIR maps */

//from: https://github.com/jfriend00/docReady
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

var touch;

docReady(function() {
    initInteraction();
    stateSelect();
});

function initInteraction(){
  /* Check if viewing on a mobile browser */
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    touch = true;
    var wrapper = document.getElementById("interactive-wrapper");
    wrapper.className += ' touch-device';
  }

  var tooltip = document.getElementsByClassName("map-tooltip")[0];
  var map = document.getElementById("us-map");

  if (!touch) {
    map.addEventListener( 'mousemove', function(e) {
      var left = e.offsetX==undefined?e.layerX+10:e.offsetX+10;
      var top = e.offsetY==undefined?e.layerY+10:e.offsetY+10;
      if (e.pageX > (window.innerWidth - 300)){
        //left = e.offsetX==undefined?e.layerX-160:e.offsetX-160;
        left = e.offsetX==undefined?e.layerX-tooltip.clientWidth:e.offsetX-tooltip.clientWidth;
      }
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
  }

  var elements = document.getElementsByClassName("cir-map-state");
  for (var i in elements) {
    if (!elements.hasOwnProperty(i)) {
      continue;
    }
    var elem = elements[i];
    if (i !== 'length') {

      if (!touch){
        elem.addEventListener( 'mouseover', function(e) {
          tooltipInfo(e.target, tooltip);
          tooltip.style.display = 'block';
        });

        elem.addEventListener( 'mouseout', function() {
          tooltip.style.display = 'none';
        });
      } else {
        elem.addEventListener( 'click', function(e) {
          if(e.handled !== true) {
            var stateID = e.target.id;
            var select = document.getElementById("cir-map-select");           
            if (e.target.getAttribute('data-selected') == 'true'){
              select.value = "Select a state";
              e.target = "";
              stateID = "Select a state";
            } else {
              select.value = stateID;
            }
            updateSelectedPath(e.target);
            updateSelectionInfo(stateID);
            e.handled = true;
          }
        });
      }
    }
  }
}

function tooltipInfo(elem, tooltip){
  var state = elem.getAttribute("data-state");
  var group = elem.getAttribute("data-group");
  var htmlName = "<span class='state-name'>" + state + "</span>";
  var htmlGroup = "<span class='state-group'>" + group + "</span>";

  var innerTip = document.getElementsByClassName("tooltip-inner")[0];

  innerTip.innerHTML = htmlName + htmlGroup;
}

function stateSelect(){
  var select = document.getElementById("cir-map-select");
  select.onchange = function(){
    var value = select.value;
    updateSelectionInfo(value);
  }
}

function updateSelectionInfo(value){
  var info = document.getElementById("cir-map-info");
  if (value != "Select a state"){
    var svgState = document.getElementById(value);
    var dataState = svgState.getAttribute("data-state");
    var dataGroup = svgState.getAttribute("data-group")
    var html = "<div class='info-inner'><span class='state-name'>" + dataState + "</span><span class='state-group'>" + dataGroup + "</span></div>";
    info.innerHTML = html;
    updateSelectedPath(svgState);     
  } else {
    info.innerHTML = "";
    deselectPath();
  }
}

function updateSelectedPath(path){
  deselectPath();   
  if (path.getAttribute('data-selected') == 'true'){
    path.setAttribute('data-selected', 'false');
  } else {
    path.setAttribute('data-selected', 'true');
  } 
  path.setAttribute('data-selected', 'true');
  var parent = path.parentNode;
  parent.appendChild(path);
}

function deselectPath(){
  var states = document.getElementsByClassName("cir-map-state");
  for (var j in states) {
    var state = states[j];
    if (typeof state === 'object'){
      state.setAttribute('data-selected', 'false');
    }
  }
}