window.lunrData = {
  "index": {
    "version": "1.0.0",
    "fields": [
      {
        "name": "longname",
        "boost": 1000
      },
      {
        "name": "name",
        "boost": 500
      },
      {
        "name": "tags",
        "boost": 300
      },
      {
        "name": "kind",
        "boost": 110
      },
      {
        "name": "title",
        "boost": 100
      },
      {
        "name": "summary",
        "boost": 70
      },
      {
        "name": "description",
        "boost": 50
      },
      {
        "name": "body",
        "boost": 1
      }
    ],
    "ref": "id",
    "tokenizer": "default",
    "documentStore": {
      "store": {
        "index.html": [
          "base",
          "bootstrap",
          "foodoc",
          "handlebar",
          "index",
          "jsdoc3",
          "readm",
          "templat"
        ],
        "global.html": [
          "document",
          "global"
        ],
        "list_class.html": [
          "class",
          "document",
          "list",
          "list:class"
        ],
        "list_namespace.html": [
          "document",
          "list",
          "list:namespac",
          "namespac"
        ],
        "NFComp.html": [
          "access",
          "allow",
          "class",
          "compitem",
          "layer",
          "manipl",
          "nf",
          "nfcomp",
          "object",
          "wrapper"
        ],
        "NFComp.html#selectedLayers": [
          "comp",
          "function",
          "get",
          "layer",
          "nfcomp#selectedlay",
          "nflayercollect",
          "select",
          "selectedlay"
        ],
        "NFComp.html#selectedPageLayers": [
          "comp",
          "function",
          "get",
          "nfcomp#selectedpagelay",
          "nfpagelayercollect",
          "page",
          "select",
          "selectedpagelay"
        ],
        "NFComp.html#layerWithName": [
          "comp",
          "found",
          "function",
          "given",
          "layer",
          "layerwithnam",
          "name",
          "nfcomp#layerwithnam",
          "nflayer",
          "nflayer|nul",
          "none",
          "null",
          "return"
        ],
        "NFComp.html#getZoomer": [
          "function",
          "get",
          "getzoom",
          "layer",
          "nfcomp#getzoom",
          "nflayer|nul",
          "zoomer"
        ],
        "NFComp.html#addNull": [
          "addnul",
          "comp",
          "creat",
          "function",
          "layer",
          "new",
          "nfcomp#addnul",
          "nflayer",
          "null",
          "return"
        ],
        "NFComp.html#getInfo": [
          "function",
          "getinfo",
          "nfcomp#getinfo",
          "object",
          "represent",
          "return",
          "string"
        ],
        "NFLayer.html": [
          "avlay",
          "class",
          "nf",
          "nflayer",
          "object",
          "wrapper"
        ],
        "NFLayer.html#isPageLayer": [
          "boolean",
          "check",
          "function",
          "ispagelay",
          "layer",
          "nflayer#ispagelay",
          "page",
          "valid"
        ],
        "NFLayer.html#isNullLayer": [
          "boolean",
          "check",
          "function",
          "isnulllay",
          "layer",
          "nflayer#isnulllay",
          "null"
        ],
        "NFLayer.html#isHighlightLayer": [
          "boolean",
          "check",
          "function",
          "highlight",
          "ishighlightlay",
          "layer",
          "nflayer#ishighlightlay",
          "valid"
        ],
        "NFLayer.html#isPaperParentLayer": [
          "boolean",
          "check",
          "function",
          "ispaperparentlay",
          "layer",
          "nflayer#ispaperparentlay",
          "paper",
          "parent",
          "valid"
        ],
        "NFLayer.html#getSpecializedLayer": [
          "content",
          "function",
          "getspecializedlay",
          "layer",
          "new",
          "nflayer#getspecializedlay",
          "nfpagelayer|nfhighlightlayer|nfpaperparentlayer|nflay",
          "return",
          "special",
          "type"
        ],
        "NFLayer.html#index": [
          "function",
          "index",
          "int",
          "layer'",
          "nflayer#index",
          "shorthand"
        ],
        "NFLayer.html#hasNullParent": [
          "boolean",
          "function",
          "hasnullpar",
          "layer",
          "nflayer#hasnullpar",
          "null",
          "parent",
          "return",
          "true"
        ],
        "NFLayer.html#sameLayerAs": [
          "boolean",
          "check",
          "exampl",
          "function",
          "given",
          "layer",
          "nflayer",
          "nflayer#samelayera",
          "nflayer'",
          "nfpagelay",
          "one'",
          "refer",
          "return",
          "same",
          "samelayera",
          "see",
          "true"
        ],
        "NFLayer.html#containingComp": [
          "contain",
          "containingcomp",
          "function",
          "nfcomp",
          "nflayer#containingcomp",
          "return"
        ],
        "NFLayer.html#getChildren": [
          "child",
          "function",
          "getchildren",
          "layer",
          "nflayer#getchildren",
          "nflayercollect",
          "return",
          "special"
        ],
        "NFLayer.html#getParent": [
          "function",
          "get",
          "getpar",
          "layer'",
          "nflayer",
          "nflayer#getpar",
          "nflayer|nul",
          "parent"
        ],
        "NFLayer.html#setParent": [
          "function",
          "given",
          "layer'",
          "newpar",
          "nflayer",
          "nflayer#setpar",
          "parent",
          "set",
          "setpar"
        ],
        "NFLayer.html#setZoomer": [
          "function",
          "layer",
          "layer'",
          "nflayer",
          "nflayer#setzoom",
          "nfpartcomp",
          "parent",
          "set",
          "setzoom",
          "zoomer"
        ],
        "NFLayer.html#moveBefore": [
          "befor",
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "movebefor",
          "nflayer",
          "nflayer#movebefor",
          "provid",
          "target",
          "targetlay"
        ],
        "NFLayer.html#moveAfter": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "moveaft",
          "nflayer",
          "nflayer#moveaft",
          "provid",
          "target",
          "targetlay"
        ],
        "NFLayer.html#markers": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "marker",
          "move",
          "nflayer#mark",
          "properti",
          "provid",
          "target"
        ],
        "NFLayer.html#addInOutMarkersForProperty": [
          "add",
          "addinoutmarkersforproperti",
          "alreadi",
          "express",
          "function",
          "given",
          "layer",
          "marker",
          "nflayer",
          "nflayer#addinoutmarkersforproperti",
          "option",
          "out",
          "overrid",
          "previou",
          "property'",
          "set",
          "transit"
        ],
        "NFLayer.html#addSlider": [
          "addslid",
          "creat",
          "effect",
          "function",
          "layer",
          "name",
          "nflayer#addslid",
          "properti",
          "return",
          "slider",
          "valu"
        ],
        "NFLayer.html#.getSpecializedLayerFromAVLayer": [
          "avlay",
          "class",
          "function",
          "getspecializedlayerfromavlay",
          "lt;static&gt",
          "method",
          "new",
          "nflayer",
          "nflayer.getspecializedlayerfromavlay",
          "nflayer|nfhighlightlayer|nfpagelayer|nfemphasislayer|nfgaussylayer|nfimagelay",
          "return",
          "special",
          "thelay"
        ],
        "NFLayer.html#.isCompLayer": [
          "avlay",
          "boolean",
          "class",
          "comp",
          "function",
          "given",
          "iscomplay",
          "layer",
          "lt;static&gt",
          "method",
          "nflayer.iscomplay",
          "return",
          "thelay",
          "true"
        ],
        "NFLayer.html#.isAVLayer": [
          "avlay",
          "boolean",
          "don't",
          "function",
          "given",
          "instanceof",
          "isavlay",
          "layer",
          "lt;static&gt",
          "nflayer.isavlay",
          "nice",
          "object",
          "on",
          "play",
          "return",
          "subclass",
          "whether"
        ],
        "NFLayerCollection.html": [
          "array",
          "class",
          "contain",
          "nf",
          "nflayer",
          "nflayercollect",
          "object",
          "wrapper"
        ],
        "NFLayerCollection.html#addNFLayer": [
          "add",
          "addnflay",
          "collect",
          "function",
          "newlay",
          "nflayer",
          "nflayercollect",
          "nflayercollection#addnflay"
        ],
        "NFLayerCollection.html#onlyContainsPageLayers": [
          "boolean",
          "collect",
          "contain",
          "function",
          "nflayer",
          "nflayercollection#onlycontainspagelay",
          "nfpagelay",
          "onlycontainspagelay",
          "return",
          "true",
          "type"
        ],
        "NFLayerCollection.html#inSameComp": [
          "boolean",
          "collect",
          "comp",
          "function",
          "insamecomp",
          "layer",
          "nflayercollection#insamecomp",
          "return",
          "same",
          "true"
        ],
        "NFLayerCollection.html#containingComp": [
          "comp",
          "contain",
          "containingcomp",
          "fals",
          "function",
          "insamecomp",
          "layer",
          "nfcomp|nul",
          "nflayercollection#containingcomp",
          "null",
          "return"
        ],
        "NFLayerCollection.html#getPageLayerCollection": [
          "call",
          "collect",
          "contain",
          "function",
          "getpagelayercollect",
          "know",
          "new",
          "nflayercollection#getpagelayercollect",
          "nfpagelay",
          "nfpagelayercollect",
          "return"
        ],
        "NFLayerCollection.html#count": [
          "access",
          "collect",
          "count",
          "function",
          "int",
          "layer",
          "nflayercollection#count",
          "number",
          "shortcut"
        ],
        "NFLayerCollection.html#isEmpty": [
          "boolean",
          "collect",
          "empti",
          "function",
          "isempti",
          "nflayercollection#isempti",
          "true"
        ],
        "NFLayerCollection.html#remove": [
          "collect",
          "function",
          "given",
          "layer",
          "layertoremov",
          "nflayercollect",
          "nflayercollection#remov",
          "remov"
        ],
        "NFLayerCollection.html#getTopmostLayer": [
          "collect",
          "function",
          "get",
          "gettopmostlay",
          "nflayer",
          "nflayercollection#gettopmostlay",
          "nflayer|nul",
          "topmost"
        ],
        "NFLayerCollection.html#getBottommostLayer": [
          "bottommost",
          "collect",
          "function",
          "get",
          "getbottommostlay",
          "nflayer",
          "nflayercollection#getbottommostlay",
          "nflayer|nul"
        ],
        "NFLayerCollection.html#setParents": [
          "function",
          "given",
          "layer",
          "member",
          "newpar",
          "nflayer",
          "nflayercollect",
          "nflayercollection#setpar",
          "null",
          "parent",
          "set",
          "setpar"
        ],
        "NFLayerCollection.html#nullify": [
          "abov",
          "collect",
          "creat",
          "function",
          "index",
          "layer",
          "lowest",
          "new",
          "nflayer",
          "nflayercollection#nullifi",
          "null",
          "nullifi",
          "on",
          "overrid",
          "parent",
          "posit",
          "previou"
        ],
        "NFLayerCollection.html#.collectionFromAVLayerArray": [
          "array",
          "avlay",
          "class",
          "collectionfromavlayerarray",
          "function",
          "lt;static&gt",
          "method",
          "new",
          "nflayercollect",
          "nflayercollection.collectionfromavlayerarray",
          "return"
        ],
        "NFPDF.html": [
          "class",
          "group",
          "nf",
          "nfpageitem",
          "nfpdf",
          "object",
          "wrapper"
        ],
        "NFPDF.html#addNFPageItem": [
          "addnfpageitem",
          "check",
          "function",
          "layer",
          "newpag",
          "nfpdf",
          "nfpdf#addnfpageitem",
          "page",
          "valid"
        ],
        "NFPageItem.html": [
          "class",
          "compitem",
          "nf",
          "nfpageitem",
          "object",
          "page",
          "wrapper"
        ],
        "NFPageItem.html#getPDFNumber": [
          "function",
          "getpdfnumb",
          "nfpageitem#getpdfnumb",
          "number",
          "pdf",
          "return",
          "string"
        ],
        "NFPageItem.html#getPageNumber": [
          "function",
          "getpagenumb",
          "nfpageitem#getpagenumb",
          "number",
          "page",
          "return",
          "string"
        ],
        "NFPageItem.html#highlights": [
          "function",
          "get",
          "highlight",
          "item",
          "layer",
          "nfhighlightlayercollect",
          "nfpageitem#highlight"
        ],
        "NFPaperLayerGroup.html": [
          "class",
          "group",
          "layer",
          "manag",
          "manipul",
          "nfpaperlayergroup",
          "object",
          "part",
          "pdf",
          "same"
        ],
        "NFPaperLayerGroup.html#getChildren": [
          "function",
          "get",
          "getchildren",
          "group",
          "nflayer",
          "nflayercollect",
          "nfpaperlayergroup#getchildren"
        ],
        "NFPaperLayerGroup.html#getPages": [
          "function",
          "get",
          "getpag",
          "group",
          "nfpagelay",
          "nfpagelayercollect",
          "nfpaperlayergroup#getpag"
        ],
        "NFPaperLayerGroup.html#gatherLayers": [
          "abov",
          "below",
          "bottom",
          "bottommost",
          "function",
          "gatherlay",
          "given",
          "go",
          "group",
          "immedi",
          "indic",
          "layer",
          "layerstogath",
          "move",
          "nfpaperlayergroup",
          "nfpaperlayergroup#gatherlay",
          "parent",
          "shouldpar"
        ],
        "NFPageLayer.html": [
          "class",
          "layer",
          "nflayer",
          "nfpagelay",
          "page",
          "subclass"
        ],
        "NFPageLayer.html#getPaperParentLayer": [
          "confus",
          "connect",
          "function",
          "getpaperparentlay",
          "layer",
          "nfpagelayer#findpaperparentlay",
          "nfpagelayer#getpaperparentlay",
          "nfpaperparentlayer|nul",
          "non",
          "on",
          "paper",
          "parent",
          "return"
        ],
        "NFPageLayer.html#findPaperParentLayer": [
          "confus",
          "connect",
          "exist",
          "findpaperparentlay",
          "function",
          "layer",
          "nfpagelayer#findpaperparentlay",
          "nfpagelayer#getpaperparentlay",
          "nfpaperparentlayer|nul",
          "paperparentlay",
          "regardless",
          "return",
          "whether"
        ],
        "NFPageLayer.html#isPageLayer": [
          "boolean",
          "check",
          "function",
          "ispagelay",
          "layer",
          "nfpagelayer#ispagelay",
          "page",
          "valid"
        ],
        "NFPageLayer.html#isNullLayer": [
          "boolean",
          "check",
          "function",
          "isnulllay",
          "layer",
          "nfpagelayer#isnulllay",
          "null"
        ],
        "NFPageLayer.html#isHighlightLayer": [
          "boolean",
          "check",
          "function",
          "highlight",
          "ishighlightlay",
          "layer",
          "nfpagelayer#ishighlightlay",
          "valid"
        ],
        "NFPageLayer.html#isPaperParentLayer": [
          "boolean",
          "check",
          "function",
          "ispaperparentlay",
          "layer",
          "nfpagelayer#ispaperparentlay",
          "paper",
          "parent",
          "valid"
        ],
        "NFPageLayer.html#getSpecializedLayer": [
          "content",
          "function",
          "getspecializedlay",
          "layer",
          "new",
          "nfpagelayer#getspecializedlay",
          "nfpagelayer|nfhighlightlayer|nfpaperparentlayer|nflay",
          "return",
          "special",
          "type"
        ],
        "NFPageLayer.html#index": [
          "function",
          "index",
          "int",
          "layer'",
          "nfpagelayer#index",
          "shorthand"
        ],
        "NFPageLayer.html#hasNullParent": [
          "boolean",
          "function",
          "hasnullpar",
          "layer",
          "nfpagelayer#hasnullpar",
          "null",
          "parent",
          "return",
          "true"
        ],
        "NFPageLayer.html#sameLayerAs": [
          "boolean",
          "check",
          "exampl",
          "function",
          "given",
          "layer",
          "nflayer",
          "nflayer'",
          "nfpagelay",
          "nfpagelayer#samelayera",
          "one'",
          "refer",
          "return",
          "same",
          "samelayera",
          "see",
          "true"
        ],
        "NFPageLayer.html#containingComp": [
          "contain",
          "containingcomp",
          "function",
          "nfcomp",
          "nfpagelayer#containingcomp",
          "return"
        ],
        "NFPageLayer.html#getChildren": [
          "child",
          "function",
          "getchildren",
          "layer",
          "nflayercollect",
          "nfpagelayer#getchildren",
          "return",
          "special"
        ],
        "NFPageLayer.html#getParent": [
          "function",
          "get",
          "getpar",
          "layer'",
          "nflayer",
          "nflayer|nul",
          "nfpagelayer#getpar",
          "parent"
        ],
        "NFPageLayer.html#setParent": [
          "function",
          "given",
          "layer'",
          "newpar",
          "nflayer",
          "nfpagelayer#setpar",
          "parent",
          "set",
          "setpar"
        ],
        "NFPageLayer.html#setZoomer": [
          "function",
          "layer",
          "layer'",
          "nflayer",
          "nfpagelayer#setzoom",
          "nfpartcomp",
          "parent",
          "set",
          "setzoom",
          "zoomer"
        ],
        "NFPageLayer.html#moveBefore": [
          "befor",
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "movebefor",
          "nflayer",
          "nfpagelayer#movebefor",
          "provid",
          "target",
          "targetlay"
        ],
        "NFPageLayer.html#moveAfter": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "moveaft",
          "nflayer",
          "nfpagelayer#moveaft",
          "provid",
          "target",
          "targetlay"
        ],
        "NFPageLayer.html#markers": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "marker",
          "move",
          "nfpagelayer#mark",
          "properti",
          "provid",
          "target"
        ],
        "NFPageLayer.html#addInOutMarkersForProperty": [
          "add",
          "addinoutmarkersforproperti",
          "alreadi",
          "express",
          "function",
          "given",
          "layer",
          "marker",
          "nflayer",
          "nfpagelayer#addinoutmarkersforproperti",
          "option",
          "out",
          "overrid",
          "previou",
          "property'",
          "set",
          "transit"
        ],
        "NFPageLayer.html#addSlider": [
          "addslid",
          "creat",
          "effect",
          "function",
          "layer",
          "name",
          "nfpagelayer#addslid",
          "properti",
          "return",
          "slider",
          "valu"
        ],
        "NFPageLayerCollection.html": [
          "class",
          "group",
          "layer",
          "nflayer",
          "nfpagelayercollect",
          "null",
          "page",
          "parent",
          "pdf",
          "same",
          "subclass"
        ],
        "NFPageLayerCollection.html#addNFPageLayer": [
          "add",
          "addnfpagelay",
          "collect",
          "function",
          "newlay",
          "nfpagelay",
          "nfpagelayercollect",
          "nfpagelayercollection#addnfpagelay"
        ],
        "NFPageLayerCollection.html#addAVLayer": [
          "add",
          "addavlay",
          "avlay",
          "collect",
          "function",
          "newlay",
          "nfpagelayercollect",
          "nfpagelayercollection#addavlay"
        ],
        "NFPageLayerCollection.html#highlights": [
          "collect",
          "function",
          "highlight",
          "newlay",
          "nfhighlightlayercollect",
          "nfpagelayercollection#highlight",
          "page",
          "return"
        ],
        "NFPageLayerCollection.html#fromSamePDF": [
          "boolean",
          "collect",
          "contain",
          "fromsamepdf",
          "function",
          "nfpagelayercollection#fromsamepdf",
          "page",
          "pdf",
          "return",
          "same",
          "true"
        ],
        "NFPageLayerCollection.html#initLayers": [
          "collect",
          "function",
          "initlay",
          "nfpagelayer#init",
          "nfpagelayercollect",
          "nfpagelayercollection#initlay",
          "page",
          "run"
        ],
        "NFPageLayerCollection.html#initLayerTransforms": [
          "collect",
          "function",
          "initlayertransform",
          "nfpagelayer#initlayertransform",
          "nfpagelayercollect",
          "nfpagelayercollection#initlayertransform",
          "page",
          "run"
        ],
        "NFPageLayerCollection.html#newPaperParentLayer": [
          "collect",
          "creat",
          "function",
          "new",
          "newpaperparentlay",
          "nfpagelayercollection#newpaperparentlay",
          "nfpaperparentlay"
        ],
        "NFPageLayerCollection.html#assignPaperParentLayer": [
          "assignpaperparentlay",
          "check",
          "creat",
          "exist",
          "function",
          "layer",
          "new",
          "nfpagelayercollection#assignpaperparentlay",
          "nfpaperparentlay",
          "on",
          "otherwis",
          "page",
          "paper",
          "parent",
          "set",
          "shouldmov",
          "valid"
        ],
        "NFPageLayerCollection.html#.collectionFromAVLayerArray": [
          "array",
          "avlay",
          "collectionfromavlayerarray",
          "function",
          "instanc",
          "lt;static&gt",
          "new",
          "nfpagelayercollect",
          "nfpagelayercollection.collectionfromavlayerarray",
          "return"
        ],
        "NFPageLayerCollection.html#addNFLayer": [
          "add",
          "addnflay",
          "collect",
          "function",
          "newlay",
          "nflayer",
          "nflayercollect",
          "nfpagelayercollection#addnflay"
        ],
        "NFPageLayerCollection.html#onlyContainsPageLayers": [
          "boolean",
          "collect",
          "contain",
          "function",
          "nflayer",
          "nfpagelay",
          "nfpagelayercollection#onlycontainspagelay",
          "onlycontainspagelay",
          "return",
          "true",
          "type"
        ],
        "NFPageLayerCollection.html#inSameComp": [
          "boolean",
          "collect",
          "comp",
          "function",
          "insamecomp",
          "layer",
          "nfpagelayercollection#insamecomp",
          "return",
          "same",
          "true"
        ],
        "NFPageLayerCollection.html#containingComp": [
          "comp",
          "contain",
          "containingcomp",
          "fals",
          "function",
          "insamecomp",
          "layer",
          "nfcomp|nul",
          "nfpagelayercollection#containingcomp",
          "null",
          "return"
        ],
        "NFPageLayerCollection.html#getPageLayerCollection": [
          "call",
          "collect",
          "contain",
          "function",
          "getpagelayercollect",
          "know",
          "new",
          "nfpagelay",
          "nfpagelayercollect",
          "nfpagelayercollection#getpagelayercollect",
          "return"
        ],
        "NFPageLayerCollection.html#count": [
          "access",
          "collect",
          "count",
          "function",
          "int",
          "layer",
          "nfpagelayercollection#count",
          "number",
          "shortcut"
        ],
        "NFPageLayerCollection.html#isEmpty": [
          "boolean",
          "collect",
          "empti",
          "function",
          "isempti",
          "nfpagelayercollection#isempti",
          "true"
        ],
        "NFPageLayerCollection.html#remove": [
          "collect",
          "function",
          "given",
          "layer",
          "layertoremov",
          "nflayercollect",
          "nfpagelayercollection#remov",
          "remov"
        ],
        "NFPageLayerCollection.html#getTopmostLayer": [
          "collect",
          "function",
          "get",
          "gettopmostlay",
          "nflayer",
          "nflayer|nul",
          "nfpagelayercollection#gettopmostlay",
          "topmost"
        ],
        "NFPageLayerCollection.html#getBottommostLayer": [
          "bottommost",
          "collect",
          "function",
          "get",
          "getbottommostlay",
          "nflayer",
          "nflayer|nul",
          "nfpagelayercollection#getbottommostlay"
        ],
        "NFPageLayerCollection.html#setParents": [
          "function",
          "given",
          "layer",
          "member",
          "newpar",
          "nflayer",
          "nflayercollect",
          "nfpagelayercollection#setpar",
          "null",
          "parent",
          "set",
          "setpar"
        ],
        "NFPageLayerCollection.html#nullify": [
          "abov",
          "collect",
          "creat",
          "function",
          "index",
          "layer",
          "lowest",
          "new",
          "nflayer",
          "nfpagelayercollection#nullifi",
          "null",
          "nullifi",
          "on",
          "overrid",
          "parent",
          "posit",
          "previou"
        ],
        "NFPaperParentLayer.html": [
          "class",
          "group",
          "layer",
          "nflayer",
          "nfpaperparentlay",
          "null",
          "page",
          "parent",
          "pdf",
          "same",
          "subclass"
        ],
        "NFPaperParentLayer.html#setName": [
          "correct",
          "function",
          "layer",
          "name",
          "nfpaperparentlay",
          "nfpaperparentlayer#setnam",
          "paper",
          "parent",
          "set",
          "setnam"
        ],
        "NFPaperParentLayer.html#.isPaperParentLayer": [
          "av",
          "boolean",
          "class",
          "function",
          "ispaperparentlay",
          "layer",
          "lt;static&gt",
          "method",
          "nfpaperparentlayer.ispaperparentlay",
          "paper",
          "parent",
          "see",
          "test"
        ],
        "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": [
          "class",
          "function",
          "getpaperparentnameforpagelay",
          "given",
          "layer",
          "lt;static&gt",
          "method",
          "name",
          "nfpaperparentlayer.getpaperparentnameforpagelay",
          "pagelay",
          "paper",
          "parent",
          "return",
          "string"
        ],
        "NFPaperParentLayer.html#isPageLayer": [
          "boolean",
          "check",
          "function",
          "ispagelay",
          "layer",
          "nfpaperparentlayer#ispagelay",
          "page",
          "valid"
        ],
        "NFPaperParentLayer.html#isNullLayer": [
          "boolean",
          "check",
          "function",
          "isnulllay",
          "layer",
          "nfpaperparentlayer#isnulllay",
          "null"
        ],
        "NFPaperParentLayer.html#isHighlightLayer": [
          "boolean",
          "check",
          "function",
          "highlight",
          "ishighlightlay",
          "layer",
          "nfpaperparentlayer#ishighlightlay",
          "valid"
        ],
        "NFPaperParentLayer.html#isPaperParentLayer": [
          "boolean",
          "check",
          "function",
          "ispaperparentlay",
          "layer",
          "nfpaperparentlayer#ispaperparentlay",
          "paper",
          "parent",
          "valid"
        ],
        "NFPaperParentLayer.html#getSpecializedLayer": [
          "content",
          "function",
          "getspecializedlay",
          "layer",
          "new",
          "nfpagelayer|nfhighlightlayer|nfpaperparentlayer|nflay",
          "nfpaperparentlayer#getspecializedlay",
          "return",
          "special",
          "type"
        ],
        "NFPaperParentLayer.html#index": [
          "function",
          "index",
          "int",
          "layer'",
          "nfpaperparentlayer#index",
          "shorthand"
        ],
        "NFPaperParentLayer.html#hasNullParent": [
          "boolean",
          "function",
          "hasnullpar",
          "layer",
          "nfpaperparentlayer#hasnullpar",
          "null",
          "parent",
          "return",
          "true"
        ],
        "NFPaperParentLayer.html#sameLayerAs": [
          "boolean",
          "check",
          "exampl",
          "function",
          "given",
          "layer",
          "nflayer",
          "nflayer'",
          "nfpagelay",
          "nfpaperparentlayer#samelayera",
          "one'",
          "refer",
          "return",
          "same",
          "samelayera",
          "see",
          "true"
        ],
        "NFPaperParentLayer.html#containingComp": [
          "contain",
          "containingcomp",
          "function",
          "nfcomp",
          "nfpaperparentlayer#containingcomp",
          "return"
        ],
        "NFPaperParentLayer.html#getChildren": [
          "child",
          "function",
          "getchildren",
          "layer",
          "nflayercollect",
          "nfpaperparentlayer#getchildren",
          "return",
          "special"
        ],
        "NFPaperParentLayer.html#getParent": [
          "function",
          "get",
          "getpar",
          "layer'",
          "nflayer",
          "nflayer|nul",
          "nfpaperparentlayer#getpar",
          "parent"
        ],
        "NFPaperParentLayer.html#setParent": [
          "function",
          "given",
          "layer'",
          "newpar",
          "nflayer",
          "nfpaperparentlayer#setpar",
          "parent",
          "set",
          "setpar"
        ],
        "NFPaperParentLayer.html#setZoomer": [
          "function",
          "layer",
          "layer'",
          "nflayer",
          "nfpaperparentlayer#setzoom",
          "nfpartcomp",
          "parent",
          "set",
          "setzoom",
          "zoomer"
        ],
        "NFPaperParentLayer.html#moveBefore": [
          "befor",
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "movebefor",
          "nflayer",
          "nfpaperparentlayer#movebefor",
          "provid",
          "target",
          "targetlay"
        ],
        "NFPaperParentLayer.html#moveAfter": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "move",
          "moveaft",
          "nflayer",
          "nfpaperparentlayer#moveaft",
          "provid",
          "target",
          "targetlay"
        ],
        "NFPaperParentLayer.html#markers": [
          "function",
          "immedi",
          "index",
          "layer",
          "layer'",
          "marker",
          "move",
          "nfpaperparentlayer#mark",
          "properti",
          "provid",
          "target"
        ],
        "NFPaperParentLayer.html#addInOutMarkersForProperty": [
          "add",
          "addinoutmarkersforproperti",
          "alreadi",
          "express",
          "function",
          "given",
          "layer",
          "marker",
          "nflayer",
          "nfpaperparentlayer#addinoutmarkersforproperti",
          "option",
          "out",
          "overrid",
          "previou",
          "property'",
          "set",
          "transit"
        ],
        "NFPaperParentLayer.html#addSlider": [
          "addslid",
          "creat",
          "effect",
          "function",
          "layer",
          "name",
          "nfpaperparentlayer#addslid",
          "properti",
          "return",
          "slider",
          "valu"
        ],
        "NFPartComp.html": [
          "access",
          "allow",
          "class",
          "comp",
          "compitem",
          "layer",
          "manipl",
          "nf",
          "nfpartcomp",
          "object",
          "part",
          "us",
          "wrapper"
        ],
        "NFPartComp.html#getInfo": [
          "function",
          "getinfo",
          "nfpartcomp#getinfo",
          "object",
          "represent",
          "return",
          "string"
        ],
        "NFPartComp.html#selectedLayers": [
          "comp",
          "function",
          "get",
          "layer",
          "nflayercollect",
          "nfpartcomp#selectedlay",
          "select",
          "selectedlay"
        ],
        "NFPartComp.html#selectedPageLayers": [
          "comp",
          "function",
          "get",
          "nfpagelayercollect",
          "nfpartcomp#selectedpagelay",
          "page",
          "select",
          "selectedpagelay"
        ],
        "NFPartComp.html#layerWithName": [
          "comp",
          "found",
          "function",
          "given",
          "layer",
          "layerwithnam",
          "name",
          "nflayer",
          "nflayer|nul",
          "nfpartcomp#layerwithnam",
          "none",
          "null",
          "return"
        ],
        "NFPartComp.html#getZoomer": [
          "function",
          "get",
          "getzoom",
          "layer",
          "nflayer|nul",
          "nfpartcomp#getzoom",
          "zoomer"
        ],
        "NFPartComp.html#addNull": [
          "addnul",
          "comp",
          "creat",
          "function",
          "layer",
          "new",
          "nflayer",
          "nfpartcomp#addnul",
          "null",
          "return"
        ],
        "LayerCollection.html": [
          "class",
          "effect",
          "layercollect",
          "namespac"
        ],
        "LayerCollection.html#.toArr": [
          "array",
          "collect",
          "easier",
          "function",
          "layer",
          "layercollection.toarr",
          "lt;static&gt",
          "manipul",
          "return",
          "toarr"
        ],
        "Layer.html": [
          "class",
          "effect",
          "layer",
          "namespac"
        ],
        "Layer.html#.indexOfMarker": [
          "comment",
          "function",
          "given",
          "index",
          "indexofmark",
          "int|nul",
          "layer.indexofmark",
          "lt;static&gt",
          "marker",
          "return"
        ],
        "Layer.html#.removeMarker": [
          "comment",
          "function",
          "given",
          "layer",
          "layer.removemark",
          "lt;static&gt",
          "marker",
          "remov",
          "removemark"
        ],
        "Property.html": [
          "class",
          "effect",
          "layer",
          "namespac",
          "properti"
        ],
        "Property.html#.expressionStringForValue": [
          "comment",
          "expressionstringforvalu",
          "function",
          "given",
          "index",
          "lt;static&gt",
          "marker",
          "property.expressionstringforvalu",
          "return",
          "string"
        ]
      },
      "length": 136
    },
    "tokenStore": {
      "root": {
        "docs": {},
        "b": {
          "docs": {},
          "a": {
            "docs": {},
            "s": {
              "docs": {},
              "e": {
                "docs": {
                  "index.html": {
                    "ref": "index.html",
                    "tf": 14
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "o": {
              "docs": {},
              "t": {
                "docs": {},
                "s": {
                  "docs": {},
                  "t": {
                    "docs": {},
                    "r": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "p": {
                          "docs": {
                            "index.html": {
                              "ref": "index.html",
                              "tf": 14
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "l": {
                "docs": {},
                "e": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "n": {
                      "docs": {
                        "NFLayer.html#isPageLayer": {
                          "ref": "NFLayer.html#isPageLayer",
                          "tf": 50
                        },
                        "NFLayer.html#isNullLayer": {
                          "ref": "NFLayer.html#isNullLayer",
                          "tf": 50
                        },
                        "NFLayer.html#isHighlightLayer": {
                          "ref": "NFLayer.html#isHighlightLayer",
                          "tf": 50
                        },
                        "NFLayer.html#isPaperParentLayer": {
                          "ref": "NFLayer.html#isPaperParentLayer",
                          "tf": 50
                        },
                        "NFLayer.html#hasNullParent": {
                          "ref": "NFLayer.html#hasNullParent",
                          "tf": 50
                        },
                        "NFLayer.html#sameLayerAs": {
                          "ref": "NFLayer.html#sameLayerAs",
                          "tf": 50
                        },
                        "NFLayer.html#.isCompLayer": {
                          "ref": "NFLayer.html#.isCompLayer",
                          "tf": 25
                        },
                        "NFLayer.html#.isAVLayer": {
                          "ref": "NFLayer.html#.isAVLayer",
                          "tf": 25
                        },
                        "NFLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                          "tf": 50
                        },
                        "NFLayerCollection.html#inSameComp": {
                          "ref": "NFLayerCollection.html#inSameComp",
                          "tf": 50
                        },
                        "NFLayerCollection.html#isEmpty": {
                          "ref": "NFLayerCollection.html#isEmpty",
                          "tf": 50
                        },
                        "NFPageLayer.html#isPageLayer": {
                          "ref": "NFPageLayer.html#isPageLayer",
                          "tf": 50
                        },
                        "NFPageLayer.html#isNullLayer": {
                          "ref": "NFPageLayer.html#isNullLayer",
                          "tf": 50
                        },
                        "NFPageLayer.html#isHighlightLayer": {
                          "ref": "NFPageLayer.html#isHighlightLayer",
                          "tf": 50
                        },
                        "NFPageLayer.html#isPaperParentLayer": {
                          "ref": "NFPageLayer.html#isPaperParentLayer",
                          "tf": 50
                        },
                        "NFPageLayer.html#hasNullParent": {
                          "ref": "NFPageLayer.html#hasNullParent",
                          "tf": 50
                        },
                        "NFPageLayer.html#sameLayerAs": {
                          "ref": "NFPageLayer.html#sameLayerAs",
                          "tf": 50
                        },
                        "NFPageLayerCollection.html#fromSamePDF": {
                          "ref": "NFPageLayerCollection.html#fromSamePDF",
                          "tf": 50
                        },
                        "NFPageLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                          "tf": 50
                        },
                        "NFPageLayerCollection.html#inSameComp": {
                          "ref": "NFPageLayerCollection.html#inSameComp",
                          "tf": 50
                        },
                        "NFPageLayerCollection.html#isEmpty": {
                          "ref": "NFPageLayerCollection.html#isEmpty",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#.isPaperParentLayer": {
                          "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                          "tf": 25
                        },
                        "NFPaperParentLayer.html#isPageLayer": {
                          "ref": "NFPaperParentLayer.html#isPageLayer",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#isNullLayer": {
                          "ref": "NFPaperParentLayer.html#isNullLayer",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#isHighlightLayer": {
                          "ref": "NFPaperParentLayer.html#isHighlightLayer",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#isPaperParentLayer": {
                          "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#hasNullParent": {
                          "ref": "NFPaperParentLayer.html#hasNullParent",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#sameLayerAs": {
                          "ref": "NFPaperParentLayer.html#sameLayerAs",
                          "tf": 50
                        }
                      }
                    }
                  }
                }
              }
            },
            "t": {
              "docs": {},
              "t": {
                "docs": {},
                "o": {
                  "docs": {},
                  "m": {
                    "docs": {
                      "NFPaperLayerGroup.html#gatherLayers": {
                        "ref": "NFPaperLayerGroup.html#gatherLayers",
                        "tf": 2.631578947368421
                      }
                    },
                    "m": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "s": {
                          "docs": {},
                          "t": {
                            "docs": {
                              "NFLayerCollection.html#getBottommostLayer": {
                                "ref": "NFLayerCollection.html#getBottommostLayer",
                                "tf": 12.5
                              },
                              "NFPaperLayerGroup.html#gatherLayers": {
                                "ref": "NFPaperLayerGroup.html#gatherLayers",
                                "tf": 2.631578947368421
                              },
                              "NFPageLayerCollection.html#getBottommostLayer": {
                                "ref": "NFPageLayerCollection.html#getBottommostLayer",
                                "tf": 12.5
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "e": {
            "docs": {},
            "f": {
              "docs": {},
              "o": {
                "docs": {},
                "r": {
                  "docs": {
                    "NFLayer.html#moveBefore": {
                      "ref": "NFLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPageLayer.html#moveBefore": {
                      "ref": "NFPageLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPaperParentLayer.html#moveBefore": {
                      "ref": "NFPaperParentLayer.html#moveBefore",
                      "tf": 6.25
                    }
                  }
                }
              }
            },
            "l": {
              "docs": {},
              "o": {
                "docs": {},
                "w": {
                  "docs": {
                    "NFPaperLayerGroup.html#gatherLayers": {
                      "ref": "NFPaperLayerGroup.html#gatherLayers",
                      "tf": 5.263157894736842
                    }
                  }
                }
              }
            }
          }
        },
        "f": {
          "docs": {},
          "o": {
            "docs": {},
            "o": {
              "docs": {},
              "d": {
                "docs": {},
                "o": {
                  "docs": {},
                  "c": {
                    "docs": {
                      "index.html": {
                        "ref": "index.html",
                        "tf": 600
                      }
                    }
                  }
                }
              }
            },
            "u": {
              "docs": {},
              "n": {
                "docs": {},
                "d": {
                  "docs": {
                    "NFComp.html#layerWithName": {
                      "ref": "NFComp.html#layerWithName",
                      "tf": 5.555555555555555
                    },
                    "NFPartComp.html#layerWithName": {
                      "ref": "NFPartComp.html#layerWithName",
                      "tf": 5.555555555555555
                    }
                  }
                }
              }
            }
          },
          "u": {
            "docs": {},
            "n": {
              "docs": {},
              "c": {
                "docs": {},
                "t": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "o": {
                      "docs": {},
                      "n": {
                        "docs": {
                          "NFComp.html#selectedLayers": {
                            "ref": "NFComp.html#selectedLayers",
                            "tf": 110
                          },
                          "NFComp.html#selectedPageLayers": {
                            "ref": "NFComp.html#selectedPageLayers",
                            "tf": 110
                          },
                          "NFComp.html#layerWithName": {
                            "ref": "NFComp.html#layerWithName",
                            "tf": 110
                          },
                          "NFComp.html#getZoomer": {
                            "ref": "NFComp.html#getZoomer",
                            "tf": 110
                          },
                          "NFComp.html#addNull": {
                            "ref": "NFComp.html#addNull",
                            "tf": 110
                          },
                          "NFComp.html#getInfo": {
                            "ref": "NFComp.html#getInfo",
                            "tf": 110
                          },
                          "NFLayer.html#isPageLayer": {
                            "ref": "NFLayer.html#isPageLayer",
                            "tf": 110
                          },
                          "NFLayer.html#isNullLayer": {
                            "ref": "NFLayer.html#isNullLayer",
                            "tf": 110
                          },
                          "NFLayer.html#isHighlightLayer": {
                            "ref": "NFLayer.html#isHighlightLayer",
                            "tf": 110
                          },
                          "NFLayer.html#isPaperParentLayer": {
                            "ref": "NFLayer.html#isPaperParentLayer",
                            "tf": 110
                          },
                          "NFLayer.html#getSpecializedLayer": {
                            "ref": "NFLayer.html#getSpecializedLayer",
                            "tf": 110
                          },
                          "NFLayer.html#index": {
                            "ref": "NFLayer.html#index",
                            "tf": 110
                          },
                          "NFLayer.html#hasNullParent": {
                            "ref": "NFLayer.html#hasNullParent",
                            "tf": 110
                          },
                          "NFLayer.html#sameLayerAs": {
                            "ref": "NFLayer.html#sameLayerAs",
                            "tf": 110
                          },
                          "NFLayer.html#containingComp": {
                            "ref": "NFLayer.html#containingComp",
                            "tf": 110
                          },
                          "NFLayer.html#getChildren": {
                            "ref": "NFLayer.html#getChildren",
                            "tf": 110
                          },
                          "NFLayer.html#getParent": {
                            "ref": "NFLayer.html#getParent",
                            "tf": 110
                          },
                          "NFLayer.html#setParent": {
                            "ref": "NFLayer.html#setParent",
                            "tf": 110
                          },
                          "NFLayer.html#setZoomer": {
                            "ref": "NFLayer.html#setZoomer",
                            "tf": 110
                          },
                          "NFLayer.html#moveBefore": {
                            "ref": "NFLayer.html#moveBefore",
                            "tf": 110
                          },
                          "NFLayer.html#moveAfter": {
                            "ref": "NFLayer.html#moveAfter",
                            "tf": 110
                          },
                          "NFLayer.html#markers": {
                            "ref": "NFLayer.html#markers",
                            "tf": 110
                          },
                          "NFLayer.html#addInOutMarkersForProperty": {
                            "ref": "NFLayer.html#addInOutMarkersForProperty",
                            "tf": 110
                          },
                          "NFLayer.html#addSlider": {
                            "ref": "NFLayer.html#addSlider",
                            "tf": 110
                          },
                          "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                            "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                            "tf": 110
                          },
                          "NFLayer.html#.isCompLayer": {
                            "ref": "NFLayer.html#.isCompLayer",
                            "tf": 110
                          },
                          "NFLayer.html#.isAVLayer": {
                            "ref": "NFLayer.html#.isAVLayer",
                            "tf": 110
                          },
                          "NFLayerCollection.html#addNFLayer": {
                            "ref": "NFLayerCollection.html#addNFLayer",
                            "tf": 110
                          },
                          "NFLayerCollection.html#onlyContainsPageLayers": {
                            "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                            "tf": 110
                          },
                          "NFLayerCollection.html#inSameComp": {
                            "ref": "NFLayerCollection.html#inSameComp",
                            "tf": 110
                          },
                          "NFLayerCollection.html#containingComp": {
                            "ref": "NFLayerCollection.html#containingComp",
                            "tf": 110
                          },
                          "NFLayerCollection.html#getPageLayerCollection": {
                            "ref": "NFLayerCollection.html#getPageLayerCollection",
                            "tf": 110
                          },
                          "NFLayerCollection.html#count": {
                            "ref": "NFLayerCollection.html#count",
                            "tf": 110
                          },
                          "NFLayerCollection.html#isEmpty": {
                            "ref": "NFLayerCollection.html#isEmpty",
                            "tf": 110
                          },
                          "NFLayerCollection.html#remove": {
                            "ref": "NFLayerCollection.html#remove",
                            "tf": 110
                          },
                          "NFLayerCollection.html#getTopmostLayer": {
                            "ref": "NFLayerCollection.html#getTopmostLayer",
                            "tf": 110
                          },
                          "NFLayerCollection.html#getBottommostLayer": {
                            "ref": "NFLayerCollection.html#getBottommostLayer",
                            "tf": 110
                          },
                          "NFLayerCollection.html#setParents": {
                            "ref": "NFLayerCollection.html#setParents",
                            "tf": 110
                          },
                          "NFLayerCollection.html#nullify": {
                            "ref": "NFLayerCollection.html#nullify",
                            "tf": 110
                          },
                          "NFLayerCollection.html#.collectionFromAVLayerArray": {
                            "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                            "tf": 110
                          },
                          "NFPDF.html#addNFPageItem": {
                            "ref": "NFPDF.html#addNFPageItem",
                            "tf": 110
                          },
                          "NFPageItem.html#getPDFNumber": {
                            "ref": "NFPageItem.html#getPDFNumber",
                            "tf": 110
                          },
                          "NFPageItem.html#getPageNumber": {
                            "ref": "NFPageItem.html#getPageNumber",
                            "tf": 110
                          },
                          "NFPageItem.html#highlights": {
                            "ref": "NFPageItem.html#highlights",
                            "tf": 110
                          },
                          "NFPaperLayerGroup.html#getChildren": {
                            "ref": "NFPaperLayerGroup.html#getChildren",
                            "tf": 110
                          },
                          "NFPaperLayerGroup.html#getPages": {
                            "ref": "NFPaperLayerGroup.html#getPages",
                            "tf": 110
                          },
                          "NFPaperLayerGroup.html#gatherLayers": {
                            "ref": "NFPaperLayerGroup.html#gatherLayers",
                            "tf": 110
                          },
                          "NFPageLayer.html#getPaperParentLayer": {
                            "ref": "NFPageLayer.html#getPaperParentLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#findPaperParentLayer": {
                            "ref": "NFPageLayer.html#findPaperParentLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#isPageLayer": {
                            "ref": "NFPageLayer.html#isPageLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#isNullLayer": {
                            "ref": "NFPageLayer.html#isNullLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#isHighlightLayer": {
                            "ref": "NFPageLayer.html#isHighlightLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#isPaperParentLayer": {
                            "ref": "NFPageLayer.html#isPaperParentLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#getSpecializedLayer": {
                            "ref": "NFPageLayer.html#getSpecializedLayer",
                            "tf": 110
                          },
                          "NFPageLayer.html#index": {
                            "ref": "NFPageLayer.html#index",
                            "tf": 110
                          },
                          "NFPageLayer.html#hasNullParent": {
                            "ref": "NFPageLayer.html#hasNullParent",
                            "tf": 110
                          },
                          "NFPageLayer.html#sameLayerAs": {
                            "ref": "NFPageLayer.html#sameLayerAs",
                            "tf": 110
                          },
                          "NFPageLayer.html#containingComp": {
                            "ref": "NFPageLayer.html#containingComp",
                            "tf": 110
                          },
                          "NFPageLayer.html#getChildren": {
                            "ref": "NFPageLayer.html#getChildren",
                            "tf": 110
                          },
                          "NFPageLayer.html#getParent": {
                            "ref": "NFPageLayer.html#getParent",
                            "tf": 110
                          },
                          "NFPageLayer.html#setParent": {
                            "ref": "NFPageLayer.html#setParent",
                            "tf": 110
                          },
                          "NFPageLayer.html#setZoomer": {
                            "ref": "NFPageLayer.html#setZoomer",
                            "tf": 110
                          },
                          "NFPageLayer.html#moveBefore": {
                            "ref": "NFPageLayer.html#moveBefore",
                            "tf": 110
                          },
                          "NFPageLayer.html#moveAfter": {
                            "ref": "NFPageLayer.html#moveAfter",
                            "tf": 110
                          },
                          "NFPageLayer.html#markers": {
                            "ref": "NFPageLayer.html#markers",
                            "tf": 110
                          },
                          "NFPageLayer.html#addInOutMarkersForProperty": {
                            "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                            "tf": 110
                          },
                          "NFPageLayer.html#addSlider": {
                            "ref": "NFPageLayer.html#addSlider",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#addNFPageLayer": {
                            "ref": "NFPageLayerCollection.html#addNFPageLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#addAVLayer": {
                            "ref": "NFPageLayerCollection.html#addAVLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#highlights": {
                            "ref": "NFPageLayerCollection.html#highlights",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#fromSamePDF": {
                            "ref": "NFPageLayerCollection.html#fromSamePDF",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#initLayers": {
                            "ref": "NFPageLayerCollection.html#initLayers",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#initLayerTransforms": {
                            "ref": "NFPageLayerCollection.html#initLayerTransforms",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#newPaperParentLayer": {
                            "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#assignPaperParentLayer": {
                            "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                            "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#addNFLayer": {
                            "ref": "NFPageLayerCollection.html#addNFLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#onlyContainsPageLayers": {
                            "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#inSameComp": {
                            "ref": "NFPageLayerCollection.html#inSameComp",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#containingComp": {
                            "ref": "NFPageLayerCollection.html#containingComp",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#getPageLayerCollection": {
                            "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#count": {
                            "ref": "NFPageLayerCollection.html#count",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#isEmpty": {
                            "ref": "NFPageLayerCollection.html#isEmpty",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#remove": {
                            "ref": "NFPageLayerCollection.html#remove",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#getTopmostLayer": {
                            "ref": "NFPageLayerCollection.html#getTopmostLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#getBottommostLayer": {
                            "ref": "NFPageLayerCollection.html#getBottommostLayer",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#setParents": {
                            "ref": "NFPageLayerCollection.html#setParents",
                            "tf": 110
                          },
                          "NFPageLayerCollection.html#nullify": {
                            "ref": "NFPageLayerCollection.html#nullify",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#setName": {
                            "ref": "NFPaperParentLayer.html#setName",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#.isPaperParentLayer": {
                            "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                            "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#isPageLayer": {
                            "ref": "NFPaperParentLayer.html#isPageLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#isNullLayer": {
                            "ref": "NFPaperParentLayer.html#isNullLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#isHighlightLayer": {
                            "ref": "NFPaperParentLayer.html#isHighlightLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#isPaperParentLayer": {
                            "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#getSpecializedLayer": {
                            "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#index": {
                            "ref": "NFPaperParentLayer.html#index",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#hasNullParent": {
                            "ref": "NFPaperParentLayer.html#hasNullParent",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#sameLayerAs": {
                            "ref": "NFPaperParentLayer.html#sameLayerAs",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#containingComp": {
                            "ref": "NFPaperParentLayer.html#containingComp",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#getChildren": {
                            "ref": "NFPaperParentLayer.html#getChildren",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#getParent": {
                            "ref": "NFPaperParentLayer.html#getParent",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#setParent": {
                            "ref": "NFPaperParentLayer.html#setParent",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#setZoomer": {
                            "ref": "NFPaperParentLayer.html#setZoomer",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#moveBefore": {
                            "ref": "NFPaperParentLayer.html#moveBefore",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#moveAfter": {
                            "ref": "NFPaperParentLayer.html#moveAfter",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#markers": {
                            "ref": "NFPaperParentLayer.html#markers",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                            "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                            "tf": 110
                          },
                          "NFPaperParentLayer.html#addSlider": {
                            "ref": "NFPaperParentLayer.html#addSlider",
                            "tf": 110
                          },
                          "NFPartComp.html#getInfo": {
                            "ref": "NFPartComp.html#getInfo",
                            "tf": 110
                          },
                          "NFPartComp.html#selectedLayers": {
                            "ref": "NFPartComp.html#selectedLayers",
                            "tf": 110
                          },
                          "NFPartComp.html#selectedPageLayers": {
                            "ref": "NFPartComp.html#selectedPageLayers",
                            "tf": 110
                          },
                          "NFPartComp.html#layerWithName": {
                            "ref": "NFPartComp.html#layerWithName",
                            "tf": 110
                          },
                          "NFPartComp.html#getZoomer": {
                            "ref": "NFPartComp.html#getZoomer",
                            "tf": 110
                          },
                          "NFPartComp.html#addNull": {
                            "ref": "NFPartComp.html#addNull",
                            "tf": 110
                          },
                          "LayerCollection.html#.toArr": {
                            "ref": "LayerCollection.html#.toArr",
                            "tf": 110
                          },
                          "Layer.html#.indexOfMarker": {
                            "ref": "Layer.html#.indexOfMarker",
                            "tf": 110
                          },
                          "Layer.html#.removeMarker": {
                            "ref": "Layer.html#.removeMarker",
                            "tf": 110
                          },
                          "Property.html#.expressionStringForValue": {
                            "ref": "Property.html#.expressionStringForValue",
                            "tf": 110
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "l": {
              "docs": {},
              "s": {
                "docs": {
                  "NFLayerCollection.html#containingComp": {
                    "ref": "NFLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#containingComp": {
                    "ref": "NFPageLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  }
                }
              }
            }
          },
          "i": {
            "docs": {},
            "n": {
              "docs": {},
              "d": {
                "docs": {},
                "p": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "p": {
                      "docs": {},
                      "e": {
                        "docs": {},
                        "r": {
                          "docs": {},
                          "p": {
                            "docs": {},
                            "a": {
                              "docs": {},
                              "r": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "n": {
                                    "docs": {},
                                    "t": {
                                      "docs": {},
                                      "l": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "y": {
                                            "docs": {
                                              "NFPageLayer.html#findPaperParentLayer": {
                                                "ref": "NFPageLayer.html#findPaperParentLayer",
                                                "tf": 700
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "o": {
              "docs": {},
              "m": {
                "docs": {},
                "s": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "m": {
                      "docs": {},
                      "e": {
                        "docs": {},
                        "p": {
                          "docs": {},
                          "d": {
                            "docs": {},
                            "f": {
                              "docs": {
                                "NFPageLayerCollection.html#fromSamePDF": {
                                  "ref": "NFPageLayerCollection.html#fromSamePDF",
                                  "tf": 700
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "h": {
          "docs": {},
          "a": {
            "docs": {},
            "n": {
              "docs": {},
              "d": {
                "docs": {},
                "l": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "b": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "r": {
                          "docs": {
                            "index.html": {
                              "ref": "index.html",
                              "tf": 14
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "s": {
              "docs": {},
              "n": {
                "docs": {},
                "u": {
                  "docs": {},
                  "l": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "p": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "r": {
                            "docs": {
                              "NFLayer.html#hasNullParent": {
                                "ref": "NFLayer.html#hasNullParent",
                                "tf": 700
                              },
                              "NFPageLayer.html#hasNullParent": {
                                "ref": "NFPageLayer.html#hasNullParent",
                                "tf": 700
                              },
                              "NFPaperParentLayer.html#hasNullParent": {
                                "ref": "NFPaperParentLayer.html#hasNullParent",
                                "tf": 700
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "i": {
            "docs": {},
            "g": {
              "docs": {},
              "h": {
                "docs": {},
                "l": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "g": {
                      "docs": {},
                      "h": {
                        "docs": {},
                        "t": {
                          "docs": {
                            "NFLayer.html#isHighlightLayer": {
                              "ref": "NFLayer.html#isHighlightLayer",
                              "tf": 10
                            },
                            "NFPageItem.html#highlights": {
                              "ref": "NFPageItem.html#highlights",
                              "tf": 712.5
                            },
                            "NFPageLayer.html#isHighlightLayer": {
                              "ref": "NFPageLayer.html#isHighlightLayer",
                              "tf": 10
                            },
                            "NFPageLayerCollection.html#highlights": {
                              "ref": "NFPageLayerCollection.html#highlights",
                              "tf": 693.3333333333334
                            },
                            "NFPaperParentLayer.html#isHighlightLayer": {
                              "ref": "NFPaperParentLayer.html#isHighlightLayer",
                              "tf": 10
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "i": {
          "docs": {},
          "n": {
            "docs": {},
            "d": {
              "docs": {},
              "e": {
                "docs": {},
                "x": {
                  "docs": {
                    "index.html": {
                      "ref": "index.html",
                      "tf": 1300
                    },
                    "NFLayer.html#index": {
                      "ref": "NFLayer.html#index",
                      "tf": 716.6666666666666
                    },
                    "NFLayer.html#moveBefore": {
                      "ref": "NFLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFLayer.html#moveAfter": {
                      "ref": "NFLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFLayer.html#markers": {
                      "ref": "NFLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "NFLayerCollection.html#nullify": {
                      "ref": "NFLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayer.html#index": {
                      "ref": "NFPageLayer.html#index",
                      "tf": 716.6666666666666
                    },
                    "NFPageLayer.html#moveBefore": {
                      "ref": "NFPageLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPageLayer.html#moveAfter": {
                      "ref": "NFPageLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayer.html#markers": {
                      "ref": "NFPageLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayerCollection.html#nullify": {
                      "ref": "NFPageLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#index": {
                      "ref": "NFPaperParentLayer.html#index",
                      "tf": 716.6666666666666
                    },
                    "NFPaperParentLayer.html#moveBefore": {
                      "ref": "NFPaperParentLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPaperParentLayer.html#moveAfter": {
                      "ref": "NFPaperParentLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#markers": {
                      "ref": "NFPaperParentLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "Layer.html#.indexOfMarker": {
                      "ref": "Layer.html#.indexOfMarker",
                      "tf": 10
                    },
                    "Property.html#.expressionStringForValue": {
                      "ref": "Property.html#.expressionStringForValue",
                      "tf": 10
                    }
                  },
                  "o": {
                    "docs": {},
                    "f": {
                      "docs": {},
                      "m": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "r": {
                            "docs": {},
                            "k": {
                              "docs": {
                                "Layer.html#.indexOfMarker": {
                                  "ref": "Layer.html#.indexOfMarker",
                                  "tf": 675
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "i": {
                "docs": {},
                "c": {
                  "docs": {
                    "NFPaperLayerGroup.html#gatherLayers": {
                      "ref": "NFPaperLayerGroup.html#gatherLayers",
                      "tf": 2.631578947368421
                    }
                  }
                }
              }
            },
            "t": {
              "docs": {
                "NFLayer.html#index": {
                  "ref": "NFLayer.html#index",
                  "tf": 50
                },
                "NFLayerCollection.html#count": {
                  "ref": "NFLayerCollection.html#count",
                  "tf": 50
                },
                "NFPageLayer.html#index": {
                  "ref": "NFPageLayer.html#index",
                  "tf": 50
                },
                "NFPageLayerCollection.html#count": {
                  "ref": "NFPageLayerCollection.html#count",
                  "tf": 50
                },
                "NFPaperParentLayer.html#index": {
                  "ref": "NFPaperParentLayer.html#index",
                  "tf": 50
                }
              },
              "|": {
                "docs": {},
                "n": {
                  "docs": {},
                  "u": {
                    "docs": {},
                    "l": {
                      "docs": {
                        "Layer.html#.indexOfMarker": {
                          "ref": "Layer.html#.indexOfMarker",
                          "tf": 25
                        }
                      }
                    }
                  }
                }
              }
            },
            "s": {
              "docs": {},
              "t": {
                "docs": {},
                "a": {
                  "docs": {},
                  "n": {
                    "docs": {},
                    "c": {
                      "docs": {
                        "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                          "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                          "tf": 10
                        }
                      },
                      "e": {
                        "docs": {},
                        "o": {
                          "docs": {},
                          "f": {
                            "docs": {
                              "NFLayer.html#.isAVLayer": {
                                "ref": "NFLayer.html#.isAVLayer",
                                "tf": 3.8461538461538463
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "a": {
                "docs": {},
                "m": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "c": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "p": {
                            "docs": {
                              "NFLayerCollection.html#inSameComp": {
                                "ref": "NFLayerCollection.html#inSameComp",
                                "tf": 700
                              },
                              "NFLayerCollection.html#containingComp": {
                                "ref": "NFLayerCollection.html#containingComp",
                                "tf": 7.142857142857142
                              },
                              "NFPageLayerCollection.html#inSameComp": {
                                "ref": "NFPageLayerCollection.html#inSameComp",
                                "tf": 700
                              },
                              "NFPageLayerCollection.html#containingComp": {
                                "ref": "NFPageLayerCollection.html#containingComp",
                                "tf": 7.142857142857142
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "i": {
              "docs": {},
              "t": {
                "docs": {},
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "y": {
                      "docs": {
                        "NFPageLayerCollection.html#initLayers": {
                          "ref": "NFPageLayerCollection.html#initLayers",
                          "tf": 700
                        }
                      },
                      "e": {
                        "docs": {},
                        "r": {
                          "docs": {},
                          "t": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "a": {
                                "docs": {},
                                "n": {
                                  "docs": {},
                                  "s": {
                                    "docs": {},
                                    "f": {
                                      "docs": {},
                                      "o": {
                                        "docs": {},
                                        "r": {
                                          "docs": {},
                                          "m": {
                                            "docs": {
                                              "NFPageLayerCollection.html#initLayerTransforms": {
                                                "ref": "NFPageLayerCollection.html#initLayerTransforms",
                                                "tf": 700
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "s": {
            "docs": {},
            "p": {
              "docs": {},
              "a": {
                "docs": {},
                "g": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFLayer.html#isPageLayer": {
                              "ref": "NFLayer.html#isPageLayer",
                              "tf": 700
                            },
                            "NFPageLayer.html#isPageLayer": {
                              "ref": "NFPageLayer.html#isPageLayer",
                              "tf": 700
                            },
                            "NFPaperParentLayer.html#isPageLayer": {
                              "ref": "NFPaperParentLayer.html#isPageLayer",
                              "tf": 700
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "p": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "r": {
                      "docs": {},
                      "p": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "r": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "n": {
                                "docs": {},
                                "t": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "a": {
                                      "docs": {},
                                      "y": {
                                        "docs": {
                                          "NFLayer.html#isPaperParentLayer": {
                                            "ref": "NFLayer.html#isPaperParentLayer",
                                            "tf": 700
                                          },
                                          "NFPageLayer.html#isPaperParentLayer": {
                                            "ref": "NFPageLayer.html#isPaperParentLayer",
                                            "tf": 700
                                          },
                                          "NFPaperParentLayer.html#.isPaperParentLayer": {
                                            "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                                            "tf": 675
                                          },
                                          "NFPaperParentLayer.html#isPaperParentLayer": {
                                            "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                                            "tf": 700
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "n": {
              "docs": {},
              "u": {
                "docs": {},
                "l": {
                  "docs": {},
                  "l": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFLayer.html#isNullLayer": {
                              "ref": "NFLayer.html#isNullLayer",
                              "tf": 700
                            },
                            "NFPageLayer.html#isNullLayer": {
                              "ref": "NFPageLayer.html#isNullLayer",
                              "tf": 700
                            },
                            "NFPaperParentLayer.html#isNullLayer": {
                              "ref": "NFPaperParentLayer.html#isNullLayer",
                              "tf": 700
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "h": {
              "docs": {},
              "i": {
                "docs": {},
                "g": {
                  "docs": {},
                  "h": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "i": {
                        "docs": {},
                        "g": {
                          "docs": {},
                          "h": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "l": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "y": {
                                    "docs": {
                                      "NFLayer.html#isHighlightLayer": {
                                        "ref": "NFLayer.html#isHighlightLayer",
                                        "tf": 700
                                      },
                                      "NFPageLayer.html#isHighlightLayer": {
                                        "ref": "NFPageLayer.html#isHighlightLayer",
                                        "tf": 700
                                      },
                                      "NFPaperParentLayer.html#isHighlightLayer": {
                                        "ref": "NFPaperParentLayer.html#isHighlightLayer",
                                        "tf": 700
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "c": {
              "docs": {},
              "o": {
                "docs": {},
                "m": {
                  "docs": {},
                  "p": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFLayer.html#.isCompLayer": {
                              "ref": "NFLayer.html#.isCompLayer",
                              "tf": 675
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "a": {
              "docs": {},
              "v": {
                "docs": {},
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "y": {
                      "docs": {
                        "NFLayer.html#.isAVLayer": {
                          "ref": "NFLayer.html#.isAVLayer",
                          "tf": 675
                        }
                      }
                    }
                  }
                }
              }
            },
            "e": {
              "docs": {},
              "m": {
                "docs": {},
                "p": {
                  "docs": {},
                  "t": {
                    "docs": {},
                    "i": {
                      "docs": {
                        "NFLayerCollection.html#isEmpty": {
                          "ref": "NFLayerCollection.html#isEmpty",
                          "tf": 700
                        },
                        "NFPageLayerCollection.html#isEmpty": {
                          "ref": "NFPageLayerCollection.html#isEmpty",
                          "tf": 700
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "m": {
            "docs": {},
            "m": {
              "docs": {},
              "e": {
                "docs": {},
                "d": {
                  "docs": {},
                  "i": {
                    "docs": {
                      "NFLayer.html#moveBefore": {
                        "ref": "NFLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFLayer.html#moveAfter": {
                        "ref": "NFLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#markers": {
                        "ref": "NFLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPaperLayerGroup.html#gatherLayers": {
                        "ref": "NFPaperLayerGroup.html#gatherLayers",
                        "tf": 2.631578947368421
                      },
                      "NFPageLayer.html#moveBefore": {
                        "ref": "NFPageLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPageLayer.html#moveAfter": {
                        "ref": "NFPageLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#markers": {
                        "ref": "NFPageLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#moveBefore": {
                        "ref": "NFPaperParentLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPaperParentLayer.html#moveAfter": {
                        "ref": "NFPaperParentLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#markers": {
                        "ref": "NFPaperParentLayer.html#markers",
                        "tf": 7.142857142857142
                      }
                    }
                  }
                }
              }
            }
          },
          "t": {
            "docs": {},
            "e": {
              "docs": {},
              "m": {
                "docs": {
                  "NFPageItem.html#highlights": {
                    "ref": "NFPageItem.html#highlights",
                    "tf": 12.5
                  }
                }
              }
            }
          }
        },
        "j": {
          "docs": {},
          "s": {
            "docs": {},
            "d": {
              "docs": {},
              "o": {
                "docs": {},
                "c": {
                  "3": {
                    "docs": {
                      "index.html": {
                        "ref": "index.html",
                        "tf": 14
                      }
                    }
                  },
                  "docs": {}
                }
              }
            }
          }
        },
        "r": {
          "docs": {},
          "e": {
            "docs": {},
            "a": {
              "docs": {},
              "d": {
                "docs": {},
                "m": {
                  "docs": {
                    "index.html": {
                      "ref": "index.html",
                      "tf": 110
                    }
                  }
                }
              }
            },
            "t": {
              "docs": {},
              "u": {
                "docs": {},
                "r": {
                  "docs": {},
                  "n": {
                    "docs": {
                      "NFComp.html#layerWithName": {
                        "ref": "NFComp.html#layerWithName",
                        "tf": 5.555555555555555
                      },
                      "NFComp.html#addNull": {
                        "ref": "NFComp.html#addNull",
                        "tf": 8.333333333333332
                      },
                      "NFComp.html#getInfo": {
                        "ref": "NFComp.html#getInfo",
                        "tf": 12.5
                      },
                      "NFLayer.html#getSpecializedLayer": {
                        "ref": "NFLayer.html#getSpecializedLayer",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#hasNullParent": {
                        "ref": "NFLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFLayer.html#sameLayerAs": {
                        "ref": "NFLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      },
                      "NFLayer.html#containingComp": {
                        "ref": "NFLayer.html#containingComp",
                        "tf": 16.666666666666664
                      },
                      "NFLayer.html#getChildren": {
                        "ref": "NFLayer.html#getChildren",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#addSlider": {
                        "ref": "NFLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                        "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#.isCompLayer": {
                        "ref": "NFLayer.html#.isCompLayer",
                        "tf": 6.25
                      },
                      "NFLayer.html#.isAVLayer": {
                        "ref": "NFLayer.html#.isAVLayer",
                        "tf": 3.8461538461538463
                      },
                      "NFLayerCollection.html#onlyContainsPageLayers": {
                        "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                        "tf": 7.142857142857142
                      },
                      "NFLayerCollection.html#inSameComp": {
                        "ref": "NFLayerCollection.html#inSameComp",
                        "tf": 8.333333333333332
                      },
                      "NFLayerCollection.html#containingComp": {
                        "ref": "NFLayerCollection.html#containingComp",
                        "tf": 7.142857142857142
                      },
                      "NFLayerCollection.html#getPageLayerCollection": {
                        "ref": "NFLayerCollection.html#getPageLayerCollection",
                        "tf": 5.555555555555555
                      },
                      "NFLayerCollection.html#.collectionFromAVLayerArray": {
                        "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                        "tf": 7.142857142857142
                      },
                      "NFPageItem.html#getPDFNumber": {
                        "ref": "NFPageItem.html#getPDFNumber",
                        "tf": 12.5
                      },
                      "NFPageItem.html#getPageNumber": {
                        "ref": "NFPageItem.html#getPageNumber",
                        "tf": 12.5
                      },
                      "NFPageLayer.html#getPaperParentLayer": {
                        "ref": "NFPageLayer.html#getPaperParentLayer",
                        "tf": 9.090909090909092
                      },
                      "NFPageLayer.html#findPaperParentLayer": {
                        "ref": "NFPageLayer.html#findPaperParentLayer",
                        "tf": 5.555555555555555
                      },
                      "NFPageLayer.html#getSpecializedLayer": {
                        "ref": "NFPageLayer.html#getSpecializedLayer",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#hasNullParent": {
                        "ref": "NFPageLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFPageLayer.html#sameLayerAs": {
                        "ref": "NFPageLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      },
                      "NFPageLayer.html#containingComp": {
                        "ref": "NFPageLayer.html#containingComp",
                        "tf": 16.666666666666664
                      },
                      "NFPageLayer.html#getChildren": {
                        "ref": "NFPageLayer.html#getChildren",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#addSlider": {
                        "ref": "NFPageLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPageLayerCollection.html#highlights": {
                        "ref": "NFPageLayerCollection.html#highlights",
                        "tf": 10
                      },
                      "NFPageLayerCollection.html#fromSamePDF": {
                        "ref": "NFPageLayerCollection.html#fromSamePDF",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                        "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                        "tf": 10
                      },
                      "NFPageLayerCollection.html#onlyContainsPageLayers": {
                        "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#inSameComp": {
                        "ref": "NFPageLayerCollection.html#inSameComp",
                        "tf": 8.333333333333332
                      },
                      "NFPageLayerCollection.html#containingComp": {
                        "ref": "NFPageLayerCollection.html#containingComp",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#getPageLayerCollection": {
                        "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                        "tf": 5.555555555555555
                      },
                      "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                        "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                        "tf": 5.555555555555555
                      },
                      "NFPaperParentLayer.html#getSpecializedLayer": {
                        "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#hasNullParent": {
                        "ref": "NFPaperParentLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#sameLayerAs": {
                        "ref": "NFPaperParentLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      },
                      "NFPaperParentLayer.html#containingComp": {
                        "ref": "NFPaperParentLayer.html#containingComp",
                        "tf": 16.666666666666664
                      },
                      "NFPaperParentLayer.html#getChildren": {
                        "ref": "NFPaperParentLayer.html#getChildren",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#addSlider": {
                        "ref": "NFPaperParentLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPartComp.html#getInfo": {
                        "ref": "NFPartComp.html#getInfo",
                        "tf": 12.5
                      },
                      "NFPartComp.html#layerWithName": {
                        "ref": "NFPartComp.html#layerWithName",
                        "tf": 5.555555555555555
                      },
                      "NFPartComp.html#addNull": {
                        "ref": "NFPartComp.html#addNull",
                        "tf": 8.333333333333332
                      },
                      "LayerCollection.html#.toArr": {
                        "ref": "LayerCollection.html#.toArr",
                        "tf": 8.333333333333332
                      },
                      "Layer.html#.indexOfMarker": {
                        "ref": "Layer.html#.indexOfMarker",
                        "tf": 10
                      },
                      "Property.html#.expressionStringForValue": {
                        "ref": "Property.html#.expressionStringForValue",
                        "tf": 10
                      }
                    }
                  }
                }
              }
            },
            "p": {
              "docs": {},
              "r": {
                "docs": {},
                "e": {
                  "docs": {},
                  "s": {
                    "docs": {},
                    "e": {
                      "docs": {},
                      "n": {
                        "docs": {},
                        "t": {
                          "docs": {
                            "NFComp.html#getInfo": {
                              "ref": "NFComp.html#getInfo",
                              "tf": 12.5
                            },
                            "NFPartComp.html#getInfo": {
                              "ref": "NFPartComp.html#getInfo",
                              "tf": 12.5
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "f": {
              "docs": {},
              "e": {
                "docs": {},
                "r": {
                  "docs": {
                    "NFLayer.html#sameLayerAs": {
                      "ref": "NFLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPageLayer.html#sameLayerAs": {
                      "ref": "NFPageLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPaperParentLayer.html#sameLayerAs": {
                      "ref": "NFPaperParentLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    }
                  }
                }
              }
            },
            "m": {
              "docs": {},
              "o": {
                "docs": {},
                "v": {
                  "docs": {
                    "NFLayerCollection.html#remove": {
                      "ref": "NFLayerCollection.html#remove",
                      "tf": 695.8333333333334
                    },
                    "NFPageLayerCollection.html#remove": {
                      "ref": "NFPageLayerCollection.html#remove",
                      "tf": 695.8333333333334
                    },
                    "Layer.html#.removeMarker": {
                      "ref": "Layer.html#.removeMarker",
                      "tf": 12.5
                    }
                  },
                  "e": {
                    "docs": {},
                    "m": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "r": {
                          "docs": {},
                          "k": {
                            "docs": {
                              "Layer.html#.removeMarker": {
                                "ref": "Layer.html#.removeMarker",
                                "tf": 675
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "g": {
              "docs": {},
              "a": {
                "docs": {},
                "r": {
                  "docs": {},
                  "d": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "e": {
                        "docs": {},
                        "s": {
                          "docs": {},
                          "s": {
                            "docs": {
                              "NFPageLayer.html#findPaperParentLayer": {
                                "ref": "NFPageLayer.html#findPaperParentLayer",
                                "tf": 5.555555555555555
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "u": {
            "docs": {},
            "n": {
              "docs": {
                "NFPageLayerCollection.html#initLayers": {
                  "ref": "NFPageLayerCollection.html#initLayers",
                  "tf": 12.5
                },
                "NFPageLayerCollection.html#initLayerTransforms": {
                  "ref": "NFPageLayerCollection.html#initLayerTransforms",
                  "tf": 12.5
                }
              }
            }
          }
        },
        "t": {
          "docs": {},
          "e": {
            "docs": {},
            "m": {
              "docs": {},
              "p": {
                "docs": {},
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "index.html": {
                          "ref": "index.html",
                          "tf": 14
                        }
                      }
                    }
                  }
                }
              }
            },
            "s": {
              "docs": {},
              "t": {
                "docs": {
                  "NFPaperParentLayer.html#.isPaperParentLayer": {
                    "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                    "tf": 5.555555555555555
                  }
                }
              }
            }
          },
          "y": {
            "docs": {},
            "p": {
              "docs": {},
              "e": {
                "docs": {
                  "NFLayer.html#getSpecializedLayer": {
                    "ref": "NFLayer.html#getSpecializedLayer",
                    "tf": 7.142857142857142
                  },
                  "NFLayerCollection.html#onlyContainsPageLayers": {
                    "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayer.html#getSpecializedLayer": {
                    "ref": "NFPageLayer.html#getSpecializedLayer",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#onlyContainsPageLayers": {
                    "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                    "tf": 7.142857142857142
                  },
                  "NFPaperParentLayer.html#getSpecializedLayer": {
                    "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                    "tf": 7.142857142857142
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "u": {
              "docs": {},
              "e": {
                "docs": {
                  "NFLayer.html#hasNullParent": {
                    "ref": "NFLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFLayer.html#sameLayerAs": {
                    "ref": "NFLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  },
                  "NFLayer.html#.isCompLayer": {
                    "ref": "NFLayer.html#.isCompLayer",
                    "tf": 6.25
                  },
                  "NFLayerCollection.html#onlyContainsPageLayers": {
                    "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                    "tf": 7.142857142857142
                  },
                  "NFLayerCollection.html#inSameComp": {
                    "ref": "NFLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFLayerCollection.html#isEmpty": {
                    "ref": "NFLayerCollection.html#isEmpty",
                    "tf": 16.666666666666664
                  },
                  "NFPageLayer.html#hasNullParent": {
                    "ref": "NFPageLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFPageLayer.html#sameLayerAs": {
                    "ref": "NFPageLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  },
                  "NFPageLayerCollection.html#fromSamePDF": {
                    "ref": "NFPageLayerCollection.html#fromSamePDF",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#onlyContainsPageLayers": {
                    "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#inSameComp": {
                    "ref": "NFPageLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFPageLayerCollection.html#isEmpty": {
                    "ref": "NFPageLayerCollection.html#isEmpty",
                    "tf": 16.666666666666664
                  },
                  "NFPaperParentLayer.html#hasNullParent": {
                    "ref": "NFPaperParentLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFPaperParentLayer.html#sameLayerAs": {
                    "ref": "NFPaperParentLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  }
                }
              }
            },
            "a": {
              "docs": {},
              "n": {
                "docs": {},
                "s": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "r": {
              "docs": {},
              "g": {
                "docs": {},
                "e": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFLayer.html#moveBefore": {
                        "ref": "NFLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFLayer.html#moveAfter": {
                        "ref": "NFLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#markers": {
                        "ref": "NFLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#moveBefore": {
                        "ref": "NFPageLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPageLayer.html#moveAfter": {
                        "ref": "NFPageLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#markers": {
                        "ref": "NFPageLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#moveBefore": {
                        "ref": "NFPaperParentLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPaperParentLayer.html#moveAfter": {
                        "ref": "NFPaperParentLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#markers": {
                        "ref": "NFPaperParentLayer.html#markers",
                        "tf": 7.142857142857142
                      }
                    },
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFLayer.html#moveBefore": {
                              "ref": "NFLayer.html#moveBefore",
                              "tf": 33.33333333333333
                            },
                            "NFLayer.html#moveAfter": {
                              "ref": "NFLayer.html#moveAfter",
                              "tf": 33.33333333333333
                            },
                            "NFPageLayer.html#moveBefore": {
                              "ref": "NFPageLayer.html#moveBefore",
                              "tf": 33.33333333333333
                            },
                            "NFPageLayer.html#moveAfter": {
                              "ref": "NFPageLayer.html#moveAfter",
                              "tf": 33.33333333333333
                            },
                            "NFPaperParentLayer.html#moveBefore": {
                              "ref": "NFPaperParentLayer.html#moveBefore",
                              "tf": 33.33333333333333
                            },
                            "NFPaperParentLayer.html#moveAfter": {
                              "ref": "NFPaperParentLayer.html#moveAfter",
                              "tf": 33.33333333333333
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "h": {
            "docs": {},
            "e": {
              "docs": {},
              "l": {
                "docs": {},
                "a": {
                  "docs": {},
                  "y": {
                    "docs": {
                      "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                        "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                        "tf": 25
                      },
                      "NFLayer.html#.isCompLayer": {
                        "ref": "NFLayer.html#.isCompLayer",
                        "tf": 25
                      }
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "p": {
              "docs": {},
              "m": {
                "docs": {},
                "o": {
                  "docs": {},
                  "s": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFLayerCollection.html#getTopmostLayer": {
                          "ref": "NFLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#getTopmostLayer": {
                          "ref": "NFPageLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        }
                      }
                    }
                  }
                }
              }
            },
            "a": {
              "docs": {},
              "r": {
                "docs": {},
                "r": {
                  "docs": {
                    "LayerCollection.html#.toArr": {
                      "ref": "LayerCollection.html#.toArr",
                      "tf": 683.3333333333334
                    }
                  }
                }
              }
            }
          }
        },
        "d": {
          "docs": {},
          "o": {
            "docs": {},
            "c": {
              "docs": {},
              "u": {
                "docs": {},
                "m": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "n": {
                      "docs": {},
                      "t": {
                        "docs": {
                          "global.html": {
                            "ref": "global.html",
                            "tf": 35
                          },
                          "list_class.html": {
                            "ref": "list_class.html",
                            "tf": 35
                          },
                          "list_namespace.html": {
                            "ref": "list_namespace.html",
                            "tf": 35
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "n": {
              "docs": {},
              "'": {
                "docs": {},
                "t": {
                  "docs": {
                    "NFLayer.html#.isAVLayer": {
                      "ref": "NFLayer.html#.isAVLayer",
                      "tf": 3.8461538461538463
                    }
                  }
                }
              }
            }
          }
        },
        "g": {
          "docs": {},
          "l": {
            "docs": {},
            "o": {
              "docs": {},
              "b": {
                "docs": {},
                "a": {
                  "docs": {},
                  "l": {
                    "docs": {
                      "global.html": {
                        "ref": "global.html",
                        "tf": 2045
                      }
                    }
                  }
                }
              }
            }
          },
          "e": {
            "docs": {},
            "t": {
              "docs": {
                "NFComp.html#selectedLayers": {
                  "ref": "NFComp.html#selectedLayers",
                  "tf": 12.5
                },
                "NFComp.html#selectedPageLayers": {
                  "ref": "NFComp.html#selectedPageLayers",
                  "tf": 12.5
                },
                "NFComp.html#getZoomer": {
                  "ref": "NFComp.html#getZoomer",
                  "tf": 16.666666666666664
                },
                "NFLayer.html#getParent": {
                  "ref": "NFLayer.html#getParent",
                  "tf": 12.5
                },
                "NFLayerCollection.html#getTopmostLayer": {
                  "ref": "NFLayerCollection.html#getTopmostLayer",
                  "tf": 12.5
                },
                "NFLayerCollection.html#getBottommostLayer": {
                  "ref": "NFLayerCollection.html#getBottommostLayer",
                  "tf": 12.5
                },
                "NFPageItem.html#highlights": {
                  "ref": "NFPageItem.html#highlights",
                  "tf": 12.5
                },
                "NFPaperLayerGroup.html#getChildren": {
                  "ref": "NFPaperLayerGroup.html#getChildren",
                  "tf": 16.666666666666664
                },
                "NFPaperLayerGroup.html#getPages": {
                  "ref": "NFPaperLayerGroup.html#getPages",
                  "tf": 16.666666666666664
                },
                "NFPageLayer.html#getParent": {
                  "ref": "NFPageLayer.html#getParent",
                  "tf": 12.5
                },
                "NFPageLayerCollection.html#getTopmostLayer": {
                  "ref": "NFPageLayerCollection.html#getTopmostLayer",
                  "tf": 12.5
                },
                "NFPageLayerCollection.html#getBottommostLayer": {
                  "ref": "NFPageLayerCollection.html#getBottommostLayer",
                  "tf": 12.5
                },
                "NFPaperParentLayer.html#getParent": {
                  "ref": "NFPaperParentLayer.html#getParent",
                  "tf": 12.5
                },
                "NFPartComp.html#selectedLayers": {
                  "ref": "NFPartComp.html#selectedLayers",
                  "tf": 12.5
                },
                "NFPartComp.html#selectedPageLayers": {
                  "ref": "NFPartComp.html#selectedPageLayers",
                  "tf": 12.5
                },
                "NFPartComp.html#getZoomer": {
                  "ref": "NFPartComp.html#getZoomer",
                  "tf": 16.666666666666664
                }
              },
              "z": {
                "docs": {},
                "o": {
                  "docs": {},
                  "o": {
                    "docs": {},
                    "m": {
                      "docs": {
                        "NFComp.html#getZoomer": {
                          "ref": "NFComp.html#getZoomer",
                          "tf": 700
                        },
                        "NFPartComp.html#getZoomer": {
                          "ref": "NFPartComp.html#getZoomer",
                          "tf": 700
                        }
                      }
                    }
                  }
                }
              },
              "i": {
                "docs": {},
                "n": {
                  "docs": {},
                  "f": {
                    "docs": {},
                    "o": {
                      "docs": {
                        "NFComp.html#getInfo": {
                          "ref": "NFComp.html#getInfo",
                          "tf": 700
                        },
                        "NFPartComp.html#getInfo": {
                          "ref": "NFPartComp.html#getInfo",
                          "tf": 700
                        }
                      }
                    }
                  }
                }
              },
              "s": {
                "docs": {},
                "p": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "c": {
                      "docs": {},
                      "i": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "l": {
                            "docs": {},
                            "i": {
                              "docs": {},
                              "z": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "d": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFLayer.html#getSpecializedLayer": {
                                              "ref": "NFLayer.html#getSpecializedLayer",
                                              "tf": 700
                                            },
                                            "NFPageLayer.html#getSpecializedLayer": {
                                              "ref": "NFPageLayer.html#getSpecializedLayer",
                                              "tf": 700
                                            },
                                            "NFPaperParentLayer.html#getSpecializedLayer": {
                                              "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                                              "tf": 700
                                            }
                                          },
                                          "e": {
                                            "docs": {},
                                            "r": {
                                              "docs": {},
                                              "f": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "o": {
                                                    "docs": {},
                                                    "m": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "v": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {
                                                                  "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                                                                    "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                                                                    "tf": 675
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "c": {
                "docs": {},
                "h": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "d": {
                        "docs": {},
                        "r": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "n": {
                              "docs": {
                                "NFLayer.html#getChildren": {
                                  "ref": "NFLayer.html#getChildren",
                                  "tf": 700
                                },
                                "NFPaperLayerGroup.html#getChildren": {
                                  "ref": "NFPaperLayerGroup.html#getChildren",
                                  "tf": 700
                                },
                                "NFPageLayer.html#getChildren": {
                                  "ref": "NFPageLayer.html#getChildren",
                                  "tf": 700
                                },
                                "NFPaperParentLayer.html#getChildren": {
                                  "ref": "NFPaperParentLayer.html#getChildren",
                                  "tf": 700
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "p": {
                "docs": {},
                "a": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayer.html#getParent": {
                        "ref": "NFLayer.html#getParent",
                        "tf": 700
                      },
                      "NFPageLayer.html#getParent": {
                        "ref": "NFPageLayer.html#getParent",
                        "tf": 700
                      },
                      "NFPaperParentLayer.html#getParent": {
                        "ref": "NFPaperParentLayer.html#getParent",
                        "tf": 700
                      }
                    }
                  },
                  "g": {
                    "docs": {
                      "NFPaperLayerGroup.html#getPages": {
                        "ref": "NFPaperLayerGroup.html#getPages",
                        "tf": 700
                      }
                    },
                    "e": {
                      "docs": {},
                      "l": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "y": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "r": {
                                "docs": {},
                                "c": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "l": {
                                        "docs": {},
                                        "e": {
                                          "docs": {},
                                          "c": {
                                            "docs": {},
                                            "t": {
                                              "docs": {
                                                "NFLayerCollection.html#getPageLayerCollection": {
                                                  "ref": "NFLayerCollection.html#getPageLayerCollection",
                                                  "tf": 700
                                                },
                                                "NFPageLayerCollection.html#getPageLayerCollection": {
                                                  "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                                                  "tf": 700
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "n": {
                        "docs": {},
                        "u": {
                          "docs": {},
                          "m": {
                            "docs": {},
                            "b": {
                              "docs": {
                                "NFPageItem.html#getPageNumber": {
                                  "ref": "NFPageItem.html#getPageNumber",
                                  "tf": 700
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "p": {
                    "docs": {},
                    "e": {
                      "docs": {},
                      "r": {
                        "docs": {},
                        "p": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "n": {
                                  "docs": {},
                                  "t": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFPageLayer.html#getPaperParentLayer": {
                                              "ref": "NFPageLayer.html#getPaperParentLayer",
                                              "tf": 700
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "n": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "m": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "f": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "g": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {
                                                                  "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                                                                    "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                                                                    "tf": 675
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "d": {
                  "docs": {},
                  "f": {
                    "docs": {},
                    "n": {
                      "docs": {},
                      "u": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "b": {
                            "docs": {
                              "NFPageItem.html#getPDFNumber": {
                                "ref": "NFPageItem.html#getPDFNumber",
                                "tf": 700
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "t": {
                "docs": {},
                "o": {
                  "docs": {},
                  "p": {
                    "docs": {},
                    "m": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "s": {
                          "docs": {},
                          "t": {
                            "docs": {},
                            "l": {
                              "docs": {},
                              "a": {
                                "docs": {},
                                "y": {
                                  "docs": {
                                    "NFLayerCollection.html#getTopmostLayer": {
                                      "ref": "NFLayerCollection.html#getTopmostLayer",
                                      "tf": 700
                                    },
                                    "NFPageLayerCollection.html#getTopmostLayer": {
                                      "ref": "NFPageLayerCollection.html#getTopmostLayer",
                                      "tf": 700
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "b": {
                "docs": {},
                "o": {
                  "docs": {},
                  "t": {
                    "docs": {},
                    "t": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "m": {
                            "docs": {},
                            "o": {
                              "docs": {},
                              "s": {
                                "docs": {},
                                "t": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "a": {
                                      "docs": {},
                                      "y": {
                                        "docs": {
                                          "NFLayerCollection.html#getBottommostLayer": {
                                            "ref": "NFLayerCollection.html#getBottommostLayer",
                                            "tf": 700
                                          },
                                          "NFPageLayerCollection.html#getBottommostLayer": {
                                            "ref": "NFPageLayerCollection.html#getBottommostLayer",
                                            "tf": 700
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "i": {
            "docs": {},
            "v": {
              "docs": {},
              "e": {
                "docs": {},
                "n": {
                  "docs": {
                    "NFComp.html#layerWithName": {
                      "ref": "NFComp.html#layerWithName",
                      "tf": 5.555555555555555
                    },
                    "NFLayer.html#sameLayerAs": {
                      "ref": "NFLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFLayer.html#setParent": {
                      "ref": "NFLayer.html#setParent",
                      "tf": 10
                    },
                    "NFLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFLayer.html#.isCompLayer": {
                      "ref": "NFLayer.html#.isCompLayer",
                      "tf": 6.25
                    },
                    "NFLayer.html#.isAVLayer": {
                      "ref": "NFLayer.html#.isAVLayer",
                      "tf": 3.8461538461538463
                    },
                    "NFLayerCollection.html#remove": {
                      "ref": "NFLayerCollection.html#remove",
                      "tf": 12.5
                    },
                    "NFLayerCollection.html#setParents": {
                      "ref": "NFLayerCollection.html#setParents",
                      "tf": 7.142857142857142
                    },
                    "NFPaperLayerGroup.html#gatherLayers": {
                      "ref": "NFPaperLayerGroup.html#gatherLayers",
                      "tf": 2.631578947368421
                    },
                    "NFPageLayer.html#sameLayerAs": {
                      "ref": "NFPageLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPageLayer.html#setParent": {
                      "ref": "NFPageLayer.html#setParent",
                      "tf": 10
                    },
                    "NFPageLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayerCollection.html#remove": {
                      "ref": "NFPageLayerCollection.html#remove",
                      "tf": 12.5
                    },
                    "NFPageLayerCollection.html#setParents": {
                      "ref": "NFPageLayerCollection.html#setParents",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                      "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPaperParentLayer.html#sameLayerAs": {
                      "ref": "NFPaperParentLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPaperParentLayer.html#setParent": {
                      "ref": "NFPaperParentLayer.html#setParent",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFPartComp.html#layerWithName": {
                      "ref": "NFPartComp.html#layerWithName",
                      "tf": 5.555555555555555
                    },
                    "Layer.html#.indexOfMarker": {
                      "ref": "Layer.html#.indexOfMarker",
                      "tf": 10
                    },
                    "Layer.html#.removeMarker": {
                      "ref": "Layer.html#.removeMarker",
                      "tf": 12.5
                    },
                    "Property.html#.expressionStringForValue": {
                      "ref": "Property.html#.expressionStringForValue",
                      "tf": 10
                    }
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "o": {
              "docs": {},
              "u": {
                "docs": {},
                "p": {
                  "docs": {
                    "NFPDF.html": {
                      "ref": "NFPDF.html",
                      "tf": 10
                    },
                    "NFPaperLayerGroup.html": {
                      "ref": "NFPaperLayerGroup.html",
                      "tf": 6.25
                    },
                    "NFPaperLayerGroup.html#getChildren": {
                      "ref": "NFPaperLayerGroup.html#getChildren",
                      "tf": 16.666666666666664
                    },
                    "NFPaperLayerGroup.html#getPages": {
                      "ref": "NFPaperLayerGroup.html#getPages",
                      "tf": 16.666666666666664
                    },
                    "NFPaperLayerGroup.html#gatherLayers": {
                      "ref": "NFPaperLayerGroup.html#gatherLayers",
                      "tf": 5.263157894736842
                    },
                    "NFPageLayerCollection.html": {
                      "ref": "NFPageLayerCollection.html",
                      "tf": 5
                    },
                    "NFPaperParentLayer.html": {
                      "ref": "NFPaperParentLayer.html",
                      "tf": 5
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "t": {
              "docs": {},
              "h": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFPaperLayerGroup.html#gatherLayers": {
                              "ref": "NFPaperLayerGroup.html#gatherLayers",
                              "tf": 675
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {
              "NFPaperLayerGroup.html#gatherLayers": {
                "ref": "NFPaperLayerGroup.html#gatherLayers",
                "tf": 5.263157894736842
              }
            }
          }
        },
        "c": {
          "docs": {},
          "l": {
            "docs": {},
            "a": {
              "docs": {},
              "s": {
                "docs": {},
                "s": {
                  "docs": {
                    "list_class.html": {
                      "ref": "list_class.html",
                      "tf": 635
                    },
                    "NFComp.html": {
                      "ref": "NFComp.html",
                      "tf": 110
                    },
                    "NFLayer.html": {
                      "ref": "NFLayer.html",
                      "tf": 110
                    },
                    "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                      "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                      "tf": 7.142857142857142
                    },
                    "NFLayer.html#.isCompLayer": {
                      "ref": "NFLayer.html#.isCompLayer",
                      "tf": 6.25
                    },
                    "NFLayerCollection.html": {
                      "ref": "NFLayerCollection.html",
                      "tf": 110
                    },
                    "NFLayerCollection.html#.collectionFromAVLayerArray": {
                      "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                      "tf": 7.142857142857142
                    },
                    "NFPDF.html": {
                      "ref": "NFPDF.html",
                      "tf": 110
                    },
                    "NFPageItem.html": {
                      "ref": "NFPageItem.html",
                      "tf": 110
                    },
                    "NFPaperLayerGroup.html": {
                      "ref": "NFPaperLayerGroup.html",
                      "tf": 110
                    },
                    "NFPageLayer.html": {
                      "ref": "NFPageLayer.html",
                      "tf": 110
                    },
                    "NFPageLayerCollection.html": {
                      "ref": "NFPageLayerCollection.html",
                      "tf": 110
                    },
                    "NFPaperParentLayer.html": {
                      "ref": "NFPaperParentLayer.html",
                      "tf": 110
                    },
                    "NFPaperParentLayer.html#.isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                      "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPartComp.html": {
                      "ref": "NFPartComp.html",
                      "tf": 110
                    },
                    "LayerCollection.html": {
                      "ref": "LayerCollection.html",
                      "tf": 16.666666666666664
                    },
                    "Layer.html": {
                      "ref": "Layer.html",
                      "tf": 16.666666666666664
                    },
                    "Property.html": {
                      "ref": "Property.html",
                      "tf": 16.666666666666664
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "m": {
              "docs": {},
              "p": {
                "docs": {
                  "NFComp.html#selectedLayers": {
                    "ref": "NFComp.html#selectedLayers",
                    "tf": 12.5
                  },
                  "NFComp.html#selectedPageLayers": {
                    "ref": "NFComp.html#selectedPageLayers",
                    "tf": 12.5
                  },
                  "NFComp.html#layerWithName": {
                    "ref": "NFComp.html#layerWithName",
                    "tf": 5.555555555555555
                  },
                  "NFComp.html#addNull": {
                    "ref": "NFComp.html#addNull",
                    "tf": 8.333333333333332
                  },
                  "NFLayer.html#.isCompLayer": {
                    "ref": "NFLayer.html#.isCompLayer",
                    "tf": 6.25
                  },
                  "NFLayerCollection.html#inSameComp": {
                    "ref": "NFLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFLayerCollection.html#containingComp": {
                    "ref": "NFLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#inSameComp": {
                    "ref": "NFPageLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFPageLayerCollection.html#containingComp": {
                    "ref": "NFPageLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  },
                  "NFPartComp.html": {
                    "ref": "NFPartComp.html",
                    "tf": 4.545454545454546
                  },
                  "NFPartComp.html#selectedLayers": {
                    "ref": "NFPartComp.html#selectedLayers",
                    "tf": 12.5
                  },
                  "NFPartComp.html#selectedPageLayers": {
                    "ref": "NFPartComp.html#selectedPageLayers",
                    "tf": 12.5
                  },
                  "NFPartComp.html#layerWithName": {
                    "ref": "NFPartComp.html#layerWithName",
                    "tf": 5.555555555555555
                  },
                  "NFPartComp.html#addNull": {
                    "ref": "NFPartComp.html#addNull",
                    "tf": 8.333333333333332
                  }
                },
                "i": {
                  "docs": {},
                  "t": {
                    "docs": {},
                    "e": {
                      "docs": {},
                      "m": {
                        "docs": {
                          "NFComp.html": {
                            "ref": "NFComp.html",
                            "tf": 6.25
                          },
                          "NFPageItem.html": {
                            "ref": "NFPageItem.html",
                            "tf": 10
                          },
                          "NFPartComp.html": {
                            "ref": "NFPartComp.html",
                            "tf": 4.545454545454546
                          }
                        }
                      }
                    }
                  }
                }
              },
              "m": {
                "docs": {},
                "e": {
                  "docs": {},
                  "n": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "Layer.html#.indexOfMarker": {
                          "ref": "Layer.html#.indexOfMarker",
                          "tf": 35
                        },
                        "Layer.html#.removeMarker": {
                          "ref": "Layer.html#.removeMarker",
                          "tf": 37.5
                        },
                        "Property.html#.expressionStringForValue": {
                          "ref": "Property.html#.expressionStringForValue",
                          "tf": 10
                        }
                      }
                    }
                  }
                }
              }
            },
            "n": {
              "docs": {},
              "t": {
                "docs": {},
                "e": {
                  "docs": {},
                  "n": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFLayer.html#getSpecializedLayer": {
                          "ref": "NFLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayer.html#getSpecializedLayer": {
                          "ref": "NFPageLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        },
                        "NFPaperParentLayer.html#getSpecializedLayer": {
                          "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        }
                      }
                    }
                  }
                },
                "a": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "n": {
                      "docs": {
                        "NFLayer.html#containingComp": {
                          "ref": "NFLayer.html#containingComp",
                          "tf": 16.666666666666664
                        },
                        "NFLayerCollection.html": {
                          "ref": "NFLayerCollection.html",
                          "tf": 8.333333333333332
                        },
                        "NFLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html#containingComp": {
                          "ref": "NFLayerCollection.html#containingComp",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html#getPageLayerCollection": {
                          "ref": "NFLayerCollection.html#getPageLayerCollection",
                          "tf": 5.555555555555555
                        },
                        "NFPageLayer.html#containingComp": {
                          "ref": "NFPageLayer.html#containingComp",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#fromSamePDF": {
                          "ref": "NFPageLayerCollection.html#fromSamePDF",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#containingComp": {
                          "ref": "NFPageLayerCollection.html#containingComp",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#getPageLayerCollection": {
                          "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                          "tf": 5.555555555555555
                        },
                        "NFPaperParentLayer.html#containingComp": {
                          "ref": "NFPaperParentLayer.html#containingComp",
                          "tf": 16.666666666666664
                        }
                      },
                      "i": {
                        "docs": {},
                        "n": {
                          "docs": {},
                          "g": {
                            "docs": {},
                            "c": {
                              "docs": {},
                              "o": {
                                "docs": {},
                                "m": {
                                  "docs": {},
                                  "p": {
                                    "docs": {
                                      "NFLayer.html#containingComp": {
                                        "ref": "NFLayer.html#containingComp",
                                        "tf": 700
                                      },
                                      "NFLayerCollection.html#containingComp": {
                                        "ref": "NFLayerCollection.html#containingComp",
                                        "tf": 700
                                      },
                                      "NFPageLayer.html#containingComp": {
                                        "ref": "NFPageLayer.html#containingComp",
                                        "tf": 700
                                      },
                                      "NFPageLayerCollection.html#containingComp": {
                                        "ref": "NFPageLayerCollection.html#containingComp",
                                        "tf": 700
                                      },
                                      "NFPaperParentLayer.html#containingComp": {
                                        "ref": "NFPaperParentLayer.html#containingComp",
                                        "tf": 700
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "f": {
                "docs": {},
                "u": {
                  "docs": {},
                  "s": {
                    "docs": {
                      "NFPageLayer.html#getPaperParentLayer": {
                        "ref": "NFPageLayer.html#getPaperParentLayer",
                        "tf": 4.545454545454546
                      },
                      "NFPageLayer.html#findPaperParentLayer": {
                        "ref": "NFPageLayer.html#findPaperParentLayer",
                        "tf": 5.555555555555555
                      }
                    }
                  }
                }
              },
              "n": {
                "docs": {},
                "e": {
                  "docs": {},
                  "c": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFPageLayer.html#getPaperParentLayer": {
                          "ref": "NFPageLayer.html#getPaperParentLayer",
                          "tf": 9.090909090909092
                        },
                        "NFPageLayer.html#findPaperParentLayer": {
                          "ref": "NFPageLayer.html#findPaperParentLayer",
                          "tf": 5.555555555555555
                        }
                      }
                    }
                  }
                }
              }
            },
            "l": {
              "docs": {},
              "l": {
                "docs": {},
                "e": {
                  "docs": {},
                  "c": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFLayerCollection.html#addNFLayer": {
                          "ref": "NFLayerCollection.html#addNFLayer",
                          "tf": 16.666666666666664
                        },
                        "NFLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html#inSameComp": {
                          "ref": "NFLayerCollection.html#inSameComp",
                          "tf": 8.333333333333332
                        },
                        "NFLayerCollection.html#getPageLayerCollection": {
                          "ref": "NFLayerCollection.html#getPageLayerCollection",
                          "tf": 11.11111111111111
                        },
                        "NFLayerCollection.html#count": {
                          "ref": "NFLayerCollection.html#count",
                          "tf": 10
                        },
                        "NFLayerCollection.html#isEmpty": {
                          "ref": "NFLayerCollection.html#isEmpty",
                          "tf": 16.666666666666664
                        },
                        "NFLayerCollection.html#remove": {
                          "ref": "NFLayerCollection.html#remove",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html#getTopmostLayer": {
                          "ref": "NFLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html#getBottommostLayer": {
                          "ref": "NFLayerCollection.html#getBottommostLayer",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html#nullify": {
                          "ref": "NFLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayerCollection.html#addNFPageLayer": {
                          "ref": "NFPageLayerCollection.html#addNFPageLayer",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#addAVLayer": {
                          "ref": "NFPageLayerCollection.html#addAVLayer",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#highlights": {
                          "ref": "NFPageLayerCollection.html#highlights",
                          "tf": 10
                        },
                        "NFPageLayerCollection.html#fromSamePDF": {
                          "ref": "NFPageLayerCollection.html#fromSamePDF",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#initLayers": {
                          "ref": "NFPageLayerCollection.html#initLayers",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#initLayerTransforms": {
                          "ref": "NFPageLayerCollection.html#initLayerTransforms",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#newPaperParentLayer": {
                          "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#addNFLayer": {
                          "ref": "NFPageLayerCollection.html#addNFLayer",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#inSameComp": {
                          "ref": "NFPageLayerCollection.html#inSameComp",
                          "tf": 8.333333333333332
                        },
                        "NFPageLayerCollection.html#getPageLayerCollection": {
                          "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                          "tf": 11.11111111111111
                        },
                        "NFPageLayerCollection.html#count": {
                          "ref": "NFPageLayerCollection.html#count",
                          "tf": 10
                        },
                        "NFPageLayerCollection.html#isEmpty": {
                          "ref": "NFPageLayerCollection.html#isEmpty",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#remove": {
                          "ref": "NFPageLayerCollection.html#remove",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#getTopmostLayer": {
                          "ref": "NFPageLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#getBottommostLayer": {
                          "ref": "NFPageLayerCollection.html#getBottommostLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#nullify": {
                          "ref": "NFPageLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "LayerCollection.html#.toArr": {
                          "ref": "LayerCollection.html#.toArr",
                          "tf": 8.333333333333332
                        }
                      },
                      "i": {
                        "docs": {},
                        "o": {
                          "docs": {},
                          "n": {
                            "docs": {},
                            "f": {
                              "docs": {},
                              "r": {
                                "docs": {},
                                "o": {
                                  "docs": {},
                                  "m": {
                                    "docs": {},
                                    "a": {
                                      "docs": {},
                                      "v": {
                                        "docs": {},
                                        "l": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "y": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {},
                                                    "r": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {
                                                              "NFLayerCollection.html#.collectionFromAVLayerArray": {
                                                                "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                                                                "tf": 683.3333333333334
                                                              },
                                                              "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                                                                "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                                                                "tf": 683.3333333333334
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "u": {
              "docs": {},
              "n": {
                "docs": {},
                "t": {
                  "docs": {
                    "NFLayerCollection.html#count": {
                      "ref": "NFLayerCollection.html#count",
                      "tf": 700
                    },
                    "NFPageLayerCollection.html#count": {
                      "ref": "NFPageLayerCollection.html#count",
                      "tf": 700
                    }
                  }
                }
              }
            },
            "r": {
              "docs": {},
              "r": {
                "docs": {},
                "e": {
                  "docs": {},
                  "c": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFPaperParentLayer.html#setName": {
                          "ref": "NFPaperParentLayer.html#setName",
                          "tf": 7.142857142857142
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "e": {
              "docs": {},
              "a": {
                "docs": {},
                "t": {
                  "docs": {
                    "NFComp.html#addNull": {
                      "ref": "NFComp.html#addNull",
                      "tf": 8.333333333333332
                    },
                    "NFLayer.html#addSlider": {
                      "ref": "NFLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFLayerCollection.html#nullify": {
                      "ref": "NFLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayer.html#addSlider": {
                      "ref": "NFPageLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFPageLayerCollection.html#newPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                      "tf": 12.5
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayerCollection.html#nullify": {
                      "ref": "NFPageLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#addSlider": {
                      "ref": "NFPaperParentLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFPartComp.html#addNull": {
                      "ref": "NFPartComp.html#addNull",
                      "tf": 8.333333333333332
                    }
                  }
                }
              }
            }
          },
          "h": {
            "docs": {},
            "e": {
              "docs": {},
              "c": {
                "docs": {},
                "k": {
                  "docs": {
                    "NFLayer.html#isPageLayer": {
                      "ref": "NFLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFLayer.html#isNullLayer": {
                      "ref": "NFLayer.html#isNullLayer",
                      "tf": 12.5
                    },
                    "NFLayer.html#isHighlightLayer": {
                      "ref": "NFLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFLayer.html#isPaperParentLayer": {
                      "ref": "NFLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFLayer.html#sameLayerAs": {
                      "ref": "NFLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPDF.html#addNFPageItem": {
                      "ref": "NFPDF.html#addNFPageItem",
                      "tf": 10
                    },
                    "NFPageLayer.html#isPageLayer": {
                      "ref": "NFPageLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFPageLayer.html#isNullLayer": {
                      "ref": "NFPageLayer.html#isNullLayer",
                      "tf": 12.5
                    },
                    "NFPageLayer.html#isHighlightLayer": {
                      "ref": "NFPageLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFPageLayer.html#isPaperParentLayer": {
                      "ref": "NFPageLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayer.html#sameLayerAs": {
                      "ref": "NFPageLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#isPageLayer": {
                      "ref": "NFPaperParentLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#isNullLayer": {
                      "ref": "NFPaperParentLayer.html#isNullLayer",
                      "tf": 12.5
                    },
                    "NFPaperParentLayer.html#isHighlightLayer": {
                      "ref": "NFPaperParentLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPaperParentLayer.html#sameLayerAs": {
                      "ref": "NFPaperParentLayer.html#sameLayerAs",
                      "tf": 3.3333333333333335
                    }
                  }
                }
              }
            },
            "i": {
              "docs": {},
              "l": {
                "docs": {},
                "d": {
                  "docs": {
                    "NFLayer.html#getChildren": {
                      "ref": "NFLayer.html#getChildren",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayer.html#getChildren": {
                      "ref": "NFPageLayer.html#getChildren",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#getChildren": {
                      "ref": "NFPaperParentLayer.html#getChildren",
                      "tf": 7.142857142857142
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "l": {
              "docs": {},
              "l": {
                "docs": {
                  "NFLayerCollection.html#getPageLayerCollection": {
                    "ref": "NFLayerCollection.html#getPageLayerCollection",
                    "tf": 5.555555555555555
                  },
                  "NFPageLayerCollection.html#getPageLayerCollection": {
                    "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                    "tf": 5.555555555555555
                  }
                }
              }
            }
          }
        },
        "l": {
          "docs": {},
          "i": {
            "docs": {},
            "s": {
              "docs": {},
              "t": {
                "docs": {
                  "list_class.html": {
                    "ref": "list_class.html",
                    "tf": 110
                  },
                  "list_namespace.html": {
                    "ref": "list_namespace.html",
                    "tf": 110
                  }
                },
                ":": {
                  "docs": {},
                  "c": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "s": {
                          "docs": {},
                          "s": {
                            "docs": {
                              "list_class.html": {
                                "ref": "list_class.html",
                                "tf": 1300
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "n": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "m": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "s": {
                            "docs": {},
                            "p": {
                              "docs": {},
                              "a": {
                                "docs": {},
                                "c": {
                                  "docs": {
                                    "list_namespace.html": {
                                      "ref": "list_namespace.html",
                                      "tf": 1300
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "y": {
              "docs": {},
              "e": {
                "docs": {},
                "r": {
                  "docs": {
                    "NFComp.html": {
                      "ref": "NFComp.html",
                      "tf": 6.25
                    },
                    "NFComp.html#selectedLayers": {
                      "ref": "NFComp.html#selectedLayers",
                      "tf": 12.5
                    },
                    "NFComp.html#layerWithName": {
                      "ref": "NFComp.html#layerWithName",
                      "tf": 5.555555555555555
                    },
                    "NFComp.html#getZoomer": {
                      "ref": "NFComp.html#getZoomer",
                      "tf": 16.666666666666664
                    },
                    "NFComp.html#addNull": {
                      "ref": "NFComp.html#addNull",
                      "tf": 8.333333333333332
                    },
                    "NFLayer.html#isPageLayer": {
                      "ref": "NFLayer.html#isPageLayer",
                      "tf": 20
                    },
                    "NFLayer.html#isNullLayer": {
                      "ref": "NFLayer.html#isNullLayer",
                      "tf": 25
                    },
                    "NFLayer.html#isHighlightLayer": {
                      "ref": "NFLayer.html#isHighlightLayer",
                      "tf": 20
                    },
                    "NFLayer.html#isPaperParentLayer": {
                      "ref": "NFLayer.html#isPaperParentLayer",
                      "tf": 16.666666666666664
                    },
                    "NFLayer.html#getSpecializedLayer": {
                      "ref": "NFLayer.html#getSpecializedLayer",
                      "tf": 14.285714285714285
                    },
                    "NFLayer.html#hasNullParent": {
                      "ref": "NFLayer.html#hasNullParent",
                      "tf": 10
                    },
                    "NFLayer.html#sameLayerAs": {
                      "ref": "NFLayer.html#sameLayerAs",
                      "tf": 6.666666666666667
                    },
                    "NFLayer.html#getChildren": {
                      "ref": "NFLayer.html#getChildren",
                      "tf": 21.428571428571427
                    },
                    "NFLayer.html#setZoomer": {
                      "ref": "NFLayer.html#setZoomer",
                      "tf": 8.333333333333332
                    },
                    "NFLayer.html#moveBefore": {
                      "ref": "NFLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFLayer.html#moveAfter": {
                      "ref": "NFLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFLayer.html#markers": {
                      "ref": "NFLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "NFLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFLayer.html#addSlider": {
                      "ref": "NFLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFLayer.html#.isCompLayer": {
                      "ref": "NFLayer.html#.isCompLayer",
                      "tf": 6.25
                    },
                    "NFLayer.html#.isAVLayer": {
                      "ref": "NFLayer.html#.isAVLayer",
                      "tf": 32.69230769230769
                    },
                    "NFLayerCollection.html#inSameComp": {
                      "ref": "NFLayerCollection.html#inSameComp",
                      "tf": 8.333333333333332
                    },
                    "NFLayerCollection.html#containingComp": {
                      "ref": "NFLayerCollection.html#containingComp",
                      "tf": 7.142857142857142
                    },
                    "NFLayerCollection.html#count": {
                      "ref": "NFLayerCollection.html#count",
                      "tf": 10
                    },
                    "NFLayerCollection.html#remove": {
                      "ref": "NFLayerCollection.html#remove",
                      "tf": 12.5
                    },
                    "NFLayerCollection.html#setParents": {
                      "ref": "NFLayerCollection.html#setParents",
                      "tf": 7.142857142857142
                    },
                    "NFLayerCollection.html#nullify": {
                      "ref": "NFLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPDF.html#addNFPageItem": {
                      "ref": "NFPDF.html#addNFPageItem",
                      "tf": 20
                    },
                    "NFPageItem.html#highlights": {
                      "ref": "NFPageItem.html#highlights",
                      "tf": 12.5
                    },
                    "NFPaperLayerGroup.html": {
                      "ref": "NFPaperLayerGroup.html",
                      "tf": 6.25
                    },
                    "NFPaperLayerGroup.html#gatherLayers": {
                      "ref": "NFPaperLayerGroup.html#gatherLayers",
                      "tf": 10.526315789473683
                    },
                    "NFPageLayer.html": {
                      "ref": "NFPageLayer.html",
                      "tf": 12.5
                    },
                    "NFPageLayer.html#getPaperParentLayer": {
                      "ref": "NFPageLayer.html#getPaperParentLayer",
                      "tf": 4.545454545454546
                    },
                    "NFPageLayer.html#findPaperParentLayer": {
                      "ref": "NFPageLayer.html#findPaperParentLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPageLayer.html#isPageLayer": {
                      "ref": "NFPageLayer.html#isPageLayer",
                      "tf": 20
                    },
                    "NFPageLayer.html#isNullLayer": {
                      "ref": "NFPageLayer.html#isNullLayer",
                      "tf": 25
                    },
                    "NFPageLayer.html#isHighlightLayer": {
                      "ref": "NFPageLayer.html#isHighlightLayer",
                      "tf": 20
                    },
                    "NFPageLayer.html#isPaperParentLayer": {
                      "ref": "NFPageLayer.html#isPaperParentLayer",
                      "tf": 16.666666666666664
                    },
                    "NFPageLayer.html#getSpecializedLayer": {
                      "ref": "NFPageLayer.html#getSpecializedLayer",
                      "tf": 14.285714285714285
                    },
                    "NFPageLayer.html#hasNullParent": {
                      "ref": "NFPageLayer.html#hasNullParent",
                      "tf": 10
                    },
                    "NFPageLayer.html#sameLayerAs": {
                      "ref": "NFPageLayer.html#sameLayerAs",
                      "tf": 6.666666666666667
                    },
                    "NFPageLayer.html#getChildren": {
                      "ref": "NFPageLayer.html#getChildren",
                      "tf": 21.428571428571427
                    },
                    "NFPageLayer.html#setZoomer": {
                      "ref": "NFPageLayer.html#setZoomer",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayer.html#moveBefore": {
                      "ref": "NFPageLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPageLayer.html#moveAfter": {
                      "ref": "NFPageLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayer.html#markers": {
                      "ref": "NFPageLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayer.html#addSlider": {
                      "ref": "NFPageLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFPageLayerCollection.html": {
                      "ref": "NFPageLayerCollection.html",
                      "tf": 10
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayerCollection.html#inSameComp": {
                      "ref": "NFPageLayerCollection.html#inSameComp",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayerCollection.html#containingComp": {
                      "ref": "NFPageLayerCollection.html#containingComp",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayerCollection.html#count": {
                      "ref": "NFPageLayerCollection.html#count",
                      "tf": 10
                    },
                    "NFPageLayerCollection.html#remove": {
                      "ref": "NFPageLayerCollection.html#remove",
                      "tf": 12.5
                    },
                    "NFPageLayerCollection.html#setParents": {
                      "ref": "NFPageLayerCollection.html#setParents",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayerCollection.html#nullify": {
                      "ref": "NFPageLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html": {
                      "ref": "NFPaperParentLayer.html",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#setName": {
                      "ref": "NFPaperParentLayer.html#setName",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#.isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                      "tf": 36.111111111111114
                    },
                    "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                      "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPaperParentLayer.html#isPageLayer": {
                      "ref": "NFPaperParentLayer.html#isPageLayer",
                      "tf": 20
                    },
                    "NFPaperParentLayer.html#isNullLayer": {
                      "ref": "NFPaperParentLayer.html#isNullLayer",
                      "tf": 25
                    },
                    "NFPaperParentLayer.html#isHighlightLayer": {
                      "ref": "NFPaperParentLayer.html#isHighlightLayer",
                      "tf": 20
                    },
                    "NFPaperParentLayer.html#isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                      "tf": 16.666666666666664
                    },
                    "NFPaperParentLayer.html#getSpecializedLayer": {
                      "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                      "tf": 14.285714285714285
                    },
                    "NFPaperParentLayer.html#hasNullParent": {
                      "ref": "NFPaperParentLayer.html#hasNullParent",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#sameLayerAs": {
                      "ref": "NFPaperParentLayer.html#sameLayerAs",
                      "tf": 6.666666666666667
                    },
                    "NFPaperParentLayer.html#getChildren": {
                      "ref": "NFPaperParentLayer.html#getChildren",
                      "tf": 21.428571428571427
                    },
                    "NFPaperParentLayer.html#setZoomer": {
                      "ref": "NFPaperParentLayer.html#setZoomer",
                      "tf": 8.333333333333332
                    },
                    "NFPaperParentLayer.html#moveBefore": {
                      "ref": "NFPaperParentLayer.html#moveBefore",
                      "tf": 6.25
                    },
                    "NFPaperParentLayer.html#moveAfter": {
                      "ref": "NFPaperParentLayer.html#moveAfter",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#markers": {
                      "ref": "NFPaperParentLayer.html#markers",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                      "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#addSlider": {
                      "ref": "NFPaperParentLayer.html#addSlider",
                      "tf": 10
                    },
                    "NFPartComp.html": {
                      "ref": "NFPartComp.html",
                      "tf": 4.545454545454546
                    },
                    "NFPartComp.html#selectedLayers": {
                      "ref": "NFPartComp.html#selectedLayers",
                      "tf": 12.5
                    },
                    "NFPartComp.html#layerWithName": {
                      "ref": "NFPartComp.html#layerWithName",
                      "tf": 5.555555555555555
                    },
                    "NFPartComp.html#getZoomer": {
                      "ref": "NFPartComp.html#getZoomer",
                      "tf": 16.666666666666664
                    },
                    "NFPartComp.html#addNull": {
                      "ref": "NFPartComp.html#addNull",
                      "tf": 8.333333333333332
                    },
                    "LayerCollection.html#.toArr": {
                      "ref": "LayerCollection.html#.toArr",
                      "tf": 8.333333333333332
                    },
                    "Layer.html": {
                      "ref": "Layer.html",
                      "tf": 1916.6666666666667
                    },
                    "Layer.html#.removeMarker": {
                      "ref": "Layer.html#.removeMarker",
                      "tf": 25
                    },
                    "Property.html": {
                      "ref": "Property.html",
                      "tf": 16.666666666666664
                    }
                  },
                  "w": {
                    "docs": {},
                    "i": {
                      "docs": {},
                      "t": {
                        "docs": {},
                        "h": {
                          "docs": {},
                          "n": {
                            "docs": {},
                            "a": {
                              "docs": {},
                              "m": {
                                "docs": {
                                  "NFComp.html#layerWithName": {
                                    "ref": "NFComp.html#layerWithName",
                                    "tf": 683.3333333333334
                                  },
                                  "NFPartComp.html#layerWithName": {
                                    "ref": "NFPartComp.html#layerWithName",
                                    "tf": 683.3333333333334
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "'": {
                    "docs": {
                      "NFLayer.html#index": {
                        "ref": "NFLayer.html#index",
                        "tf": 16.666666666666664
                      },
                      "NFLayer.html#getParent": {
                        "ref": "NFLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFLayer.html#setParent": {
                        "ref": "NFLayer.html#setParent",
                        "tf": 10
                      },
                      "NFLayer.html#setZoomer": {
                        "ref": "NFLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFLayer.html#moveBefore": {
                        "ref": "NFLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFLayer.html#moveAfter": {
                        "ref": "NFLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#markers": {
                        "ref": "NFLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#index": {
                        "ref": "NFPageLayer.html#index",
                        "tf": 16.666666666666664
                      },
                      "NFPageLayer.html#getParent": {
                        "ref": "NFPageLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFPageLayer.html#setParent": {
                        "ref": "NFPageLayer.html#setParent",
                        "tf": 10
                      },
                      "NFPageLayer.html#setZoomer": {
                        "ref": "NFPageLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPageLayer.html#moveBefore": {
                        "ref": "NFPageLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPageLayer.html#moveAfter": {
                        "ref": "NFPageLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#markers": {
                        "ref": "NFPageLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#index": {
                        "ref": "NFPaperParentLayer.html#index",
                        "tf": 16.666666666666664
                      },
                      "NFPaperParentLayer.html#getParent": {
                        "ref": "NFPaperParentLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFPaperParentLayer.html#setParent": {
                        "ref": "NFPaperParentLayer.html#setParent",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#setZoomer": {
                        "ref": "NFPaperParentLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPaperParentLayer.html#moveBefore": {
                        "ref": "NFPaperParentLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPaperParentLayer.html#moveAfter": {
                        "ref": "NFPaperParentLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#markers": {
                        "ref": "NFPaperParentLayer.html#markers",
                        "tf": 7.142857142857142
                      }
                    }
                  },
                  "t": {
                    "docs": {},
                    "o": {
                      "docs": {},
                      "r": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "m": {
                            "docs": {},
                            "o": {
                              "docs": {},
                              "v": {
                                "docs": {
                                  "NFLayerCollection.html#remove": {
                                    "ref": "NFLayerCollection.html#remove",
                                    "tf": 33.33333333333333
                                  },
                                  "NFPageLayerCollection.html#remove": {
                                    "ref": "NFPageLayerCollection.html#remove",
                                    "tf": 33.33333333333333
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "s": {
                    "docs": {},
                    "t": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "g": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "h": {
                                "docs": {
                                  "NFPaperLayerGroup.html#gatherLayers": {
                                    "ref": "NFPaperLayerGroup.html#gatherLayers",
                                    "tf": 25
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "c": {
                    "docs": {},
                    "o": {
                      "docs": {},
                      "l": {
                        "docs": {},
                        "l": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "c": {
                              "docs": {},
                              "t": {
                                "docs": {
                                  "LayerCollection.html": {
                                    "ref": "LayerCollection.html",
                                    "tf": 1916.6666666666667
                                  }
                                },
                                "i": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      ".": {
                                        "docs": {},
                                        "t": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "a": {
                                              "docs": {},
                                              "r": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {
                                                    "LayerCollection.html#.toArr": {
                                                      "ref": "LayerCollection.html#.toArr",
                                                      "tf": 1150
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  ".": {
                    "docs": {},
                    "i": {
                      "docs": {},
                      "n": {
                        "docs": {},
                        "d": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "x": {
                              "docs": {},
                              "o": {
                                "docs": {},
                                "f": {
                                  "docs": {},
                                  "m": {
                                    "docs": {},
                                    "a": {
                                      "docs": {},
                                      "r": {
                                        "docs": {},
                                        "k": {
                                          "docs": {
                                            "Layer.html#.indexOfMarker": {
                                              "ref": "Layer.html#.indexOfMarker",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "r": {
                      "docs": {},
                      "e": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "o": {
                            "docs": {},
                            "v": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "m": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "r": {
                                      "docs": {},
                                      "k": {
                                        "docs": {
                                          "Layer.html#.removeMarker": {
                                            "ref": "Layer.html#.removeMarker",
                                            "tf": 1150
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "t": {
            "docs": {},
            ";": {
              "docs": {},
              "s": {
                "docs": {},
                "t": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "t": {
                      "docs": {},
                      "i": {
                        "docs": {},
                        "c": {
                          "docs": {},
                          "&": {
                            "docs": {},
                            "g": {
                              "docs": {},
                              "t": {
                                "docs": {
                                  "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                                    "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                                    "tf": 25
                                  },
                                  "NFLayer.html#.isCompLayer": {
                                    "ref": "NFLayer.html#.isCompLayer",
                                    "tf": 25
                                  },
                                  "NFLayer.html#.isAVLayer": {
                                    "ref": "NFLayer.html#.isAVLayer",
                                    "tf": 25
                                  },
                                  "NFLayerCollection.html#.collectionFromAVLayerArray": {
                                    "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                                    "tf": 33.33333333333333
                                  },
                                  "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                                    "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                                    "tf": 33.33333333333333
                                  },
                                  "NFPaperParentLayer.html#.isPaperParentLayer": {
                                    "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                                    "tf": 25
                                  },
                                  "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                                    "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                                    "tf": 25
                                  },
                                  "LayerCollection.html#.toArr": {
                                    "ref": "LayerCollection.html#.toArr",
                                    "tf": 33.33333333333333
                                  },
                                  "Layer.html#.indexOfMarker": {
                                    "ref": "Layer.html#.indexOfMarker",
                                    "tf": 25
                                  },
                                  "Layer.html#.removeMarker": {
                                    "ref": "Layer.html#.removeMarker",
                                    "tf": 25
                                  },
                                  "Property.html#.expressionStringForValue": {
                                    "ref": "Property.html#.expressionStringForValue",
                                    "tf": 33.33333333333333
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "w": {
              "docs": {},
              "e": {
                "docs": {},
                "s": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFLayerCollection.html#nullify": {
                        "ref": "NFLayerCollection.html#nullify",
                        "tf": 3.571428571428571
                      },
                      "NFPageLayerCollection.html#nullify": {
                        "ref": "NFPageLayerCollection.html#nullify",
                        "tf": 3.571428571428571
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "n": {
          "docs": {},
          "a": {
            "docs": {},
            "m": {
              "docs": {},
              "e": {
                "docs": {
                  "NFComp.html#layerWithName": {
                    "ref": "NFComp.html#layerWithName",
                    "tf": 38.888888888888886
                  },
                  "NFLayer.html#addSlider": {
                    "ref": "NFLayer.html#addSlider",
                    "tf": 25
                  },
                  "NFPageLayer.html#addSlider": {
                    "ref": "NFPageLayer.html#addSlider",
                    "tf": 25
                  },
                  "NFPaperParentLayer.html#setName": {
                    "ref": "NFPaperParentLayer.html#setName",
                    "tf": 14.285714285714285
                  },
                  "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                    "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                    "tf": 5.555555555555555
                  },
                  "NFPaperParentLayer.html#addSlider": {
                    "ref": "NFPaperParentLayer.html#addSlider",
                    "tf": 25
                  },
                  "NFPartComp.html#layerWithName": {
                    "ref": "NFPartComp.html#layerWithName",
                    "tf": 38.888888888888886
                  }
                },
                "s": {
                  "docs": {},
                  "p": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "c": {
                        "docs": {
                          "list_namespace.html": {
                            "ref": "list_namespace.html",
                            "tf": 635
                          },
                          "LayerCollection.html": {
                            "ref": "LayerCollection.html",
                            "tf": 110
                          },
                          "Layer.html": {
                            "ref": "Layer.html",
                            "tf": 110
                          },
                          "Property.html": {
                            "ref": "Property.html",
                            "tf": 110
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "f": {
            "docs": {
              "NFComp.html": {
                "ref": "NFComp.html",
                "tf": 6.25
              },
              "NFLayer.html": {
                "ref": "NFLayer.html",
                "tf": 12.5
              },
              "NFLayerCollection.html": {
                "ref": "NFLayerCollection.html",
                "tf": 8.333333333333332
              },
              "NFPDF.html": {
                "ref": "NFPDF.html",
                "tf": 10
              },
              "NFPageItem.html": {
                "ref": "NFPageItem.html",
                "tf": 10
              },
              "NFPartComp.html": {
                "ref": "NFPartComp.html",
                "tf": 4.545454545454546
              }
            },
            "c": {
              "docs": {},
              "o": {
                "docs": {},
                "m": {
                  "docs": {},
                  "p": {
                    "docs": {
                      "NFComp.html": {
                        "ref": "NFComp.html",
                        "tf": 1900
                      },
                      "NFLayer.html#containingComp": {
                        "ref": "NFLayer.html#containingComp",
                        "tf": 66.66666666666666
                      },
                      "NFPageLayer.html#containingComp": {
                        "ref": "NFPageLayer.html#containingComp",
                        "tf": 66.66666666666666
                      },
                      "NFPaperParentLayer.html#containingComp": {
                        "ref": "NFPaperParentLayer.html#containingComp",
                        "tf": 66.66666666666666
                      }
                    },
                    "#": {
                      "docs": {},
                      "s": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "l": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "c": {
                                "docs": {},
                                "t": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "d": {
                                      "docs": {},
                                      "l": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "y": {
                                            "docs": {
                                              "NFComp.html#selectedLayers": {
                                                "ref": "NFComp.html#selectedLayers",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "p": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "g": {
                                            "docs": {},
                                            "e": {
                                              "docs": {},
                                              "l": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "y": {
                                                    "docs": {
                                                      "NFComp.html#selectedPageLayers": {
                                                        "ref": "NFComp.html#selectedPageLayers",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "l": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "y": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "r": {
                                "docs": {},
                                "w": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "t": {
                                      "docs": {},
                                      "h": {
                                        "docs": {},
                                        "n": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "m": {
                                              "docs": {
                                                "NFComp.html#layerWithName": {
                                                  "ref": "NFComp.html#layerWithName",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "g": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "t": {
                            "docs": {},
                            "z": {
                              "docs": {},
                              "o": {
                                "docs": {},
                                "o": {
                                  "docs": {},
                                  "m": {
                                    "docs": {
                                      "NFComp.html#getZoomer": {
                                        "ref": "NFComp.html#getZoomer",
                                        "tf": 1150
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "i": {
                              "docs": {},
                              "n": {
                                "docs": {},
                                "f": {
                                  "docs": {},
                                  "o": {
                                    "docs": {
                                      "NFComp.html#getInfo": {
                                        "ref": "NFComp.html#getInfo",
                                        "tf": 1150
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "a": {
                        "docs": {},
                        "d": {
                          "docs": {},
                          "d": {
                            "docs": {},
                            "n": {
                              "docs": {},
                              "u": {
                                "docs": {},
                                "l": {
                                  "docs": {
                                    "NFComp.html#addNull": {
                                      "ref": "NFComp.html#addNull",
                                      "tf": 1150
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "|": {
                      "docs": {},
                      "n": {
                        "docs": {},
                        "u": {
                          "docs": {},
                          "l": {
                            "docs": {
                              "NFLayerCollection.html#containingComp": {
                                "ref": "NFLayerCollection.html#containingComp",
                                "tf": 50
                              },
                              "NFPageLayerCollection.html#containingComp": {
                                "ref": "NFPageLayerCollection.html#containingComp",
                                "tf": 50
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "l": {
              "docs": {},
              "a": {
                "docs": {},
                "y": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "r": {
                      "docs": {
                        "NFComp.html#layerWithName": {
                          "ref": "NFComp.html#layerWithName",
                          "tf": 5.555555555555555
                        },
                        "NFComp.html#addNull": {
                          "ref": "NFComp.html#addNull",
                          "tf": 50
                        },
                        "NFLayer.html": {
                          "ref": "NFLayer.html",
                          "tf": 1900
                        },
                        "NFLayer.html#sameLayerAs": {
                          "ref": "NFLayer.html#sameLayerAs",
                          "tf": 3.3333333333333335
                        },
                        "NFLayer.html#getParent": {
                          "ref": "NFLayer.html#getParent",
                          "tf": 12.5
                        },
                        "NFLayer.html#setParent": {
                          "ref": "NFLayer.html#setParent",
                          "tf": 43.33333333333333
                        },
                        "NFLayer.html#setZoomer": {
                          "ref": "NFLayer.html#setZoomer",
                          "tf": 50
                        },
                        "NFLayer.html#moveBefore": {
                          "ref": "NFLayer.html#moveBefore",
                          "tf": 33.33333333333333
                        },
                        "NFLayer.html#moveAfter": {
                          "ref": "NFLayer.html#moveAfter",
                          "tf": 33.33333333333333
                        },
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 33.33333333333333
                        },
                        "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                          "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html": {
                          "ref": "NFLayerCollection.html",
                          "tf": 8.333333333333332
                        },
                        "NFLayerCollection.html#addNFLayer": {
                          "ref": "NFLayerCollection.html#addNFLayer",
                          "tf": 16.666666666666664
                        },
                        "NFLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html#getTopmostLayer": {
                          "ref": "NFLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html#getBottommostLayer": {
                          "ref": "NFLayerCollection.html#getBottommostLayer",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html#setParents": {
                          "ref": "NFLayerCollection.html#setParents",
                          "tf": 7.142857142857142
                        },
                        "NFLayerCollection.html#nullify": {
                          "ref": "NFLayerCollection.html#nullify",
                          "tf": 50
                        },
                        "NFPaperLayerGroup.html#getChildren": {
                          "ref": "NFPaperLayerGroup.html#getChildren",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayer.html": {
                          "ref": "NFPageLayer.html",
                          "tf": 12.5
                        },
                        "NFPageLayer.html#sameLayerAs": {
                          "ref": "NFPageLayer.html#sameLayerAs",
                          "tf": 3.3333333333333335
                        },
                        "NFPageLayer.html#getParent": {
                          "ref": "NFPageLayer.html#getParent",
                          "tf": 12.5
                        },
                        "NFPageLayer.html#setParent": {
                          "ref": "NFPageLayer.html#setParent",
                          "tf": 43.33333333333333
                        },
                        "NFPageLayer.html#setZoomer": {
                          "ref": "NFPageLayer.html#setZoomer",
                          "tf": 50
                        },
                        "NFPageLayer.html#moveBefore": {
                          "ref": "NFPageLayer.html#moveBefore",
                          "tf": 33.33333333333333
                        },
                        "NFPageLayer.html#moveAfter": {
                          "ref": "NFPageLayer.html#moveAfter",
                          "tf": 33.33333333333333
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 33.33333333333333
                        },
                        "NFPageLayerCollection.html": {
                          "ref": "NFPageLayerCollection.html",
                          "tf": 5
                        },
                        "NFPageLayerCollection.html#addNFLayer": {
                          "ref": "NFPageLayerCollection.html#addNFLayer",
                          "tf": 16.666666666666664
                        },
                        "NFPageLayerCollection.html#onlyContainsPageLayers": {
                          "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#getTopmostLayer": {
                          "ref": "NFPageLayerCollection.html#getTopmostLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#getBottommostLayer": {
                          "ref": "NFPageLayerCollection.html#getBottommostLayer",
                          "tf": 12.5
                        },
                        "NFPageLayerCollection.html#setParents": {
                          "ref": "NFPageLayerCollection.html#setParents",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayerCollection.html#nullify": {
                          "ref": "NFPageLayerCollection.html#nullify",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html": {
                          "ref": "NFPaperParentLayer.html",
                          "tf": 5
                        },
                        "NFPaperParentLayer.html#sameLayerAs": {
                          "ref": "NFPaperParentLayer.html#sameLayerAs",
                          "tf": 3.3333333333333335
                        },
                        "NFPaperParentLayer.html#getParent": {
                          "ref": "NFPaperParentLayer.html#getParent",
                          "tf": 12.5
                        },
                        "NFPaperParentLayer.html#setParent": {
                          "ref": "NFPaperParentLayer.html#setParent",
                          "tf": 43.33333333333333
                        },
                        "NFPaperParentLayer.html#setZoomer": {
                          "ref": "NFPaperParentLayer.html#setZoomer",
                          "tf": 50
                        },
                        "NFPaperParentLayer.html#moveBefore": {
                          "ref": "NFPaperParentLayer.html#moveBefore",
                          "tf": 33.33333333333333
                        },
                        "NFPaperParentLayer.html#moveAfter": {
                          "ref": "NFPaperParentLayer.html#moveAfter",
                          "tf": 33.33333333333333
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 33.33333333333333
                        },
                        "NFPartComp.html#layerWithName": {
                          "ref": "NFPartComp.html#layerWithName",
                          "tf": 5.555555555555555
                        },
                        "NFPartComp.html#addNull": {
                          "ref": "NFPartComp.html#addNull",
                          "tf": 50
                        }
                      },
                      "c": {
                        "docs": {},
                        "o": {
                          "docs": {},
                          "l": {
                            "docs": {},
                            "l": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "c": {
                                  "docs": {},
                                  "t": {
                                    "docs": {
                                      "NFComp.html#selectedLayers": {
                                        "ref": "NFComp.html#selectedLayers",
                                        "tf": 50
                                      },
                                      "NFLayer.html#getChildren": {
                                        "ref": "NFLayer.html#getChildren",
                                        "tf": 57.14285714285714
                                      },
                                      "NFLayerCollection.html": {
                                        "ref": "NFLayerCollection.html",
                                        "tf": 1900
                                      },
                                      "NFLayerCollection.html#addNFLayer": {
                                        "ref": "NFLayerCollection.html#addNFLayer",
                                        "tf": 33.33333333333333
                                      },
                                      "NFLayerCollection.html#remove": {
                                        "ref": "NFLayerCollection.html#remove",
                                        "tf": 33.33333333333333
                                      },
                                      "NFLayerCollection.html#setParents": {
                                        "ref": "NFLayerCollection.html#setParents",
                                        "tf": 33.33333333333333
                                      },
                                      "NFLayerCollection.html#.collectionFromAVLayerArray": {
                                        "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                                        "tf": 40.47619047619047
                                      },
                                      "NFPaperLayerGroup.html#getChildren": {
                                        "ref": "NFPaperLayerGroup.html#getChildren",
                                        "tf": 50
                                      },
                                      "NFPageLayer.html#getChildren": {
                                        "ref": "NFPageLayer.html#getChildren",
                                        "tf": 57.14285714285714
                                      },
                                      "NFPageLayerCollection.html#addNFLayer": {
                                        "ref": "NFPageLayerCollection.html#addNFLayer",
                                        "tf": 33.33333333333333
                                      },
                                      "NFPageLayerCollection.html#remove": {
                                        "ref": "NFPageLayerCollection.html#remove",
                                        "tf": 33.33333333333333
                                      },
                                      "NFPageLayerCollection.html#setParents": {
                                        "ref": "NFPageLayerCollection.html#setParents",
                                        "tf": 33.33333333333333
                                      },
                                      "NFPaperParentLayer.html#getChildren": {
                                        "ref": "NFPaperParentLayer.html#getChildren",
                                        "tf": 57.14285714285714
                                      },
                                      "NFPartComp.html#selectedLayers": {
                                        "ref": "NFPartComp.html#selectedLayers",
                                        "tf": 50
                                      }
                                    },
                                    "i": {
                                      "docs": {},
                                      "o": {
                                        "docs": {},
                                        "n": {
                                          "docs": {},
                                          "#": {
                                            "docs": {},
                                            "a": {
                                              "docs": {},
                                              "d": {
                                                "docs": {},
                                                "d": {
                                                  "docs": {},
                                                  "n": {
                                                    "docs": {},
                                                    "f": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {
                                                              "NFLayerCollection.html#addNFLayer": {
                                                                "ref": "NFLayerCollection.html#addNFLayer",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "o": {
                                              "docs": {},
                                              "n": {
                                                "docs": {},
                                                "l": {
                                                  "docs": {},
                                                  "y": {
                                                    "docs": {},
                                                    "c": {
                                                      "docs": {},
                                                      "o": {
                                                        "docs": {},
                                                        "n": {
                                                          "docs": {},
                                                          "t": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "i": {
                                                                "docs": {},
                                                                "n": {
                                                                  "docs": {},
                                                                  "s": {
                                                                    "docs": {},
                                                                    "p": {
                                                                      "docs": {},
                                                                      "a": {
                                                                        "docs": {},
                                                                        "g": {
                                                                          "docs": {},
                                                                          "e": {
                                                                            "docs": {},
                                                                            "l": {
                                                                              "docs": {},
                                                                              "a": {
                                                                                "docs": {},
                                                                                "y": {
                                                                                  "docs": {
                                                                                    "NFLayerCollection.html#onlyContainsPageLayers": {
                                                                                      "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                                                                                      "tf": 1150
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "i": {
                                              "docs": {},
                                              "n": {
                                                "docs": {},
                                                "s": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {},
                                                    "m": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "c": {
                                                          "docs": {},
                                                          "o": {
                                                            "docs": {},
                                                            "m": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {
                                                                  "NFLayerCollection.html#inSameComp": {
                                                                    "ref": "NFLayerCollection.html#inSameComp",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "s": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "m": {
                                                    "docs": {},
                                                    "p": {
                                                      "docs": {},
                                                      "t": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {
                                                            "NFLayerCollection.html#isEmpty": {
                                                              "ref": "NFLayerCollection.html#isEmpty",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "c": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "n": {
                                                  "docs": {},
                                                  "t": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "i": {
                                                        "docs": {},
                                                        "n": {
                                                          "docs": {},
                                                          "i": {
                                                            "docs": {},
                                                            "n": {
                                                              "docs": {},
                                                              "g": {
                                                                "docs": {},
                                                                "c": {
                                                                  "docs": {},
                                                                  "o": {
                                                                    "docs": {},
                                                                    "m": {
                                                                      "docs": {},
                                                                      "p": {
                                                                        "docs": {
                                                                          "NFLayerCollection.html#containingComp": {
                                                                            "ref": "NFLayerCollection.html#containingComp",
                                                                            "tf": 1150
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                },
                                                "u": {
                                                  "docs": {},
                                                  "n": {
                                                    "docs": {},
                                                    "t": {
                                                      "docs": {
                                                        "NFLayerCollection.html#count": {
                                                          "ref": "NFLayerCollection.html#count",
                                                          "tf": 1150
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "g": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "g": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {},
                                                                "e": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "c": {
                                                                      "docs": {},
                                                                      "o": {
                                                                        "docs": {},
                                                                        "l": {
                                                                          "docs": {},
                                                                          "l": {
                                                                            "docs": {},
                                                                            "e": {
                                                                              "docs": {},
                                                                              "c": {
                                                                                "docs": {},
                                                                                "t": {
                                                                                  "docs": {
                                                                                    "NFLayerCollection.html#getPageLayerCollection": {
                                                                                      "ref": "NFLayerCollection.html#getPageLayerCollection",
                                                                                      "tf": 1150
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "t": {
                                                    "docs": {},
                                                    "o": {
                                                      "docs": {},
                                                      "p": {
                                                        "docs": {},
                                                        "m": {
                                                          "docs": {},
                                                          "o": {
                                                            "docs": {},
                                                            "s": {
                                                              "docs": {},
                                                              "t": {
                                                                "docs": {},
                                                                "l": {
                                                                  "docs": {},
                                                                  "a": {
                                                                    "docs": {},
                                                                    "y": {
                                                                      "docs": {
                                                                        "NFLayerCollection.html#getTopmostLayer": {
                                                                          "ref": "NFLayerCollection.html#getTopmostLayer",
                                                                          "tf": 1150
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "b": {
                                                    "docs": {},
                                                    "o": {
                                                      "docs": {},
                                                      "t": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "o": {
                                                            "docs": {},
                                                            "m": {
                                                              "docs": {},
                                                              "m": {
                                                                "docs": {},
                                                                "o": {
                                                                  "docs": {},
                                                                  "s": {
                                                                    "docs": {},
                                                                    "t": {
                                                                      "docs": {},
                                                                      "l": {
                                                                        "docs": {},
                                                                        "a": {
                                                                          "docs": {},
                                                                          "y": {
                                                                            "docs": {
                                                                              "NFLayerCollection.html#getBottommostLayer": {
                                                                                "ref": "NFLayerCollection.html#getBottommostLayer",
                                                                                "tf": 1150
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "r": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "m": {
                                                  "docs": {},
                                                  "o": {
                                                    "docs": {},
                                                    "v": {
                                                      "docs": {
                                                        "NFLayerCollection.html#remove": {
                                                          "ref": "NFLayerCollection.html#remove",
                                                          "tf": 1150
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "s": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {
                                                          "NFLayerCollection.html#setParents": {
                                                            "ref": "NFLayerCollection.html#setParents",
                                                            "tf": 1150
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "n": {
                                              "docs": {},
                                              "u": {
                                                "docs": {},
                                                "l": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {},
                                                    "i": {
                                                      "docs": {},
                                                      "f": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {
                                                            "NFLayerCollection.html#nullify": {
                                                              "ref": "NFLayerCollection.html#nullify",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          },
                                          ".": {
                                            "docs": {},
                                            "c": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "l": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "c": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "i": {
                                                            "docs": {},
                                                            "o": {
                                                              "docs": {},
                                                              "n": {
                                                                "docs": {},
                                                                "f": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "o": {
                                                                      "docs": {},
                                                                      "m": {
                                                                        "docs": {},
                                                                        "a": {
                                                                          "docs": {},
                                                                          "v": {
                                                                            "docs": {},
                                                                            "l": {
                                                                              "docs": {},
                                                                              "a": {
                                                                                "docs": {},
                                                                                "y": {
                                                                                  "docs": {},
                                                                                  "e": {
                                                                                    "docs": {},
                                                                                    "r": {
                                                                                      "docs": {},
                                                                                      "a": {
                                                                                        "docs": {},
                                                                                        "r": {
                                                                                          "docs": {},
                                                                                          "r": {
                                                                                            "docs": {},
                                                                                            "a": {
                                                                                              "docs": {},
                                                                                              "y": {
                                                                                                "docs": {
                                                                                                  "NFLayerCollection.html#.collectionFromAVLayerArray": {
                                                                                                    "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                                                                                                    "tf": 1150
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "|": {
                        "docs": {},
                        "n": {
                          "docs": {},
                          "u": {
                            "docs": {},
                            "l": {
                              "docs": {
                                "NFComp.html#layerWithName": {
                                  "ref": "NFComp.html#layerWithName",
                                  "tf": 33.33333333333333
                                },
                                "NFComp.html#getZoomer": {
                                  "ref": "NFComp.html#getZoomer",
                                  "tf": 50
                                },
                                "NFLayer.html#getParent": {
                                  "ref": "NFLayer.html#getParent",
                                  "tf": 50
                                },
                                "NFLayerCollection.html#getTopmostLayer": {
                                  "ref": "NFLayerCollection.html#getTopmostLayer",
                                  "tf": 50
                                },
                                "NFLayerCollection.html#getBottommostLayer": {
                                  "ref": "NFLayerCollection.html#getBottommostLayer",
                                  "tf": 50
                                },
                                "NFPageLayer.html#getParent": {
                                  "ref": "NFPageLayer.html#getParent",
                                  "tf": 50
                                },
                                "NFPageLayerCollection.html#getTopmostLayer": {
                                  "ref": "NFPageLayerCollection.html#getTopmostLayer",
                                  "tf": 50
                                },
                                "NFPageLayerCollection.html#getBottommostLayer": {
                                  "ref": "NFPageLayerCollection.html#getBottommostLayer",
                                  "tf": 50
                                },
                                "NFPaperParentLayer.html#getParent": {
                                  "ref": "NFPaperParentLayer.html#getParent",
                                  "tf": 50
                                },
                                "NFPartComp.html#layerWithName": {
                                  "ref": "NFPartComp.html#layerWithName",
                                  "tf": 33.33333333333333
                                },
                                "NFPartComp.html#getZoomer": {
                                  "ref": "NFPartComp.html#getZoomer",
                                  "tf": 50
                                }
                              }
                            }
                          },
                          "f": {
                            "docs": {},
                            "h": {
                              "docs": {},
                              "i": {
                                "docs": {},
                                "g": {
                                  "docs": {},
                                  "h": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "h": {
                                            "docs": {},
                                            "t": {
                                              "docs": {},
                                              "l": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "y": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "|": {
                                                          "docs": {},
                                                          "n": {
                                                            "docs": {},
                                                            "f": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "g": {
                                                                    "docs": {},
                                                                    "e": {
                                                                      "docs": {},
                                                                      "l": {
                                                                        "docs": {},
                                                                        "a": {
                                                                          "docs": {},
                                                                          "y": {
                                                                            "docs": {},
                                                                            "e": {
                                                                              "docs": {},
                                                                              "r": {
                                                                                "docs": {},
                                                                                "|": {
                                                                                  "docs": {},
                                                                                  "n": {
                                                                                    "docs": {},
                                                                                    "f": {
                                                                                      "docs": {},
                                                                                      "e": {
                                                                                        "docs": {},
                                                                                        "m": {
                                                                                          "docs": {},
                                                                                          "p": {
                                                                                            "docs": {},
                                                                                            "h": {
                                                                                              "docs": {},
                                                                                              "a": {
                                                                                                "docs": {},
                                                                                                "s": {
                                                                                                  "docs": {},
                                                                                                  "i": {
                                                                                                    "docs": {},
                                                                                                    "s": {
                                                                                                      "docs": {},
                                                                                                      "l": {
                                                                                                        "docs": {},
                                                                                                        "a": {
                                                                                                          "docs": {},
                                                                                                          "y": {
                                                                                                            "docs": {},
                                                                                                            "e": {
                                                                                                              "docs": {},
                                                                                                              "r": {
                                                                                                                "docs": {},
                                                                                                                "|": {
                                                                                                                  "docs": {},
                                                                                                                  "n": {
                                                                                                                    "docs": {},
                                                                                                                    "f": {
                                                                                                                      "docs": {},
                                                                                                                      "g": {
                                                                                                                        "docs": {},
                                                                                                                        "a": {
                                                                                                                          "docs": {},
                                                                                                                          "u": {
                                                                                                                            "docs": {},
                                                                                                                            "s": {
                                                                                                                              "docs": {},
                                                                                                                              "s": {
                                                                                                                                "docs": {},
                                                                                                                                "y": {
                                                                                                                                  "docs": {},
                                                                                                                                  "l": {
                                                                                                                                    "docs": {},
                                                                                                                                    "a": {
                                                                                                                                      "docs": {},
                                                                                                                                      "y": {
                                                                                                                                        "docs": {},
                                                                                                                                        "e": {
                                                                                                                                          "docs": {},
                                                                                                                                          "r": {
                                                                                                                                            "docs": {},
                                                                                                                                            "|": {
                                                                                                                                              "docs": {},
                                                                                                                                              "n": {
                                                                                                                                                "docs": {},
                                                                                                                                                "f": {
                                                                                                                                                  "docs": {},
                                                                                                                                                  "i": {
                                                                                                                                                    "docs": {},
                                                                                                                                                    "m": {
                                                                                                                                                      "docs": {},
                                                                                                                                                      "a": {
                                                                                                                                                        "docs": {},
                                                                                                                                                        "g": {
                                                                                                                                                          "docs": {},
                                                                                                                                                          "e": {
                                                                                                                                                            "docs": {},
                                                                                                                                                            "l": {
                                                                                                                                                              "docs": {},
                                                                                                                                                              "a": {
                                                                                                                                                                "docs": {},
                                                                                                                                                                "y": {
                                                                                                                                                                  "docs": {
                                                                                                                                                                    "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                                                                                                                                                                      "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                                                                                                                                                                      "tf": 25
                                                                                                                                                                    }
                                                                                                                                                                  }
                                                                                                                                                                }
                                                                                                                                                              }
                                                                                                                                                            }
                                                                                                                                                          }
                                                                                                                                                        }
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  }
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "#": {
                        "docs": {},
                        "i": {
                          "docs": {},
                          "s": {
                            "docs": {},
                            "p": {
                              "docs": {},
                              "a": {
                                "docs": {},
                                "g": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFLayer.html#isPageLayer": {
                                              "ref": "NFLayer.html#isPageLayer",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "p": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "r": {
                                      "docs": {},
                                      "p": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "r": {
                                            "docs": {},
                                            "e": {
                                              "docs": {},
                                              "n": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "y": {
                                                        "docs": {
                                                          "NFLayer.html#isPaperParentLayer": {
                                                            "ref": "NFLayer.html#isPaperParentLayer",
                                                            "tf": 1150
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "n": {
                              "docs": {},
                              "u": {
                                "docs": {},
                                "l": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFLayer.html#isNullLayer": {
                                              "ref": "NFLayer.html#isNullLayer",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "h": {
                              "docs": {},
                              "i": {
                                "docs": {},
                                "g": {
                                  "docs": {},
                                  "h": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "h": {
                                            "docs": {},
                                            "t": {
                                              "docs": {},
                                              "l": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "y": {
                                                    "docs": {
                                                      "NFLayer.html#isHighlightLayer": {
                                                        "ref": "NFLayer.html#isHighlightLayer",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "n": {
                            "docs": {},
                            "d": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "x": {
                                  "docs": {
                                    "NFLayer.html#index": {
                                      "ref": "NFLayer.html#index",
                                      "tf": 1150
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "g": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "s": {
                                "docs": {},
                                "p": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "c": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "l": {
                                            "docs": {},
                                            "i": {
                                              "docs": {},
                                              "z": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "d": {
                                                    "docs": {},
                                                    "l": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "y": {
                                                          "docs": {
                                                            "NFLayer.html#getSpecializedLayer": {
                                                              "ref": "NFLayer.html#getSpecializedLayer",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "c": {
                                "docs": {},
                                "h": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "d": {
                                        "docs": {},
                                        "r": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "n": {
                                              "docs": {
                                                "NFLayer.html#getChildren": {
                                                  "ref": "NFLayer.html#getChildren",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "p": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "r": {
                                    "docs": {
                                      "NFLayer.html#getParent": {
                                        "ref": "NFLayer.html#getParent",
                                        "tf": 1150
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "h": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "s": {
                              "docs": {},
                              "n": {
                                "docs": {},
                                "u": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "p": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "r": {
                                            "docs": {
                                              "NFLayer.html#hasNullParent": {
                                                "ref": "NFLayer.html#hasNullParent",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "s": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "m": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "l": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "y": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "r": {
                                          "docs": {},
                                          "a": {
                                            "docs": {
                                              "NFLayer.html#sameLayerAs": {
                                                "ref": "NFLayer.html#sameLayerAs",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "e": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "p": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "r": {
                                    "docs": {
                                      "NFLayer.html#setParent": {
                                        "ref": "NFLayer.html#setParent",
                                        "tf": 1150
                                      }
                                    }
                                  }
                                }
                              },
                              "z": {
                                "docs": {},
                                "o": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "m": {
                                      "docs": {
                                        "NFLayer.html#setZoomer": {
                                          "ref": "NFLayer.html#setZoomer",
                                          "tf": 1150
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "c": {
                          "docs": {},
                          "o": {
                            "docs": {},
                            "n": {
                              "docs": {},
                              "t": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "n": {
                                          "docs": {},
                                          "g": {
                                            "docs": {},
                                            "c": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "m": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {
                                                      "NFLayer.html#containingComp": {
                                                        "ref": "NFLayer.html#containingComp",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "m": {
                          "docs": {},
                          "o": {
                            "docs": {},
                            "v": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "b": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "f": {
                                      "docs": {},
                                      "o": {
                                        "docs": {},
                                        "r": {
                                          "docs": {
                                            "NFLayer.html#moveBefore": {
                                              "ref": "NFLayer.html#moveBefore",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "a": {
                                  "docs": {},
                                  "f": {
                                    "docs": {},
                                    "t": {
                                      "docs": {
                                        "NFLayer.html#moveAfter": {
                                          "ref": "NFLayer.html#moveAfter",
                                          "tf": 1150
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "a": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "k": {
                                "docs": {
                                  "NFLayer.html#markers": {
                                    "ref": "NFLayer.html#markers",
                                    "tf": 1150
                                  }
                                }
                              }
                            }
                          }
                        },
                        "a": {
                          "docs": {},
                          "d": {
                            "docs": {},
                            "d": {
                              "docs": {},
                              "i": {
                                "docs": {},
                                "n": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "u": {
                                      "docs": {},
                                      "t": {
                                        "docs": {},
                                        "m": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "r": {
                                              "docs": {},
                                              "k": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "r": {
                                                    "docs": {},
                                                    "s": {
                                                      "docs": {},
                                                      "f": {
                                                        "docs": {},
                                                        "o": {
                                                          "docs": {},
                                                          "r": {
                                                            "docs": {},
                                                            "p": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {},
                                                                "o": {
                                                                  "docs": {},
                                                                  "p": {
                                                                    "docs": {},
                                                                    "e": {
                                                                      "docs": {},
                                                                      "r": {
                                                                        "docs": {},
                                                                        "t": {
                                                                          "docs": {},
                                                                          "i": {
                                                                            "docs": {
                                                                              "NFLayer.html#addInOutMarkersForProperty": {
                                                                                "ref": "NFLayer.html#addInOutMarkersForProperty",
                                                                                "tf": 1150
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "s": {
                                "docs": {},
                                "l": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "d": {
                                      "docs": {
                                        "NFLayer.html#addSlider": {
                                          "ref": "NFLayer.html#addSlider",
                                          "tf": 1150
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "'": {
                        "docs": {
                          "NFLayer.html#sameLayerAs": {
                            "ref": "NFLayer.html#sameLayerAs",
                            "tf": 3.3333333333333335
                          },
                          "NFPageLayer.html#sameLayerAs": {
                            "ref": "NFPageLayer.html#sameLayerAs",
                            "tf": 3.3333333333333335
                          },
                          "NFPaperParentLayer.html#sameLayerAs": {
                            "ref": "NFPaperParentLayer.html#sameLayerAs",
                            "tf": 3.3333333333333335
                          }
                        }
                      },
                      ".": {
                        "docs": {},
                        "g": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "s": {
                                "docs": {},
                                "p": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "c": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "l": {
                                            "docs": {},
                                            "i": {
                                              "docs": {},
                                              "z": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "d": {
                                                    "docs": {},
                                                    "l": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "y": {
                                                          "docs": {},
                                                          "e": {
                                                            "docs": {},
                                                            "r": {
                                                              "docs": {},
                                                              "f": {
                                                                "docs": {},
                                                                "r": {
                                                                  "docs": {},
                                                                  "o": {
                                                                    "docs": {},
                                                                    "m": {
                                                                      "docs": {},
                                                                      "a": {
                                                                        "docs": {},
                                                                        "v": {
                                                                          "docs": {},
                                                                          "l": {
                                                                            "docs": {},
                                                                            "a": {
                                                                              "docs": {},
                                                                              "y": {
                                                                                "docs": {
                                                                                  "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                                                                                    "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                                                                                    "tf": 1150
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        },
                        "i": {
                          "docs": {},
                          "s": {
                            "docs": {},
                            "c": {
                              "docs": {},
                              "o": {
                                "docs": {},
                                "m": {
                                  "docs": {},
                                  "p": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFLayer.html#.isCompLayer": {
                                              "ref": "NFLayer.html#.isCompLayer",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            },
                            "a": {
                              "docs": {},
                              "v": {
                                "docs": {},
                                "l": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "y": {
                                      "docs": {
                                        "NFLayer.html#.isAVLayer": {
                                          "ref": "NFLayer.html#.isAVLayer",
                                          "tf": 1150
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "p": {
              "docs": {},
              "a": {
                "docs": {},
                "g": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "y": {
                          "docs": {
                            "NFLayer.html#sameLayerAs": {
                              "ref": "NFLayer.html#sameLayerAs",
                              "tf": 3.3333333333333335
                            },
                            "NFLayerCollection.html#onlyContainsPageLayers": {
                              "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                              "tf": 7.142857142857142
                            },
                            "NFLayerCollection.html#getPageLayerCollection": {
                              "ref": "NFLayerCollection.html#getPageLayerCollection",
                              "tf": 5.555555555555555
                            },
                            "NFPaperLayerGroup.html#getPages": {
                              "ref": "NFPaperLayerGroup.html#getPages",
                              "tf": 16.666666666666664
                            },
                            "NFPageLayer.html": {
                              "ref": "NFPageLayer.html",
                              "tf": 1900
                            },
                            "NFPageLayer.html#sameLayerAs": {
                              "ref": "NFPageLayer.html#sameLayerAs",
                              "tf": 3.3333333333333335
                            },
                            "NFPageLayerCollection.html#addNFPageLayer": {
                              "ref": "NFPageLayerCollection.html#addNFPageLayer",
                              "tf": 16.666666666666664
                            },
                            "NFPageLayerCollection.html#onlyContainsPageLayers": {
                              "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                              "tf": 7.142857142857142
                            },
                            "NFPageLayerCollection.html#getPageLayerCollection": {
                              "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                              "tf": 5.555555555555555
                            },
                            "NFPaperParentLayer.html#sameLayerAs": {
                              "ref": "NFPaperParentLayer.html#sameLayerAs",
                              "tf": 3.3333333333333335
                            }
                          },
                          "e": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "c": {
                                "docs": {},
                                "o": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "c": {
                                          "docs": {},
                                          "t": {
                                            "docs": {
                                              "NFComp.html#selectedPageLayers": {
                                                "ref": "NFComp.html#selectedPageLayers",
                                                "tf": 50
                                              },
                                              "NFLayerCollection.html#getPageLayerCollection": {
                                                "ref": "NFLayerCollection.html#getPageLayerCollection",
                                                "tf": 55.55555555555556
                                              },
                                              "NFPaperLayerGroup.html#getPages": {
                                                "ref": "NFPaperLayerGroup.html#getPages",
                                                "tf": 50
                                              },
                                              "NFPageLayerCollection.html": {
                                                "ref": "NFPageLayerCollection.html",
                                                "tf": 1900
                                              },
                                              "NFPageLayerCollection.html#addNFPageLayer": {
                                                "ref": "NFPageLayerCollection.html#addNFPageLayer",
                                                "tf": 33.33333333333333
                                              },
                                              "NFPageLayerCollection.html#addAVLayer": {
                                                "ref": "NFPageLayerCollection.html#addAVLayer",
                                                "tf": 33.33333333333333
                                              },
                                              "NFPageLayerCollection.html#initLayers": {
                                                "ref": "NFPageLayerCollection.html#initLayers",
                                                "tf": 50
                                              },
                                              "NFPageLayerCollection.html#initLayerTransforms": {
                                                "ref": "NFPageLayerCollection.html#initLayerTransforms",
                                                "tf": 50
                                              },
                                              "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                                                "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                                                "tf": 33.33333333333333
                                              },
                                              "NFPageLayerCollection.html#getPageLayerCollection": {
                                                "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                                                "tf": 55.55555555555556
                                              },
                                              "NFPartComp.html#selectedPageLayers": {
                                                "ref": "NFPartComp.html#selectedPageLayers",
                                                "tf": 50
                                              }
                                            },
                                            "i": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "n": {
                                                  "docs": {},
                                                  "#": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "d": {
                                                        "docs": {},
                                                        "d": {
                                                          "docs": {},
                                                          "n": {
                                                            "docs": {},
                                                            "f": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "g": {
                                                                    "docs": {},
                                                                    "e": {
                                                                      "docs": {},
                                                                      "l": {
                                                                        "docs": {},
                                                                        "a": {
                                                                          "docs": {},
                                                                          "y": {
                                                                            "docs": {
                                                                              "NFPageLayerCollection.html#addNFPageLayer": {
                                                                                "ref": "NFPageLayerCollection.html#addNFPageLayer",
                                                                                "tf": 1150
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              },
                                                              "l": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "y": {
                                                                    "docs": {
                                                                      "NFPageLayerCollection.html#addNFLayer": {
                                                                        "ref": "NFPageLayerCollection.html#addNFLayer",
                                                                        "tf": 1150
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          },
                                                          "a": {
                                                            "docs": {},
                                                            "v": {
                                                              "docs": {},
                                                              "l": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "y": {
                                                                    "docs": {
                                                                      "NFPageLayerCollection.html#addAVLayer": {
                                                                        "ref": "NFPageLayerCollection.html#addAVLayer",
                                                                        "tf": 1150
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "s": {
                                                        "docs": {},
                                                        "s": {
                                                          "docs": {},
                                                          "i": {
                                                            "docs": {},
                                                            "g": {
                                                              "docs": {},
                                                              "n": {
                                                                "docs": {},
                                                                "p": {
                                                                  "docs": {},
                                                                  "a": {
                                                                    "docs": {},
                                                                    "p": {
                                                                      "docs": {},
                                                                      "e": {
                                                                        "docs": {},
                                                                        "r": {
                                                                          "docs": {},
                                                                          "p": {
                                                                            "docs": {},
                                                                            "a": {
                                                                              "docs": {},
                                                                              "r": {
                                                                                "docs": {},
                                                                                "e": {
                                                                                  "docs": {},
                                                                                  "n": {
                                                                                    "docs": {},
                                                                                    "t": {
                                                                                      "docs": {},
                                                                                      "l": {
                                                                                        "docs": {},
                                                                                        "a": {
                                                                                          "docs": {},
                                                                                          "y": {
                                                                                            "docs": {
                                                                                              "NFPageLayerCollection.html#assignPaperParentLayer": {
                                                                                                "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                                                                                                "tf": 1150
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "h": {
                                                      "docs": {},
                                                      "i": {
                                                        "docs": {},
                                                        "g": {
                                                          "docs": {},
                                                          "h": {
                                                            "docs": {},
                                                            "l": {
                                                              "docs": {},
                                                              "i": {
                                                                "docs": {},
                                                                "g": {
                                                                  "docs": {},
                                                                  "h": {
                                                                    "docs": {},
                                                                    "t": {
                                                                      "docs": {
                                                                        "NFPageLayerCollection.html#highlights": {
                                                                          "ref": "NFPageLayerCollection.html#highlights",
                                                                          "tf": 1150
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "f": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "o": {
                                                          "docs": {},
                                                          "m": {
                                                            "docs": {},
                                                            "s": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "m": {
                                                                  "docs": {},
                                                                  "e": {
                                                                    "docs": {},
                                                                    "p": {
                                                                      "docs": {},
                                                                      "d": {
                                                                        "docs": {},
                                                                        "f": {
                                                                          "docs": {
                                                                            "NFPageLayerCollection.html#fromSamePDF": {
                                                                              "ref": "NFPageLayerCollection.html#fromSamePDF",
                                                                              "tf": 1150
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "i": {
                                                      "docs": {},
                                                      "n": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {},
                                                          "t": {
                                                            "docs": {},
                                                            "l": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "y": {
                                                                  "docs": {
                                                                    "NFPageLayerCollection.html#initLayers": {
                                                                      "ref": "NFPageLayerCollection.html#initLayers",
                                                                      "tf": 1150
                                                                    }
                                                                  },
                                                                  "e": {
                                                                    "docs": {},
                                                                    "r": {
                                                                      "docs": {},
                                                                      "t": {
                                                                        "docs": {},
                                                                        "r": {
                                                                          "docs": {},
                                                                          "a": {
                                                                            "docs": {},
                                                                            "n": {
                                                                              "docs": {},
                                                                              "s": {
                                                                                "docs": {},
                                                                                "f": {
                                                                                  "docs": {},
                                                                                  "o": {
                                                                                    "docs": {},
                                                                                    "r": {
                                                                                      "docs": {},
                                                                                      "m": {
                                                                                        "docs": {
                                                                                          "NFPageLayerCollection.html#initLayerTransforms": {
                                                                                            "ref": "NFPageLayerCollection.html#initLayerTransforms",
                                                                                            "tf": 1150
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        },
                                                        "s": {
                                                          "docs": {},
                                                          "a": {
                                                            "docs": {},
                                                            "m": {
                                                              "docs": {},
                                                              "e": {
                                                                "docs": {},
                                                                "c": {
                                                                  "docs": {},
                                                                  "o": {
                                                                    "docs": {},
                                                                    "m": {
                                                                      "docs": {},
                                                                      "p": {
                                                                        "docs": {
                                                                          "NFPageLayerCollection.html#inSameComp": {
                                                                            "ref": "NFPageLayerCollection.html#inSameComp",
                                                                            "tf": 1150
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "s": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "m": {
                                                            "docs": {},
                                                            "p": {
                                                              "docs": {},
                                                              "t": {
                                                                "docs": {},
                                                                "i": {
                                                                  "docs": {
                                                                    "NFPageLayerCollection.html#isEmpty": {
                                                                      "ref": "NFPageLayerCollection.html#isEmpty",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "n": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "w": {
                                                          "docs": {},
                                                          "p": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {},
                                                                "e": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "p": {
                                                                      "docs": {},
                                                                      "a": {
                                                                        "docs": {},
                                                                        "r": {
                                                                          "docs": {},
                                                                          "e": {
                                                                            "docs": {},
                                                                            "n": {
                                                                              "docs": {},
                                                                              "t": {
                                                                                "docs": {},
                                                                                "l": {
                                                                                  "docs": {},
                                                                                  "a": {
                                                                                    "docs": {},
                                                                                    "y": {
                                                                                      "docs": {
                                                                                        "NFPageLayerCollection.html#newPaperParentLayer": {
                                                                                          "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                                                                                          "tf": 1150
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "u": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "i": {
                                                              "docs": {},
                                                              "f": {
                                                                "docs": {},
                                                                "i": {
                                                                  "docs": {
                                                                    "NFPageLayerCollection.html#nullify": {
                                                                      "ref": "NFPageLayerCollection.html#nullify",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "o": {
                                                      "docs": {},
                                                      "n": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {},
                                                            "c": {
                                                              "docs": {},
                                                              "o": {
                                                                "docs": {},
                                                                "n": {
                                                                  "docs": {},
                                                                  "t": {
                                                                    "docs": {},
                                                                    "a": {
                                                                      "docs": {},
                                                                      "i": {
                                                                        "docs": {},
                                                                        "n": {
                                                                          "docs": {},
                                                                          "s": {
                                                                            "docs": {},
                                                                            "p": {
                                                                              "docs": {},
                                                                              "a": {
                                                                                "docs": {},
                                                                                "g": {
                                                                                  "docs": {},
                                                                                  "e": {
                                                                                    "docs": {},
                                                                                    "l": {
                                                                                      "docs": {},
                                                                                      "a": {
                                                                                        "docs": {},
                                                                                        "y": {
                                                                                          "docs": {
                                                                                            "NFPageLayerCollection.html#onlyContainsPageLayers": {
                                                                                              "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                                                                                              "tf": 1150
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "c": {
                                                      "docs": {},
                                                      "o": {
                                                        "docs": {},
                                                        "n": {
                                                          "docs": {},
                                                          "t": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "i": {
                                                                "docs": {},
                                                                "n": {
                                                                  "docs": {},
                                                                  "i": {
                                                                    "docs": {},
                                                                    "n": {
                                                                      "docs": {},
                                                                      "g": {
                                                                        "docs": {},
                                                                        "c": {
                                                                          "docs": {},
                                                                          "o": {
                                                                            "docs": {},
                                                                            "m": {
                                                                              "docs": {},
                                                                              "p": {
                                                                                "docs": {
                                                                                  "NFPageLayerCollection.html#containingComp": {
                                                                                    "ref": "NFPageLayerCollection.html#containingComp",
                                                                                    "tf": 1150
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        },
                                                        "u": {
                                                          "docs": {},
                                                          "n": {
                                                            "docs": {},
                                                            "t": {
                                                              "docs": {
                                                                "NFPageLayerCollection.html#count": {
                                                                  "ref": "NFPageLayerCollection.html#count",
                                                                  "tf": 1150
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "g": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "p": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "g": {
                                                                "docs": {},
                                                                "e": {
                                                                  "docs": {},
                                                                  "l": {
                                                                    "docs": {},
                                                                    "a": {
                                                                      "docs": {},
                                                                      "y": {
                                                                        "docs": {},
                                                                        "e": {
                                                                          "docs": {},
                                                                          "r": {
                                                                            "docs": {},
                                                                            "c": {
                                                                              "docs": {},
                                                                              "o": {
                                                                                "docs": {},
                                                                                "l": {
                                                                                  "docs": {},
                                                                                  "l": {
                                                                                    "docs": {},
                                                                                    "e": {
                                                                                      "docs": {},
                                                                                      "c": {
                                                                                        "docs": {},
                                                                                        "t": {
                                                                                          "docs": {
                                                                                            "NFPageLayerCollection.html#getPageLayerCollection": {
                                                                                              "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                                                                                              "tf": 1150
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          },
                                                          "t": {
                                                            "docs": {},
                                                            "o": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {},
                                                                "m": {
                                                                  "docs": {},
                                                                  "o": {
                                                                    "docs": {},
                                                                    "s": {
                                                                      "docs": {},
                                                                      "t": {
                                                                        "docs": {},
                                                                        "l": {
                                                                          "docs": {},
                                                                          "a": {
                                                                            "docs": {},
                                                                            "y": {
                                                                              "docs": {
                                                                                "NFPageLayerCollection.html#getTopmostLayer": {
                                                                                  "ref": "NFPageLayerCollection.html#getTopmostLayer",
                                                                                  "tf": 1150
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          },
                                                          "b": {
                                                            "docs": {},
                                                            "o": {
                                                              "docs": {},
                                                              "t": {
                                                                "docs": {},
                                                                "t": {
                                                                  "docs": {},
                                                                  "o": {
                                                                    "docs": {},
                                                                    "m": {
                                                                      "docs": {},
                                                                      "m": {
                                                                        "docs": {},
                                                                        "o": {
                                                                          "docs": {},
                                                                          "s": {
                                                                            "docs": {},
                                                                            "t": {
                                                                              "docs": {},
                                                                              "l": {
                                                                                "docs": {},
                                                                                "a": {
                                                                                  "docs": {},
                                                                                  "y": {
                                                                                    "docs": {
                                                                                      "NFPageLayerCollection.html#getBottommostLayer": {
                                                                                        "ref": "NFPageLayerCollection.html#getBottommostLayer",
                                                                                        "tf": 1150
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "r": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "m": {
                                                          "docs": {},
                                                          "o": {
                                                            "docs": {},
                                                            "v": {
                                                              "docs": {
                                                                "NFPageLayerCollection.html#remove": {
                                                                  "ref": "NFPageLayerCollection.html#remove",
                                                                  "tf": 1150
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "s": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "p": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {
                                                                  "NFPageLayerCollection.html#setParents": {
                                                                    "ref": "NFPageLayerCollection.html#setParents",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  ".": {
                                                    "docs": {},
                                                    "c": {
                                                      "docs": {},
                                                      "o": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "e": {
                                                              "docs": {},
                                                              "c": {
                                                                "docs": {},
                                                                "t": {
                                                                  "docs": {},
                                                                  "i": {
                                                                    "docs": {},
                                                                    "o": {
                                                                      "docs": {},
                                                                      "n": {
                                                                        "docs": {},
                                                                        "f": {
                                                                          "docs": {},
                                                                          "r": {
                                                                            "docs": {},
                                                                            "o": {
                                                                              "docs": {},
                                                                              "m": {
                                                                                "docs": {},
                                                                                "a": {
                                                                                  "docs": {},
                                                                                  "v": {
                                                                                    "docs": {},
                                                                                    "l": {
                                                                                      "docs": {},
                                                                                      "a": {
                                                                                        "docs": {},
                                                                                        "y": {
                                                                                          "docs": {},
                                                                                          "e": {
                                                                                            "docs": {},
                                                                                            "r": {
                                                                                              "docs": {},
                                                                                              "a": {
                                                                                                "docs": {},
                                                                                                "r": {
                                                                                                  "docs": {},
                                                                                                  "r": {
                                                                                                    "docs": {},
                                                                                                    "a": {
                                                                                                      "docs": {},
                                                                                                      "y": {
                                                                                                        "docs": {
                                                                                                          "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                                                                                                            "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                                                                                                            "tf": 1150
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "|": {
                                "docs": {},
                                "n": {
                                  "docs": {},
                                  "f": {
                                    "docs": {},
                                    "h": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "h": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "i": {
                                                "docs": {},
                                                "g": {
                                                  "docs": {},
                                                  "h": {
                                                    "docs": {},
                                                    "t": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {},
                                                            "e": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {},
                                                                "|": {
                                                                  "docs": {},
                                                                  "n": {
                                                                    "docs": {},
                                                                    "f": {
                                                                      "docs": {},
                                                                      "p": {
                                                                        "docs": {},
                                                                        "a": {
                                                                          "docs": {},
                                                                          "p": {
                                                                            "docs": {},
                                                                            "e": {
                                                                              "docs": {},
                                                                              "r": {
                                                                                "docs": {},
                                                                                "p": {
                                                                                  "docs": {},
                                                                                  "a": {
                                                                                    "docs": {},
                                                                                    "r": {
                                                                                      "docs": {},
                                                                                      "e": {
                                                                                        "docs": {},
                                                                                        "n": {
                                                                                          "docs": {},
                                                                                          "t": {
                                                                                            "docs": {},
                                                                                            "l": {
                                                                                              "docs": {},
                                                                                              "a": {
                                                                                                "docs": {},
                                                                                                "y": {
                                                                                                  "docs": {},
                                                                                                  "e": {
                                                                                                    "docs": {},
                                                                                                    "r": {
                                                                                                      "docs": {},
                                                                                                      "|": {
                                                                                                        "docs": {},
                                                                                                        "n": {
                                                                                                          "docs": {},
                                                                                                          "f": {
                                                                                                            "docs": {},
                                                                                                            "l": {
                                                                                                              "docs": {},
                                                                                                              "a": {
                                                                                                                "docs": {},
                                                                                                                "y": {
                                                                                                                  "docs": {
                                                                                                                    "NFLayer.html#getSpecializedLayer": {
                                                                                                                      "ref": "NFLayer.html#getSpecializedLayer",
                                                                                                                      "tf": 50
                                                                                                                    },
                                                                                                                    "NFPageLayer.html#getSpecializedLayer": {
                                                                                                                      "ref": "NFPageLayer.html#getSpecializedLayer",
                                                                                                                      "tf": 50
                                                                                                                    },
                                                                                                                    "NFPaperParentLayer.html#getSpecializedLayer": {
                                                                                                                      "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                                                                                                                      "tf": 50
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "#": {
                                "docs": {},
                                "f": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      "d": {
                                        "docs": {},
                                        "p": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "p": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "n": {
                                                            "docs": {},
                                                            "t": {
                                                              "docs": {},
                                                              "l": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "y": {
                                                                    "docs": {
                                                                      "NFPageLayer.html#getPaperParentLayer": {
                                                                        "ref": "NFPageLayer.html#getPaperParentLayer",
                                                                        "tf": 4.545454545454546
                                                                      },
                                                                      "NFPageLayer.html#findPaperParentLayer": {
                                                                        "ref": "NFPageLayer.html#findPaperParentLayer",
                                                                        "tf": 1150
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "g": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "t": {
                                      "docs": {},
                                      "p": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "p": {
                                            "docs": {},
                                            "e": {
                                              "docs": {},
                                              "r": {
                                                "docs": {},
                                                "p": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {},
                                                    "r": {
                                                      "docs": {},
                                                      "e": {
                                                        "docs": {},
                                                        "n": {
                                                          "docs": {},
                                                          "t": {
                                                            "docs": {},
                                                            "l": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "y": {
                                                                  "docs": {
                                                                    "NFPageLayer.html#getPaperParentLayer": {
                                                                      "ref": "NFPageLayer.html#getPaperParentLayer",
                                                                      "tf": 1150
                                                                    },
                                                                    "NFPageLayer.html#findPaperParentLayer": {
                                                                      "ref": "NFPageLayer.html#findPaperParentLayer",
                                                                      "tf": 5.555555555555555
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          },
                                          "r": {
                                            "docs": {
                                              "NFPageLayer.html#getParent": {
                                                "ref": "NFPageLayer.html#getParent",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "s": {
                                        "docs": {},
                                        "p": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "c": {
                                              "docs": {},
                                              "i": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {},
                                                    "i": {
                                                      "docs": {},
                                                      "z": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "d": {
                                                            "docs": {},
                                                            "l": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "y": {
                                                                  "docs": {
                                                                    "NFPageLayer.html#getSpecializedLayer": {
                                                                      "ref": "NFPageLayer.html#getSpecializedLayer",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "c": {
                                        "docs": {},
                                        "h": {
                                          "docs": {},
                                          "i": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "d": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "e": {
                                                    "docs": {},
                                                    "n": {
                                                      "docs": {
                                                        "NFPageLayer.html#getChildren": {
                                                          "ref": "NFPageLayer.html#getChildren",
                                                          "tf": 1150
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "i": {
                                  "docs": {},
                                  "s": {
                                    "docs": {},
                                    "p": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "a": {
                                                "docs": {},
                                                "y": {
                                                  "docs": {
                                                    "NFPageLayer.html#isPageLayer": {
                                                      "ref": "NFPageLayer.html#isPageLayer",
                                                      "tf": 1150
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        },
                                        "p": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "r": {
                                              "docs": {},
                                              "p": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "r": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "n": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {
                                                                  "NFPageLayer.html#isPaperParentLayer": {
                                                                    "ref": "NFPageLayer.html#isPaperParentLayer",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "n": {
                                      "docs": {},
                                      "u": {
                                        "docs": {},
                                        "l": {
                                          "docs": {},
                                          "l": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "a": {
                                                "docs": {},
                                                "y": {
                                                  "docs": {
                                                    "NFPageLayer.html#isNullLayer": {
                                                      "ref": "NFPageLayer.html#isNullLayer",
                                                      "tf": 1150
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "h": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "h": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "i": {
                                                "docs": {},
                                                "g": {
                                                  "docs": {},
                                                  "h": {
                                                    "docs": {},
                                                    "t": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {
                                                              "NFPageLayer.html#isHighlightLayer": {
                                                                "ref": "NFPageLayer.html#isHighlightLayer",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  },
                                  "n": {
                                    "docs": {},
                                    "d": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "x": {
                                          "docs": {
                                            "NFPageLayer.html#index": {
                                              "ref": "NFPageLayer.html#index",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "i": {
                                      "docs": {},
                                      "t": {
                                        "docs": {
                                          "NFPageLayerCollection.html#initLayers": {
                                            "ref": "NFPageLayerCollection.html#initLayers",
                                            "tf": 12.5
                                          }
                                        },
                                        "l": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "y": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "t": {
                                                    "docs": {},
                                                    "r": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "n": {
                                                          "docs": {},
                                                          "s": {
                                                            "docs": {},
                                                            "f": {
                                                              "docs": {},
                                                              "o": {
                                                                "docs": {},
                                                                "r": {
                                                                  "docs": {},
                                                                  "m": {
                                                                    "docs": {
                                                                      "NFPageLayerCollection.html#initLayerTransforms": {
                                                                        "ref": "NFPageLayerCollection.html#initLayerTransforms",
                                                                        "tf": 12.5
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "h": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "s": {
                                      "docs": {},
                                      "n": {
                                        "docs": {},
                                        "u": {
                                          "docs": {},
                                          "l": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "p": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "r": {
                                                    "docs": {
                                                      "NFPageLayer.html#hasNullParent": {
                                                        "ref": "NFPageLayer.html#hasNullParent",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "s": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "m": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "l": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "y": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {
                                                      "NFPageLayer.html#sameLayerAs": {
                                                        "ref": "NFPageLayer.html#sameLayerAs",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  },
                                  "e": {
                                    "docs": {},
                                    "t": {
                                      "docs": {},
                                      "p": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "r": {
                                            "docs": {
                                              "NFPageLayer.html#setParent": {
                                                "ref": "NFPageLayer.html#setParent",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "z": {
                                        "docs": {},
                                        "o": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "m": {
                                              "docs": {
                                                "NFPageLayer.html#setZoomer": {
                                                  "ref": "NFPageLayer.html#setZoomer",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "c": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      "t": {
                                        "docs": {},
                                        "a": {
                                          "docs": {},
                                          "i": {
                                            "docs": {},
                                            "n": {
                                              "docs": {},
                                              "i": {
                                                "docs": {},
                                                "n": {
                                                  "docs": {},
                                                  "g": {
                                                    "docs": {},
                                                    "c": {
                                                      "docs": {},
                                                      "o": {
                                                        "docs": {},
                                                        "m": {
                                                          "docs": {},
                                                          "p": {
                                                            "docs": {
                                                              "NFPageLayer.html#containingComp": {
                                                                "ref": "NFPageLayer.html#containingComp",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "m": {
                                  "docs": {},
                                  "o": {
                                    "docs": {},
                                    "v": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "b": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "f": {
                                              "docs": {},
                                              "o": {
                                                "docs": {},
                                                "r": {
                                                  "docs": {
                                                    "NFPageLayer.html#moveBefore": {
                                                      "ref": "NFPageLayer.html#moveBefore",
                                                      "tf": 1150
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        },
                                        "a": {
                                          "docs": {},
                                          "f": {
                                            "docs": {},
                                            "t": {
                                              "docs": {
                                                "NFPageLayer.html#moveAfter": {
                                                  "ref": "NFPageLayer.html#moveAfter",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  },
                                  "a": {
                                    "docs": {},
                                    "r": {
                                      "docs": {},
                                      "k": {
                                        "docs": {
                                          "NFPageLayer.html#markers": {
                                            "ref": "NFPageLayer.html#markers",
                                            "tf": 1150
                                          }
                                        }
                                      }
                                    }
                                  }
                                },
                                "a": {
                                  "docs": {},
                                  "d": {
                                    "docs": {},
                                    "d": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "n": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "u": {
                                              "docs": {},
                                              "t": {
                                                "docs": {},
                                                "m": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {},
                                                    "r": {
                                                      "docs": {},
                                                      "k": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "r": {
                                                            "docs": {},
                                                            "s": {
                                                              "docs": {},
                                                              "f": {
                                                                "docs": {},
                                                                "o": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "p": {
                                                                      "docs": {},
                                                                      "r": {
                                                                        "docs": {},
                                                                        "o": {
                                                                          "docs": {},
                                                                          "p": {
                                                                            "docs": {},
                                                                            "e": {
                                                                              "docs": {},
                                                                              "r": {
                                                                                "docs": {},
                                                                                "t": {
                                                                                  "docs": {},
                                                                                  "i": {
                                                                                    "docs": {
                                                                                      "NFPageLayer.html#addInOutMarkersForProperty": {
                                                                                        "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                                                                                        "tf": 1150
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "s": {
                                        "docs": {},
                                        "l": {
                                          "docs": {},
                                          "i": {
                                            "docs": {},
                                            "d": {
                                              "docs": {
                                                "NFPageLayer.html#addSlider": {
                                                  "ref": "NFPageLayer.html#addSlider",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "i": {
                      "docs": {},
                      "t": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "m": {
                            "docs": {
                              "NFPDF.html": {
                                "ref": "NFPDF.html",
                                "tf": 10
                              },
                              "NFPageItem.html": {
                                "ref": "NFPageItem.html",
                                "tf": 1900
                              }
                            },
                            "#": {
                              "docs": {},
                              "g": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "t": {
                                    "docs": {},
                                    "p": {
                                      "docs": {},
                                      "d": {
                                        "docs": {},
                                        "f": {
                                          "docs": {},
                                          "n": {
                                            "docs": {},
                                            "u": {
                                              "docs": {},
                                              "m": {
                                                "docs": {},
                                                "b": {
                                                  "docs": {
                                                    "NFPageItem.html#getPDFNumber": {
                                                      "ref": "NFPageItem.html#getPDFNumber",
                                                      "tf": 1150
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      },
                                      "a": {
                                        "docs": {},
                                        "g": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "n": {
                                              "docs": {},
                                              "u": {
                                                "docs": {},
                                                "m": {
                                                  "docs": {},
                                                  "b": {
                                                    "docs": {
                                                      "NFPageItem.html#getPageNumber": {
                                                        "ref": "NFPageItem.html#getPageNumber",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "h": {
                                "docs": {},
                                "i": {
                                  "docs": {},
                                  "g": {
                                    "docs": {},
                                    "h": {
                                      "docs": {},
                                      "l": {
                                        "docs": {},
                                        "i": {
                                          "docs": {},
                                          "g": {
                                            "docs": {},
                                            "h": {
                                              "docs": {},
                                              "t": {
                                                "docs": {
                                                  "NFPageItem.html#highlights": {
                                                    "ref": "NFPageItem.html#highlights",
                                                    "tf": 1150
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "r": {
                  "docs": {},
                  "t": {
                    "docs": {},
                    "c": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "p": {
                            "docs": {
                              "NFLayer.html#setZoomer": {
                                "ref": "NFLayer.html#setZoomer",
                                "tf": 8.333333333333332
                              },
                              "NFPageLayer.html#setZoomer": {
                                "ref": "NFPageLayer.html#setZoomer",
                                "tf": 8.333333333333332
                              },
                              "NFPaperParentLayer.html#setZoomer": {
                                "ref": "NFPaperParentLayer.html#setZoomer",
                                "tf": 8.333333333333332
                              },
                              "NFPartComp.html": {
                                "ref": "NFPartComp.html",
                                "tf": 1900
                              }
                            },
                            "#": {
                              "docs": {},
                              "g": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "t": {
                                    "docs": {},
                                    "i": {
                                      "docs": {},
                                      "n": {
                                        "docs": {},
                                        "f": {
                                          "docs": {},
                                          "o": {
                                            "docs": {
                                              "NFPartComp.html#getInfo": {
                                                "ref": "NFPartComp.html#getInfo",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      }
                                    },
                                    "z": {
                                      "docs": {},
                                      "o": {
                                        "docs": {},
                                        "o": {
                                          "docs": {},
                                          "m": {
                                            "docs": {
                                              "NFPartComp.html#getZoomer": {
                                                "ref": "NFPartComp.html#getZoomer",
                                                "tf": 1150
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "s": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "e": {
                                      "docs": {},
                                      "c": {
                                        "docs": {},
                                        "t": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "d": {
                                              "docs": {},
                                              "l": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "y": {
                                                    "docs": {
                                                      "NFPartComp.html#selectedLayers": {
                                                        "ref": "NFPartComp.html#selectedLayers",
                                                        "tf": 1150
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "p": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "g": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {
                                                              "NFPartComp.html#selectedPageLayers": {
                                                                "ref": "NFPartComp.html#selectedPageLayers",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "l": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "y": {
                                    "docs": {},
                                    "e": {
                                      "docs": {},
                                      "r": {
                                        "docs": {},
                                        "w": {
                                          "docs": {},
                                          "i": {
                                            "docs": {},
                                            "t": {
                                              "docs": {},
                                              "h": {
                                                "docs": {},
                                                "n": {
                                                  "docs": {},
                                                  "a": {
                                                    "docs": {},
                                                    "m": {
                                                      "docs": {
                                                        "NFPartComp.html#layerWithName": {
                                                          "ref": "NFPartComp.html#layerWithName",
                                                          "tf": 1150
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "a": {
                                "docs": {},
                                "d": {
                                  "docs": {},
                                  "d": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      "u": {
                                        "docs": {},
                                        "l": {
                                          "docs": {
                                            "NFPartComp.html#addNull": {
                                              "ref": "NFPartComp.html#addNull",
                                              "tf": 1150
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "p": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "r": {
                      "docs": {},
                      "l": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "y": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "r": {
                                "docs": {},
                                "g": {
                                  "docs": {},
                                  "r": {
                                    "docs": {},
                                    "o": {
                                      "docs": {},
                                      "u": {
                                        "docs": {},
                                        "p": {
                                          "docs": {
                                            "NFPaperLayerGroup.html": {
                                              "ref": "NFPaperLayerGroup.html",
                                              "tf": 1900
                                            },
                                            "NFPaperLayerGroup.html#gatherLayers": {
                                              "ref": "NFPaperLayerGroup.html#gatherLayers",
                                              "tf": 25
                                            }
                                          },
                                          "#": {
                                            "docs": {},
                                            "g": {
                                              "docs": {},
                                              "e": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "c": {
                                                    "docs": {},
                                                    "h": {
                                                      "docs": {},
                                                      "i": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "d": {
                                                            "docs": {},
                                                            "r": {
                                                              "docs": {},
                                                              "e": {
                                                                "docs": {},
                                                                "n": {
                                                                  "docs": {
                                                                    "NFPaperLayerGroup.html#getChildren": {
                                                                      "ref": "NFPaperLayerGroup.html#getChildren",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "g": {
                                                        "docs": {
                                                          "NFPaperLayerGroup.html#getPages": {
                                                            "ref": "NFPaperLayerGroup.html#getPages",
                                                            "tf": 1150
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "a": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "h": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "a": {
                                                            "docs": {},
                                                            "y": {
                                                              "docs": {
                                                                "NFPaperLayerGroup.html#gatherLayers": {
                                                                  "ref": "NFPaperLayerGroup.html#gatherLayers",
                                                                  "tf": 1150
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "p": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "r": {
                            "docs": {},
                            "e": {
                              "docs": {},
                              "n": {
                                "docs": {},
                                "t": {
                                  "docs": {},
                                  "l": {
                                    "docs": {},
                                    "a": {
                                      "docs": {},
                                      "y": {
                                        "docs": {
                                          "NFPageLayerCollection.html#newPaperParentLayer": {
                                            "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                                            "tf": 62.5
                                          },
                                          "NFPageLayerCollection.html#assignPaperParentLayer": {
                                            "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                                            "tf": 33.33333333333333
                                          },
                                          "NFPaperParentLayer.html": {
                                            "ref": "NFPaperParentLayer.html",
                                            "tf": 1900
                                          },
                                          "NFPaperParentLayer.html#setName": {
                                            "ref": "NFPaperParentLayer.html#setName",
                                            "tf": 50
                                          }
                                        },
                                        "e": {
                                          "docs": {},
                                          "r": {
                                            "docs": {},
                                            "|": {
                                              "docs": {},
                                              "n": {
                                                "docs": {},
                                                "u": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {
                                                      "NFPageLayer.html#getPaperParentLayer": {
                                                        "ref": "NFPageLayer.html#getPaperParentLayer",
                                                        "tf": 50
                                                      },
                                                      "NFPageLayer.html#findPaperParentLayer": {
                                                        "ref": "NFPageLayer.html#findPaperParentLayer",
                                                        "tf": 50
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "#": {
                                              "docs": {},
                                              "s": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "t": {
                                                    "docs": {},
                                                    "n": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "m": {
                                                          "docs": {
                                                            "NFPaperParentLayer.html#setName": {
                                                              "ref": "NFPaperParentLayer.html#setName",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "p": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "r": {
                                                          "docs": {
                                                            "NFPaperParentLayer.html#setParent": {
                                                              "ref": "NFPaperParentLayer.html#setParent",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "z": {
                                                      "docs": {},
                                                      "o": {
                                                        "docs": {},
                                                        "o": {
                                                          "docs": {},
                                                          "m": {
                                                            "docs": {
                                                              "NFPaperParentLayer.html#setZoomer": {
                                                                "ref": "NFPaperParentLayer.html#setZoomer",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                },
                                                "a": {
                                                  "docs": {},
                                                  "m": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "a": {
                                                          "docs": {},
                                                          "y": {
                                                            "docs": {},
                                                            "e": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {
                                                                    "NFPaperParentLayer.html#sameLayerAs": {
                                                                      "ref": "NFPaperParentLayer.html#sameLayerAs",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "i": {
                                                "docs": {},
                                                "s": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "g": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {
                                                                  "NFPaperParentLayer.html#isPageLayer": {
                                                                    "ref": "NFPaperParentLayer.html#isPageLayer",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "p": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "r": {
                                                            "docs": {},
                                                            "p": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "r": {
                                                                  "docs": {},
                                                                  "e": {
                                                                    "docs": {},
                                                                    "n": {
                                                                      "docs": {},
                                                                      "t": {
                                                                        "docs": {},
                                                                        "l": {
                                                                          "docs": {},
                                                                          "a": {
                                                                            "docs": {},
                                                                            "y": {
                                                                              "docs": {
                                                                                "NFPaperParentLayer.html#isPaperParentLayer": {
                                                                                  "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                                                                                  "tf": 1150
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "n": {
                                                    "docs": {},
                                                    "u": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "a": {
                                                              "docs": {},
                                                              "y": {
                                                                "docs": {
                                                                  "NFPaperParentLayer.html#isNullLayer": {
                                                                    "ref": "NFPaperParentLayer.html#isNullLayer",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "h": {
                                                    "docs": {},
                                                    "i": {
                                                      "docs": {},
                                                      "g": {
                                                        "docs": {},
                                                        "h": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "i": {
                                                              "docs": {},
                                                              "g": {
                                                                "docs": {},
                                                                "h": {
                                                                  "docs": {},
                                                                  "t": {
                                                                    "docs": {},
                                                                    "l": {
                                                                      "docs": {},
                                                                      "a": {
                                                                        "docs": {},
                                                                        "y": {
                                                                          "docs": {
                                                                            "NFPaperParentLayer.html#isHighlightLayer": {
                                                                              "ref": "NFPaperParentLayer.html#isHighlightLayer",
                                                                              "tf": 1150
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                },
                                                "n": {
                                                  "docs": {},
                                                  "d": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "x": {
                                                        "docs": {
                                                          "NFPaperParentLayer.html#index": {
                                                            "ref": "NFPaperParentLayer.html#index",
                                                            "tf": 1150
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "g": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "t": {
                                                    "docs": {},
                                                    "s": {
                                                      "docs": {},
                                                      "p": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "c": {
                                                            "docs": {},
                                                            "i": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "l": {
                                                                  "docs": {},
                                                                  "i": {
                                                                    "docs": {},
                                                                    "z": {
                                                                      "docs": {},
                                                                      "e": {
                                                                        "docs": {},
                                                                        "d": {
                                                                          "docs": {},
                                                                          "l": {
                                                                            "docs": {},
                                                                            "a": {
                                                                              "docs": {},
                                                                              "y": {
                                                                                "docs": {
                                                                                  "NFPaperParentLayer.html#getSpecializedLayer": {
                                                                                    "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                                                                                    "tf": 1150
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "c": {
                                                      "docs": {},
                                                      "h": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "d": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {},
                                                                "e": {
                                                                  "docs": {},
                                                                  "n": {
                                                                    "docs": {
                                                                      "NFPaperParentLayer.html#getChildren": {
                                                                        "ref": "NFPaperParentLayer.html#getChildren",
                                                                        "tf": 1150
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "p": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "r": {
                                                          "docs": {
                                                            "NFPaperParentLayer.html#getParent": {
                                                              "ref": "NFPaperParentLayer.html#getParent",
                                                              "tf": 1150
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "h": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "s": {
                                                    "docs": {},
                                                    "n": {
                                                      "docs": {},
                                                      "u": {
                                                        "docs": {},
                                                        "l": {
                                                          "docs": {},
                                                          "l": {
                                                            "docs": {},
                                                            "p": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "r": {
                                                                  "docs": {
                                                                    "NFPaperParentLayer.html#hasNullParent": {
                                                                      "ref": "NFPaperParentLayer.html#hasNullParent",
                                                                      "tf": 1150
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "c": {
                                                "docs": {},
                                                "o": {
                                                  "docs": {},
                                                  "n": {
                                                    "docs": {},
                                                    "t": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {},
                                                          "n": {
                                                            "docs": {},
                                                            "i": {
                                                              "docs": {},
                                                              "n": {
                                                                "docs": {},
                                                                "g": {
                                                                  "docs": {},
                                                                  "c": {
                                                                    "docs": {},
                                                                    "o": {
                                                                      "docs": {},
                                                                      "m": {
                                                                        "docs": {},
                                                                        "p": {
                                                                          "docs": {
                                                                            "NFPaperParentLayer.html#containingComp": {
                                                                              "ref": "NFPaperParentLayer.html#containingComp",
                                                                              "tf": 1150
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "m": {
                                                "docs": {},
                                                "o": {
                                                  "docs": {},
                                                  "v": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "b": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "f": {
                                                            "docs": {},
                                                            "o": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {
                                                                  "NFPaperParentLayer.html#moveBefore": {
                                                                    "ref": "NFPaperParentLayer.html#moveBefore",
                                                                    "tf": 1150
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "a": {
                                                        "docs": {},
                                                        "f": {
                                                          "docs": {},
                                                          "t": {
                                                            "docs": {
                                                              "NFPaperParentLayer.html#moveAfter": {
                                                                "ref": "NFPaperParentLayer.html#moveAfter",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                },
                                                "a": {
                                                  "docs": {},
                                                  "r": {
                                                    "docs": {},
                                                    "k": {
                                                      "docs": {
                                                        "NFPaperParentLayer.html#markers": {
                                                          "ref": "NFPaperParentLayer.html#markers",
                                                          "tf": 1150
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "a": {
                                                "docs": {},
                                                "d": {
                                                  "docs": {},
                                                  "d": {
                                                    "docs": {},
                                                    "i": {
                                                      "docs": {},
                                                      "n": {
                                                        "docs": {},
                                                        "o": {
                                                          "docs": {},
                                                          "u": {
                                                            "docs": {},
                                                            "t": {
                                                              "docs": {},
                                                              "m": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "k": {
                                                                      "docs": {},
                                                                      "e": {
                                                                        "docs": {},
                                                                        "r": {
                                                                          "docs": {},
                                                                          "s": {
                                                                            "docs": {},
                                                                            "f": {
                                                                              "docs": {},
                                                                              "o": {
                                                                                "docs": {},
                                                                                "r": {
                                                                                  "docs": {},
                                                                                  "p": {
                                                                                    "docs": {},
                                                                                    "r": {
                                                                                      "docs": {},
                                                                                      "o": {
                                                                                        "docs": {},
                                                                                        "p": {
                                                                                          "docs": {},
                                                                                          "e": {
                                                                                            "docs": {},
                                                                                            "r": {
                                                                                              "docs": {},
                                                                                              "t": {
                                                                                                "docs": {},
                                                                                                "i": {
                                                                                                  "docs": {
                                                                                                    "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                                                                                                      "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                                                                                                      "tf": 1150
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    },
                                                    "s": {
                                                      "docs": {},
                                                      "l": {
                                                        "docs": {},
                                                        "i": {
                                                          "docs": {},
                                                          "d": {
                                                            "docs": {
                                                              "NFPaperParentLayer.html#addSlider": {
                                                                "ref": "NFPaperParentLayer.html#addSlider",
                                                                "tf": 1150
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            ".": {
                                              "docs": {},
                                              "i": {
                                                "docs": {},
                                                "s": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "a": {
                                                      "docs": {},
                                                      "p": {
                                                        "docs": {},
                                                        "e": {
                                                          "docs": {},
                                                          "r": {
                                                            "docs": {},
                                                            "p": {
                                                              "docs": {},
                                                              "a": {
                                                                "docs": {},
                                                                "r": {
                                                                  "docs": {},
                                                                  "e": {
                                                                    "docs": {},
                                                                    "n": {
                                                                      "docs": {},
                                                                      "t": {
                                                                        "docs": {},
                                                                        "l": {
                                                                          "docs": {},
                                                                          "a": {
                                                                            "docs": {},
                                                                            "y": {
                                                                              "docs": {
                                                                                "NFPaperParentLayer.html#.isPaperParentLayer": {
                                                                                  "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                                                                                  "tf": 1150
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "g": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "t": {
                                                    "docs": {},
                                                    "p": {
                                                      "docs": {},
                                                      "a": {
                                                        "docs": {},
                                                        "p": {
                                                          "docs": {},
                                                          "e": {
                                                            "docs": {},
                                                            "r": {
                                                              "docs": {},
                                                              "p": {
                                                                "docs": {},
                                                                "a": {
                                                                  "docs": {},
                                                                  "r": {
                                                                    "docs": {},
                                                                    "e": {
                                                                      "docs": {},
                                                                      "n": {
                                                                        "docs": {},
                                                                        "t": {
                                                                          "docs": {},
                                                                          "n": {
                                                                            "docs": {},
                                                                            "a": {
                                                                              "docs": {},
                                                                              "m": {
                                                                                "docs": {},
                                                                                "e": {
                                                                                  "docs": {},
                                                                                  "f": {
                                                                                    "docs": {},
                                                                                    "o": {
                                                                                      "docs": {},
                                                                                      "r": {
                                                                                        "docs": {},
                                                                                        "p": {
                                                                                          "docs": {},
                                                                                          "a": {
                                                                                            "docs": {},
                                                                                            "g": {
                                                                                              "docs": {},
                                                                                              "e": {
                                                                                                "docs": {},
                                                                                                "l": {
                                                                                                  "docs": {},
                                                                                                  "a": {
                                                                                                    "docs": {},
                                                                                                    "y": {
                                                                                                      "docs": {
                                                                                                        "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                                                                                                          "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                                                                                                          "tf": 1150
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "d": {
                "docs": {},
                "f": {
                  "docs": {
                    "NFPDF.html": {
                      "ref": "NFPDF.html",
                      "tf": 1900
                    },
                    "NFPDF.html#addNFPageItem": {
                      "ref": "NFPDF.html#addNFPageItem",
                      "tf": 33.33333333333333
                    }
                  },
                  "#": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "d": {
                        "docs": {},
                        "d": {
                          "docs": {},
                          "n": {
                            "docs": {},
                            "f": {
                              "docs": {},
                              "p": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "g": {
                                    "docs": {},
                                    "e": {
                                      "docs": {},
                                      "i": {
                                        "docs": {},
                                        "t": {
                                          "docs": {},
                                          "e": {
                                            "docs": {},
                                            "m": {
                                              "docs": {
                                                "NFPDF.html#addNFPageItem": {
                                                  "ref": "NFPDF.html#addNFPageItem",
                                                  "tf": 1150
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "h": {
              "docs": {},
              "i": {
                "docs": {},
                "g": {
                  "docs": {},
                  "h": {
                    "docs": {},
                    "l": {
                      "docs": {},
                      "i": {
                        "docs": {},
                        "g": {
                          "docs": {},
                          "h": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "l": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "y": {
                                    "docs": {},
                                    "e": {
                                      "docs": {},
                                      "r": {
                                        "docs": {},
                                        "c": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "l": {
                                              "docs": {},
                                              "l": {
                                                "docs": {},
                                                "e": {
                                                  "docs": {},
                                                  "c": {
                                                    "docs": {},
                                                    "t": {
                                                      "docs": {
                                                        "NFPageItem.html#highlights": {
                                                          "ref": "NFPageItem.html#highlights",
                                                          "tf": 50
                                                        },
                                                        "NFPageLayerCollection.html#highlights": {
                                                          "ref": "NFPageLayerCollection.html#highlights",
                                                          "tf": 43.33333333333333
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "n": {
              "docs": {
                "NFPageLayer.html#getPaperParentLayer": {
                  "ref": "NFPageLayer.html#getPaperParentLayer",
                  "tf": 4.545454545454546
                }
              },
              "e": {
                "docs": {
                  "NFComp.html#layerWithName": {
                    "ref": "NFComp.html#layerWithName",
                    "tf": 5.555555555555555
                  },
                  "NFPartComp.html#layerWithName": {
                    "ref": "NFPartComp.html#layerWithName",
                    "tf": 5.555555555555555
                  }
                }
              }
            }
          },
          "u": {
            "docs": {},
            "l": {
              "docs": {},
              "l": {
                "docs": {
                  "NFComp.html#layerWithName": {
                    "ref": "NFComp.html#layerWithName",
                    "tf": 5.555555555555555
                  },
                  "NFComp.html#addNull": {
                    "ref": "NFComp.html#addNull",
                    "tf": 8.333333333333332
                  },
                  "NFLayer.html#isNullLayer": {
                    "ref": "NFLayer.html#isNullLayer",
                    "tf": 12.5
                  },
                  "NFLayer.html#hasNullParent": {
                    "ref": "NFLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFLayerCollection.html#containingComp": {
                    "ref": "NFLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  },
                  "NFLayerCollection.html#setParents": {
                    "ref": "NFLayerCollection.html#setParents",
                    "tf": 7.142857142857142
                  },
                  "NFLayerCollection.html#nullify": {
                    "ref": "NFLayerCollection.html#nullify",
                    "tf": 3.571428571428571
                  },
                  "NFPageLayer.html#isNullLayer": {
                    "ref": "NFPageLayer.html#isNullLayer",
                    "tf": 12.5
                  },
                  "NFPageLayer.html#hasNullParent": {
                    "ref": "NFPageLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFPageLayerCollection.html": {
                    "ref": "NFPageLayerCollection.html",
                    "tf": 5
                  },
                  "NFPageLayerCollection.html#containingComp": {
                    "ref": "NFPageLayerCollection.html#containingComp",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#setParents": {
                    "ref": "NFPageLayerCollection.html#setParents",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#nullify": {
                    "ref": "NFPageLayerCollection.html#nullify",
                    "tf": 3.571428571428571
                  },
                  "NFPaperParentLayer.html": {
                    "ref": "NFPaperParentLayer.html",
                    "tf": 5
                  },
                  "NFPaperParentLayer.html#isNullLayer": {
                    "ref": "NFPaperParentLayer.html#isNullLayer",
                    "tf": 12.5
                  },
                  "NFPaperParentLayer.html#hasNullParent": {
                    "ref": "NFPaperParentLayer.html#hasNullParent",
                    "tf": 10
                  },
                  "NFPartComp.html#layerWithName": {
                    "ref": "NFPartComp.html#layerWithName",
                    "tf": 5.555555555555555
                  },
                  "NFPartComp.html#addNull": {
                    "ref": "NFPartComp.html#addNull",
                    "tf": 8.333333333333332
                  }
                },
                "i": {
                  "docs": {},
                  "f": {
                    "docs": {},
                    "i": {
                      "docs": {
                        "NFLayerCollection.html#nullify": {
                          "ref": "NFLayerCollection.html#nullify",
                          "tf": 700
                        },
                        "NFPageLayerCollection.html#nullify": {
                          "ref": "NFPageLayerCollection.html#nullify",
                          "tf": 700
                        }
                      }
                    }
                  }
                }
              }
            },
            "m": {
              "docs": {},
              "b": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayerCollection.html#count": {
                        "ref": "NFLayerCollection.html#count",
                        "tf": 10
                      },
                      "NFPageItem.html#getPDFNumber": {
                        "ref": "NFPageItem.html#getPDFNumber",
                        "tf": 12.5
                      },
                      "NFPageItem.html#getPageNumber": {
                        "ref": "NFPageItem.html#getPageNumber",
                        "tf": 12.5
                      },
                      "NFPageLayerCollection.html#count": {
                        "ref": "NFPageLayerCollection.html#count",
                        "tf": 10
                      }
                    }
                  }
                }
              }
            }
          },
          "e": {
            "docs": {},
            "w": {
              "docs": {
                "NFComp.html#addNull": {
                  "ref": "NFComp.html#addNull",
                  "tf": 8.333333333333332
                },
                "NFLayer.html#getSpecializedLayer": {
                  "ref": "NFLayer.html#getSpecializedLayer",
                  "tf": 7.142857142857142
                },
                "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                  "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                  "tf": 7.142857142857142
                },
                "NFLayerCollection.html#getPageLayerCollection": {
                  "ref": "NFLayerCollection.html#getPageLayerCollection",
                  "tf": 5.555555555555555
                },
                "NFLayerCollection.html#nullify": {
                  "ref": "NFLayerCollection.html#nullify",
                  "tf": 3.571428571428571
                },
                "NFLayerCollection.html#.collectionFromAVLayerArray": {
                  "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                  "tf": 7.142857142857142
                },
                "NFPageLayer.html#getSpecializedLayer": {
                  "ref": "NFPageLayer.html#getSpecializedLayer",
                  "tf": 7.142857142857142
                },
                "NFPageLayerCollection.html#newPaperParentLayer": {
                  "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                  "tf": 12.5
                },
                "NFPageLayerCollection.html#assignPaperParentLayer": {
                  "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                  "tf": 3.571428571428571
                },
                "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                  "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                  "tf": 10
                },
                "NFPageLayerCollection.html#getPageLayerCollection": {
                  "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                  "tf": 5.555555555555555
                },
                "NFPageLayerCollection.html#nullify": {
                  "ref": "NFPageLayerCollection.html#nullify",
                  "tf": 3.571428571428571
                },
                "NFPaperParentLayer.html#getSpecializedLayer": {
                  "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                  "tf": 7.142857142857142
                },
                "NFPartComp.html#addNull": {
                  "ref": "NFPartComp.html#addNull",
                  "tf": 8.333333333333332
                }
              },
              "p": {
                "docs": {},
                "a": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayer.html#setParent": {
                        "ref": "NFLayer.html#setParent",
                        "tf": 33.33333333333333
                      },
                      "NFLayerCollection.html#setParents": {
                        "ref": "NFLayerCollection.html#setParents",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayer.html#setParent": {
                        "ref": "NFPageLayer.html#setParent",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayerCollection.html#setParents": {
                        "ref": "NFPageLayerCollection.html#setParents",
                        "tf": 33.33333333333333
                      },
                      "NFPaperParentLayer.html#setParent": {
                        "ref": "NFPaperParentLayer.html#setParent",
                        "tf": 33.33333333333333
                      }
                    }
                  },
                  "g": {
                    "docs": {
                      "NFPDF.html#addNFPageItem": {
                        "ref": "NFPDF.html#addNFPageItem",
                        "tf": 33.33333333333333
                      }
                    }
                  },
                  "p": {
                    "docs": {},
                    "e": {
                      "docs": {},
                      "r": {
                        "docs": {},
                        "p": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "n": {
                                  "docs": {},
                                  "t": {
                                    "docs": {},
                                    "l": {
                                      "docs": {},
                                      "a": {
                                        "docs": {},
                                        "y": {
                                          "docs": {
                                            "NFPageLayerCollection.html#newPaperParentLayer": {
                                              "ref": "NFPageLayerCollection.html#newPaperParentLayer",
                                              "tf": 700
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "l": {
                "docs": {},
                "a": {
                  "docs": {},
                  "y": {
                    "docs": {
                      "NFLayerCollection.html#addNFLayer": {
                        "ref": "NFLayerCollection.html#addNFLayer",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayerCollection.html#addNFPageLayer": {
                        "ref": "NFPageLayerCollection.html#addNFPageLayer",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayerCollection.html#addAVLayer": {
                        "ref": "NFPageLayerCollection.html#addAVLayer",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayerCollection.html#highlights": {
                        "ref": "NFPageLayerCollection.html#highlights",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayerCollection.html#addNFLayer": {
                        "ref": "NFPageLayerCollection.html#addNFLayer",
                        "tf": 33.33333333333333
                      }
                    }
                  }
                }
              }
            }
          },
          "i": {
            "docs": {},
            "c": {
              "docs": {},
              "e": {
                "docs": {
                  "NFLayer.html#.isAVLayer": {
                    "ref": "NFLayer.html#.isAVLayer",
                    "tf": 3.8461538461538463
                  }
                }
              }
            }
          }
        },
        "a": {
          "docs": {},
          "c": {
            "docs": {},
            "c": {
              "docs": {},
              "e": {
                "docs": {},
                "s": {
                  "docs": {},
                  "s": {
                    "docs": {
                      "NFComp.html": {
                        "ref": "NFComp.html",
                        "tf": 6.25
                      },
                      "NFLayerCollection.html#count": {
                        "ref": "NFLayerCollection.html#count",
                        "tf": 10
                      },
                      "NFPageLayerCollection.html#count": {
                        "ref": "NFPageLayerCollection.html#count",
                        "tf": 10
                      },
                      "NFPartComp.html": {
                        "ref": "NFPartComp.html",
                        "tf": 4.545454545454546
                      }
                    }
                  }
                }
              }
            }
          },
          "l": {
            "docs": {},
            "l": {
              "docs": {},
              "o": {
                "docs": {},
                "w": {
                  "docs": {
                    "NFComp.html": {
                      "ref": "NFComp.html",
                      "tf": 6.25
                    },
                    "NFPartComp.html": {
                      "ref": "NFPartComp.html",
                      "tf": 4.545454545454546
                    }
                  }
                }
              }
            },
            "r": {
              "docs": {},
              "e": {
                "docs": {},
                "a": {
                  "docs": {},
                  "d": {
                    "docs": {},
                    "i": {
                      "docs": {
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "d": {
            "docs": {},
            "d": {
              "docs": {
                "NFLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                },
                "NFLayerCollection.html#addNFLayer": {
                  "ref": "NFLayerCollection.html#addNFLayer",
                  "tf": 16.666666666666664
                },
                "NFPageLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                },
                "NFPageLayerCollection.html#addNFPageLayer": {
                  "ref": "NFPageLayerCollection.html#addNFPageLayer",
                  "tf": 16.666666666666664
                },
                "NFPageLayerCollection.html#addAVLayer": {
                  "ref": "NFPageLayerCollection.html#addAVLayer",
                  "tf": 16.666666666666664
                },
                "NFPageLayerCollection.html#addNFLayer": {
                  "ref": "NFPageLayerCollection.html#addNFLayer",
                  "tf": 16.666666666666664
                },
                "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                }
              },
              "n": {
                "docs": {},
                "u": {
                  "docs": {},
                  "l": {
                    "docs": {
                      "NFComp.html#addNull": {
                        "ref": "NFComp.html#addNull",
                        "tf": 700
                      },
                      "NFPartComp.html#addNull": {
                        "ref": "NFPartComp.html#addNull",
                        "tf": 700
                      }
                    }
                  }
                },
                "f": {
                  "docs": {},
                  "l": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "y": {
                        "docs": {
                          "NFLayerCollection.html#addNFLayer": {
                            "ref": "NFLayerCollection.html#addNFLayer",
                            "tf": 683.3333333333334
                          },
                          "NFPageLayerCollection.html#addNFLayer": {
                            "ref": "NFPageLayerCollection.html#addNFLayer",
                            "tf": 683.3333333333334
                          }
                        }
                      }
                    }
                  },
                  "p": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "g": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "i": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "m": {
                                  "docs": {
                                    "NFPDF.html#addNFPageItem": {
                                      "ref": "NFPDF.html#addNFPageItem",
                                      "tf": 683.3333333333334
                                    }
                                  }
                                }
                              }
                            }
                          },
                          "l": {
                            "docs": {},
                            "a": {
                              "docs": {},
                              "y": {
                                "docs": {
                                  "NFPageLayerCollection.html#addNFPageLayer": {
                                    "ref": "NFPageLayerCollection.html#addNFPageLayer",
                                    "tf": 683.3333333333334
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "i": {
                "docs": {},
                "n": {
                  "docs": {},
                  "o": {
                    "docs": {},
                    "u": {
                      "docs": {},
                      "t": {
                        "docs": {},
                        "m": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "k": {
                                "docs": {},
                                "e": {
                                  "docs": {},
                                  "r": {
                                    "docs": {},
                                    "s": {
                                      "docs": {},
                                      "f": {
                                        "docs": {},
                                        "o": {
                                          "docs": {},
                                          "r": {
                                            "docs": {},
                                            "p": {
                                              "docs": {},
                                              "r": {
                                                "docs": {},
                                                "o": {
                                                  "docs": {},
                                                  "p": {
                                                    "docs": {},
                                                    "e": {
                                                      "docs": {},
                                                      "r": {
                                                        "docs": {},
                                                        "t": {
                                                          "docs": {},
                                                          "i": {
                                                            "docs": {
                                                              "NFLayer.html#addInOutMarkersForProperty": {
                                                                "ref": "NFLayer.html#addInOutMarkersForProperty",
                                                                "tf": 683.3333333333334
                                                              },
                                                              "NFPageLayer.html#addInOutMarkersForProperty": {
                                                                "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                                                                "tf": 683.3333333333334
                                                              },
                                                              "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                                                                "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                                                                "tf": 683.3333333333334
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              "s": {
                "docs": {},
                "l": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "d": {
                      "docs": {
                        "NFLayer.html#addSlider": {
                          "ref": "NFLayer.html#addSlider",
                          "tf": 675
                        },
                        "NFPageLayer.html#addSlider": {
                          "ref": "NFPageLayer.html#addSlider",
                          "tf": 675
                        },
                        "NFPaperParentLayer.html#addSlider": {
                          "ref": "NFPaperParentLayer.html#addSlider",
                          "tf": 675
                        }
                      }
                    }
                  }
                }
              },
              "a": {
                "docs": {},
                "v": {
                  "docs": {},
                  "l": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "y": {
                        "docs": {
                          "NFPageLayerCollection.html#addAVLayer": {
                            "ref": "NFPageLayerCollection.html#addAVLayer",
                            "tf": 683.3333333333334
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "v": {
            "docs": {
              "NFPaperParentLayer.html#.isPaperParentLayer": {
                "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                "tf": 5.555555555555555
              }
            },
            "l": {
              "docs": {},
              "a": {
                "docs": {},
                "y": {
                  "docs": {
                    "NFLayer.html": {
                      "ref": "NFLayer.html",
                      "tf": 12.5
                    },
                    "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                      "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                      "tf": 7.142857142857142
                    },
                    "NFLayer.html#.isCompLayer": {
                      "ref": "NFLayer.html#.isCompLayer",
                      "tf": 6.25
                    },
                    "NFLayer.html#.isAVLayer": {
                      "ref": "NFLayer.html#.isAVLayer",
                      "tf": 3.8461538461538463
                    },
                    "NFLayerCollection.html#.collectionFromAVLayerArray": {
                      "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayerCollection.html#addAVLayer": {
                      "ref": "NFPageLayerCollection.html#addAVLayer",
                      "tf": 16.666666666666664
                    },
                    "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                      "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                      "tf": 10
                    }
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "r": {
              "docs": {},
              "a": {
                "docs": {},
                "y": {
                  "docs": {
                    "NFLayerCollection.html": {
                      "ref": "NFLayerCollection.html",
                      "tf": 8.333333333333332
                    },
                    "NFLayerCollection.html#.collectionFromAVLayerArray": {
                      "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                      "tf": 7.142857142857142
                    },
                    "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
                      "ref": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
                      "tf": 10
                    },
                    "LayerCollection.html#.toArr": {
                      "ref": "LayerCollection.html#.toArr",
                      "tf": 41.66666666666666
                    }
                  }
                }
              }
            }
          },
          "b": {
            "docs": {},
            "o": {
              "docs": {},
              "v": {
                "docs": {
                  "NFLayerCollection.html#nullify": {
                    "ref": "NFLayerCollection.html#nullify",
                    "tf": 3.571428571428571
                  },
                  "NFPaperLayerGroup.html#gatherLayers": {
                    "ref": "NFPaperLayerGroup.html#gatherLayers",
                    "tf": 2.631578947368421
                  },
                  "NFPageLayerCollection.html#nullify": {
                    "ref": "NFPageLayerCollection.html#nullify",
                    "tf": 3.571428571428571
                  }
                }
              }
            }
          },
          "s": {
            "docs": {},
            "s": {
              "docs": {},
              "i": {
                "docs": {},
                "g": {
                  "docs": {},
                  "n": {
                    "docs": {},
                    "p": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "p": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "r": {
                              "docs": {},
                              "p": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "r": {
                                    "docs": {},
                                    "e": {
                                      "docs": {},
                                      "n": {
                                        "docs": {},
                                        "t": {
                                          "docs": {},
                                          "l": {
                                            "docs": {},
                                            "a": {
                                              "docs": {},
                                              "y": {
                                                "docs": {
                                                  "NFPageLayerCollection.html#assignPaperParentLayer": {
                                                    "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                                                    "tf": 683.3333333333334
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "m": {
          "docs": {},
          "a": {
            "docs": {},
            "n": {
              "docs": {},
              "i": {
                "docs": {},
                "p": {
                  "docs": {},
                  "l": {
                    "docs": {
                      "NFComp.html": {
                        "ref": "NFComp.html",
                        "tf": 6.25
                      },
                      "NFPartComp.html": {
                        "ref": "NFPartComp.html",
                        "tf": 4.545454545454546
                      }
                    }
                  },
                  "u": {
                    "docs": {},
                    "l": {
                      "docs": {
                        "NFPaperLayerGroup.html": {
                          "ref": "NFPaperLayerGroup.html",
                          "tf": 6.25
                        },
                        "LayerCollection.html#.toArr": {
                          "ref": "LayerCollection.html#.toArr",
                          "tf": 8.333333333333332
                        }
                      }
                    }
                  }
                }
              },
              "a": {
                "docs": {},
                "g": {
                  "docs": {
                    "NFPaperLayerGroup.html": {
                      "ref": "NFPaperLayerGroup.html",
                      "tf": 6.25
                    }
                  }
                }
              }
            },
            "r": {
              "docs": {},
              "k": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayer.html#markers": {
                        "ref": "NFLayer.html#markers",
                        "tf": 700
                      },
                      "NFLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFLayer.html#addInOutMarkersForProperty",
                        "tf": 3.571428571428571
                      },
                      "NFPageLayer.html#markers": {
                        "ref": "NFPageLayer.html#markers",
                        "tf": 700
                      },
                      "NFPageLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                        "tf": 3.571428571428571
                      },
                      "NFPaperParentLayer.html#markers": {
                        "ref": "NFPaperParentLayer.html#markers",
                        "tf": 700
                      },
                      "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                        "tf": 3.571428571428571
                      },
                      "Layer.html#.indexOfMarker": {
                        "ref": "Layer.html#.indexOfMarker",
                        "tf": 10
                      },
                      "Layer.html#.removeMarker": {
                        "ref": "Layer.html#.removeMarker",
                        "tf": 12.5
                      },
                      "Property.html#.expressionStringForValue": {
                        "ref": "Property.html#.expressionStringForValue",
                        "tf": 10
                      }
                    }
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "v": {
              "docs": {},
              "e": {
                "docs": {
                  "NFLayer.html#moveBefore": {
                    "ref": "NFLayer.html#moveBefore",
                    "tf": 6.25
                  },
                  "NFLayer.html#moveAfter": {
                    "ref": "NFLayer.html#moveAfter",
                    "tf": 7.142857142857142
                  },
                  "NFLayer.html#markers": {
                    "ref": "NFLayer.html#markers",
                    "tf": 7.142857142857142
                  },
                  "NFPaperLayerGroup.html#gatherLayers": {
                    "ref": "NFPaperLayerGroup.html#gatherLayers",
                    "tf": 2.631578947368421
                  },
                  "NFPageLayer.html#moveBefore": {
                    "ref": "NFPageLayer.html#moveBefore",
                    "tf": 6.25
                  },
                  "NFPageLayer.html#moveAfter": {
                    "ref": "NFPageLayer.html#moveAfter",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayer.html#markers": {
                    "ref": "NFPageLayer.html#markers",
                    "tf": 7.142857142857142
                  },
                  "NFPaperParentLayer.html#moveBefore": {
                    "ref": "NFPaperParentLayer.html#moveBefore",
                    "tf": 6.25
                  },
                  "NFPaperParentLayer.html#moveAfter": {
                    "ref": "NFPaperParentLayer.html#moveAfter",
                    "tf": 7.142857142857142
                  },
                  "NFPaperParentLayer.html#markers": {
                    "ref": "NFPaperParentLayer.html#markers",
                    "tf": 7.142857142857142
                  }
                },
                "b": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "f": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "r": {
                          "docs": {
                            "NFLayer.html#moveBefore": {
                              "ref": "NFLayer.html#moveBefore",
                              "tf": 683.3333333333334
                            },
                            "NFPageLayer.html#moveBefore": {
                              "ref": "NFPageLayer.html#moveBefore",
                              "tf": 683.3333333333334
                            },
                            "NFPaperParentLayer.html#moveBefore": {
                              "ref": "NFPaperParentLayer.html#moveBefore",
                              "tf": 683.3333333333334
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "a": {
                  "docs": {},
                  "f": {
                    "docs": {},
                    "t": {
                      "docs": {
                        "NFLayer.html#moveAfter": {
                          "ref": "NFLayer.html#moveAfter",
                          "tf": 683.3333333333334
                        },
                        "NFPageLayer.html#moveAfter": {
                          "ref": "NFPageLayer.html#moveAfter",
                          "tf": 683.3333333333334
                        },
                        "NFPaperParentLayer.html#moveAfter": {
                          "ref": "NFPaperParentLayer.html#moveAfter",
                          "tf": 683.3333333333334
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "e": {
            "docs": {},
            "t": {
              "docs": {},
              "h": {
                "docs": {},
                "o": {
                  "docs": {},
                  "d": {
                    "docs": {
                      "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                        "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#.isCompLayer": {
                        "ref": "NFLayer.html#.isCompLayer",
                        "tf": 6.25
                      },
                      "NFLayerCollection.html#.collectionFromAVLayerArray": {
                        "ref": "NFLayerCollection.html#.collectionFromAVLayerArray",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#.isPaperParentLayer": {
                        "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                        "tf": 5.555555555555555
                      },
                      "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                        "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                        "tf": 5.555555555555555
                      }
                    }
                  }
                }
              }
            },
            "m": {
              "docs": {},
              "b": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayerCollection.html#setParents": {
                        "ref": "NFLayerCollection.html#setParents",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#setParents": {
                        "ref": "NFPageLayerCollection.html#setParents",
                        "tf": 7.142857142857142
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "o": {
          "docs": {},
          "b": {
            "docs": {},
            "j": {
              "docs": {},
              "e": {
                "docs": {},
                "c": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFComp.html": {
                        "ref": "NFComp.html",
                        "tf": 6.25
                      },
                      "NFComp.html#getInfo": {
                        "ref": "NFComp.html#getInfo",
                        "tf": 12.5
                      },
                      "NFLayer.html": {
                        "ref": "NFLayer.html",
                        "tf": 12.5
                      },
                      "NFLayer.html#.isAVLayer": {
                        "ref": "NFLayer.html#.isAVLayer",
                        "tf": 3.8461538461538463
                      },
                      "NFLayerCollection.html": {
                        "ref": "NFLayerCollection.html",
                        "tf": 8.333333333333332
                      },
                      "NFPDF.html": {
                        "ref": "NFPDF.html",
                        "tf": 10
                      },
                      "NFPageItem.html": {
                        "ref": "NFPageItem.html",
                        "tf": 10
                      },
                      "NFPaperLayerGroup.html": {
                        "ref": "NFPaperLayerGroup.html",
                        "tf": 6.25
                      },
                      "NFPartComp.html": {
                        "ref": "NFPartComp.html",
                        "tf": 4.545454545454546
                      },
                      "NFPartComp.html#getInfo": {
                        "ref": "NFPartComp.html#getInfo",
                        "tf": 12.5
                      }
                    }
                  }
                }
              }
            }
          },
          "n": {
            "docs": {
              "NFLayer.html#.isAVLayer": {
                "ref": "NFLayer.html#.isAVLayer",
                "tf": 3.8461538461538463
              },
              "NFLayerCollection.html#nullify": {
                "ref": "NFLayerCollection.html#nullify",
                "tf": 3.571428571428571
              },
              "NFPageLayer.html#getPaperParentLayer": {
                "ref": "NFPageLayer.html#getPaperParentLayer",
                "tf": 4.545454545454546
              },
              "NFPageLayerCollection.html#assignPaperParentLayer": {
                "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                "tf": 3.571428571428571
              },
              "NFPageLayerCollection.html#nullify": {
                "ref": "NFPageLayerCollection.html#nullify",
                "tf": 3.571428571428571
              }
            },
            "e": {
              "docs": {},
              "'": {
                "docs": {
                  "NFLayer.html#sameLayerAs": {
                    "ref": "NFLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  },
                  "NFPageLayer.html#sameLayerAs": {
                    "ref": "NFPageLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  },
                  "NFPaperParentLayer.html#sameLayerAs": {
                    "ref": "NFPaperParentLayer.html#sameLayerAs",
                    "tf": 3.3333333333333335
                  }
                }
              }
            },
            "l": {
              "docs": {},
              "y": {
                "docs": {},
                "c": {
                  "docs": {},
                  "o": {
                    "docs": {},
                    "n": {
                      "docs": {},
                      "t": {
                        "docs": {},
                        "a": {
                          "docs": {},
                          "i": {
                            "docs": {},
                            "n": {
                              "docs": {},
                              "s": {
                                "docs": {},
                                "p": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "g": {
                                      "docs": {},
                                      "e": {
                                        "docs": {},
                                        "l": {
                                          "docs": {},
                                          "a": {
                                            "docs": {},
                                            "y": {
                                              "docs": {
                                                "NFLayerCollection.html#onlyContainsPageLayers": {
                                                  "ref": "NFLayerCollection.html#onlyContainsPageLayers",
                                                  "tf": 700
                                                },
                                                "NFPageLayerCollection.html#onlyContainsPageLayers": {
                                                  "ref": "NFPageLayerCollection.html#onlyContainsPageLayers",
                                                  "tf": 700
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "p": {
            "docs": {},
            "t": {
              "docs": {},
              "i": {
                "docs": {},
                "o": {
                  "docs": {},
                  "n": {
                    "docs": {
                      "NFLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFLayer.html#addInOutMarkersForProperty",
                        "tf": 33.33333333333333
                      },
                      "NFPageLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                        "tf": 33.33333333333333
                      },
                      "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                        "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                        "tf": 33.33333333333333
                      }
                    }
                  }
                }
              }
            }
          },
          "u": {
            "docs": {},
            "t": {
              "docs": {
                "NFLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFLayer.html#addInOutMarkersForProperty",
                  "tf": 7.142857142857142
                },
                "NFPageLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                  "tf": 7.142857142857142
                },
                "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                  "tf": 7.142857142857142
                }
              }
            }
          },
          "v": {
            "docs": {},
            "e": {
              "docs": {},
              "r": {
                "docs": {},
                "r": {
                  "docs": {},
                  "i": {
                    "docs": {},
                    "d": {
                      "docs": {
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFLayerCollection.html#nullify": {
                          "ref": "NFLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayerCollection.html#nullify": {
                          "ref": "NFPageLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "t": {
            "docs": {},
            "h": {
              "docs": {},
              "e": {
                "docs": {},
                "r": {
                  "docs": {},
                  "w": {
                    "docs": {},
                    "i": {
                      "docs": {},
                      "s": {
                        "docs": {
                          "NFPageLayerCollection.html#assignPaperParentLayer": {
                            "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                            "tf": 3.571428571428571
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "w": {
          "docs": {},
          "r": {
            "docs": {},
            "a": {
              "docs": {},
              "p": {
                "docs": {},
                "p": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "r": {
                      "docs": {
                        "NFComp.html": {
                          "ref": "NFComp.html",
                          "tf": 6.25
                        },
                        "NFLayer.html": {
                          "ref": "NFLayer.html",
                          "tf": 12.5
                        },
                        "NFLayerCollection.html": {
                          "ref": "NFLayerCollection.html",
                          "tf": 8.333333333333332
                        },
                        "NFPDF.html": {
                          "ref": "NFPDF.html",
                          "tf": 10
                        },
                        "NFPageItem.html": {
                          "ref": "NFPageItem.html",
                          "tf": 10
                        },
                        "NFPartComp.html": {
                          "ref": "NFPartComp.html",
                          "tf": 4.545454545454546
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "h": {
            "docs": {},
            "e": {
              "docs": {},
              "t": {
                "docs": {},
                "h": {
                  "docs": {},
                  "e": {
                    "docs": {},
                    "r": {
                      "docs": {
                        "NFLayer.html#.isAVLayer": {
                          "ref": "NFLayer.html#.isAVLayer",
                          "tf": 3.8461538461538463
                        },
                        "NFPageLayer.html#findPaperParentLayer": {
                          "ref": "NFPageLayer.html#findPaperParentLayer",
                          "tf": 5.555555555555555
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "s": {
          "docs": {},
          "e": {
            "docs": {},
            "l": {
              "docs": {},
              "e": {
                "docs": {},
                "c": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFComp.html#selectedLayers": {
                        "ref": "NFComp.html#selectedLayers",
                        "tf": 12.5
                      },
                      "NFComp.html#selectedPageLayers": {
                        "ref": "NFComp.html#selectedPageLayers",
                        "tf": 12.5
                      },
                      "NFPartComp.html#selectedLayers": {
                        "ref": "NFPartComp.html#selectedLayers",
                        "tf": 12.5
                      },
                      "NFPartComp.html#selectedPageLayers": {
                        "ref": "NFPartComp.html#selectedPageLayers",
                        "tf": 12.5
                      }
                    },
                    "e": {
                      "docs": {},
                      "d": {
                        "docs": {},
                        "l": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "y": {
                              "docs": {
                                "NFComp.html#selectedLayers": {
                                  "ref": "NFComp.html#selectedLayers",
                                  "tf": 700
                                },
                                "NFPartComp.html#selectedLayers": {
                                  "ref": "NFPartComp.html#selectedLayers",
                                  "tf": 700
                                }
                              }
                            }
                          }
                        },
                        "p": {
                          "docs": {},
                          "a": {
                            "docs": {},
                            "g": {
                              "docs": {},
                              "e": {
                                "docs": {},
                                "l": {
                                  "docs": {},
                                  "a": {
                                    "docs": {},
                                    "y": {
                                      "docs": {
                                        "NFComp.html#selectedPageLayers": {
                                          "ref": "NFComp.html#selectedPageLayers",
                                          "tf": 700
                                        },
                                        "NFPartComp.html#selectedPageLayers": {
                                          "ref": "NFPartComp.html#selectedPageLayers",
                                          "tf": 700
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "e": {
              "docs": {
                "NFLayer.html#sameLayerAs": {
                  "ref": "NFLayer.html#sameLayerAs",
                  "tf": 3.3333333333333335
                },
                "NFPageLayer.html#sameLayerAs": {
                  "ref": "NFPageLayer.html#sameLayerAs",
                  "tf": 3.3333333333333335
                },
                "NFPaperParentLayer.html#.isPaperParentLayer": {
                  "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                  "tf": 5.555555555555555
                },
                "NFPaperParentLayer.html#sameLayerAs": {
                  "ref": "NFPaperParentLayer.html#sameLayerAs",
                  "tf": 3.3333333333333335
                }
              }
            },
            "t": {
              "docs": {
                "NFLayer.html#setParent": {
                  "ref": "NFLayer.html#setParent",
                  "tf": 10
                },
                "NFLayer.html#setZoomer": {
                  "ref": "NFLayer.html#setZoomer",
                  "tf": 8.333333333333332
                },
                "NFLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                },
                "NFLayerCollection.html#setParents": {
                  "ref": "NFLayerCollection.html#setParents",
                  "tf": 7.142857142857142
                },
                "NFPageLayer.html#setParent": {
                  "ref": "NFPageLayer.html#setParent",
                  "tf": 10
                },
                "NFPageLayer.html#setZoomer": {
                  "ref": "NFPageLayer.html#setZoomer",
                  "tf": 8.333333333333332
                },
                "NFPageLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                },
                "NFPageLayerCollection.html#assignPaperParentLayer": {
                  "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                  "tf": 3.571428571428571
                },
                "NFPageLayerCollection.html#setParents": {
                  "ref": "NFPageLayerCollection.html#setParents",
                  "tf": 7.142857142857142
                },
                "NFPaperParentLayer.html#setName": {
                  "ref": "NFPaperParentLayer.html#setName",
                  "tf": 7.142857142857142
                },
                "NFPaperParentLayer.html#setParent": {
                  "ref": "NFPaperParentLayer.html#setParent",
                  "tf": 10
                },
                "NFPaperParentLayer.html#setZoomer": {
                  "ref": "NFPaperParentLayer.html#setZoomer",
                  "tf": 8.333333333333332
                },
                "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                  "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                  "tf": 3.571428571428571
                }
              },
              "p": {
                "docs": {},
                "a": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayer.html#setParent": {
                        "ref": "NFLayer.html#setParent",
                        "tf": 683.3333333333334
                      },
                      "NFLayerCollection.html#setParents": {
                        "ref": "NFLayerCollection.html#setParents",
                        "tf": 683.3333333333334
                      },
                      "NFPageLayer.html#setParent": {
                        "ref": "NFPageLayer.html#setParent",
                        "tf": 683.3333333333334
                      },
                      "NFPageLayerCollection.html#setParents": {
                        "ref": "NFPageLayerCollection.html#setParents",
                        "tf": 683.3333333333334
                      },
                      "NFPaperParentLayer.html#setParent": {
                        "ref": "NFPaperParentLayer.html#setParent",
                        "tf": 683.3333333333334
                      }
                    }
                  }
                }
              },
              "z": {
                "docs": {},
                "o": {
                  "docs": {},
                  "o": {
                    "docs": {},
                    "m": {
                      "docs": {
                        "NFLayer.html#setZoomer": {
                          "ref": "NFLayer.html#setZoomer",
                          "tf": 700
                        },
                        "NFPageLayer.html#setZoomer": {
                          "ref": "NFPageLayer.html#setZoomer",
                          "tf": 700
                        },
                        "NFPaperParentLayer.html#setZoomer": {
                          "ref": "NFPaperParentLayer.html#setZoomer",
                          "tf": 700
                        }
                      }
                    }
                  }
                }
              },
              "n": {
                "docs": {},
                "a": {
                  "docs": {},
                  "m": {
                    "docs": {
                      "NFPaperParentLayer.html#setName": {
                        "ref": "NFPaperParentLayer.html#setName",
                        "tf": 700
                      }
                    }
                  }
                }
              }
            }
          },
          "t": {
            "docs": {},
            "r": {
              "docs": {},
              "i": {
                "docs": {},
                "n": {
                  "docs": {},
                  "g": {
                    "docs": {
                      "NFComp.html#getInfo": {
                        "ref": "NFComp.html#getInfo",
                        "tf": 62.5
                      },
                      "NFPageItem.html#getPDFNumber": {
                        "ref": "NFPageItem.html#getPDFNumber",
                        "tf": 62.5
                      },
                      "NFPageItem.html#getPageNumber": {
                        "ref": "NFPageItem.html#getPageNumber",
                        "tf": 62.5
                      },
                      "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                        "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                        "tf": 30.555555555555557
                      },
                      "NFPartComp.html#getInfo": {
                        "ref": "NFPartComp.html#getInfo",
                        "tf": 62.5
                      },
                      "Property.html#.expressionStringForValue": {
                        "ref": "Property.html#.expressionStringForValue",
                        "tf": 33.33333333333333
                      }
                    }
                  }
                }
              }
            }
          },
          "p": {
            "docs": {},
            "e": {
              "docs": {},
              "c": {
                "docs": {},
                "i": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "l": {
                      "docs": {
                        "NFLayer.html#getSpecializedLayer": {
                          "ref": "NFLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        },
                        "NFLayer.html#getChildren": {
                          "ref": "NFLayer.html#getChildren",
                          "tf": 7.142857142857142
                        },
                        "NFLayer.html#.getSpecializedLayerFromAVLayer": {
                          "ref": "NFLayer.html#.getSpecializedLayerFromAVLayer",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayer.html#getSpecializedLayer": {
                          "ref": "NFPageLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayer.html#getChildren": {
                          "ref": "NFPageLayer.html#getChildren",
                          "tf": 7.142857142857142
                        },
                        "NFPaperParentLayer.html#getSpecializedLayer": {
                          "ref": "NFPaperParentLayer.html#getSpecializedLayer",
                          "tf": 7.142857142857142
                        },
                        "NFPaperParentLayer.html#getChildren": {
                          "ref": "NFPaperParentLayer.html#getChildren",
                          "tf": 7.142857142857142
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "h": {
            "docs": {},
            "o": {
              "docs": {},
              "r": {
                "docs": {},
                "t": {
                  "docs": {},
                  "h": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "n": {
                        "docs": {},
                        "d": {
                          "docs": {
                            "NFLayer.html#index": {
                              "ref": "NFLayer.html#index",
                              "tf": 16.666666666666664
                            },
                            "NFPageLayer.html#index": {
                              "ref": "NFPageLayer.html#index",
                              "tf": 16.666666666666664
                            },
                            "NFPaperParentLayer.html#index": {
                              "ref": "NFPaperParentLayer.html#index",
                              "tf": 16.666666666666664
                            }
                          }
                        }
                      }
                    }
                  },
                  "c": {
                    "docs": {},
                    "u": {
                      "docs": {},
                      "t": {
                        "docs": {
                          "NFLayerCollection.html#count": {
                            "ref": "NFLayerCollection.html#count",
                            "tf": 10
                          },
                          "NFPageLayerCollection.html#count": {
                            "ref": "NFPageLayerCollection.html#count",
                            "tf": 10
                          }
                        }
                      }
                    }
                  }
                }
              },
              "u": {
                "docs": {},
                "l": {
                  "docs": {},
                  "d": {
                    "docs": {},
                    "p": {
                      "docs": {},
                      "a": {
                        "docs": {},
                        "r": {
                          "docs": {
                            "NFPaperLayerGroup.html#gatherLayers": {
                              "ref": "NFPaperLayerGroup.html#gatherLayers",
                              "tf": 25
                            }
                          }
                        }
                      }
                    },
                    "m": {
                      "docs": {},
                      "o": {
                        "docs": {},
                        "v": {
                          "docs": {
                            "NFPageLayerCollection.html#assignPaperParentLayer": {
                              "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                              "tf": 33.33333333333333
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "m": {
              "docs": {},
              "e": {
                "docs": {
                  "NFLayer.html#sameLayerAs": {
                    "ref": "NFLayer.html#sameLayerAs",
                    "tf": 6.666666666666667
                  },
                  "NFLayerCollection.html#inSameComp": {
                    "ref": "NFLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFPaperLayerGroup.html": {
                    "ref": "NFPaperLayerGroup.html",
                    "tf": 6.25
                  },
                  "NFPageLayer.html#sameLayerAs": {
                    "ref": "NFPageLayer.html#sameLayerAs",
                    "tf": 6.666666666666667
                  },
                  "NFPageLayerCollection.html": {
                    "ref": "NFPageLayerCollection.html",
                    "tf": 5
                  },
                  "NFPageLayerCollection.html#fromSamePDF": {
                    "ref": "NFPageLayerCollection.html#fromSamePDF",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#inSameComp": {
                    "ref": "NFPageLayerCollection.html#inSameComp",
                    "tf": 8.333333333333332
                  },
                  "NFPaperParentLayer.html": {
                    "ref": "NFPaperParentLayer.html",
                    "tf": 5
                  },
                  "NFPaperParentLayer.html#sameLayerAs": {
                    "ref": "NFPaperParentLayer.html#sameLayerAs",
                    "tf": 6.666666666666667
                  }
                },
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "y": {
                      "docs": {},
                      "e": {
                        "docs": {},
                        "r": {
                          "docs": {},
                          "a": {
                            "docs": {
                              "NFLayer.html#sameLayerAs": {
                                "ref": "NFLayer.html#sameLayerAs",
                                "tf": 700
                              },
                              "NFPageLayer.html#sameLayerAs": {
                                "ref": "NFPageLayer.html#sameLayerAs",
                                "tf": 700
                              },
                              "NFPaperParentLayer.html#sameLayerAs": {
                                "ref": "NFPaperParentLayer.html#sameLayerAs",
                                "tf": 700
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "l": {
            "docs": {},
            "i": {
              "docs": {},
              "d": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFLayer.html#addSlider": {
                        "ref": "NFLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPageLayer.html#addSlider": {
                        "ref": "NFPageLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#addSlider": {
                        "ref": "NFPaperParentLayer.html#addSlider",
                        "tf": 10
                      }
                    }
                  }
                }
              }
            }
          },
          "u": {
            "docs": {},
            "b": {
              "docs": {},
              "c": {
                "docs": {},
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "s": {
                      "docs": {},
                      "s": {
                        "docs": {
                          "NFLayer.html#.isAVLayer": {
                            "ref": "NFLayer.html#.isAVLayer",
                            "tf": 3.8461538461538463
                          },
                          "NFPageLayer.html": {
                            "ref": "NFPageLayer.html",
                            "tf": 12.5
                          },
                          "NFPageLayerCollection.html": {
                            "ref": "NFPageLayerCollection.html",
                            "tf": 5
                          },
                          "NFPaperParentLayer.html": {
                            "ref": "NFPaperParentLayer.html",
                            "tf": 5
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "p": {
          "docs": {},
          "a": {
            "docs": {},
            "g": {
              "docs": {},
              "e": {
                "docs": {
                  "NFComp.html#selectedPageLayers": {
                    "ref": "NFComp.html#selectedPageLayers",
                    "tf": 12.5
                  },
                  "NFLayer.html#isPageLayer": {
                    "ref": "NFLayer.html#isPageLayer",
                    "tf": 10
                  },
                  "NFPDF.html#addNFPageItem": {
                    "ref": "NFPDF.html#addNFPageItem",
                    "tf": 10
                  },
                  "NFPageItem.html": {
                    "ref": "NFPageItem.html",
                    "tf": 10
                  },
                  "NFPageItem.html#getPageNumber": {
                    "ref": "NFPageItem.html#getPageNumber",
                    "tf": 12.5
                  },
                  "NFPageLayer.html": {
                    "ref": "NFPageLayer.html",
                    "tf": 12.5
                  },
                  "NFPageLayer.html#isPageLayer": {
                    "ref": "NFPageLayer.html#isPageLayer",
                    "tf": 10
                  },
                  "NFPageLayerCollection.html": {
                    "ref": "NFPageLayerCollection.html",
                    "tf": 5
                  },
                  "NFPageLayerCollection.html#highlights": {
                    "ref": "NFPageLayerCollection.html#highlights",
                    "tf": 10
                  },
                  "NFPageLayerCollection.html#fromSamePDF": {
                    "ref": "NFPageLayerCollection.html#fromSamePDF",
                    "tf": 7.142857142857142
                  },
                  "NFPageLayerCollection.html#initLayers": {
                    "ref": "NFPageLayerCollection.html#initLayers",
                    "tf": 12.5
                  },
                  "NFPageLayerCollection.html#initLayerTransforms": {
                    "ref": "NFPageLayerCollection.html#initLayerTransforms",
                    "tf": 12.5
                  },
                  "NFPageLayerCollection.html#assignPaperParentLayer": {
                    "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                    "tf": 3.571428571428571
                  },
                  "NFPaperParentLayer.html": {
                    "ref": "NFPaperParentLayer.html",
                    "tf": 5
                  },
                  "NFPaperParentLayer.html#isPageLayer": {
                    "ref": "NFPaperParentLayer.html#isPageLayer",
                    "tf": 10
                  },
                  "NFPartComp.html#selectedPageLayers": {
                    "ref": "NFPartComp.html#selectedPageLayers",
                    "tf": 12.5
                  }
                },
                "l": {
                  "docs": {},
                  "a": {
                    "docs": {},
                    "y": {
                      "docs": {
                        "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                          "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                          "tf": 25
                        }
                      }
                    }
                  }
                }
              }
            },
            "p": {
              "docs": {},
              "e": {
                "docs": {},
                "r": {
                  "docs": {
                    "NFLayer.html#isPaperParentLayer": {
                      "ref": "NFLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayer.html#getPaperParentLayer": {
                      "ref": "NFPageLayer.html#getPaperParentLayer",
                      "tf": 4.545454545454546
                    },
                    "NFPageLayer.html#isPaperParentLayer": {
                      "ref": "NFPageLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#setName": {
                      "ref": "NFPaperParentLayer.html#setName",
                      "tf": 7.142857142857142
                    },
                    "NFPaperParentLayer.html#.isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                      "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPaperParentLayer.html#isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    }
                  },
                  "p": {
                    "docs": {},
                    "a": {
                      "docs": {},
                      "r": {
                        "docs": {},
                        "e": {
                          "docs": {},
                          "n": {
                            "docs": {},
                            "t": {
                              "docs": {},
                              "l": {
                                "docs": {},
                                "a": {
                                  "docs": {},
                                  "y": {
                                    "docs": {
                                      "NFPageLayer.html#findPaperParentLayer": {
                                        "ref": "NFPageLayer.html#findPaperParentLayer",
                                        "tf": 5.555555555555555
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "r": {
              "docs": {},
              "e": {
                "docs": {},
                "n": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFLayer.html#isPaperParentLayer": {
                        "ref": "NFLayer.html#isPaperParentLayer",
                        "tf": 8.333333333333332
                      },
                      "NFLayer.html#hasNullParent": {
                        "ref": "NFLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFLayer.html#getParent": {
                        "ref": "NFLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFLayer.html#setParent": {
                        "ref": "NFLayer.html#setParent",
                        "tf": 10
                      },
                      "NFLayer.html#setZoomer": {
                        "ref": "NFLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFLayerCollection.html#setParents": {
                        "ref": "NFLayerCollection.html#setParents",
                        "tf": 7.142857142857142
                      },
                      "NFLayerCollection.html#nullify": {
                        "ref": "NFLayerCollection.html#nullify",
                        "tf": 7.142857142857142
                      },
                      "NFPaperLayerGroup.html#gatherLayers": {
                        "ref": "NFPaperLayerGroup.html#gatherLayers",
                        "tf": 5.263157894736842
                      },
                      "NFPageLayer.html#getPaperParentLayer": {
                        "ref": "NFPageLayer.html#getPaperParentLayer",
                        "tf": 4.545454545454546
                      },
                      "NFPageLayer.html#isPaperParentLayer": {
                        "ref": "NFPageLayer.html#isPaperParentLayer",
                        "tf": 8.333333333333332
                      },
                      "NFPageLayer.html#hasNullParent": {
                        "ref": "NFPageLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFPageLayer.html#getParent": {
                        "ref": "NFPageLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFPageLayer.html#setParent": {
                        "ref": "NFPageLayer.html#setParent",
                        "tf": 10
                      },
                      "NFPageLayer.html#setZoomer": {
                        "ref": "NFPageLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPageLayerCollection.html": {
                        "ref": "NFPageLayerCollection.html",
                        "tf": 5
                      },
                      "NFPageLayerCollection.html#assignPaperParentLayer": {
                        "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#setParents": {
                        "ref": "NFPageLayerCollection.html#setParents",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayerCollection.html#nullify": {
                        "ref": "NFPageLayerCollection.html#nullify",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html": {
                        "ref": "NFPaperParentLayer.html",
                        "tf": 5
                      },
                      "NFPaperParentLayer.html#setName": {
                        "ref": "NFPaperParentLayer.html#setName",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#.isPaperParentLayer": {
                        "ref": "NFPaperParentLayer.html#.isPaperParentLayer",
                        "tf": 5.555555555555555
                      },
                      "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
                        "ref": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
                        "tf": 5.555555555555555
                      },
                      "NFPaperParentLayer.html#isPaperParentLayer": {
                        "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                        "tf": 8.333333333333332
                      },
                      "NFPaperParentLayer.html#hasNullParent": {
                        "ref": "NFPaperParentLayer.html#hasNullParent",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#getParent": {
                        "ref": "NFPaperParentLayer.html#getParent",
                        "tf": 12.5
                      },
                      "NFPaperParentLayer.html#setParent": {
                        "ref": "NFPaperParentLayer.html#setParent",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#setZoomer": {
                        "ref": "NFPaperParentLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      }
                    }
                  }
                }
              },
              "t": {
                "docs": {
                  "NFPaperLayerGroup.html": {
                    "ref": "NFPaperLayerGroup.html",
                    "tf": 6.25
                  },
                  "NFPartComp.html": {
                    "ref": "NFPartComp.html",
                    "tf": 4.545454545454546
                  }
                }
              }
            }
          },
          "r": {
            "docs": {},
            "o": {
              "docs": {},
              "v": {
                "docs": {},
                "i": {
                  "docs": {},
                  "d": {
                    "docs": {
                      "NFLayer.html#moveBefore": {
                        "ref": "NFLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFLayer.html#moveAfter": {
                        "ref": "NFLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFLayer.html#markers": {
                        "ref": "NFLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#moveBefore": {
                        "ref": "NFPageLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPageLayer.html#moveAfter": {
                        "ref": "NFPageLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPageLayer.html#markers": {
                        "ref": "NFPageLayer.html#markers",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#moveBefore": {
                        "ref": "NFPaperParentLayer.html#moveBefore",
                        "tf": 6.25
                      },
                      "NFPaperParentLayer.html#moveAfter": {
                        "ref": "NFPaperParentLayer.html#moveAfter",
                        "tf": 7.142857142857142
                      },
                      "NFPaperParentLayer.html#markers": {
                        "ref": "NFPaperParentLayer.html#markers",
                        "tf": 7.142857142857142
                      }
                    }
                  }
                }
              },
              "p": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {},
                    "t": {
                      "docs": {},
                      "i": {
                        "docs": {
                          "NFLayer.html#markers": {
                            "ref": "NFLayer.html#markers",
                            "tf": 50
                          },
                          "NFLayer.html#addSlider": {
                            "ref": "NFLayer.html#addSlider",
                            "tf": 25
                          },
                          "NFPageLayer.html#markers": {
                            "ref": "NFPageLayer.html#markers",
                            "tf": 50
                          },
                          "NFPageLayer.html#addSlider": {
                            "ref": "NFPageLayer.html#addSlider",
                            "tf": 25
                          },
                          "NFPaperParentLayer.html#markers": {
                            "ref": "NFPaperParentLayer.html#markers",
                            "tf": 50
                          },
                          "NFPaperParentLayer.html#addSlider": {
                            "ref": "NFPaperParentLayer.html#addSlider",
                            "tf": 25
                          },
                          "Property.html": {
                            "ref": "Property.html",
                            "tf": 1900
                          }
                        }
                      },
                      "y": {
                        "docs": {},
                        "'": {
                          "docs": {
                            "NFLayer.html#addInOutMarkersForProperty": {
                              "ref": "NFLayer.html#addInOutMarkersForProperty",
                              "tf": 3.571428571428571
                            },
                            "NFPageLayer.html#addInOutMarkersForProperty": {
                              "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                              "tf": 3.571428571428571
                            },
                            "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                              "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                              "tf": 3.571428571428571
                            }
                          }
                        },
                        ".": {
                          "docs": {},
                          "e": {
                            "docs": {},
                            "x": {
                              "docs": {},
                              "p": {
                                "docs": {},
                                "r": {
                                  "docs": {},
                                  "e": {
                                    "docs": {},
                                    "s": {
                                      "docs": {},
                                      "s": {
                                        "docs": {},
                                        "i": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "n": {
                                              "docs": {},
                                              "s": {
                                                "docs": {},
                                                "t": {
                                                  "docs": {},
                                                  "r": {
                                                    "docs": {},
                                                    "i": {
                                                      "docs": {},
                                                      "n": {
                                                        "docs": {},
                                                        "g": {
                                                          "docs": {},
                                                          "f": {
                                                            "docs": {},
                                                            "o": {
                                                              "docs": {},
                                                              "r": {
                                                                "docs": {},
                                                                "v": {
                                                                  "docs": {},
                                                                  "a": {
                                                                    "docs": {},
                                                                    "l": {
                                                                      "docs": {},
                                                                      "u": {
                                                                        "docs": {
                                                                          "Property.html#.expressionStringForValue": {
                                                                            "ref": "Property.html#.expressionStringForValue",
                                                                            "tf": 1150
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "e": {
              "docs": {},
              "v": {
                "docs": {},
                "i": {
                  "docs": {},
                  "o": {
                    "docs": {},
                    "u": {
                      "docs": {
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFLayerCollection.html#nullify": {
                          "ref": "NFLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        },
                        "NFPageLayerCollection.html#nullify": {
                          "ref": "NFPageLayerCollection.html#nullify",
                          "tf": 3.571428571428571
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 3.571428571428571
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "l": {
            "docs": {},
            "a": {
              "docs": {},
              "y": {
                "docs": {
                  "NFLayer.html#.isAVLayer": {
                    "ref": "NFLayer.html#.isAVLayer",
                    "tf": 3.8461538461538463
                  }
                }
              }
            }
          },
          "o": {
            "docs": {},
            "s": {
              "docs": {},
              "i": {
                "docs": {},
                "t": {
                  "docs": {
                    "NFLayerCollection.html#nullify": {
                      "ref": "NFLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    },
                    "NFPageLayerCollection.html#nullify": {
                      "ref": "NFPageLayerCollection.html#nullify",
                      "tf": 3.571428571428571
                    }
                  }
                }
              }
            }
          },
          "d": {
            "docs": {},
            "f": {
              "docs": {
                "NFPageItem.html#getPDFNumber": {
                  "ref": "NFPageItem.html#getPDFNumber",
                  "tf": 12.5
                },
                "NFPaperLayerGroup.html": {
                  "ref": "NFPaperLayerGroup.html",
                  "tf": 6.25
                },
                "NFPageLayerCollection.html": {
                  "ref": "NFPageLayerCollection.html",
                  "tf": 5
                },
                "NFPageLayerCollection.html#fromSamePDF": {
                  "ref": "NFPageLayerCollection.html#fromSamePDF",
                  "tf": 7.142857142857142
                },
                "NFPaperParentLayer.html": {
                  "ref": "NFPaperParentLayer.html",
                  "tf": 5
                }
              }
            }
          }
        },
        "z": {
          "docs": {},
          "o": {
            "docs": {},
            "o": {
              "docs": {},
              "m": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "NFComp.html#getZoomer": {
                        "ref": "NFComp.html#getZoomer",
                        "tf": 16.666666666666664
                      },
                      "NFLayer.html#setZoomer": {
                        "ref": "NFLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPageLayer.html#setZoomer": {
                        "ref": "NFPageLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPaperParentLayer.html#setZoomer": {
                        "ref": "NFPaperParentLayer.html#setZoomer",
                        "tf": 8.333333333333332
                      },
                      "NFPartComp.html#getZoomer": {
                        "ref": "NFPartComp.html#getZoomer",
                        "tf": 16.666666666666664
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "v": {
          "docs": {},
          "a": {
            "docs": {},
            "l": {
              "docs": {},
              "i": {
                "docs": {},
                "d": {
                  "docs": {
                    "NFLayer.html#isPageLayer": {
                      "ref": "NFLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFLayer.html#isHighlightLayer": {
                      "ref": "NFLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFLayer.html#isPaperParentLayer": {
                      "ref": "NFLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPDF.html#addNFPageItem": {
                      "ref": "NFPDF.html#addNFPageItem",
                      "tf": 10
                    },
                    "NFPageLayer.html#isPageLayer": {
                      "ref": "NFPageLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFPageLayer.html#isHighlightLayer": {
                      "ref": "NFPageLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFPageLayer.html#isPaperParentLayer": {
                      "ref": "NFPageLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 3.571428571428571
                    },
                    "NFPaperParentLayer.html#isPageLayer": {
                      "ref": "NFPaperParentLayer.html#isPageLayer",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#isHighlightLayer": {
                      "ref": "NFPaperParentLayer.html#isHighlightLayer",
                      "tf": 10
                    },
                    "NFPaperParentLayer.html#isPaperParentLayer": {
                      "ref": "NFPaperParentLayer.html#isPaperParentLayer",
                      "tf": 8.333333333333332
                    }
                  }
                }
              },
              "u": {
                "docs": {
                  "NFLayer.html#addSlider": {
                    "ref": "NFLayer.html#addSlider",
                    "tf": 25
                  },
                  "NFPageLayer.html#addSlider": {
                    "ref": "NFPageLayer.html#addSlider",
                    "tf": 25
                  },
                  "NFPaperParentLayer.html#addSlider": {
                    "ref": "NFPaperParentLayer.html#addSlider",
                    "tf": 25
                  }
                }
              }
            }
          }
        },
        "e": {
          "docs": {},
          "x": {
            "docs": {},
            "a": {
              "docs": {},
              "m": {
                "docs": {},
                "p": {
                  "docs": {},
                  "l": {
                    "docs": {
                      "NFLayer.html#sameLayerAs": {
                        "ref": "NFLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      },
                      "NFPageLayer.html#sameLayerAs": {
                        "ref": "NFPageLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      },
                      "NFPaperParentLayer.html#sameLayerAs": {
                        "ref": "NFPaperParentLayer.html#sameLayerAs",
                        "tf": 3.3333333333333335
                      }
                    }
                  }
                }
              }
            },
            "p": {
              "docs": {},
              "r": {
                "docs": {},
                "e": {
                  "docs": {},
                  "s": {
                    "docs": {},
                    "s": {
                      "docs": {
                        "NFLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFLayer.html#addInOutMarkersForProperty",
                          "tf": 7.142857142857142
                        },
                        "NFPageLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPageLayer.html#addInOutMarkersForProperty",
                          "tf": 7.142857142857142
                        },
                        "NFPaperParentLayer.html#addInOutMarkersForProperty": {
                          "ref": "NFPaperParentLayer.html#addInOutMarkersForProperty",
                          "tf": 7.142857142857142
                        }
                      },
                      "i": {
                        "docs": {},
                        "o": {
                          "docs": {},
                          "n": {
                            "docs": {},
                            "s": {
                              "docs": {},
                              "t": {
                                "docs": {},
                                "r": {
                                  "docs": {},
                                  "i": {
                                    "docs": {},
                                    "n": {
                                      "docs": {},
                                      "g": {
                                        "docs": {},
                                        "f": {
                                          "docs": {},
                                          "o": {
                                            "docs": {},
                                            "r": {
                                              "docs": {},
                                              "v": {
                                                "docs": {},
                                                "a": {
                                                  "docs": {},
                                                  "l": {
                                                    "docs": {},
                                                    "u": {
                                                      "docs": {
                                                        "Property.html#.expressionStringForValue": {
                                                          "ref": "Property.html#.expressionStringForValue",
                                                          "tf": 683.3333333333334
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "i": {
              "docs": {},
              "s": {
                "docs": {},
                "t": {
                  "docs": {
                    "NFPageLayer.html#findPaperParentLayer": {
                      "ref": "NFPageLayer.html#findPaperParentLayer",
                      "tf": 5.555555555555555
                    },
                    "NFPageLayerCollection.html#assignPaperParentLayer": {
                      "ref": "NFPageLayerCollection.html#assignPaperParentLayer",
                      "tf": 7.142857142857142
                    }
                  }
                }
              }
            }
          },
          "f": {
            "docs": {},
            "f": {
              "docs": {},
              "e": {
                "docs": {},
                "c": {
                  "docs": {},
                  "t": {
                    "docs": {
                      "NFLayer.html#addSlider": {
                        "ref": "NFLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPageLayer.html#addSlider": {
                        "ref": "NFPageLayer.html#addSlider",
                        "tf": 10
                      },
                      "NFPaperParentLayer.html#addSlider": {
                        "ref": "NFPaperParentLayer.html#addSlider",
                        "tf": 10
                      },
                      "LayerCollection.html": {
                        "ref": "LayerCollection.html",
                        "tf": 16.666666666666664
                      },
                      "Layer.html": {
                        "ref": "Layer.html",
                        "tf": 16.666666666666664
                      },
                      "Property.html": {
                        "ref": "Property.html",
                        "tf": 16.666666666666664
                      }
                    }
                  }
                }
              }
            }
          },
          "m": {
            "docs": {},
            "p": {
              "docs": {},
              "t": {
                "docs": {},
                "i": {
                  "docs": {
                    "NFLayerCollection.html#isEmpty": {
                      "ref": "NFLayerCollection.html#isEmpty",
                      "tf": 16.666666666666664
                    },
                    "NFPageLayerCollection.html#isEmpty": {
                      "ref": "NFPageLayerCollection.html#isEmpty",
                      "tf": 16.666666666666664
                    }
                  }
                }
              }
            }
          },
          "a": {
            "docs": {},
            "s": {
              "docs": {},
              "i": {
                "docs": {},
                "e": {
                  "docs": {},
                  "r": {
                    "docs": {
                      "LayerCollection.html#.toArr": {
                        "ref": "LayerCollection.html#.toArr",
                        "tf": 8.333333333333332
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "k": {
          "docs": {},
          "n": {
            "docs": {},
            "o": {
              "docs": {},
              "w": {
                "docs": {
                  "NFLayerCollection.html#getPageLayerCollection": {
                    "ref": "NFLayerCollection.html#getPageLayerCollection",
                    "tf": 5.555555555555555
                  },
                  "NFPageLayerCollection.html#getPageLayerCollection": {
                    "ref": "NFPageLayerCollection.html#getPageLayerCollection",
                    "tf": 5.555555555555555
                  }
                }
              }
            }
          }
        },
        "u": {
          "docs": {},
          "s": {
            "docs": {
              "NFPartComp.html": {
                "ref": "NFPartComp.html",
                "tf": 4.545454545454546
              }
            }
          }
        }
      },
      "length": 1307
    },
    "corpusTokens": [
      "abov",
      "access",
      "add",
      "addavlay",
      "addinoutmarkersforproperti",
      "addnflay",
      "addnfpageitem",
      "addnfpagelay",
      "addnul",
      "addslid",
      "allow",
      "alreadi",
      "array",
      "assignpaperparentlay",
      "av",
      "avlay",
      "base",
      "befor",
      "below",
      "boolean",
      "bootstrap",
      "bottom",
      "bottommost",
      "call",
      "check",
      "child",
      "class",
      "collect",
      "collectionfromavlayerarray",
      "comment",
      "comp",
      "compitem",
      "confus",
      "connect",
      "contain",
      "containingcomp",
      "content",
      "correct",
      "count",
      "creat",
      "document",
      "don't",
      "easier",
      "effect",
      "empti",
      "exampl",
      "exist",
      "express",
      "expressionstringforvalu",
      "fals",
      "findpaperparentlay",
      "foodoc",
      "found",
      "fromsamepdf",
      "function",
      "gatherlay",
      "get",
      "getbottommostlay",
      "getchildren",
      "getinfo",
      "getpag",
      "getpagelayercollect",
      "getpagenumb",
      "getpaperparentlay",
      "getpaperparentnameforpagelay",
      "getpar",
      "getpdfnumb",
      "getspecializedlay",
      "getspecializedlayerfromavlay",
      "gettopmostlay",
      "getzoom",
      "given",
      "global",
      "go",
      "group",
      "handlebar",
      "hasnullpar",
      "highlight",
      "immedi",
      "index",
      "indexofmark",
      "indic",
      "initlay",
      "initlayertransform",
      "insamecomp",
      "instanc",
      "instanceof",
      "int",
      "int|nul",
      "isavlay",
      "iscomplay",
      "isempti",
      "ishighlightlay",
      "isnulllay",
      "ispagelay",
      "ispaperparentlay",
      "item",
      "jsdoc3",
      "know",
      "layer",
      "layer'",
      "layer.indexofmark",
      "layer.removemark",
      "layercollect",
      "layercollection.toarr",
      "layerstogath",
      "layertoremov",
      "layerwithnam",
      "list",
      "list:class",
      "list:namespac",
      "lowest",
      "lt;static&gt",
      "manag",
      "manipl",
      "manipul",
      "marker",
      "member",
      "method",
      "move",
      "moveaft",
      "movebefor",
      "name",
      "namespac",
      "new",
      "newlay",
      "newpag",
      "newpaperparentlay",
      "newpar",
      "nf",
      "nfcomp",
      "nfcomp#addnul",
      "nfcomp#getinfo",
      "nfcomp#getzoom",
      "nfcomp#layerwithnam",
      "nfcomp#selectedlay",
      "nfcomp#selectedpagelay",
      "nfcomp|nul",
      "nfhighlightlayercollect",
      "nflayer",
      "nflayer#addinoutmarkersforproperti",
      "nflayer#addslid",
      "nflayer#containingcomp",
      "nflayer#getchildren",
      "nflayer#getpar",
      "nflayer#getspecializedlay",
      "nflayer#hasnullpar",
      "nflayer#index",
      "nflayer#ishighlightlay",
      "nflayer#isnulllay",
      "nflayer#ispagelay",
      "nflayer#ispaperparentlay",
      "nflayer#mark",
      "nflayer#moveaft",
      "nflayer#movebefor",
      "nflayer#samelayera",
      "nflayer#setpar",
      "nflayer#setzoom",
      "nflayer'",
      "nflayer.getspecializedlayerfromavlay",
      "nflayer.isavlay",
      "nflayer.iscomplay",
      "nflayercollect",
      "nflayercollection#addnflay",
      "nflayercollection#containingcomp",
      "nflayercollection#count",
      "nflayercollection#getbottommostlay",
      "nflayercollection#getpagelayercollect",
      "nflayercollection#gettopmostlay",
      "nflayercollection#insamecomp",
      "nflayercollection#isempti",
      "nflayercollection#nullifi",
      "nflayercollection#onlycontainspagelay",
      "nflayercollection#remov",
      "nflayercollection#setpar",
      "nflayercollection.collectionfromavlayerarray",
      "nflayer|nfhighlightlayer|nfpagelayer|nfemphasislayer|nfgaussylayer|nfimagelay",
      "nflayer|nul",
      "nfpageitem",
      "nfpageitem#getpagenumb",
      "nfpageitem#getpdfnumb",
      "nfpageitem#highlight",
      "nfpagelay",
      "nfpagelayer#addinoutmarkersforproperti",
      "nfpagelayer#addslid",
      "nfpagelayer#containingcomp",
      "nfpagelayer#findpaperparentlay",
      "nfpagelayer#getchildren",
      "nfpagelayer#getpaperparentlay",
      "nfpagelayer#getpar",
      "nfpagelayer#getspecializedlay",
      "nfpagelayer#hasnullpar",
      "nfpagelayer#index",
      "nfpagelayer#init",
      "nfpagelayer#initlayertransform",
      "nfpagelayer#ishighlightlay",
      "nfpagelayer#isnulllay",
      "nfpagelayer#ispagelay",
      "nfpagelayer#ispaperparentlay",
      "nfpagelayer#mark",
      "nfpagelayer#moveaft",
      "nfpagelayer#movebefor",
      "nfpagelayer#samelayera",
      "nfpagelayer#setpar",
      "nfpagelayer#setzoom",
      "nfpagelayercollect",
      "nfpagelayercollection#addavlay",
      "nfpagelayercollection#addnflay",
      "nfpagelayercollection#addnfpagelay",
      "nfpagelayercollection#assignpaperparentlay",
      "nfpagelayercollection#containingcomp",
      "nfpagelayercollection#count",
      "nfpagelayercollection#fromsamepdf",
      "nfpagelayercollection#getbottommostlay",
      "nfpagelayercollection#getpagelayercollect",
      "nfpagelayercollection#gettopmostlay",
      "nfpagelayercollection#highlight",
      "nfpagelayercollection#initlay",
      "nfpagelayercollection#initlayertransform",
      "nfpagelayercollection#insamecomp",
      "nfpagelayercollection#isempti",
      "nfpagelayercollection#newpaperparentlay",
      "nfpagelayercollection#nullifi",
      "nfpagelayercollection#onlycontainspagelay",
      "nfpagelayercollection#remov",
      "nfpagelayercollection#setpar",
      "nfpagelayercollection.collectionfromavlayerarray",
      "nfpagelayer|nfhighlightlayer|nfpaperparentlayer|nflay",
      "nfpaperlayergroup",
      "nfpaperlayergroup#gatherlay",
      "nfpaperlayergroup#getchildren",
      "nfpaperlayergroup#getpag",
      "nfpaperparentlay",
      "nfpaperparentlayer#addinoutmarkersforproperti",
      "nfpaperparentlayer#addslid",
      "nfpaperparentlayer#containingcomp",
      "nfpaperparentlayer#getchildren",
      "nfpaperparentlayer#getpar",
      "nfpaperparentlayer#getspecializedlay",
      "nfpaperparentlayer#hasnullpar",
      "nfpaperparentlayer#index",
      "nfpaperparentlayer#ishighlightlay",
      "nfpaperparentlayer#isnulllay",
      "nfpaperparentlayer#ispagelay",
      "nfpaperparentlayer#ispaperparentlay",
      "nfpaperparentlayer#mark",
      "nfpaperparentlayer#moveaft",
      "nfpaperparentlayer#movebefor",
      "nfpaperparentlayer#samelayera",
      "nfpaperparentlayer#setnam",
      "nfpaperparentlayer#setpar",
      "nfpaperparentlayer#setzoom",
      "nfpaperparentlayer.getpaperparentnameforpagelay",
      "nfpaperparentlayer.ispaperparentlay",
      "nfpaperparentlayer|nul",
      "nfpartcomp",
      "nfpartcomp#addnul",
      "nfpartcomp#getinfo",
      "nfpartcomp#getzoom",
      "nfpartcomp#layerwithnam",
      "nfpartcomp#selectedlay",
      "nfpartcomp#selectedpagelay",
      "nfpdf",
      "nfpdf#addnfpageitem",
      "nice",
      "non",
      "none",
      "null",
      "nullifi",
      "number",
      "object",
      "on",
      "one'",
      "onlycontainspagelay",
      "option",
      "otherwis",
      "out",
      "overrid",
      "page",
      "pagelay",
      "paper",
      "paperparentlay",
      "parent",
      "part",
      "pdf",
      "play",
      "posit",
      "previou",
      "properti",
      "property'",
      "property.expressionstringforvalu",
      "provid",
      "readm",
      "refer",
      "regardless",
      "remov",
      "removemark",
      "represent",
      "return",
      "run",
      "same",
      "samelayera",
      "see",
      "select",
      "selectedlay",
      "selectedpagelay",
      "set",
      "setnam",
      "setpar",
      "setzoom",
      "shortcut",
      "shorthand",
      "shouldmov",
      "shouldpar",
      "slider",
      "special",
      "string",
      "subclass",
      "target",
      "targetlay",
      "templat",
      "test",
      "thelay",
      "toarr",
      "topmost",
      "transit",
      "true",
      "type",
      "us",
      "valid",
      "valu",
      "whether",
      "wrapper",
      "zoomer"
    ],
    "pipeline": [
      "trimmer",
      "stopWordFilter",
      "stemmer"
    ]
  },
  "store": {
    "index.html": {
      "id": "index.html",
      "kind": "readme",
      "title": "FooDoc",
      "longname": "index",
      "name": "FooDoc",
      "tags": "index",
      "summary": "A Bootstrap and Handlebars based template for JSDoc3.",
      "description": "",
      "body": ""
    },
    "global.html": {
      "id": "global.html",
      "kind": "global",
      "title": "Globals",
      "longname": "global",
      "name": "Globals",
      "tags": "global",
      "summary": "All documented globals.",
      "description": "",
      "body": ""
    },
    "list_class.html": {
      "id": "list_class.html",
      "kind": "list",
      "title": "Classes",
      "longname": "list:class",
      "name": "Classes",
      "tags": "list:class",
      "summary": "All documented classes.",
      "description": "",
      "body": ""
    },
    "list_namespace.html": {
      "id": "list_namespace.html",
      "kind": "list",
      "title": "Namespaces",
      "longname": "list:namespace",
      "name": "Namespaces",
      "tags": "list:namespace",
      "summary": "All documented namespaces.",
      "description": "",
      "body": ""
    },
    "NFComp.html": {
      "id": "NFComp.html",
      "kind": "class",
      "title": "NFComp",
      "longname": "NFComp",
      "name": "NFComp",
      "tags": "NFComp",
      "summary": "",
      "description": "NF Wrapper object for a CompItem that allows for access to and maniplation of its layers.",
      "body": ""
    },
    "NFComp.html#selectedLayers": {
      "id": "NFComp.html#selectedLayers",
      "kind": "function",
      "title": "selectedLayers() → {NFLayerCollection}",
      "longname": "NFComp#selectedLayers",
      "name": "selectedLayers",
      "tags": "NFComp#selectedLayers selectedLayers",
      "summary": "",
      "description": "Gets the selected layers in this comp"
    },
    "NFComp.html#selectedPageLayers": {
      "id": "NFComp.html#selectedPageLayers",
      "kind": "function",
      "title": "selectedPageLayers() → {NFPageLayerCollection}",
      "longname": "NFComp#selectedPageLayers",
      "name": "selectedPageLayers",
      "tags": "NFComp#selectedPageLayers selectedPageLayers",
      "summary": "",
      "description": "Gets the selected pages in this comp"
    },
    "NFComp.html#layerWithName": {
      "id": "NFComp.html#layerWithName",
      "kind": "function",
      "title": "layerWithName( name ) → {NFLayer|null}",
      "longname": "NFComp#layerWithName",
      "name": "layerWithName",
      "tags": "NFComp#layerWithName layerWithName",
      "summary": "",
      "description": "Returns the NFLayer in this comp with the layer name given or null if none found"
    },
    "NFComp.html#getZoomer": {
      "id": "NFComp.html#getZoomer",
      "kind": "function",
      "title": "getZoomer() → {NFLayer|null}",
      "longname": "NFComp#getZoomer",
      "name": "getZoomer",
      "tags": "NFComp#getZoomer getZoomer",
      "summary": "",
      "description": "Gets the Zoomer layer"
    },
    "NFComp.html#addNull": {
      "id": "NFComp.html#addNull",
      "kind": "function",
      "title": "addNull() → {NFLayer}",
      "longname": "NFComp#addNull",
      "name": "addNull",
      "tags": "NFComp#addNull addNull",
      "summary": "",
      "description": "Creates and returns a new null layer in this comp"
    },
    "NFComp.html#getInfo": {
      "id": "NFComp.html#getInfo",
      "kind": "function",
      "title": "getInfo() → {string}",
      "longname": "NFComp#getInfo",
      "name": "getInfo",
      "tags": "NFComp#getInfo getInfo",
      "summary": "",
      "description": "Returns a string representation of the object"
    },
    "NFLayer.html": {
      "id": "NFLayer.html",
      "kind": "class",
      "title": "NFLayer",
      "longname": "NFLayer",
      "name": "NFLayer",
      "tags": "NFLayer",
      "summary": "",
      "description": "NF Wrapper object for an AVLayer",
      "body": ""
    },
    "NFLayer.html#isPageLayer": {
      "id": "NFLayer.html#isPageLayer",
      "kind": "function",
      "title": "isPageLayer() → {boolean}",
      "longname": "NFLayer#isPageLayer",
      "name": "isPageLayer",
      "tags": "NFLayer#isPageLayer isPageLayer",
      "summary": "",
      "description": "Checks if this layer is a valid page Layer"
    },
    "NFLayer.html#isNullLayer": {
      "id": "NFLayer.html#isNullLayer",
      "kind": "function",
      "title": "isNullLayer() → {boolean}",
      "longname": "NFLayer#isNullLayer",
      "name": "isNullLayer",
      "tags": "NFLayer#isNullLayer isNullLayer",
      "summary": "",
      "description": "Checks if this layer is a null layer"
    },
    "NFLayer.html#isHighlightLayer": {
      "id": "NFLayer.html#isHighlightLayer",
      "kind": "function",
      "title": "isHighlightLayer() → {boolean}",
      "longname": "NFLayer#isHighlightLayer",
      "name": "isHighlightLayer",
      "tags": "NFLayer#isHighlightLayer isHighlightLayer",
      "summary": "",
      "description": "Checks if this layer is a valid highlight layer"
    },
    "NFLayer.html#isPaperParentLayer": {
      "id": "NFLayer.html#isPaperParentLayer",
      "kind": "function",
      "title": "isPaperParentLayer() → {boolean}",
      "longname": "NFLayer#isPaperParentLayer",
      "name": "isPaperParentLayer",
      "tags": "NFLayer#isPaperParentLayer isPaperParentLayer",
      "summary": "",
      "description": "Checks if this layer is a valid paper parent layer"
    },
    "NFLayer.html#getSpecializedLayer": {
      "id": "NFLayer.html#getSpecializedLayer",
      "kind": "function",
      "title": "getSpecializedLayer() → {NFPageLayer|NFHighlightLayer|NFPaperParentLayer|NFLayer}",
      "longname": "NFLayer#getSpecializedLayer",
      "name": "getSpecializedLayer",
      "tags": "NFLayer#getSpecializedLayer getSpecializedLayer",
      "summary": "",
      "description": "Returns a new layer of a specialized type for the contents of this layer"
    },
    "NFLayer.html#index": {
      "id": "NFLayer.html#index",
      "kind": "function",
      "title": "index() → {int}",
      "longname": "NFLayer#index",
      "name": "index",
      "tags": "NFLayer#index index",
      "summary": "",
      "description": "Shorthand for the layer's index"
    },
    "NFLayer.html#hasNullParent": {
      "id": "NFLayer.html#hasNullParent",
      "kind": "function",
      "title": "hasNullParent() → {boolean}",
      "longname": "NFLayer#hasNullParent",
      "name": "hasNullParent",
      "tags": "NFLayer#hasNullParent hasNullParent",
      "summary": "",
      "description": "Returns true if the layer has a null parent"
    },
    "NFLayer.html#sameLayerAs": {
      "id": "NFLayer.html#sameLayerAs",
      "kind": "function",
      "title": "sameLayerAs() → {boolean}",
      "longname": "NFLayer#sameLayerAs",
      "name": "sameLayerAs",
      "tags": "NFLayer#sameLayerAs sameLayerAs",
      "summary": "",
      "description": "Checks to see if a given NFLayer's layer is the same as this one's For example, an NFLayer and an NFPageLayer that refer to the same layer will return true"
    },
    "NFLayer.html#containingComp": {
      "id": "NFLayer.html#containingComp",
      "kind": "function",
      "title": "containingComp() → {NFComp}",
      "longname": "NFLayer#containingComp",
      "name": "containingComp",
      "tags": "NFLayer#containingComp containingComp",
      "summary": "",
      "description": "Returns the containing NFComp"
    },
    "NFLayer.html#getChildren": {
      "id": "NFLayer.html#getChildren",
      "kind": "function",
      "title": "getChildren() → {NFLayerCollection}",
      "longname": "NFLayer#getChildren",
      "name": "getChildren",
      "tags": "NFLayer#getChildren getChildren",
      "summary": "",
      "description": "Returns an NFLayerCollection of child layers of this layer as specialized layers"
    },
    "NFLayer.html#getParent": {
      "id": "NFLayer.html#getParent",
      "kind": "function",
      "title": "getParent() → {NFLayer|null}",
      "longname": "NFLayer#getParent",
      "name": "getParent",
      "tags": "NFLayer#getParent getParent",
      "summary": "",
      "description": "Gets the layer's parent NFLayer, if any"
    },
    "NFLayer.html#setParent": {
      "id": "NFLayer.html#setParent",
      "kind": "function",
      "title": "setParent( newParent ) → {NFLayer}",
      "longname": "NFLayer#setParent",
      "name": "setParent",
      "tags": "NFLayer#setParent setParent",
      "summary": "",
      "description": "Sets the layer's parent to a given NFLayer"
    },
    "NFLayer.html#setZoomer": {
      "id": "NFLayer.html#setZoomer",
      "kind": "function",
      "title": "setZoomer() → {NFLayer}",
      "longname": "NFLayer#setZoomer",
      "name": "setZoomer",
      "tags": "NFLayer#setZoomer setZoomer",
      "summary": "",
      "description": "Sets the layer's parent to the zoomer if this layer is in an NFPartComp"
    },
    "NFLayer.html#moveBefore": {
      "id": "NFLayer.html#moveBefore",
      "kind": "function",
      "title": "moveBefore( targetLayer ) → {NFLayer}",
      "longname": "NFLayer#moveBefore",
      "name": "moveBefore",
      "tags": "NFLayer#moveBefore moveBefore",
      "summary": "",
      "description": "Moves this layer's index to immediately before the provided target layer"
    },
    "NFLayer.html#moveAfter": {
      "id": "NFLayer.html#moveAfter",
      "kind": "function",
      "title": "moveAfter( targetLayer ) → {NFLayer}",
      "longname": "NFLayer#moveAfter",
      "name": "moveAfter",
      "tags": "NFLayer#moveAfter moveAfter",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFLayer.html#markers": {
      "id": "NFLayer.html#markers",
      "kind": "function",
      "title": "markers() → {Property}",
      "longname": "NFLayer#markers",
      "name": "markers",
      "tags": "NFLayer#markers markers",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFLayer.html#addInOutMarkersForProperty": {
      "id": "NFLayer.html#addInOutMarkersForProperty",
      "kind": "function",
      "title": "addInOutMarkersForProperty( options ) → {NFLayer}",
      "longname": "NFLayer#addInOutMarkersForProperty",
      "name": "addInOutMarkersForProperty",
      "tags": "NFLayer#addInOutMarkersForProperty addInOutMarkersForProperty",
      "summary": "",
      "description": "Sets the given property's expression and adds In and Out markers (if not already on the layer) for in and out transitions. Overrides previous expressions"
    },
    "NFLayer.html#addSlider": {
      "id": "NFLayer.html#addSlider",
      "kind": "function",
      "title": "addSlider( name, value ) → {Property}",
      "longname": "NFLayer#addSlider",
      "name": "addSlider",
      "tags": "NFLayer#addSlider addSlider",
      "summary": "",
      "description": "Creates and returns a slider effect on the layer"
    },
    "NFLayer.html#.getSpecializedLayerFromAVLayer": {
      "id": "NFLayer.html#.getSpecializedLayerFromAVLayer",
      "kind": "function",
      "title": "&lt;static&gt; getSpecializedLayerFromAVLayer( theLayer ) → {NFLayer|NFHighlightLayer|NFPageLayer|NFEmphasisLayer|NFGaussyLayer|NFImageLayer}",
      "longname": "NFLayer.getSpecializedLayerFromAVLayer",
      "name": "getSpecializedLayerFromAVLayer",
      "tags": "NFLayer.getSpecializedLayerFromAVLayer getSpecializedLayerFromAVLayer",
      "summary": "",
      "description": "Class Method: Returns a new Specialized NFLayer from an AVLayer"
    },
    "NFLayer.html#.isCompLayer": {
      "id": "NFLayer.html#.isCompLayer",
      "kind": "function",
      "title": "&lt;static&gt; isCompLayer( theLayer ) → {boolean}",
      "longname": "NFLayer.isCompLayer",
      "name": "isCompLayer",
      "tags": "NFLayer.isCompLayer isCompLayer",
      "summary": "",
      "description": "Class Method: Returns true if the given AVLayer is a comp layer"
    },
    "NFLayer.html#.isAVLayer": {
      "id": "NFLayer.html#.isAVLayer",
      "kind": "function",
      "title": "&lt;static&gt; isAVLayer( layer ) → {boolean}",
      "longname": "NFLayer.isAVLayer",
      "name": "isAVLayer",
      "tags": "NFLayer.isAVLayer isAVLayer",
      "summary": "",
      "description": "Returns whether or not a given Layer is an AVLayer or one of its subclasses. This is because Layer objects don't play nice with `instanceof`"
    },
    "NFLayerCollection.html": {
      "id": "NFLayerCollection.html",
      "kind": "class",
      "title": "NFLayerCollection",
      "longname": "NFLayerCollection",
      "name": "NFLayerCollection",
      "tags": "NFLayerCollection",
      "summary": "",
      "description": "NF Wrapper object for a Array that contains NFLayers",
      "body": ""
    },
    "NFLayerCollection.html#addNFLayer": {
      "id": "NFLayerCollection.html#addNFLayer",
      "kind": "function",
      "title": "addNFLayer( newLayer ) → {NFLayerCollection}",
      "longname": "NFLayerCollection#addNFLayer",
      "name": "addNFLayer",
      "tags": "NFLayerCollection#addNFLayer addNFLayer",
      "summary": "",
      "description": "Adds an NFLayer to this collection"
    },
    "NFLayerCollection.html#onlyContainsPageLayers": {
      "id": "NFLayerCollection.html#onlyContainsPageLayers",
      "kind": "function",
      "title": "onlyContainsPageLayers() → {boolean}",
      "longname": "NFLayerCollection#onlyContainsPageLayers",
      "name": "onlyContainsPageLayers",
      "tags": "NFLayerCollection#onlyContainsPageLayers onlyContainsPageLayers",
      "summary": "",
      "description": "Returns true if the collection only contains NFPageLayers and no other types of NFLayers"
    },
    "NFLayerCollection.html#inSameComp": {
      "id": "NFLayerCollection.html#inSameComp",
      "kind": "function",
      "title": "inSameComp() → {boolean}",
      "longname": "NFLayerCollection#inSameComp",
      "name": "inSameComp",
      "tags": "NFLayerCollection#inSameComp inSameComp",
      "summary": "",
      "description": "Returns true if the layers in the collection are all in the same comp"
    },
    "NFLayerCollection.html#containingComp": {
      "id": "NFLayerCollection.html#containingComp",
      "kind": "function",
      "title": "containingComp() → {NFComp|null}",
      "longname": "NFLayerCollection#containingComp",
      "name": "containingComp",
      "tags": "NFLayerCollection#containingComp containingComp",
      "summary": "",
      "description": "Returns the containing comp for the layers, or null if #inSameComp is false"
    },
    "NFLayerCollection.html#getPageLayerCollection": {
      "id": "NFLayerCollection.html#getPageLayerCollection",
      "kind": "function",
      "title": "getPageLayerCollection() → {NFPageLayerCollection}",
      "longname": "NFLayerCollection#getPageLayerCollection",
      "name": "getPageLayerCollection",
      "tags": "NFLayerCollection#getPageLayerCollection getPageLayerCollection",
      "summary": "",
      "description": "Returns a new NFPageLayerCollection from this collection. Only call if you know this collection only contains NFPageLayers"
    },
    "NFLayerCollection.html#count": {
      "id": "NFLayerCollection.html#count",
      "kind": "function",
      "title": "count() → {int}",
      "longname": "NFLayerCollection#count",
      "name": "count",
      "tags": "NFLayerCollection#count count",
      "summary": "",
      "description": "Shortcut to access the number of layers in the collection"
    },
    "NFLayerCollection.html#isEmpty": {
      "id": "NFLayerCollection.html#isEmpty",
      "kind": "function",
      "title": "isEmpty() → {boolean}",
      "longname": "NFLayerCollection#isEmpty",
      "name": "isEmpty",
      "tags": "NFLayerCollection#isEmpty isEmpty",
      "summary": "",
      "description": "True if the collection is empty"
    },
    "NFLayerCollection.html#remove": {
      "id": "NFLayerCollection.html#remove",
      "kind": "function",
      "title": "remove( layerToRemove ) → {NFLayerCollection}",
      "longname": "NFLayerCollection#remove",
      "name": "remove",
      "tags": "NFLayerCollection#remove remove",
      "summary": "",
      "description": "Removes a given layer from this collection"
    },
    "NFLayerCollection.html#getTopmostLayer": {
      "id": "NFLayerCollection.html#getTopmostLayer",
      "kind": "function",
      "title": "getTopmostLayer() → {NFLayer|null}",
      "longname": "NFLayerCollection#getTopmostLayer",
      "name": "getTopmostLayer",
      "tags": "NFLayerCollection#getTopmostLayer getTopmostLayer",
      "summary": "",
      "description": "Gets the topmost NFLayer in this collection"
    },
    "NFLayerCollection.html#getBottommostLayer": {
      "id": "NFLayerCollection.html#getBottommostLayer",
      "kind": "function",
      "title": "getBottommostLayer() → {NFLayer|null}",
      "longname": "NFLayerCollection#getBottommostLayer",
      "name": "getBottommostLayer",
      "tags": "NFLayerCollection#getBottommostLayer getBottommostLayer",
      "summary": "",
      "description": "Gets the bottommost NFLayer in this collection"
    },
    "NFLayerCollection.html#setParents": {
      "id": "NFLayerCollection.html#setParents",
      "kind": "function",
      "title": "setParents( newParent ) → {NFLayerCollection}",
      "longname": "NFLayerCollection#setParents",
      "name": "setParents",
      "tags": "NFLayerCollection#setParents setParents",
      "summary": "",
      "description": "Sets all member layers' parents to a given NFLayer or null"
    },
    "NFLayerCollection.html#nullify": {
      "id": "NFLayerCollection.html#nullify",
      "kind": "function",
      "title": "nullify() → {NFLayer}",
      "longname": "NFLayerCollection#nullify",
      "name": "nullify",
      "tags": "NFLayerCollection#nullify nullify",
      "summary": "",
      "description": "Creates a new null parent to all the layers in the collection, positioned above the one with the lowest index. Will override previous parenting."
    },
    "NFLayerCollection.html#.collectionFromAVLayerArray": {
      "id": "NFLayerCollection.html#.collectionFromAVLayerArray",
      "kind": "function",
      "title": "&lt;static&gt; collectionFromAVLayerArray() → {NFLayerCollection}",
      "longname": "NFLayerCollection.collectionFromAVLayerArray",
      "name": "collectionFromAVLayerArray",
      "tags": "NFLayerCollection.collectionFromAVLayerArray collectionFromAVLayerArray",
      "summary": "",
      "description": "Class Method which returns a new NFLayerCollection from an array of AVLayers"
    },
    "NFPDF.html": {
      "id": "NFPDF.html",
      "kind": "class",
      "title": "NFPDF",
      "longname": "NFPDF",
      "name": "NFPDF",
      "tags": "NFPDF",
      "summary": "",
      "description": "NF Wrapper object for a group of NFPageItems",
      "body": ""
    },
    "NFPDF.html#addNFPageItem": {
      "id": "NFPDF.html#addNFPageItem",
      "kind": "function",
      "title": "addNFPageItem( newPage ) → {NFPDF}",
      "longname": "NFPDF#addNFPageItem",
      "name": "addNFPageItem",
      "tags": "NFPDF#addNFPageItem addNFPageItem",
      "summary": "",
      "description": "Checks if this layer is a valid page Layer"
    },
    "NFPageItem.html": {
      "id": "NFPageItem.html",
      "kind": "class",
      "title": "NFPageItem",
      "longname": "NFPageItem",
      "name": "NFPageItem",
      "tags": "NFPageItem",
      "summary": "",
      "description": "NF Wrapper object for a page CompItem",
      "body": ""
    },
    "NFPageItem.html#getPDFNumber": {
      "id": "NFPageItem.html#getPDFNumber",
      "kind": "function",
      "title": "getPDFNumber() → {string}",
      "longname": "NFPageItem#getPDFNumber",
      "name": "getPDFNumber",
      "tags": "NFPageItem#getPDFNumber getPDFNumber",
      "summary": "",
      "description": "Returns the PDF number as a String"
    },
    "NFPageItem.html#getPageNumber": {
      "id": "NFPageItem.html#getPageNumber",
      "kind": "function",
      "title": "getPageNumber() → {string}",
      "longname": "NFPageItem#getPageNumber",
      "name": "getPageNumber",
      "tags": "NFPageItem#getPageNumber getPageNumber",
      "summary": "",
      "description": "Returns the page number as a String"
    },
    "NFPageItem.html#highlights": {
      "id": "NFPageItem.html#highlights",
      "kind": "function",
      "title": "highlights() → {NFHighlightLayerCollection}",
      "longname": "NFPageItem#highlights",
      "name": "highlights",
      "tags": "NFPageItem#highlights highlights",
      "summary": "",
      "description": "Gets the Highlight layers in this item"
    },
    "NFPaperLayerGroup.html": {
      "id": "NFPaperLayerGroup.html",
      "kind": "class",
      "title": "NFPaperLayerGroup",
      "longname": "NFPaperLayerGroup",
      "name": "NFPaperLayerGroup",
      "tags": "NFPaperLayerGroup",
      "summary": "",
      "description": "An object that manages and manipulates a group of layers that are part of the same PDF",
      "body": ""
    },
    "NFPaperLayerGroup.html#getChildren": {
      "id": "NFPaperLayerGroup.html#getChildren",
      "kind": "function",
      "title": "getChildren() → {NFLayerCollection}",
      "longname": "NFPaperLayerGroup#getChildren",
      "name": "getChildren",
      "tags": "NFPaperLayerGroup#getChildren getChildren",
      "summary": "",
      "description": "Gets all the NFLayers in the group"
    },
    "NFPaperLayerGroup.html#getPages": {
      "id": "NFPaperLayerGroup.html#getPages",
      "kind": "function",
      "title": "getPages() → {NFPageLayerCollection}",
      "longname": "NFPaperLayerGroup#getPages",
      "name": "getPages",
      "tags": "NFPaperLayerGroup#getPages getPages",
      "summary": "",
      "description": "Gets all the NFPageLayers in the group"
    },
    "NFPaperLayerGroup.html#gatherLayers": {
      "id": "NFPaperLayerGroup.html#gatherLayers",
      "kind": "function",
      "title": "gatherLayers( layersToGather [, shouldParent ] ) → {NFPaperLayerGroup}",
      "longname": "NFPaperLayerGroup#gatherLayers",
      "name": "gatherLayers",
      "tags": "NFPaperLayerGroup#gatherLayers gatherLayers",
      "summary": "",
      "description": "Moves the given layers into the group and parents if indicated. Layers below the bottommost layer in the group will go at the bottom, and layers above the parent will go immediately below it."
    },
    "NFPageLayer.html": {
      "id": "NFPageLayer.html",
      "kind": "class",
      "title": "NFPageLayer",
      "longname": "NFPageLayer",
      "name": "NFPageLayer",
      "tags": "NFPageLayer",
      "summary": "",
      "description": "Subclass of NFLayer for a page layer",
      "body": ""
    },
    "NFPageLayer.html#getPaperParentLayer": {
      "id": "NFPageLayer.html#getPaperParentLayer",
      "kind": "function",
      "title": "getPaperParentLayer() → {NFPaperParentLayer|null}",
      "longname": "NFPageLayer#getPaperParentLayer",
      "name": "getPaperParentLayer",
      "tags": "NFPageLayer#getPaperParentLayer getPaperParentLayer",
      "summary": "",
      "description": "Returns a connected paper parent layer. Not to be confused with NFPageLayer#findPaperParentLayer which will return a non-connected one"
    },
    "NFPageLayer.html#findPaperParentLayer": {
      "id": "NFPageLayer.html#findPaperParentLayer",
      "kind": "function",
      "title": "findPaperParentLayer() → {NFPaperParentLayer|null}",
      "longname": "NFPageLayer#findPaperParentLayer",
      "name": "findPaperParentLayer",
      "tags": "NFPageLayer#findPaperParentLayer findPaperParentLayer",
      "summary": "",
      "description": "Returns the paperParentLayer for this layer, if it exists, REGARDLESS OF WHETHER ITS CONNECTED. Not to be confused with NFPageLayer#getPaperParentLayer"
    },
    "NFPageLayer.html#isPageLayer": {
      "id": "NFPageLayer.html#isPageLayer",
      "kind": "function",
      "title": "isPageLayer() → {boolean}",
      "longname": "NFPageLayer#isPageLayer",
      "name": "isPageLayer",
      "tags": "NFPageLayer#isPageLayer isPageLayer",
      "summary": "",
      "description": "Checks if this layer is a valid page Layer"
    },
    "NFPageLayer.html#isNullLayer": {
      "id": "NFPageLayer.html#isNullLayer",
      "kind": "function",
      "title": "isNullLayer() → {boolean}",
      "longname": "NFPageLayer#isNullLayer",
      "name": "isNullLayer",
      "tags": "NFPageLayer#isNullLayer isNullLayer",
      "summary": "",
      "description": "Checks if this layer is a null layer"
    },
    "NFPageLayer.html#isHighlightLayer": {
      "id": "NFPageLayer.html#isHighlightLayer",
      "kind": "function",
      "title": "isHighlightLayer() → {boolean}",
      "longname": "NFPageLayer#isHighlightLayer",
      "name": "isHighlightLayer",
      "tags": "NFPageLayer#isHighlightLayer isHighlightLayer",
      "summary": "",
      "description": "Checks if this layer is a valid highlight layer"
    },
    "NFPageLayer.html#isPaperParentLayer": {
      "id": "NFPageLayer.html#isPaperParentLayer",
      "kind": "function",
      "title": "isPaperParentLayer() → {boolean}",
      "longname": "NFPageLayer#isPaperParentLayer",
      "name": "isPaperParentLayer",
      "tags": "NFPageLayer#isPaperParentLayer isPaperParentLayer",
      "summary": "",
      "description": "Checks if this layer is a valid paper parent layer"
    },
    "NFPageLayer.html#getSpecializedLayer": {
      "id": "NFPageLayer.html#getSpecializedLayer",
      "kind": "function",
      "title": "getSpecializedLayer() → {NFPageLayer|NFHighlightLayer|NFPaperParentLayer|NFLayer}",
      "longname": "NFPageLayer#getSpecializedLayer",
      "name": "getSpecializedLayer",
      "tags": "NFPageLayer#getSpecializedLayer getSpecializedLayer",
      "summary": "",
      "description": "Returns a new layer of a specialized type for the contents of this layer"
    },
    "NFPageLayer.html#index": {
      "id": "NFPageLayer.html#index",
      "kind": "function",
      "title": "index() → {int}",
      "longname": "NFPageLayer#index",
      "name": "index",
      "tags": "NFPageLayer#index index",
      "summary": "",
      "description": "Shorthand for the layer's index"
    },
    "NFPageLayer.html#hasNullParent": {
      "id": "NFPageLayer.html#hasNullParent",
      "kind": "function",
      "title": "hasNullParent() → {boolean}",
      "longname": "NFPageLayer#hasNullParent",
      "name": "hasNullParent",
      "tags": "NFPageLayer#hasNullParent hasNullParent",
      "summary": "",
      "description": "Returns true if the layer has a null parent"
    },
    "NFPageLayer.html#sameLayerAs": {
      "id": "NFPageLayer.html#sameLayerAs",
      "kind": "function",
      "title": "sameLayerAs() → {boolean}",
      "longname": "NFPageLayer#sameLayerAs",
      "name": "sameLayerAs",
      "tags": "NFPageLayer#sameLayerAs sameLayerAs",
      "summary": "",
      "description": "Checks to see if a given NFLayer's layer is the same as this one's For example, an NFLayer and an NFPageLayer that refer to the same layer will return true"
    },
    "NFPageLayer.html#containingComp": {
      "id": "NFPageLayer.html#containingComp",
      "kind": "function",
      "title": "containingComp() → {NFComp}",
      "longname": "NFPageLayer#containingComp",
      "name": "containingComp",
      "tags": "NFPageLayer#containingComp containingComp",
      "summary": "",
      "description": "Returns the containing NFComp"
    },
    "NFPageLayer.html#getChildren": {
      "id": "NFPageLayer.html#getChildren",
      "kind": "function",
      "title": "getChildren() → {NFLayerCollection}",
      "longname": "NFPageLayer#getChildren",
      "name": "getChildren",
      "tags": "NFPageLayer#getChildren getChildren",
      "summary": "",
      "description": "Returns an NFLayerCollection of child layers of this layer as specialized layers"
    },
    "NFPageLayer.html#getParent": {
      "id": "NFPageLayer.html#getParent",
      "kind": "function",
      "title": "getParent() → {NFLayer|null}",
      "longname": "NFPageLayer#getParent",
      "name": "getParent",
      "tags": "NFPageLayer#getParent getParent",
      "summary": "",
      "description": "Gets the layer's parent NFLayer, if any"
    },
    "NFPageLayer.html#setParent": {
      "id": "NFPageLayer.html#setParent",
      "kind": "function",
      "title": "setParent( newParent ) → {NFLayer}",
      "longname": "NFPageLayer#setParent",
      "name": "setParent",
      "tags": "NFPageLayer#setParent setParent",
      "summary": "",
      "description": "Sets the layer's parent to a given NFLayer"
    },
    "NFPageLayer.html#setZoomer": {
      "id": "NFPageLayer.html#setZoomer",
      "kind": "function",
      "title": "setZoomer() → {NFLayer}",
      "longname": "NFPageLayer#setZoomer",
      "name": "setZoomer",
      "tags": "NFPageLayer#setZoomer setZoomer",
      "summary": "",
      "description": "Sets the layer's parent to the zoomer if this layer is in an NFPartComp"
    },
    "NFPageLayer.html#moveBefore": {
      "id": "NFPageLayer.html#moveBefore",
      "kind": "function",
      "title": "moveBefore( targetLayer ) → {NFLayer}",
      "longname": "NFPageLayer#moveBefore",
      "name": "moveBefore",
      "tags": "NFPageLayer#moveBefore moveBefore",
      "summary": "",
      "description": "Moves this layer's index to immediately before the provided target layer"
    },
    "NFPageLayer.html#moveAfter": {
      "id": "NFPageLayer.html#moveAfter",
      "kind": "function",
      "title": "moveAfter( targetLayer ) → {NFLayer}",
      "longname": "NFPageLayer#moveAfter",
      "name": "moveAfter",
      "tags": "NFPageLayer#moveAfter moveAfter",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFPageLayer.html#markers": {
      "id": "NFPageLayer.html#markers",
      "kind": "function",
      "title": "markers() → {Property}",
      "longname": "NFPageLayer#markers",
      "name": "markers",
      "tags": "NFPageLayer#markers markers",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFPageLayer.html#addInOutMarkersForProperty": {
      "id": "NFPageLayer.html#addInOutMarkersForProperty",
      "kind": "function",
      "title": "addInOutMarkersForProperty( options ) → {NFLayer}",
      "longname": "NFPageLayer#addInOutMarkersForProperty",
      "name": "addInOutMarkersForProperty",
      "tags": "NFPageLayer#addInOutMarkersForProperty addInOutMarkersForProperty",
      "summary": "",
      "description": "Sets the given property's expression and adds In and Out markers (if not already on the layer) for in and out transitions. Overrides previous expressions"
    },
    "NFPageLayer.html#addSlider": {
      "id": "NFPageLayer.html#addSlider",
      "kind": "function",
      "title": "addSlider( name, value ) → {Property}",
      "longname": "NFPageLayer#addSlider",
      "name": "addSlider",
      "tags": "NFPageLayer#addSlider addSlider",
      "summary": "",
      "description": "Creates and returns a slider effect on the layer"
    },
    "NFPageLayerCollection.html": {
      "id": "NFPageLayerCollection.html",
      "kind": "class",
      "title": "NFPageLayerCollection",
      "longname": "NFPageLayerCollection",
      "name": "NFPageLayerCollection",
      "tags": "NFPageLayerCollection",
      "summary": "",
      "description": "Subclass of NFLayer for the parent null layer of a group of page layers from the same PDF",
      "body": ""
    },
    "NFPageLayerCollection.html#addNFPageLayer": {
      "id": "NFPageLayerCollection.html#addNFPageLayer",
      "kind": "function",
      "title": "addNFPageLayer( newLayer ) → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection#addNFPageLayer",
      "name": "addNFPageLayer",
      "tags": "NFPageLayerCollection#addNFPageLayer addNFPageLayer",
      "summary": "",
      "description": "Adds an NFPageLayer to this collection"
    },
    "NFPageLayerCollection.html#addAVLayer": {
      "id": "NFPageLayerCollection.html#addAVLayer",
      "kind": "function",
      "title": "addAVLayer( newLayer ) → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection#addAVLayer",
      "name": "addAVLayer",
      "tags": "NFPageLayerCollection#addAVLayer addAVLayer",
      "summary": "",
      "description": "Adds an AVLayer to this collection"
    },
    "NFPageLayerCollection.html#highlights": {
      "id": "NFPageLayerCollection.html#highlights",
      "kind": "function",
      "title": "highlights( newLayer ) → {NFHighlightLayerCollection}",
      "longname": "NFPageLayerCollection#highlights",
      "name": "highlights",
      "tags": "NFPageLayerCollection#highlights highlights",
      "summary": "",
      "description": "Returns NFHighlightLayerCollection of all highlights in all pages in the collection"
    },
    "NFPageLayerCollection.html#fromSamePDF": {
      "id": "NFPageLayerCollection.html#fromSamePDF",
      "kind": "function",
      "title": "fromSamePDF() → {boolean}",
      "longname": "NFPageLayerCollection#fromSamePDF",
      "name": "fromSamePDF",
      "tags": "NFPageLayerCollection#fromSamePDF fromSamePDF",
      "summary": "",
      "description": "Returns true if the collection only contains pages from the same PDF"
    },
    "NFPageLayerCollection.html#initLayers": {
      "id": "NFPageLayerCollection.html#initLayers",
      "kind": "function",
      "title": "initLayers() → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection#initLayers",
      "name": "initLayers",
      "tags": "NFPageLayerCollection#initLayers initLayers",
      "summary": "",
      "description": "Run NFPageLayer#init on every page in this collection"
    },
    "NFPageLayerCollection.html#initLayerTransforms": {
      "id": "NFPageLayerCollection.html#initLayerTransforms",
      "kind": "function",
      "title": "initLayerTransforms() → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection#initLayerTransforms",
      "name": "initLayerTransforms",
      "tags": "NFPageLayerCollection#initLayerTransforms initLayerTransforms",
      "summary": "",
      "description": "Run NFPageLayer#initLayerTransforms on every page in this collection"
    },
    "NFPageLayerCollection.html#newPaperParentLayer": {
      "id": "NFPageLayerCollection.html#newPaperParentLayer",
      "kind": "function",
      "title": "newPaperParentLayer() → {NFPaperParentLayer}",
      "longname": "NFPageLayerCollection#newPaperParentLayer",
      "name": "newPaperParentLayer",
      "tags": "NFPageLayerCollection#newPaperParentLayer newPaperParentLayer",
      "summary": "",
      "description": "Creates a new NFPaperParentLayer from this collection"
    },
    "NFPageLayerCollection.html#assignPaperParentLayer": {
      "id": "NFPageLayerCollection.html#assignPaperParentLayer",
      "kind": "function",
      "title": "assignPaperParentLayer( [ shouldMove ] ) → {NFPaperParentLayer}",
      "longname": "NFPageLayerCollection#assignPaperParentLayer",
      "name": "assignPaperParentLayer",
      "tags": "NFPageLayerCollection#assignPaperParentLayer assignPaperParentLayer",
      "summary": "",
      "description": "Checks for an existing valid paper parent layer for these pages. Sets it as the parent if it exists, otherwise creates a new one."
    },
    "NFPageLayerCollection.html#.collectionFromAVLayerArray": {
      "id": "NFPageLayerCollection.html#.collectionFromAVLayerArray",
      "kind": "function",
      "title": "&lt;static&gt; collectionFromAVLayerArray() → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection.collectionFromAVLayerArray",
      "name": "collectionFromAVLayerArray",
      "tags": "NFPageLayerCollection.collectionFromAVLayerArray collectionFromAVLayerArray",
      "summary": "",
      "description": "Returns a new instance from an array of AVLayers"
    },
    "NFPageLayerCollection.html#addNFLayer": {
      "id": "NFPageLayerCollection.html#addNFLayer",
      "kind": "function",
      "title": "addNFLayer( newLayer ) → {NFLayerCollection}",
      "longname": "NFPageLayerCollection#addNFLayer",
      "name": "addNFLayer",
      "tags": "NFPageLayerCollection#addNFLayer addNFLayer",
      "summary": "",
      "description": "Adds an NFLayer to this collection"
    },
    "NFPageLayerCollection.html#onlyContainsPageLayers": {
      "id": "NFPageLayerCollection.html#onlyContainsPageLayers",
      "kind": "function",
      "title": "onlyContainsPageLayers() → {boolean}",
      "longname": "NFPageLayerCollection#onlyContainsPageLayers",
      "name": "onlyContainsPageLayers",
      "tags": "NFPageLayerCollection#onlyContainsPageLayers onlyContainsPageLayers",
      "summary": "",
      "description": "Returns true if the collection only contains NFPageLayers and no other types of NFLayers"
    },
    "NFPageLayerCollection.html#inSameComp": {
      "id": "NFPageLayerCollection.html#inSameComp",
      "kind": "function",
      "title": "inSameComp() → {boolean}",
      "longname": "NFPageLayerCollection#inSameComp",
      "name": "inSameComp",
      "tags": "NFPageLayerCollection#inSameComp inSameComp",
      "summary": "",
      "description": "Returns true if the layers in the collection are all in the same comp"
    },
    "NFPageLayerCollection.html#containingComp": {
      "id": "NFPageLayerCollection.html#containingComp",
      "kind": "function",
      "title": "containingComp() → {NFComp|null}",
      "longname": "NFPageLayerCollection#containingComp",
      "name": "containingComp",
      "tags": "NFPageLayerCollection#containingComp containingComp",
      "summary": "",
      "description": "Returns the containing comp for the layers, or null if #inSameComp is false"
    },
    "NFPageLayerCollection.html#getPageLayerCollection": {
      "id": "NFPageLayerCollection.html#getPageLayerCollection",
      "kind": "function",
      "title": "getPageLayerCollection() → {NFPageLayerCollection}",
      "longname": "NFPageLayerCollection#getPageLayerCollection",
      "name": "getPageLayerCollection",
      "tags": "NFPageLayerCollection#getPageLayerCollection getPageLayerCollection",
      "summary": "",
      "description": "Returns a new NFPageLayerCollection from this collection. Only call if you know this collection only contains NFPageLayers"
    },
    "NFPageLayerCollection.html#count": {
      "id": "NFPageLayerCollection.html#count",
      "kind": "function",
      "title": "count() → {int}",
      "longname": "NFPageLayerCollection#count",
      "name": "count",
      "tags": "NFPageLayerCollection#count count",
      "summary": "",
      "description": "Shortcut to access the number of layers in the collection"
    },
    "NFPageLayerCollection.html#isEmpty": {
      "id": "NFPageLayerCollection.html#isEmpty",
      "kind": "function",
      "title": "isEmpty() → {boolean}",
      "longname": "NFPageLayerCollection#isEmpty",
      "name": "isEmpty",
      "tags": "NFPageLayerCollection#isEmpty isEmpty",
      "summary": "",
      "description": "True if the collection is empty"
    },
    "NFPageLayerCollection.html#remove": {
      "id": "NFPageLayerCollection.html#remove",
      "kind": "function",
      "title": "remove( layerToRemove ) → {NFLayerCollection}",
      "longname": "NFPageLayerCollection#remove",
      "name": "remove",
      "tags": "NFPageLayerCollection#remove remove",
      "summary": "",
      "description": "Removes a given layer from this collection"
    },
    "NFPageLayerCollection.html#getTopmostLayer": {
      "id": "NFPageLayerCollection.html#getTopmostLayer",
      "kind": "function",
      "title": "getTopmostLayer() → {NFLayer|null}",
      "longname": "NFPageLayerCollection#getTopmostLayer",
      "name": "getTopmostLayer",
      "tags": "NFPageLayerCollection#getTopmostLayer getTopmostLayer",
      "summary": "",
      "description": "Gets the topmost NFLayer in this collection"
    },
    "NFPageLayerCollection.html#getBottommostLayer": {
      "id": "NFPageLayerCollection.html#getBottommostLayer",
      "kind": "function",
      "title": "getBottommostLayer() → {NFLayer|null}",
      "longname": "NFPageLayerCollection#getBottommostLayer",
      "name": "getBottommostLayer",
      "tags": "NFPageLayerCollection#getBottommostLayer getBottommostLayer",
      "summary": "",
      "description": "Gets the bottommost NFLayer in this collection"
    },
    "NFPageLayerCollection.html#setParents": {
      "id": "NFPageLayerCollection.html#setParents",
      "kind": "function",
      "title": "setParents( newParent ) → {NFLayerCollection}",
      "longname": "NFPageLayerCollection#setParents",
      "name": "setParents",
      "tags": "NFPageLayerCollection#setParents setParents",
      "summary": "",
      "description": "Sets all member layers' parents to a given NFLayer or null"
    },
    "NFPageLayerCollection.html#nullify": {
      "id": "NFPageLayerCollection.html#nullify",
      "kind": "function",
      "title": "nullify() → {NFLayer}",
      "longname": "NFPageLayerCollection#nullify",
      "name": "nullify",
      "tags": "NFPageLayerCollection#nullify nullify",
      "summary": "",
      "description": "Creates a new null parent to all the layers in the collection, positioned above the one with the lowest index. Will override previous parenting."
    },
    "NFPaperParentLayer.html": {
      "id": "NFPaperParentLayer.html",
      "kind": "class",
      "title": "NFPaperParentLayer",
      "longname": "NFPaperParentLayer",
      "name": "NFPaperParentLayer",
      "tags": "NFPaperParentLayer",
      "summary": "",
      "description": "Subclass of NFLayer for the parent null layer of a group of page layers from the same PDF",
      "body": ""
    },
    "NFPaperParentLayer.html#setName": {
      "id": "NFPaperParentLayer.html#setName",
      "kind": "function",
      "title": "setName() → {NFPaperParentLayer}",
      "longname": "NFPaperParentLayer#setName",
      "name": "setName",
      "tags": "NFPaperParentLayer#setName setName",
      "summary": "",
      "description": "Sets the name of this paper parent layer to the correct name."
    },
    "NFPaperParentLayer.html#.isPaperParentLayer": {
      "id": "NFPaperParentLayer.html#.isPaperParentLayer",
      "kind": "function",
      "title": "&lt;static&gt; isPaperParentLayer( layer ) → {boolean}",
      "longname": "NFPaperParentLayer.isPaperParentLayer",
      "name": "isPaperParentLayer",
      "tags": "NFPaperParentLayer.isPaperParentLayer isPaperParentLayer",
      "summary": "",
      "description": "Class Method. Tests an AV layer to see if it can be a paper parent Layer"
    },
    "NFPaperParentLayer.html#.getPaperParentNameForPageLayer": {
      "id": "NFPaperParentLayer.html#.getPaperParentNameForPageLayer",
      "kind": "function",
      "title": "&lt;static&gt; getPaperParentNameForPageLayer( pageLayer ) → {string}",
      "longname": "NFPaperParentLayer.getPaperParentNameForPageLayer",
      "name": "getPaperParentNameForPageLayer",
      "tags": "NFPaperParentLayer.getPaperParentNameForPageLayer getPaperParentNameForPageLayer",
      "summary": "",
      "description": "Class Method. Returns the name string for the paper parent for a given layer"
    },
    "NFPaperParentLayer.html#isPageLayer": {
      "id": "NFPaperParentLayer.html#isPageLayer",
      "kind": "function",
      "title": "isPageLayer() → {boolean}",
      "longname": "NFPaperParentLayer#isPageLayer",
      "name": "isPageLayer",
      "tags": "NFPaperParentLayer#isPageLayer isPageLayer",
      "summary": "",
      "description": "Checks if this layer is a valid page Layer"
    },
    "NFPaperParentLayer.html#isNullLayer": {
      "id": "NFPaperParentLayer.html#isNullLayer",
      "kind": "function",
      "title": "isNullLayer() → {boolean}",
      "longname": "NFPaperParentLayer#isNullLayer",
      "name": "isNullLayer",
      "tags": "NFPaperParentLayer#isNullLayer isNullLayer",
      "summary": "",
      "description": "Checks if this layer is a null layer"
    },
    "NFPaperParentLayer.html#isHighlightLayer": {
      "id": "NFPaperParentLayer.html#isHighlightLayer",
      "kind": "function",
      "title": "isHighlightLayer() → {boolean}",
      "longname": "NFPaperParentLayer#isHighlightLayer",
      "name": "isHighlightLayer",
      "tags": "NFPaperParentLayer#isHighlightLayer isHighlightLayer",
      "summary": "",
      "description": "Checks if this layer is a valid highlight layer"
    },
    "NFPaperParentLayer.html#isPaperParentLayer": {
      "id": "NFPaperParentLayer.html#isPaperParentLayer",
      "kind": "function",
      "title": "isPaperParentLayer() → {boolean}",
      "longname": "NFPaperParentLayer#isPaperParentLayer",
      "name": "isPaperParentLayer",
      "tags": "NFPaperParentLayer#isPaperParentLayer isPaperParentLayer",
      "summary": "",
      "description": "Checks if this layer is a valid paper parent layer"
    },
    "NFPaperParentLayer.html#getSpecializedLayer": {
      "id": "NFPaperParentLayer.html#getSpecializedLayer",
      "kind": "function",
      "title": "getSpecializedLayer() → {NFPageLayer|NFHighlightLayer|NFPaperParentLayer|NFLayer}",
      "longname": "NFPaperParentLayer#getSpecializedLayer",
      "name": "getSpecializedLayer",
      "tags": "NFPaperParentLayer#getSpecializedLayer getSpecializedLayer",
      "summary": "",
      "description": "Returns a new layer of a specialized type for the contents of this layer"
    },
    "NFPaperParentLayer.html#index": {
      "id": "NFPaperParentLayer.html#index",
      "kind": "function",
      "title": "index() → {int}",
      "longname": "NFPaperParentLayer#index",
      "name": "index",
      "tags": "NFPaperParentLayer#index index",
      "summary": "",
      "description": "Shorthand for the layer's index"
    },
    "NFPaperParentLayer.html#hasNullParent": {
      "id": "NFPaperParentLayer.html#hasNullParent",
      "kind": "function",
      "title": "hasNullParent() → {boolean}",
      "longname": "NFPaperParentLayer#hasNullParent",
      "name": "hasNullParent",
      "tags": "NFPaperParentLayer#hasNullParent hasNullParent",
      "summary": "",
      "description": "Returns true if the layer has a null parent"
    },
    "NFPaperParentLayer.html#sameLayerAs": {
      "id": "NFPaperParentLayer.html#sameLayerAs",
      "kind": "function",
      "title": "sameLayerAs() → {boolean}",
      "longname": "NFPaperParentLayer#sameLayerAs",
      "name": "sameLayerAs",
      "tags": "NFPaperParentLayer#sameLayerAs sameLayerAs",
      "summary": "",
      "description": "Checks to see if a given NFLayer's layer is the same as this one's For example, an NFLayer and an NFPageLayer that refer to the same layer will return true"
    },
    "NFPaperParentLayer.html#containingComp": {
      "id": "NFPaperParentLayer.html#containingComp",
      "kind": "function",
      "title": "containingComp() → {NFComp}",
      "longname": "NFPaperParentLayer#containingComp",
      "name": "containingComp",
      "tags": "NFPaperParentLayer#containingComp containingComp",
      "summary": "",
      "description": "Returns the containing NFComp"
    },
    "NFPaperParentLayer.html#getChildren": {
      "id": "NFPaperParentLayer.html#getChildren",
      "kind": "function",
      "title": "getChildren() → {NFLayerCollection}",
      "longname": "NFPaperParentLayer#getChildren",
      "name": "getChildren",
      "tags": "NFPaperParentLayer#getChildren getChildren",
      "summary": "",
      "description": "Returns an NFLayerCollection of child layers of this layer as specialized layers"
    },
    "NFPaperParentLayer.html#getParent": {
      "id": "NFPaperParentLayer.html#getParent",
      "kind": "function",
      "title": "getParent() → {NFLayer|null}",
      "longname": "NFPaperParentLayer#getParent",
      "name": "getParent",
      "tags": "NFPaperParentLayer#getParent getParent",
      "summary": "",
      "description": "Gets the layer's parent NFLayer, if any"
    },
    "NFPaperParentLayer.html#setParent": {
      "id": "NFPaperParentLayer.html#setParent",
      "kind": "function",
      "title": "setParent( newParent ) → {NFLayer}",
      "longname": "NFPaperParentLayer#setParent",
      "name": "setParent",
      "tags": "NFPaperParentLayer#setParent setParent",
      "summary": "",
      "description": "Sets the layer's parent to a given NFLayer"
    },
    "NFPaperParentLayer.html#setZoomer": {
      "id": "NFPaperParentLayer.html#setZoomer",
      "kind": "function",
      "title": "setZoomer() → {NFLayer}",
      "longname": "NFPaperParentLayer#setZoomer",
      "name": "setZoomer",
      "tags": "NFPaperParentLayer#setZoomer setZoomer",
      "summary": "",
      "description": "Sets the layer's parent to the zoomer if this layer is in an NFPartComp"
    },
    "NFPaperParentLayer.html#moveBefore": {
      "id": "NFPaperParentLayer.html#moveBefore",
      "kind": "function",
      "title": "moveBefore( targetLayer ) → {NFLayer}",
      "longname": "NFPaperParentLayer#moveBefore",
      "name": "moveBefore",
      "tags": "NFPaperParentLayer#moveBefore moveBefore",
      "summary": "",
      "description": "Moves this layer's index to immediately before the provided target layer"
    },
    "NFPaperParentLayer.html#moveAfter": {
      "id": "NFPaperParentLayer.html#moveAfter",
      "kind": "function",
      "title": "moveAfter( targetLayer ) → {NFLayer}",
      "longname": "NFPaperParentLayer#moveAfter",
      "name": "moveAfter",
      "tags": "NFPaperParentLayer#moveAfter moveAfter",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFPaperParentLayer.html#markers": {
      "id": "NFPaperParentLayer.html#markers",
      "kind": "function",
      "title": "markers() → {Property}",
      "longname": "NFPaperParentLayer#markers",
      "name": "markers",
      "tags": "NFPaperParentLayer#markers markers",
      "summary": "",
      "description": "Moves this layer's index to immediately after the provided target layer"
    },
    "NFPaperParentLayer.html#addInOutMarkersForProperty": {
      "id": "NFPaperParentLayer.html#addInOutMarkersForProperty",
      "kind": "function",
      "title": "addInOutMarkersForProperty( options ) → {NFLayer}",
      "longname": "NFPaperParentLayer#addInOutMarkersForProperty",
      "name": "addInOutMarkersForProperty",
      "tags": "NFPaperParentLayer#addInOutMarkersForProperty addInOutMarkersForProperty",
      "summary": "",
      "description": "Sets the given property's expression and adds In and Out markers (if not already on the layer) for in and out transitions. Overrides previous expressions"
    },
    "NFPaperParentLayer.html#addSlider": {
      "id": "NFPaperParentLayer.html#addSlider",
      "kind": "function",
      "title": "addSlider( name, value ) → {Property}",
      "longname": "NFPaperParentLayer#addSlider",
      "name": "addSlider",
      "tags": "NFPaperParentLayer#addSlider addSlider",
      "summary": "",
      "description": "Creates and returns a slider effect on the layer"
    },
    "NFPartComp.html": {
      "id": "NFPartComp.html",
      "kind": "class",
      "title": "NFPartComp",
      "longname": "NFPartComp",
      "name": "NFPartComp",
      "tags": "NFPartComp",
      "summary": "",
      "description": "NF Wrapper object for a CompItem used as a part comp that allows for access to and maniplation of its layers.",
      "body": ""
    },
    "NFPartComp.html#getInfo": {
      "id": "NFPartComp.html#getInfo",
      "kind": "function",
      "title": "getInfo() → {string}",
      "longname": "NFPartComp#getInfo",
      "name": "getInfo",
      "tags": "NFPartComp#getInfo getInfo",
      "summary": "",
      "description": "Returns a string representation of the object"
    },
    "NFPartComp.html#selectedLayers": {
      "id": "NFPartComp.html#selectedLayers",
      "kind": "function",
      "title": "selectedLayers() → {NFLayerCollection}",
      "longname": "NFPartComp#selectedLayers",
      "name": "selectedLayers",
      "tags": "NFPartComp#selectedLayers selectedLayers",
      "summary": "",
      "description": "Gets the selected layers in this comp"
    },
    "NFPartComp.html#selectedPageLayers": {
      "id": "NFPartComp.html#selectedPageLayers",
      "kind": "function",
      "title": "selectedPageLayers() → {NFPageLayerCollection}",
      "longname": "NFPartComp#selectedPageLayers",
      "name": "selectedPageLayers",
      "tags": "NFPartComp#selectedPageLayers selectedPageLayers",
      "summary": "",
      "description": "Gets the selected pages in this comp"
    },
    "NFPartComp.html#layerWithName": {
      "id": "NFPartComp.html#layerWithName",
      "kind": "function",
      "title": "layerWithName( name ) → {NFLayer|null}",
      "longname": "NFPartComp#layerWithName",
      "name": "layerWithName",
      "tags": "NFPartComp#layerWithName layerWithName",
      "summary": "",
      "description": "Returns the NFLayer in this comp with the layer name given or null if none found"
    },
    "NFPartComp.html#getZoomer": {
      "id": "NFPartComp.html#getZoomer",
      "kind": "function",
      "title": "getZoomer() → {NFLayer|null}",
      "longname": "NFPartComp#getZoomer",
      "name": "getZoomer",
      "tags": "NFPartComp#getZoomer getZoomer",
      "summary": "",
      "description": "Gets the Zoomer layer"
    },
    "NFPartComp.html#addNull": {
      "id": "NFPartComp.html#addNull",
      "kind": "function",
      "title": "addNull() → {NFLayer}",
      "longname": "NFPartComp#addNull",
      "name": "addNull",
      "tags": "NFPartComp#addNull addNull",
      "summary": "",
      "description": "Creates and returns a new null layer in this comp"
    },
    "LayerCollection.html": {
      "id": "LayerCollection.html",
      "kind": "namespace",
      "title": "LayerCollection",
      "longname": "LayerCollection",
      "name": "LayerCollection",
      "tags": "LayerCollection",
      "summary": "",
      "description": "The After Effects LayerCollection Class",
      "body": ""
    },
    "LayerCollection.html#.toArr": {
      "id": "LayerCollection.html#.toArr",
      "kind": "function",
      "title": "&lt;static&gt; toArr() → {Array}",
      "longname": "LayerCollection.toArr",
      "name": "toArr",
      "tags": "LayerCollection.toArr toArr",
      "summary": "",
      "description": "Returns an Array of all the layers in this collection for easier manipulation"
    },
    "Layer.html": {
      "id": "Layer.html",
      "kind": "namespace",
      "title": "Layer",
      "longname": "Layer",
      "name": "Layer",
      "tags": "Layer",
      "summary": "",
      "description": "The After Effects Layer Class",
      "body": ""
    },
    "Layer.html#.indexOfMarker": {
      "id": "Layer.html#.indexOfMarker",
      "kind": "function",
      "title": "&lt;static&gt; indexOfMarker( comment ) → {int|null}",
      "longname": "Layer.indexOfMarker",
      "name": "indexOfMarker",
      "tags": "Layer.indexOfMarker indexOfMarker",
      "summary": "",
      "description": "Returns the index of the marker with the given comment"
    },
    "Layer.html#.removeMarker": {
      "id": "Layer.html#.removeMarker",
      "kind": "function",
      "title": "&lt;static&gt; removeMarker( comment ) → {Layer}",
      "longname": "Layer.removeMarker",
      "name": "removeMarker",
      "tags": "Layer.removeMarker removeMarker",
      "summary": "",
      "description": "Removes the marker with a given comment"
    },
    "Property.html": {
      "id": "Property.html",
      "kind": "namespace",
      "title": "Property",
      "longname": "Property",
      "name": "Property",
      "tags": "Property",
      "summary": "",
      "description": "The After Effects Layer Class",
      "body": ""
    },
    "Property.html#.expressionStringForValue": {
      "id": "Property.html#.expressionStringForValue",
      "kind": "function",
      "title": "&lt;static&gt; expressionStringForValue() → {string}",
      "longname": "Property.expressionStringForValue",
      "name": "expressionStringForValue",
      "tags": "Property.expressionStringForValue expressionStringForValue",
      "summary": "",
      "description": "Returns the index of the marker with the given comment"
    }
  }
};