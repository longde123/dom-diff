var isObject = require("is-object");
//var isHook = requirex("../vnode/is-vhook")

var forEach = [].forEach;

module.exports = diffProps;

function diffProps(a, b) {
    var diff

	forEach.call(a.attributes, function(aAttr){


    //for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            //continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    });

	forEach.call(b.attributes, function(bAttr){
		var bAttrName = bAttr.name;

		if(!a.getAttribute(bAttrName)) {
			diff = diff || {};
			diff[bAttrName] = bAttr.value;
		}

    //for (var bKey in b) {
        /*if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }*/
    });

    return diff;
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}
